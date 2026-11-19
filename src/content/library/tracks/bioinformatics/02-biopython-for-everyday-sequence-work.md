---
title: "Biopython for everyday sequence work"
description: "Read, filter, translate and align sequences in Python with Biopython, and fetch records from NCBI politely. You write short scripts you can test, and you keep pairs of reads in step."
section: "Bioinformatics"
order: 2
track: "bioinformatics"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Read FASTA and FASTQ files record by record with SeqIO, without loading a whole file into memory"
  - "Reverse-complement and translate DNA with the right genetic code"
  - "Filter paired reads so that the two files stay in step"
  - "Fetch a record from NCBI with Entrez, following the rules for polite use"
  - "Run a pairwise alignment with scores you set yourself, and say what each score means"
resources:
  - "biopython/tutorial-and-cookbook"
  - "ncbi/new-api-keys-for-the-e-utilities"
  - "htslib/hts-specs"
  - "embl-ebi/european-nucleotide-archive"
  - "galaxy-training-network/training-material"
prerequisites:
  - "tracks/bioinformatics/01-sequence-data-and-file-formats"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of testing small scripts before you trust them. **Time:** about three hours.

## 1. Why this matters

Command-line tools do the heavy work in bioinformatics, but the glue between them is often a few lines of Python. Count the reads that pass a filter. Pull one gene out of a genome. Translate a stretch of DNA into a protein. Check that two files agree. An AI agent writes this kind of glue in seconds, and it is also where small mistakes hide: an off-by-one position, the wrong genetic code, two files that drift out of step.

Biopython is the long-standing open-source library for this work. You do not need to memorise it. You need to read a ten-line script and say what it does, what it assumes and how you would test it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What counts as a "good" read or a correct translation, and which genetic code applies | Writing the script, the tests and the docstrings | The script gives the known answer on a case you worked out by hand | Security (what leaves your machine when you call NCBI), operations (rate limits, runtime), legal (the data's terms) |

## 2. Key ideas

### Streams, not lists

A sequencing file can hold millions of reads. `SeqIO.parse` gives you one record at a time. You loop over the file and keep memory use flat. If a script calls `list(SeqIO.parse(...))` on a big FASTQ, it loads everything at once and may fill your memory. Use a loop.

### A record has three parts you need

A `SeqRecord` holds an `id`, a `seq` and, for FASTQ, `letter_annotations["phred_quality"]`, a list of integers. This is the same quality list you decoded by hand in lesson 1. Biopython subtracts the 33 for you.

### The genetic code depends on the organism

A protein is built from DNA in triplets called codons. The mapping from codon to amino acid is the genetic code. Most organisms share the standard code, which Biopython calls table 1. Bacteria use table 11. It has the same codon meanings, but more start codons. If you leave the table off, Biopython uses the standard one. For the *E. coli* genes in this lesson, set `table=11`.

### Reverse complement

DNA has two strands. A gene may lie on either. The reverse complement of a sequence is the sequence of the other strand, read in its own direction. `Seq.reverse_complement()` does it. Forgetting it is a classic cause of a "translation" that is gibberish.

### Alignment scores are choices

A pairwise alignment lines up two sequences and scores the result. You choose the scores: a reward for a match, a penalty for a mismatch, and penalties for opening and for extending a gap. Different scores give different alignments. In Biopython 1.86, the default gap score of `PairwiseAligner` changed. So set every score yourself. Then your result does not depend on the library version. Older tutorials use a module called `pairwise2`. It is deprecated. Use `PairwiseAligner`.

### Polite use of NCBI

NCBI runs the Entrez system, which Biopython's `Entrez` module talks to. NCBI asks you to follow its rules:

- Tell it who you are with `Entrez.email` and `Entrez.tool`. Do not commit your personal address to git. Read it from an environment variable.
- Make at most 3 requests a second without an API key, and at most 10 a second with a free key.
- For a job of more than 100 requests, run it outside US peak hours.

The NCBI Insights post on the new API keys describes these limits.

## 3. Step by step

### Step 1: Set up a clean environment

You need Python 3.10 or newer. Make a virtual environment inside your repository and install Biopython. The version below is the one current on 19 November 2026. Check the Biopython install page for a newer one.

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install "biopython==1.88"
python -c "import Bio; print(Bio.__version__)"
```

Add `.venv/` to `.gitignore`.

### Step 2: Read a FASTQ file, one record at a time

Count how many of the first 100,000 reads have an average quality of at least 30. `islice` stops the loop after 100,000 records.

```python
import gzip
from itertools import islice
from statistics import mean

from Bio import SeqIO
from Bio.SeqUtils import gc_fraction

kept = total = 0
with gzip.open("data/SRR2584863_1.fastq.gz", "rt") as fin, open("filtered_1.fastq", "w") as fout:
    for record in islice(SeqIO.parse(fin, "fastq"), 100_000):   # only the first 100,000 reads
        total += 1
        if mean(record.letter_annotations["phred_quality"]) >= 30:
            kept += 1
            SeqIO.write(record, fout, "fastq")

print(f"kept {kept} of {total} reads ({kept / total:.1%})")

with open("filtered_1.fastq") as handle:
    gc = [gc_fraction(record.seq) for record in SeqIO.parse(handle, "fastq")]
print(f"mean GC of kept reads: {mean(gc):.3f}")
```

Note that `gzip.open(..., "rt")` opens the compressed file as text.

### Step 3: Keep the pairs in step

Filtering file 1 alone breaks the pairing. Read both files together and keep a pair only if both mates pass. `zip(..., strict=True)` raises an error if one file is shorter than the other, which is exactly the failure you want to hear about.

```python
import gzip
from itertools import islice
from statistics import mean

from Bio import SeqIO


def passes(record, min_quality=30):
    return mean(record.letter_annotations["phred_quality"]) >= min_quality


kept = total = 0
with (
    gzip.open("data/SRR2584863_1.fastq.gz", "rt") as in1,
    gzip.open("data/SRR2584863_2.fastq.gz", "rt") as in2,
    open("pairs_1.fastq", "w") as out1,
    open("pairs_2.fastq", "w") as out2,
):
    pairs = zip(SeqIO.parse(in1, "fastq"), SeqIO.parse(in2, "fastq"), strict=True)
    for read1, read2 in islice(pairs, 100_000):
        total += 1
        # Keep a pair only if BOTH mates pass, so the two files stay in step.
        if passes(read1) and passes(read2):
            kept += 1
            SeqIO.write(read1, out1, "fastq")
            SeqIO.write(read2, out2, "fastq")

print(f"kept {kept} of {total} pairs")
```

### Step 4: Fetch one gene and translate it

Set your address in the environment, then fetch bases 190 to 255 of the *E. coli* reference. That is the first gene of the chromosome, `thrL`, as the GFF3 line in lesson 1 showed.

```python
import os
import sys

from Bio import Entrez, SeqIO

# NCBI asks every script to say who runs it. Keep your address out of git: read it from the environment.
email = os.environ.get("NCBI_EMAIL")
if not email:
    sys.exit("Set NCBI_EMAIL to your own address first, for example: export NCBI_EMAIL=you@example.org")
Entrez.email = email
Entrez.tool = "bio-dojo-lesson-2"

# Fetch only bases 190 to 255 of the E. coli REL606 chromosome: the first gene, thrL.
with Entrez.efetch(db="nuccore", id="NC_012967.1", rettype="fasta", retmode="text",
                   seq_start=190, seq_stop=255) as handle:
    record = SeqIO.read(handle, "fasta")

print(record.id, len(record.seq))
print(record.seq)
protein = record.seq.translate(table=11, to_stop=True)   # table 11 is the bacterial code
print(protein, len(protein))
```

### Step 5: Reverse-complement, translate and align

These are small, checkable examples. Work the answers out by hand first, then run the code.

```python
from Bio.Align import PairwiseAligner, substitution_matrices
from Bio.Seq import Seq

dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")
print(dna.reverse_complement())
print(dna.translate(to_stop=True))

aligner = PairwiseAligner()
aligner.mode = "global"
aligner.match_score = 2
aligner.mismatch_score = -1
aligner.open_gap_score = -2      # set every score yourself; do not rely on defaults
aligner.extend_gap_score = -0.5
best = aligner.align("ACGTACGTAC", "ACGTTACGTAC")[0]
print(best)
print("identities:", best.counts().identities, "gaps:", best.counts().gaps)

# Protein alignment with a substitution matrix
protein_aligner = PairwiseAligner()
protein_aligner.substitution_matrix = substitution_matrices.load("BLOSUM62")
protein_aligner.open_gap_score = -10
protein_aligner.extend_gap_score = -0.5
protein_aligner.mode = "global"
result = protein_aligner.align("HEAGAWGHEE", "PAWHEAE")
print(result.score)
print(result[0])
```

## 4. Worked example: the first gene of E. coli REL606

You will run the steps on the same public data as lesson 1. Here is what the reference run gave with Biopython 1.88.

**The gene.** Step 4 prints:

```text
NC_012967.1:190-255 66
ATGAAACGCATTAGCACCACCATTACCACCACCATCACCATTACCACAGGTAACGGTGCGGGCTGA
MKRISTTITTTITITTGNGAG 21
```

The gene is 66 letters long, which is 22 codons: a start, 20 more amino acids and a stop. Translation stops at the stop codon `TGA` and gives a peptide of 21 amino acids. Look at it: it is rich in `T`, the amino acid threonine. The annotation calls this gene `thrL`, with the product "thr operon leader peptide". The GFF3 line in lesson 1 showed its name and position. When your translation matches the annotation, you have a cheap, strong check that your coordinates, your strand and your genetic code are right.

**The reads.** Step 2 on the first 100,000 reads of file 1 kept 80,531 (80.5%) with a mean quality of at least 30. Their mean GC fraction was 0.504, close to the 0.505 measured on a 25 kb slice of the reference.

**The pairs.** Step 3 on the first 100,000 read pairs kept only 58,603. Fewer pairs survive because mate 2 is worse than mate 1 in this run. On its own, file 2 keeps 64,562 of its first 100,000 reads, against 80,531 for file 1. The first mate-2 read in lesson 1 was mostly `N`. This is a real finding. It also shows why a crude "mean quality" filter is not enough. Lesson 3 uses a dedicated trimmer instead.

**The alignment.** Step 5 prints a gap in the first sequence:

```text
target            0 ACG-TACGTAC 10
                  0 |||-||||||| 11
query             0 ACGTTACGTAC 11
```

There are 10 identities and one gap, as you can check by eye. The protein example, scored with the BLOSUM62 matrix, gives a score of 4.0 for `HEAGAWGHEE` against `PAWHEAE`.

## 5. Working with AI agents on this

**What the PDM decides.** What a good read is, which genetic code applies, which region to fetch, and what the script must refuse to do. An agent does not know your organism.

**What you delegate, and the exact brief.** Ask for a small, testable script and its tests. Do not ask for "a tool that analyses my reads".

```text
Write filter_pairs.py for my repository. It reads two gzipped FASTQ files
(paired reads) and writes two filtered FASTQ files.
Rules:
- Use Biopython 1.88 (SeqIO). Python 3.10 or newer.
- Keep a pair only if the mean Phred quality of BOTH reads is at least
  --min-quality (default 30).
- Read both files together with zip(..., strict=True). If the files have a
  different number of reads, stop with a clear error.
- Stream the files. Never load a whole file into memory.
- Write tests in tests/test_filter_pairs.py with pytest, using a tiny
  hand-made pair of FASTQ files (4 pairs: one where both pass, one where
  only read 1 passes, one where only read 2 passes, one where neither does).
Output: the script, the tests, and the command to run them.
```

**How you verify.** Read the script for four things: the pair is kept only if both reads pass, `strict=True` is there, the quality comes from `letter_annotations["phred_quality"]`, and nothing calls `list()` on a whole file. Then open the test file. The four pairs in the test must be exactly the four cases you asked for. Break the script on purpose: change `and` to `or` and confirm a test fails.

**Which disciplines are involved.** Security and privacy ask what you send to NCBI and what you paste into an agent. Operations asks how long a job runs and how many requests it makes.

**Where this sits on the ladder.** You **delegate** a bounded task here, with a written brief and acceptance criteria. The acceptance criteria are the four test cases. If you ran several agents on several scripts at once, you would be **orchestrating**, and a shared test folder in git would be the thing that keeps them honest.

**Disclose.** Add to the top of the script's README section: "AI use: script and tests drafted by an agent from my brief; I reviewed every line and broke the filter on purpose to check the tests." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Loading a whole file into a list.** Loop over `SeqIO.parse`. Use `islice` while you develop.
- **Filtering one file of a pair.** The two files fall out of step and every later pairing is wrong.
- **The wrong genetic code.** A bacterial gene needs `table=11`. Check the translation against a known protein.
- **Forgetting the strand.** If the translation is nonsense, try the reverse complement.
- **Off-by-one coordinates.** NCBI's `seq_start` and `seq_stop` are 1-based and inclusive. A Python slice is 0-based and excludes the end.
- **Default alignment scores.** Set every score, and write them into the output, so a reader can repeat it.
- **Committing your email.** Read it from an environment variable.
- **Hammering NCBI.** Sleep between requests, stay under the limit, and run big jobs off-peak.
- **A script with no test.** If you cannot say what the right answer is for a tiny input, you cannot trust the output for a huge one.

## 7. Practice: a tested filter in your repository

**Deliverable:** a folder `02-biopython/` in your own git repository.

1. `filter_pairs.py`: a script that filters paired FASTQ files as described in the brief. Write it yourself or direct an agent.
2. `tests/test_filter_pairs.py`: tests using a tiny hand-made pair of FASTQ files, with the four cases from the brief.
3. `thrl.py`: the script from step 4, reading your address from `NCBI_EMAIL`. Paste its output into the README.
4. `README.md`: how to install (`pip install "biopython==1.88" pytest`), how to run the tests, what you found on the first 100,000 pairs, and the AI-use line.

**Check:** break the filter on purpose, watch a test fail, then fix it. Commit the test run output or a screenshot of the failure and of the fix.

## 8. Checklist

- [ ] I used `SeqIO.parse` as a stream and never loaded a whole FASTQ file.
- [ ] My filter keeps a pair only when both mates pass.
- [ ] I used `strict=True`, or I check that the two files have the same length.
- [ ] I translated with the right genetic code and matched a known protein.
- [ ] I set every alignment score myself.
- [ ] My NCBI address comes from the environment, not from git.
- [ ] My script stays under 3 requests a second without a key.
- [ ] I wrote a test for each of the four pair cases and watched one fail on purpose.
- [ ] The README has my AI-use line.

## 9. Further learning

The Biopython Tutorial and Cookbook is the library's own guide, and the chapters on `SeqIO`, sequence objects, pairwise alignment and Entrez are the ones to keep open. The NCBI Insights post on API keys sets out the request limits and why they exist. The HTS format specifications and the ENA browser are the places to check what a file or an accession should look like. The Galaxy Training Network has free tutorials on the same tasks in a point-and-click tool, which helps when you want to see a result before you script it. Next, in [Alignment and variant calling](/library/tracks/bioinformatics/03-alignment-and-variant-calling), you move from single sequences to millions of reads.
