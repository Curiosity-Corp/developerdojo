---
title: "Alignment and variant calling"
description: "Check read quality, align reads to a reference genome with bwa-mem2, call variants with bcftools and decide which calls to trust. You run each tool from a pinned container and look at the result."
section: "Bioinformatics"
order: 3
track: "bioinformatics"
level: "core"
duration: "4 hours"
outcomes:
  - "Run quality control on raw reads and say which warnings matter"
  - "Trim reads, align them to a reference genome and read the alignment statistics"
  - "Call variants in a haploid genome and read a VCF line, including depth and allele counts"
  - "Triage calls by mapping quality and allele balance, and explain why you kept or flagged each one"
  - "Say how you would test a caller against a truth set, and why a pipeline's own output is not one"
resources:
  - "babraham-bioinformatics/fastqc"
  - "seqera/multiqc-overview"
  - "htslib/samtools"
  - "htslib/hts-specs"
  - "igv/igv-desktop"
  - "nist/genome-in-a-bottle"
  - "data-carpentry/wrangling-genomics"
prerequisites:
  - "tracks/bioinformatics/01-sequence-data-and-file-formats"
  - "tracks/bioinformatics/02-biopython-for-everyday-sequence-work"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of testing a result against a known answer. **Time:** about four hours.

## 1. Why this matters

You have millions of short reads and one long reference. Where does each read belong? Where does your sample differ? **Alignment** answers the first question. **Variant calling** answers the second.

Every step can fail quietly. A tool may drop reads you wanted. An aligner may place a read in the wrong copy of a repeated sequence. A caller may report a variant that is only noise. The output is still a tidy file, and a tidy file looks right.

As a Product Development Manager you will not run these tools every day. You will decide what the analysis must answer, what threshold counts as a trusted call, and what evidence a reviewer needs. This lesson shows you each step by hand so that you know what "a variant" is made of.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The reference and its version, the filters, and what you do with doubtful calls | Writing the shell commands, parsing the outputs, drafting the table of calls | Tool versions are pinned; the numbers in your summary match the tool output; doubtful calls are flagged, not hidden | Security and legal (tool licences, data terms), operations (compute time), science colleagues (is the result plausible?) |

## 2. Key ideas

### The chain

```text
raw reads (FASTQ) -> quality control -> trim -> align -> sort and index -> call variants -> filter
```

| Step | Tool in this lesson | What it does |
|---|---|---|
| Quality control | FastQC 0.13.0 | Draws quality plots and raises warnings per file |
| Trim and filter | fastp 1.4.0 | Cuts adapters and drops poor reads, and reports before and after |
| Align | bwa-mem2 2.3 | Finds where each read fits on the reference |
| Sort, index, count | samtools 1.25 | Sorts the alignments, makes them searchable and counts them |
| Call | bcftools 1.25 | Looks at all reads over each position and decides if the sample differs |
| Report | MultiQC 1.35 | Gathers every tool's numbers into one page |

Those were the current releases on 19 November 2026. Pin the exact version of every tool and write it in your README.

### Licences

All of these are free and open source, with different terms. FastQC and MultiQC are under GPL-3.0. fastp is under the MIT licence. bwa-mem2 and samtools are under MIT licences. bcftools is under the MIT/Expat licence, but a build that uses the GNU Scientific Library is covered by the GPL. When you ship a container or a product built from these tools, read each licence. 

### Adapters and trimming

A sequencing run adds short artificial sequences, called adapters, to each fragment. If a fragment is shorter than the read, the machine reads into the adapter. Trimming removes it. fastp does this and also drops reads with too many poor bases.

### Aligning

An aligner such as **bwa-mem2** takes each read and finds its best place on the reference. For each read it also reports a **mapping quality**: how sure it is about that place. If a read fits equally well in two places, for example in two copies of a repeated sequence, the mapping quality is low. A read can also be **soft clipped**: part of it matches and part does not.

Reads from paired ends have a **proper pair** flag when the two mates land the right distance apart and facing each other. The share of properly paired reads is a quick health check. For long reads, from nanopore or PacBio machines, people use minimap2 2.31 instead. It is under the MIT licence too.

### Calling a variant in a haploid genome

A caller piles up all the reads over a position, counts how many show each letter and decides which letters the sample carries. For a bacterium there is one copy of the chromosome, so `--ploidy 1`. For a person there are two copies, so the caller must consider two letters at each site. That is a different model, and the tools in the human-genome world, such as GATK (version 4.7.0.0, Apache 2.0 licence) and DeepVariant (version 1.10.0, BSD-3-Clause licence), are built for it. DeepVariant's models were trained on human data. That matters if you point it at a bacterium. This lesson does not use them.

### What to look at in each call

In a clean haploid call, nearly every read at the site shows the new letter. So look at:

- **Depth (DP):** how many reads cover the site. Too few and the call is unsafe.
- **Allele depths (AD):** the count for the reference and the new letter, such as `0,26`.
- **Mapping quality (MQ):** the average, such as 60.
- **QUAL:** the Phred-scaled confidence that the site is a variant.

A call with 7 reference reads and 12 alternate reads in a haploid sample is suspicious. So is a low mapping quality.

### A pipeline's output is not a truth

If you run your pipeline and save its output as the "right answer", you only test that it gives the same answer tomorrow. That is a regression test. It is useful, but it is not accuracy. For accuracy you need a truth set. The Genome in a Bottle project at NIST publishes high-confidence variant calls for a few reference human genomes, made from consented donors, and tools such as hap.py and RTG vcfeval compare your calls with them. Human-scale data need much more disk and compute than a laptop has. There is no equivalent truth set for the bacterial clone in this lesson, so be honest about that in your report.

## 3. Step by step

You will use a slice of the real dataset from lesson 1 so that every step runs quickly. In the reference run the six tool steps took under a minute in total, on a 28-core desktop with 4 threads. A laptop with fewer cores takes longer. The reference (`data/REL606.fa`) and the two read files come from lesson 1.

### Step 1: Take the first 500,000 read pairs

Four lines make one read, so 2,000,000 lines make 500,000 reads per file. A "broken pipe" message from `zcat` here is harmless.

```bash
zcat data/SRR2584863_1.fastq.gz | head -n 2000000 | gzip > data/sub_1.fastq.gz
zcat data/SRR2584863_2.fastq.gz | head -n 2000000 | gzip > data/sub_2.fastq.gz
```

Take both files from the same place so the pairs stay in step. This gives roughly 25 times the coverage of the genome. Coverage is the average number of reads over each position.

### Step 2: Write one helper that runs a tool from a pinned container

Save this as `run_by_hand.sh`. The `dojo` function runs any command in a container, with your current folder visible as `/work`. The pinned image tags come from the Bioconda builds hosted by Quay. You need Docker running.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Run one tool from a pinned container. Your current folder appears inside as /work.
dojo() { docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/work -w /work "$@"; }

FASTQC=quay.io/biocontainers/fastqc:0.13.0--hdfd78af_0
FASTP=quay.io/biocontainers/fastp:1.4.0--h43da1c4_0
BWA=quay.io/biocontainers/bwa-mem2:2.3--he70b90d_0
SAMTOOLS=quay.io/biocontainers/samtools:1.25--h9dcdb79_0
BCFTOOLS=quay.io/biocontainers/bcftools:1.25--h118bc1c_1

mkdir -p qc trimmed ref aln calls

# 1. Quality control of the raw reads
dojo $FASTQC fastqc --threads 2 --outdir qc data/sub_1.fastq.gz data/sub_2.fastq.gz

# 2. Trim adapters and drop poor reads
dojo $FASTP fastp --in1 data/sub_1.fastq.gz --in2 data/sub_2.fastq.gz \
  --out1 trimmed/sub_1.fastq.gz --out2 trimmed/sub_2.fastq.gz \
  --json qc/fastp.json --html qc/fastp.html --thread 4

# 3. Index the reference and align. The read group (-R) names the sample.
dojo $BWA bwa-mem2 index -p ref/ref data/REL606.fa
dojo $BWA bash -c "bwa-mem2 mem -t 4 -R '@RG\tID:sub\tSM:sub\tPL:ILLUMINA' ref/ref trimmed/sub_1.fastq.gz trimmed/sub_2.fastq.gz > aln/sub.sam"

# 4. Sort, index and count
dojo $SAMTOOLS samtools sort -@ 4 -o aln/sub.sorted.bam aln/sub.sam
dojo $SAMTOOLS samtools index aln/sub.sorted.bam
dojo $SAMTOOLS samtools flagstat aln/sub.sorted.bam
dojo $SAMTOOLS samtools coverage aln/sub.sorted.bam

# 5. Call variants in a haploid genome and keep calls with QUAL >= 30 and depth >= 10
dojo $BCFTOOLS bash -c "bcftools mpileup --fasta-ref data/REL606.fa --annotate FORMAT/AD,FORMAT/DP --max-depth 1000 --output-type u aln/sub.sorted.bam \
  | bcftools call --multiallelic-caller --variants-only --ploidy 1 --output-type u \
  | bcftools filter --include 'QUAL>=30 && FORMAT/DP>=10' --output-type v --output calls/sub.vcf"
dojo $BCFTOOLS bcftools stats calls/sub.vcf | grep '^SN'
```

Run it with `./run_by_hand.sh`. The first run downloads each container once.

### Step 3: Read the numbers

Open the FastQC and fastp HTML reports in `qc/` in a browser. Read the numbers from `samtools flagstat` and `samtools coverage`.

### Step 4: List the calls with their evidence

```bash
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/work -w /work \
  quay.io/biocontainers/bcftools:1.25--h118bc1c_1 \
  bcftools query -f '%POS\t%REF\t%ALT\t%QUAL\t%INFO/MQ\t[%AD]\t%INFO/DP\n' calls/sub.vcf
```

### Step 5: Look at one call with your own eyes

Install IGV, the Integrative Genomics Viewer, a free viewer for alignments and variants. Load `data/REL606.fa` as the genome, then load `aln/sub.sorted.bam` and `calls/sub.vcf`. Go to a position from your list. Menu names can differ by IGV version, so use the IGV user guide if one is missing.

## 4. Worked example: E. coli reads on its reference

The reference run used the script above on the first 500,000 read pairs of **SRR2584863**, with the pinned versions in the script. These are the real numbers. Yours should be close, but a different tool version can change them slightly.

**Quality control.** FastQC passes most checks for read 1. It flags **Adapter Content** as FAIL for both files. For read 2 it also flags **Per base sequence quality** and **Per base sequence content** as FAIL. That matches what you saw in lesson 1: mate 2 is the weaker read.

**Trimming.** fastp reports 1,000,000 reads in and 827,534 reads out. It removed 171,968 for low quality and 498 for too many `N`. The share of bases at Q30 or better rises from 80.6% to 89.1%.

**Alignment.** `samtools flagstat` reports 827,534 primary reads. 98.41% are properly paired. `samtools coverage` shows 99.85% of the 4,629,812 positions covered, with a mean depth of 25.4.

**Variants.** `bcftools stats` reports 24 records: 20 single-letter changes and 4 insertions or deletions. On the full dataset, the same pipeline gave 27 records: 21 single-letter changes and 6 insertions or deletions, at a mean depth of about 80. More reads means more sites reach the depth filter.

**Triage.** Here are four calls from the list in step 4 and one clean one for comparison:

| Position | Change | QUAL | MQ | Reference, alternate reads |
|---|---|---|---|---|
| 9972 | T to G | 225 | 60 | 0, 26 |
| 263235 | G to T | 184 | 25.3 | 7, 12 |
| 377000 | T to G | 200 | 25.9 | 6, 11 |
| 2407766 | A to C | 228 | 23.7 | 11, 15 |
| 2618472 | G to T | 178 | 22.0 | 9, 11 |

Twenty of the 24 calls look like the first row: mapping quality near 60 and almost every read showing the new letter. The other four look like the last four rows. They have a high QUAL. But their reads map with low confidence, and both letters appear at the site, which a haploid clone should not show. That pattern is typical of repeated sequence, where reads from several copies pile up in one place. These four sites were not checked further, so this is a reason to flag them, not a finding about the genome. In a report, list them as "low-confidence calls" and say why.

**One more note about provenance.** The header of the SAM file recorded the aligner as version `2.2.1`, although the container tag pinned in the script is `2.3`. The same happened with the container and with a Bioconda install, and the cause was not investigated. I trust the pinned container tag and record it in the README. A tool's self-reported version is one more thing to check.

## 5. Working with AI agents on this

**What the PDM decides.** The reference and its version, the filters (here `QUAL>=30` and depth at least 10), and what happens to doubtful calls: dropped, flagged or investigated. An agent will pick a default threshold and may not tell you.

**What you delegate, and the exact brief.** The shell script and the summary table are good tasks for an agent.

```text
Write run_by_hand.sh that runs this chain with Docker, one pinned container
per tool (images are listed below): FastQC, fastp, bwa-mem2 (index, mem),
samtools (sort, index, flagstat, coverage), bcftools (mpileup, call, filter).
Inputs: data/REL606.fa, data/sub_1.fastq.gz, data/sub_2.fastq.gz.
Rules:
- The organism is a bacterium: use --ploidy 1 in bcftools call.
- Filter with QUAL>=30 && FORMAT/DP>=10. Do not use any other filter.
- set -euo pipefail. Do not delete input files.
- Use only the image tags I list. Do not choose "latest".
- Write every tool version into a file versions.txt.
Then write summarise.py that reads calls/sub.vcf and prints a table with
position, ref, alt, QUAL, MQ, AD and DP, and marks any call with MQ < 30 or
with fewer than 90% of reads showing the alternate letter as "FLAG".
Output: both files, and a list of every assumption you made.
```

**How you verify.** Compare `versions.txt` with the tags in your brief. Confirm the script uses `--ploidy 1`. Run `summarise.py` on a VCF you edited by hand, with one clean call and one that should be flagged, and see that it flags the right one. Compare the agent's summary numbers with the raw tool output: if the summary says 24 records, `bcftools stats` must say 24.

**Which disciplines are involved.** Legal reads the licences, because GPL tools may matter when you ship a product. Science colleagues judge whether the flagged calls are plausible. Operations asks how long the run takes and what it costs.

**Where this sits on the ladder.** You **delegate** a whole task with a written brief. The acceptance criteria are the version file, the ploidy setting and the test on a hand-edited VCF. Separate agents for alignment and summary would be **orchestrating**, with the file format as the contract.

**Disclose.** Add to the README: "AI use: script and summary drafted by an agent from my brief; I pinned the versions, tested the flag rule on a hand-edited file and checked the numbers against the tool output." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Not pinning versions.** "Latest" changes under you. Pin the container tag and record it.
- **The wrong ploidy.** A diploid model on a haploid genome invents heterozygous calls. Set `--ploidy 1` for a bacterium.
- **Mixing references.** Align and call against the same file. Even a small difference in the reference shifts every position.
- **Skipping quality control.** FastQC and fastp numbers tell you what is wrong before you build on it.
- **Trusting QUAL alone.** A high QUAL with a low mapping quality and a mixed allele balance is still doubtful.
- **Hiding the doubtful calls.** Flag them and say why. A report that lists only the clean ones overstates certainty.
- **Calling your own output a truth set.** It proves repeatability, not accuracy.

## 7. Practice: align, call and triage

**Deliverable:** a folder `03-alignment/` in your own git repository.

1. `run_by_hand.sh` and `versions.txt`: your script and the versions of every tool it used.
2. `calls/sub.vcf` and `qc/fastp.json`: the filtered calls and the trimming report. Both are small. Do not commit the BAM or the read files.
3. `TRIAGE.md`: a table of every call, with position, change, QUAL, MQ, AD and DP, and a column "kept" or "flagged" with a short reason for each. Give the rule you used.
4. `igv-call.png`: a screenshot from IGV of one clean call and, in a second image, one flagged call. Say what you see in two sentences each.
5. `README.md`: the numbers (reads in and out, percent properly paired, mean depth, records), what you could not check, and the AI-use line.

**Check:** a reviewer should be able to run the script and get the same record count as your README, or understand from `versions.txt` why it differs.

## 8. Checklist

- [ ] I pinned every tool's container tag and wrote the versions in a file.
- [ ] I looked at the FastQC and fastp reports and wrote down which warnings matter.
- [ ] I used `--ploidy 1` because the genome is haploid.
- [ ] The numbers in my README match the tool output.
- [ ] I flagged every call with low mapping quality or a mixed allele balance.
- [ ] I looked at at least two calls in IGV.
- [ ] I said plainly that my output is not a truth set.
- [ ] I did not commit read files or BAM files.
- [ ] The README has my AI-use line.

## 9. Further learning

FastQC's own page explains each plot and warning, and the MultiQC overview shows how to gather many reports into one. The samtools site documents each subcommand you used. The HTS format specifications define every field in a SAM or VCF line. The IGV desktop page is where to get the viewer and its user guide. NIST's Genome in a Bottle page describes the truth sets that make accuracy testing possible for human genomes. The Data Carpentry genomics lesson covers the same chain with a different *E. coli* dataset. Next, in [Reproducible pipelines with Nextflow](/library/tracks/bioinformatics/04-reproducible-pipelines-with-nextflow), you turn these commands into a pipeline anyone can re-run.
