---
title: "Sequence data and file formats"
description: "Learn what a sequencing read, a reference and a quality score are. Open real FASTA, FASTQ, SAM, VCF and GFF3 files from a public E. coli dataset, and check a download with a checksum."
section: "Bioinformatics"
order: 1
track: "bioinformatics"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Say what a sequencing read, a reference genome and a Phred quality score are"
  - "Read a line of FASTA, FASTQ, SAM, VCF and GFF3 and say what each column holds"
  - "Fetch a public sequencing run from the European Nucleotide Archive and check it with an MD5 checksum"
  - "Decode FASTQ quality characters into scores with a short Python script"
  - "Write a format cheat sheet in your own words, using real lines from real files"
resources:
  - "embl-ebi/european-nucleotide-archive"
  - "ncbi/about-the-sequence-read-archive"
  - "htslib/hts-specs"
  - "babraham-bioinformatics/fastqc"
  - "data-carpentry/wrangling-genomics"
  - "galaxy-training-network/training-material"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of checking data before you trust it. **Time:** about three hours.

## 1. Why this matters

Almost every bioinformatics problem starts with a file that somebody else made. A sequencing machine writes millions of short pieces of DNA text. A tool lines them up against a known genome. Another tool lists where they differ. Each step writes a file, and each file has a strict format.

If you cannot read those files, you cannot judge what an AI agent hands back. An agent can write a script that "filters low-quality reads" and prints a clean summary. You will only know whether it filtered the right reads if you know what a quality score is and where it lives in the file.

This lesson gives you the vocabulary and the habit. The vocabulary is a handful of formats. The habit is simple: **open the file, read a few lines, and check the download is intact before you do anything else.**

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which dataset to use, and whether you may use it | Writing the download and checksum script, counting reads, drafting the cheat sheet | The checksum matches the archive; your own eyes confirm the first lines of each file | Privacy and legal (is the data public and consented?), security (what you paste into an agent), operations (disk space and bandwidth) |

## 2. Key ideas

### A read is a short piece of DNA text

DNA is a long string over four letters: A, C, G and T. A sequencing machine cannot read a whole genome end to end. It reads millions of short pieces instead. Each piece is a **sequencing read**. On the Illumina machine used in this lesson's data, a read is 150 letters long.

Many runs are **paired**: the machine reads the same short fragment from both ends. You get two files, one for each end, and the nth read in file 1 pairs with the nth read in file 2.

### A reference genome is the map

A **reference genome** is an agreed full sequence for a species or strain. You compare reads against it. In this track you use the genome of *Escherichia coli* B strain REL606, stored at NCBI as RefSeq record `NC_012967.1`. It is 4,629,812 letters long. *E. coli* is a bacterium found in guts and labs. REL606 is a laboratory strain, and you only analyse its published sequence in this track.

A **variant** is a place where your sample differs from the reference.

### A quality score says how sure the machine is

For each letter, the machine also reports a **Phred score** Q. It is tied to the chance P that the letter is wrong:

`Q = -10 × log10(P)`

| Q | Chance the letter is wrong |
|---|---|
| 10 | 1 in 10 |
| 20 | 1 in 100 |
| 30 | 1 in 1,000 |
| 40 | 1 in 10,000 |

Higher is safer. "Q30" is a common bar for a good base.

### The formats you will meet

| Format | What it holds | Where you see it |
|---|---|---|
| **FASTA** | Named sequences, with no quality | A reference genome, a protein list |
| **FASTQ** | Reads, each with a quality for every letter | Raw data from the machine |
| **SAM / BAM / CRAM** | Reads and where each one lines up on the reference. SAM is text. BAM is the compact binary form. CRAM compresses further by leaning on the reference | After alignment |
| **VCF** | Variants, one per line, with the evidence | After variant calling |
| **GFF3 / GTF / BED** | Features on a genome: genes, exons, regions | Annotation |

The community keeps the specifications for SAM, CRAM, VCF, BCF and BED in one place, the HTS format specifications. When a tool and a blog post disagree, the specification wins.

### Coordinates are a trap

Positions start at 1 in SAM, VCF and GFF3. BED is different. It starts at 0, and its end position is not part of the region. That is a classic off-by-one bug. When you move a position between two files, check which rule each file uses.

### Where the data live

Public sequencing data sit in shared archives. The Sequence Read Archive (SRA) at NCBI and the European Nucleotide Archive (ENA) at EMBL-EBI hold the same kind of records. Accession numbers tell you what you have:

| Prefix | Means |
|---|---|
| `PRJNA` | A project (a study) |
| `SAMN` | A biological sample |
| `SRR` | One sequencing run, the thing you download |

### A checksum proves a download is whole

A big file can break in transit and still look fine. The archive publishes an MD5 checksum, a short fingerprint of the file. You compute the same fingerprint locally. If the two match, the file is intact. MD5 is fine for catching damage. It is not a security tool.

## 3. Step by step

You will fetch real data. The download is about 375 MB for the two read files, so plan on a few minutes.

### Step 1: Ask the archive what a run contains

The ENA has a public API that returns a table about any run. Use `curl` to ask for the run accession, the machine, the layout, the read count and the checksums.

```bash
curl -s "https://www.ebi.ac.uk/ena/portal/api/filereport?accession=SRR2584863&result=read_run&fields=run_accession,sample_accession,study_accession,instrument_model,library_layout,read_count,fastq_md5,fastq_bytes&format=tsv"
```

The output is a tab-separated table. Read it before you download anything. It tells you the layout is paired, how many reads to expect and the two checksums.

### Step 2: Download one file at a time, then check it

Run the two downloads one after the other. The archive may refuse many parallel requests. Then compare checksums.

```bash
mkdir -p data
base="https://ftp.sra.ebi.ac.uk/vol1/fastq/SRR258/003/SRR2584863"
curl --fail --location --retry 5 --continue-at - -o data/SRR2584863_1.fastq.gz "$base/SRR2584863_1.fastq.gz"
curl --fail --location --retry 5 --continue-at - -o data/SRR2584863_2.fastq.gz "$base/SRR2584863_2.fastq.gz"
md5sum data/SRR2584863_*.fastq.gz
```

Compare each printed checksum with the `fastq_md5` column from step 1. On macOS the command is `md5` instead of `md5sum`.

### Step 3: Count the reads

A FASTQ read takes exactly four lines. So the number of reads is the number of lines divided by four.

```bash
zcat data/SRR2584863_1.fastq.gz | awk 'END { print NR / 4 }'
```

The count should equal the `read_count` from the archive.

### Step 4: Decode the first read

Save this as `decode_quality.py`. It reads one record and turns each quality character into a number.

```python
import gzip

with gzip.open("data/SRR2584863_1.fastq.gz", "rt") as handle:
    name, sequence, _plus, quality = (handle.readline().rstrip() for _ in range(4))

scores = [ord(character) - 33 for character in quality]  # Phred+33: subtract 33 from the character code
print(name)
print(sequence[:30], "...", len(sequence), "bases")
print("first 10 scores:", scores[:10])
print("last 5 scores:", scores[-5:], "| lowest:", min(scores))
print("bases with score below 20:", sum(score < 20 for score in scores))
```

The "+33" is the encoding the format uses today. The character `I` has code 73, so its score is 40.

### Step 5: Get the reference and look at its first line

```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=NC_012967.1&rettype=fasta&retmode=text&tool=dojo-lesson" -o data/REL606.fa
head -c 200 data/REL606.fa
grep -v '>' data/REL606.fa | tr -d '\n' | wc -c
```

The last number should be 4,629,812.

## 4. Worked example: E. coli reads from a long-term experiment

The dataset is ENA run **SRR2584863**, from study **PRJNA295606**, "E. coli genome evolution over 50,000 generations". The sample is **SAMN04096083**, described as an "Ara-3 15000 generation clone". It was sequenced on an Illumina HiSeq 2500 as paired reads of 150 letters. The run has 1,553,259 read pairs. This is the same kind of data a real project starts with, and it is small enough for a laptop.

**The first read, in FASTQ.** This is the first record of file 1, copied as it is:

```text
@SRR2584863.1 HWI-ST957:244:H73TDADXX:1:1101:4712:2181/1
TTCACATCCTGACCATTCAGTTGAGCAAAATAGTTCTTCAGTGCCTGTTTAACCGAGTCACGCAGGGGTTTTTGGGTTACCTGATCCTGAGAGTTAACGGTAGAAACGGTCAGTACGTCAGAATTTACGCGTTGTTCGAACATAGTTCTG
+
CCCFFFFFGHHHHJIJJJJIJJJIIJJJJIIIJJGFIIIJEDDFEGGJIFHHJIJJDECCGGEGIIJFHFFFACD:BBBDDACCCCAA@@CA@C>C3>@5(8&>C:9?8+89<4(:83825C(:A#########################
```

Line 1 is the name. Line 2 is the 150 letters. Line 3 is just a plus sign. Line 4 is one quality character per letter.

Run the script from step 4 and you get this:

```text
first 10 scores: [34, 34, 34, 37, 37, 37, 37, 37, 38, 39]
last 5 scores: [2, 2, 2, 2, 2] | lowest: 2
bases with score below 20: 34
```

The read starts well, around Q34 to Q39. It ends in a run of `#`, which is Q2. Quality often falls toward the end of a read, and here it falls to the floor. A tool that trims by quality removes that tail. That is why the next lessons start with quality control.

**The mate, in file 2.** Its first read pairs with the one above. Its first 150 letters begin `GGCGACATTACTGACCCGC` and then run into long stretches of `N`. In this read, 117 of the 150 letters are `N`, which means "the machine could not call this letter". A read like this adds nothing. Real data have such reads, and a pipeline must cope with them.

**Alignment, in SAM.** After the reads are lined up on the reference, a typical line looks like this. I shortened the sequence and quality fields with `...`:

```text
SRR2584863.219856	147	NC_012967.1	1825	60	150M	=	1681	-294	ACTTACGTGTCTGCGG...	DDDDDDDDDDDD...
```

The eleven fixed columns are: read name, flag, reference name, position (1-based), mapping quality, CIGAR, mate's reference, mate's position, template length, sequence, and quality. Here flag 147 means "paired, properly paired, this read is on the reverse strand, and it is the second read of the pair". `150M` means 150 letters line up. Mapping quality 60 means the aligner is very sure where the read belongs. A read near the start of the genome has a softer CIGAR such as `55S95M`: the first 55 letters are "soft clipped", set aside because they do not line up. The *E. coli* chromosome is circular, but the reference file cuts it at one point, so reads that cross that point split into two parts.

**A variant, in VCF.** After variant calling, the first call in the reference run of this dataset was this line:

```text
NC_012967.1	9972	.	T	G	225.417	PASS	DP=93;...;AC=1;AN=1;DP4=0,0,31,57;MQ=60	GT:PL:DP:AD	1:255,0:88:0,88
```

It says: at position 9,972 the reference has `T`, this sample has `G`, the call quality is 225, the filter passed, and 88 reads cover the site, none showing the reference letter and all 88 showing `G`. The `1` in the genotype means "the alternate allele", written with a single value because bacteria carry one copy of their chromosome. Your numbers may differ slightly with other tool versions.

**A gene, in GFF3.** The reference's annotation lists the first gene of the chromosome like this. I shortened the last column:

```text
NC_012967.1	RefSeq	gene	190	255	.	+	.	ID=gene-ECB_RS00005;Name=thrL;gbkey=Gene;gene=thrL;...
```

Nine tab-separated columns: sequence, source, feature type, start, end, score, strand, phase and attributes. The start and end are 1-based and include both ends.

## 5. Working with AI agents on this

**What the PDM decides.** Which dataset you use, why it is allowed, and what "intact" means. An agent will not ask whether the data are public. You do.

**What you delegate, and the exact brief.** The download and checksum script is a good task for an agent. It is small, and you can check it by eye.

```text
Write a bash script fetch_data.sh for my repository.
Goal: download the paired FASTQ files for ENA run SRR2584863 into data/ and
verify them.
Steps: (1) call the ENA filereport API for fastq_md5; (2) download each file
one at a time with curl, with retries; (3) compare md5sum to the API value;
(4) exit non-zero with a clear message if any checksum differs.
Rules: set -euo pipefail. Never delete files. Do not run anything in parallel.
Do not use any URL you have not been given here or read from the API.
Output: the script, and a list of every URL it contacts.
```

**How you verify.** Read every URL in the list. Open the script and find the checksum comparison. Break it on purpose: change one letter in the expected checksum and confirm the script stops with your message. A script that cannot fail is not a check.

**Which disciplines are involved.** Privacy asks whether the data are public and consented; this dataset is from a bacterium, not a person. Security asks what you paste into an agent: never private data. Operations asks about disk space and the load you put on a public archive.

**Where this sits on the ladder.** You **use** an agent here: one small task, checked by hand. Delegating the whole analysis comes in later lessons, and then your tests become the acceptance criteria.

**Disclose.** Put one line in the README: "AI use: download script drafted by an agent from my brief; I read it, ran it and broke it on purpose to test the check." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Trusting a download that finished.** A file that opens can still be damaged. Compare the checksum.
- **Mixing up the two read files.** Read 1 and read 2 pair by order. If you filter one file and not the other, the pairs shift out of step.
- **Forgetting that quality is text.** A quality string is not a number. It is characters that you convert by subtracting 33.
- **Off-by-one positions.** SAM, VCF and GFF3 count from 1. BED counts from 0 and excludes the end. Write the rule next to the code.
- **Treating `N` as a letter of DNA.** It means "unknown".
- **Hammering the archive.** Download one file at a time. Large parallel downloads can be refused or cut short.
- **Using a reference you cannot name.** Always write the accession and version, here `NC_012967.1`. A result without its reference is not reproducible.
- **Assuming human data are fine to use.** Real patient data are protected by privacy rules and need approvals. This track uses public data only.

## 7. Practice: fetch, check and explain

**Deliverable:** a folder `01-formats/` in your own git repository with these files.

1. `fetch_data.sh`: your download and checksum script, written by you or an agent. Commit the script. Do not commit the data. Add `data/` to `.gitignore`.
2. `decode_quality.py`: the script from step 4, and its printed output pasted into the README.
3. `FORMATS.md`: a cheat sheet in your own words. For each of FASTA, FASTQ, SAM, VCF and GFF3, write what it holds and one real line you copied from a real file. Under each line, explain two of its columns. Write the position rule for each format.
4. `README.md`: the dataset accession, the reference accession, the two checksums you checked, and the AI-use line.

**Check:** ask a friend to tell you, from `FORMATS.md` alone, which file holds the quality scores and which holds the variants. If they cannot, rewrite it.

## 8. Checklist

- [ ] I read the archive's table before I downloaded anything.
- [ ] I compared both MD5 checksums with the archive's values.
- [ ] The read count matches the archive.
- [ ] I decoded a quality string by hand and by script, and both agree.
- [ ] My cheat sheet uses real lines from real files, not made-up ones.
- [ ] I wrote down which formats count from 1 and which from 0.
- [ ] I broke my checksum check on purpose and saw it fail.
- [ ] I did not commit the data files.
- [ ] The README names the run, the reference and my AI use.

## 9. Further learning

The ENA browser and the NCBI Sequence Read Archive page show how public sequencing records are organised, so you can find a run yourself. The HTS format specifications are the authority on SAM, VCF and the rest, and worth skimming for the field tables. The FastQC page from the Babraham Institute explains the quality plots you will meet in lesson 3. The Data Carpentry genomics lesson walks through a similar *E. coli* workflow in a terminal, and the Galaxy Training Network offers many free tutorials in a point-and-click interface. Next, in [Biopython for everyday sequence work](/library/tracks/bioinformatics/02-biopython-for-everyday-sequence-work), you read and change these files with Python.
