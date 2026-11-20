---
title: "Capstone: raw reads to a report"
description: "Build a repeatable pipeline that takes real public bacterial reads to quality control, alignments, variant calls and a written report, with a test that runs in continuous integration, and have it reviewed against a rubric."
section: "Bioinformatics"
order: 7
track: "bioinformatics"
level: "core"
duration: "6 hours"
outcomes:
  - "Deliver a git repository that fetches public reads, checks them and runs a pipeline with one command"
  - "Prove the pipeline with a tiny test that runs automatically on every push"
  - "Write a report that states results, flags weak calls and says what the work cannot show"
  - "Present the work with a README, a short recording, test results and a report"
  - "Review a peer's pipeline against a rubric and give specific feedback"
resources:
  - "github/github-actions"
  - "nf-core/what-is-nf-core"
  - "nextflow/training"
  - "nist/genome-in-a-bottle"
  - "igv/igv-desktop"
  - "who/laboratory-biosafety-manual-4"
  - "turing-way/guide-for-reproducible-research"
prerequisites:
  - "tracks/bioinformatics/04-reproducible-pipelines-with-nextflow"
  - "tracks/bioinformatics/06-statistics-for-noisy-biological-data"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, as its final proof of skill. **Time:** about six hours, spread over a few sessions.

## 1. Why this matters

You have met the pieces: file formats, a scripting library, alignment and variant calling, a pipeline runner, a structure database and the statistics of noisy data. This capstone joins them into one piece of work that another person can pick up, run and judge.

The skill is not any single tool. It is delivering a result that someone else can **repeat, check and doubt**. A result that only runs on your laptop, that cannot say which data produced it, or that does not say what it cannot show, is not a result a team can use.

An AI agent can write most of the code for this project. It cannot decide which claims the data support, and it will not volunteer that the test data came from the same run it is testing. Those judgements are what you are being assessed on.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The question, what counts as done, which claims the report may make and which it must refuse | Pipeline code, test scripts, the CI file, a first draft of the README and report | Every number in the report against the tool output; a clean-clone run; that each acceptance criterion is met | Reviewer (Sensei or peer), a statistician for the claims, a lab or biosafety lead before any real sample work |

## 2. Key ideas

### The question and the data

The project answers a plain question: **which positions in the genome of an evolved *E. coli* clone differ from its ancestor's reference, and how sure are we?** The data are the ones from lesson 1: run **SRR2584863**, paired Illumina reads from study PRJNA295606 (sample SAMN04096083, "Ara-3 15000 generation clone"), aligned to the RefSeq genome **NC_012967.1** (*E. coli* B strain REL606, 4,629,812 bases). The strain is a harmless laboratory one, and the data are public.

### A pipeline output is a regression test, not a truth set

When your pipeline runs on a tiny test slice and gives three variants, the test only shows that tomorrow's run still gives those three. It does not show that those variants are real. For real accuracy you would need a trusted answer, which is what projects such as Genome in a Bottle publish for human reference samples. This capstone has no trusted answer, and the report must say so.

### Hardware, honestly

You need no GPU for this capstone, and none of the tools here use one. The full run downloads about 375 MB, needs a few gigabytes of free disk (the `work` folder of the reference run was 1.6 GB) and a container tool such as Docker. In the reference run, on a 28-core desktop, the full pipeline took about 3.5 minutes. A laptop with fewer cores takes longer, so start it and do something else. If your machine cannot run containers, or is too slow, you may do the tiny test locally and rely on CI to run the same test. You must then say so in the README.

### Care with data and organisms

This project uses public, harmless bacterial data. If you extend it to human data, use only data released for open use with consent, such as the Genome in a Bottle samples, read their terms first, and never use data from a real person you were not given. Do not use these tools to study or alter dangerous organisms. Real laboratory work needs training, a supervisor and approval; the WHO laboratory biosafety manual explains why. See [Biosafety basics before you automate](/library/tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate).

## 3. Step by step: what to build

### The brief

Build a repository, `ecoli-reads-to-report`, that:

- downloads the two read files and the reference, and checks them;
- runs quality control, trimming, alignment, variant calling and a combined QC report with Nextflow;
- has a tiny test that runs without the big download;
- runs that test automatically in CI;
- ends in a written report that a reviewer can check.

### Acceptance criteria

Your work is done when all of these are true.

1. A fresh clone plus `make test` runs the tiny test and ends with `PASS`, with nothing installed beyond Docker, Java and Nextflow.
2. `scripts/fetch_data.sh` downloads SRR2584863 and NC_012967.1, checks both read files by MD5 and the reference by length, and stops with a clear message if any check fails.
3. The pipeline uses Nextflow strict syntax, passes `nextflow lint .` with no errors, and uses only pinned container tags, never `latest`.
4. The pipeline has one process per tool step: FastQC, fastp, bwa-mem2 index and mem, samtools sort and stats, bcftools call, MultiQC.
5. Results are copied into an output folder, not linked into `work/`.
6. A re-run with `-resume` reports every task as cached.
7. `tests/expected_variants.tsv` lists the calls of the tiny test, and `tests/check_outputs.sh` fails if they differ.
8. A GitHub Actions workflow runs the tiny test on every push and pull request, and the repository shows a passing run.
9. Large files (`data/`, `work/`, `results/`) are in `.gitignore` and not in git.
10. `REPORT.md` states the data with accession numbers, the tool versions, the QC result with numbers from your MultiQC report, the number of calls by type, and a table of any calls you flag as low confidence with the reason.
11. `REPORT.md` has a limits section that says the test is a regression test, that there is one sample and so no comparison between groups, and that no call was confirmed by an independent method.
12. The README has the AI-use line, a hardware note, and the commands to run each target.

### Repository layout

```text
ecoli-reads-to-report/
  README.md  REPORT.md  Makefile  .gitignore
  main.nf  nextflow.config
  modules/        fastqc.nf fastp.nf bwamem2.nf samtools.nf bcftools.nf multiqc.nf
  assets/         samplesheet.csv
  scripts/        fetch_data.sh  make_test_data.sh  cut_window.py
  tests/          samplesheet.csv  expected_variants.tsv  check_outputs.sh
                  data/ref_25kb.fa  data/test_1.fastq.gz  data/test_2.fastq.gz
  .github/workflows/test.yml
```

Take the pipeline files and the test-data scripts from lesson 4. The rest is below.

### The fetch script

```bash
#!/usr/bin/env bash
# Download ENA run SRR2584863 and RefSeq NC_012967.1, and check them.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p data
base="https://ftp.sra.ebi.ac.uk/vol1/fastq/SRR258/003/SRR2584863"

# Run one download at a time: ENA refuses many parallel requests.
download() {
  local url="$1" out="$2" want_md5="$3"
  if [ -f "$out" ] && [ "$(md5sum "$out" | cut -d' ' -f1)" = "$want_md5" ]; then
    echo "ok (already here): $out"; return
  fi
  curl --fail --location --retry 5 --continue-at - --output "$out" "$url"
  got=$(md5sum "$out" | cut -d' ' -f1)
  [ "$got" = "$want_md5" ] || { echo "FAIL: checksum of $out is $got, expected $want_md5" >&2; exit 1; }
  echo "ok: $out"
}

download "$base/SRR2584863_1.fastq.gz" data/SRR2584863_1.fastq.gz 4a1529a4165970302d6d8cb50b6e7a43
download "$base/SRR2584863_2.fastq.gz" data/SRR2584863_2.fastq.gz 33492a66dcc95c3f8fc847b41d2c8ceb

if [ ! -s data/REL606.fa ]; then
  curl --fail --location --retry 5 --output data/REL606.fa \
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=NC_012967.1&rettype=fasta&retmode=text&tool=dojo-capstone"
fi
length=$(grep -v '>' data/REL606.fa | tr -d '\n' | wc -c)
[ "$length" -eq 4629812 ] || { echo "FAIL: reference length is $length, expected 4629812" >&2; exit 1; }
echo "ok: data/REL606.fa (4,629,812 bases)"
```

Those MD5 values are the ones the ENA file report gave on 19 November 2026; lesson 1 shows the query. For the full data, `assets/samplesheet.csv` has the header `sample,fastq_1,fastq_2` and one line, `SRR2584863,../data/SRR2584863_1.fastq.gz,../data/SRR2584863_2.fastq.gz`.

### The Makefile and the check script

```makefile
# One command per job: make test, make full, make lint.
.PHONY: test full lint

test:
	nextflow run . -profile test,docker -output-dir results-test
	tests/check_outputs.sh results-test

full:
	scripts/fetch_data.sh
	nextflow run . -profile docker --input assets/samplesheet.csv --fasta data/REL606.fa -output-dir results

lint:
	nextflow lint .
```

Makefile recipe lines start with a tab.

```bash
#!/usr/bin/env bash
# Check the results of the tiny test against tests/expected_variants.tsv.
set -euo pipefail

results="${1:-results}"
expected_file="$(dirname "$0")/expected_variants.tsv"
vcf="${results}/variants/subset.vcf.gz"

test -s "${results}/multiqc/multiqc_report.html" || { echo "FAIL: no MultiQC report" >&2; exit 1; }
test -s "${results}/alignments/subset.sorted.bam" || { echo "FAIL: no BAM file" >&2; exit 1; }
test -s "${vcf}" || { echo "FAIL: no VCF file" >&2; exit 1; }

# A .vcf.gz is gzip-compatible, so no extra tool is needed to list the calls.
found=$(zcat "${vcf}" | grep -v '^#' | cut -f1,2,4,5)
expected=$(cat "${expected_file}")

if [ "${found}" != "${expected}" ]; then
  echo "FAIL: the variants differ from tests/expected_variants.tsv" >&2
  echo "--- expected" >&2; echo "${expected}" >&2
  echo "--- found" >&2; echo "${found}" >&2
  exit 1
fi
echo "PASS: the expected variants were found"
```

Make it executable with `chmod +x tests/check_outputs.sh`. The expected file is tab-separated, one call per line, as `contig`, `position`, `ref`, `alt`. In the reference run it held three lines: `ref_25kb` 5000 G>T, 11455 A>AC and 19807 G>T. Your own tiny test will give lines that depend on the window you cut.

### The CI workflow

```yaml
name: test
on:
  push:
  pull_request:

jobs:
  tiny-subset:
    runs-on: ubuntu-24.04
    env:
      NXF_VER: "26.10.6"
    steps:
      - uses: actions/checkout@v7
      - name: Install Nextflow
        run: |
          curl -s https://get.nextflow.io | bash
          sudo mv nextflow /usr/local/bin/
          nextflow -version
      - name: Run the pipeline on the tiny test data
        run: nextflow run . -profile test,docker -output-dir results
      - name: Check the results
        run: tests/check_outputs.sh results
      - uses: actions/upload-artifact@v7
        if: always()
        with:
          name: results
          path: results/
```

Save it as `.github/workflows/test.yml`. `NXF_VER` pins the Nextflow version, and Nextflow 26.10 needs Java 17 or later. This workflow file was not run on GitHub while this lesson was written, so your first push is its first test. Read the job log, and fix forward until it is green.

### Write the report

`REPORT.md` is for a reader who has not seen your terminal. Use this order.

1. **Question and data:** the accessions, the checksums and the reference.
2. **Methods:** each tool with its pinned version, and the commands.
3. **Quality:** numbers from your MultiQC report, and what fastp removed.
4. **Alignment:** the share of properly paired reads and the mean depth.
5. **Variants:** counts by type, and a table of flagged low-confidence calls with position, quality, mapping quality and the reason.
6. **Limits:** the three statements from criterion 11, and what you would do to firm up the weak calls.
7. **AI use:** which parts an agent drafted, and how you checked them.

## 4. Worked example: the reference run

The reference run followed the steps above on all 1,553,259 read pairs of SRR2584863. The pipeline took about 3.5 minutes on a 28-core desktop and left a 1.6 GB `work` folder. It produced 27 variant records, 21 single-letter changes and 6 insertions or deletions, at a mean depth of about 80. The tools in that full run came from Bioconda rather than containers. The container tags were run on the tiny data, with Podman instead of Docker. The CI workflow was not run on GitHub.

Treat these numbers as a guide. A different tool version or quality threshold can move them.

In lesson 3, on the first 500,000 pairs, fastp raised the share of bases at Q30 or better from 80.6% to 89.1%. Twenty of 24 calls had a mapping quality near 60. The other four had low mapping quality and both letters present, which is a reason to flag them, not a finding. A good report keeps that habit: it lists what it is sure about and what it is not, and it says which is which.

## 5. Working with AI agents on this

**What the PDM decides.** The question, the acceptance criteria and the claims. 

**What you delegate, and the exact brief.**

```text
Work in my repository ecoli-reads-to-report. Follow the acceptance criteria
in CAPSTONE.md (paste the 12 criteria into that file first).
Start from the lesson 4 pipeline. Add scripts/fetch_data.sh with MD5 and
length checks, a Makefile with test, full and lint targets,
tests/check_outputs.sh reading tests/expected_variants.tsv, and
.github/workflows/test.yml on ubuntu-24.04 with NXF_VER pinned.
Rules: pinned container tags only; Nextflow strict syntax; -output-dir for the
output folder; no secrets; do not commit data/, work/ or results/.
Work in small commits, run make lint and make test after each one, and stop
and report if any check fails. Do not edit tests/expected_variants.tsv to make
a test pass; tell me instead.
Then draft REPORT.md with the seven sections, leaving a visible TODO where a
number must come from my MultiQC report.
Output: the repository, and a list of anything you could not verify.
```

**How you verify.** Clone into a new empty folder and run `make test` yourself. Open the MultiQC report and copy the numbers into the report by hand. Open a flagged call in IGV, the desktop viewer, and look at the reads. Read the commit history and check that no test file was changed to turn a failure green.

**Which disciplines are involved.** A reviewer judges the work. A statistician checks the claims. A biosafety or lab lead must approve anything that moves beyond public, harmless data.

**Where this sits on the ladder.** You are **orchestrating**: an agent works under your brief, tests and CI are the gates, and you review the result. For review habits, see [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review), and for the report, [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report).

**Disclose.** Put the AI-use line in the README and in the report: "AI use: pipeline, scripts and a first draft of the report by an agent from my brief; I ran the tests from a clean clone, checked every number against the tool output and edited every claim." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Only running it on your own machine.** Test from a fresh clone, and let CI do it too.
- **Committing data or the work folder.** Keep large files out of git.
- **Editing the expected file to make the test pass.** That hides a real change.
- **Reporting the regression test as proof the calls are true.** It proves repeatability only.
- **Dropping the weak calls from the report.** List them, with the reason.
- **Writing numbers from memory.** Copy them from the tool output.
- **Claiming a group difference from one sample.** There is no group.

## 7. Practice: the capstone

**Deliverable:** your own git repository `ecoli-reads-to-report` with the layout above. The 12 acceptance criteria are the checklist.

### What to show

Present four things.

1. **README:** what it is, the commands (`make test`, `make full`, `make lint`), hardware needs, the data sources, and the AI-use line.
2. **A screen recording or GIF** of one minute or less: a fresh clone, `make test` running, and the `PASS` line. Keep it small, and do not show any credentials.
3. **Test results:** a link to a green CI run, and the output of `nextflow lint .` and of the `-resume` run in the README.
4. **The written report,** `REPORT.md`.

### Review rubric

A reviewer rates each row as Not yet, Meets or Strong.

| Row | Meets | Strong |
|---|---|---|
| Repeatability | A fresh clone passes `make test` | Also tested after deleting `work/`, and `-resume` shown |
| Data integrity | Reads and reference checked by checksum and length | A wrong checksum was tried on purpose and the script stopped |
| Pipeline quality | Strict syntax, lint clean, pinned tags, one process per tool | Clear parameters, comments say why, not what |
| Testing and CI | Tiny test and green CI run | The check fails on a changed call, shown by trying it |
| Report honesty | Numbers match the tool output, weak calls flagged, limits stated | Each claim says how it could be wrong |
| Safety and privacy | Public harmless data, no secrets, biosafety pointer | Notes what would change if human data were used |
| Communication | README and report readable by a newcomer | A reviewer could run it without asking you anything |

### How a Sensei or peer reviews it

Allow about 45 minutes.

1. Clone the repository into a new empty folder. Do not look at the author's machine.
2. Read the README. Write down every command you need to guess.
3. Run `make lint` and `make test`. Note the result.
4. Change one line of `tests/expected_variants.tsv` and run `make test` again. It must fail.
5. Open the CI run and the report. Check three numbers in the report against the MultiQC output.
6. Open one flagged call in IGV, or ask the author to show how they decided it was weak.
7. Write feedback with one thing that was done well, two specific fixes and one question. Mark each rubric row.

A learner passes when every acceptance criterion is met and no rubric row is Not yet.

## 8. Checklist

- [ ] A fresh clone passes `make test`.
- [ ] The fetch script stops on a wrong checksum.
- [ ] `nextflow lint .` has no errors.
- [ ] All container tags are pinned.
- [ ] `-resume` shows cached tasks.
- [ ] The CI run is green and linked.
- [ ] Large files are not in git.
- [ ] The report has numbers from MultiQC and a table of weak calls.
- [ ] The report states its limits.
- [ ] The README has the hardware note and the AI-use line.
- [ ] I reviewed one other learner's repository, or had mine reviewed.

## 9. Further learning

The Nextflow training and the nf-core site show how community pipelines are built. The GitHub Actions documentation covers workflows. The IGV guide shows how to inspect reads behind a call. For measured accuracy, see how Genome in a Bottle publishes trusted calls for human reference samples, and read its terms first. The Turing Way covers the habits behind this project. After this track, the [lab automation track](/library/tracks/lab-automation-in-code) shows how code meets the real laboratory, safely.
