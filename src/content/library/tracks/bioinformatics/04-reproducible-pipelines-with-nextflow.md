---
title: "Reproducible pipelines with Nextflow"
description: "Turn the shell commands of lesson 3 into a Nextflow pipeline with pinned containers, a samplesheet, a tiny test profile and published outputs. Anyone can re-run it and get the same result."
section: "Bioinformatics"
order: 4
track: "bioinformatics"
level: "core"
duration: "4 hours"
outcomes:
  - "Explain processes, channels, a workflow and published outputs in Nextflow"
  - "Write a pipeline with one pinned container per process and a samplesheet as input"
  - "Make a tiny test dataset out of real reads and run the pipeline on it with a test profile"
  - "Re-run a pipeline with -resume and say what the cache does and does not protect you from"
  - "Say when to use an nf-core pipeline instead of writing your own"
resources:
  - "nextflow/training"
  - "nextflow/your-first-script"
  - "nextflow/preparing-for-strict-syntax"
  - "nf-core/what-is-nf-core"
  - "nf-core/sarek"
  - "bioconda/bioconda"
  - "apptainer/user-guide"
  - "turing-way/guide-for-reproducible-research"
prerequisites:
  - "tracks/bioinformatics/03-alignment-and-variant-calling"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of making work repeatable. **Time:** about four hours.

## 1. Why this matters

A shell script that worked on your laptop last Tuesday is not a method. It depends on the tool versions you had, the folder you were in and the files you forgot you made. A colleague, a reviewer or you in six months cannot run it again with confidence.

A pipeline fixes that. It states the steps, the inputs, the tool versions and the outputs in code. A workflow engine runs the steps in the right order, in parallel where it can, and in containers so that the tools are the same everywhere.

**Nextflow** is an open-source language and runner for such pipelines. It is under the Apache-2.0 licence and is widely used in genomics. A large community also publishes ready-made pipelines through nf-core. As a Product Development Manager, you decide what a pipeline must guarantee and what test proves it. You do not need to write every line yourself.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the pipeline must produce, the test that proves it, and which Nextflow version it needs | Writing the process definitions, the config and the CI file | The tests pass on a clean checkout; tool versions are pinned; the published outputs are what you expect | Operations (where it runs, cost), security (container sources), legal (licences of every tool) |

## 2. Key ideas

### Process, channel, workflow

- A **process** is one step. It declares inputs, outputs and a script. Each process here runs in its own container.
- A **channel** carries data between processes, for example the pairs of read files.
- A **workflow** connects processes by passing the output of one into the next.

Nextflow runs each task in its own work folder. It runs tasks in parallel when their inputs are ready.

### Versions and syntax

Nextflow uses calendar versions. On 19 November 2026 the latest stable release was 26.10, and its newest patch was 26.10.6. Stable releases come in April and October. Nextflow needs Java 17 or newer, and it runs on versions up to 26. Since 26.04 the strict syntax is the default. That means the parser is stricter and the code is easier to check with `nextflow lint`. Two newer features make a pipeline tidier. A `params` block declares the inputs with types. **Workflow outputs** (a `publish:` section and an `output` block) say what the pipeline publishes. They replace the older `publishDir` directive, which the documentation now discourages. If you read older tutorials, expect the old style.

### Containers pin the tools

A **container** is a packaged tool with everything it needs. The Bioconda project packages thousands of bioinformatics tools, and the Biocontainers project publishes them as container images. You pin one image tag per process. That is how a result stays the same on any computer. On shared computers where Docker is not allowed, Apptainer runs the same images.

### A samplesheet describes the inputs

A small CSV with the columns `sample,fastq_1,fastq_2` lists what to run. The pipeline reads it. You change the data without changing the code.

### A test profile is a promise

A **profile** is a named bundle of settings. A `test` profile points the pipeline at a tiny dataset that runs in a minute. If the test passes, the pipeline still works. You run it on every change.

### The cache

With `-resume`, Nextflow reuses the results of tasks whose inputs and code did not change. That saves time while you build. It does not prove the result is right. It only proves nothing changed since last time.

### Use nf-core when it fits

The nf-core community maintains pipelines that real labs use. On 19 November 2026, `sarek` (variant calling) was at version 3.12.0 and `rnaseq` at 3.28.0. Both are under the MIT licence, and both need Nextflow 25.10.4 or newer. They run with `-profile test,docker` on their own small test data. For real work on human variants, use sarek rather than your own pipeline. Writing a small one here teaches you how they are built and how to read them.

## 3. Step by step

You will turn the commands of lesson 3 into a pipeline. Install Nextflow from the official page, and check `nextflow -version`. You need Java 17 or newer and Docker.

### Step 1: Make the project layout

```text
ecoli-pipeline/
  main.nf
  nextflow.config
  modules/
    fastqc.nf  fastp.nf  bwamem2.nf  samtools.nf  bcftools.nf  multiqc.nf
  tests/
    samplesheet.csv
    data/
  scripts/
    make_test_data.sh  cut_window.py
```

### Step 2: Write one process per tool

One process in full. It runs the alignment step from lesson 3. Save this as `modules/bwamem2.nf`.

```groovy
process BWAMEM2_INDEX {
    container 'quay.io/biocontainers/bwa-mem2:2.3--he70b90d_0'

    input:
    path fasta

    output:
    path "bwamem2", emit: index

    script:
    """
    mkdir bwamem2
    bwa-mem2 index -p bwamem2/ref ${fasta}
    """
}

process BWAMEM2_MEM {
    tag "${sample}"
    container 'quay.io/biocontainers/bwa-mem2:2.3--he70b90d_0'

    input:
    tuple val(sample), path(reads)
    path index

    output:
    tuple val(sample), path("${sample}.sam"), emit: sam

    script:
    """
    bwa-mem2 mem -t ${task.cpus} \\
        -R '@RG\\tID:${sample}\\tSM:${sample}\\tPL:ILLUMINA' \\
        ${index}/ref ${reads} > ${sample}.sam
    """
}
```

Write the other modules the same way, with the pinned tags from lesson 3: FastQC, fastp, samtools (sort, and stats with flagstat), bcftools (mpileup, call and filter in one process) and MultiQC 1.35. The bcftools process takes the quality and depth limits as inputs, so they are not buried in a script.

### Step 3: Connect them in `main.nf`

```groovy
include { FASTQC          } from './modules/fastqc.nf'
include { FASTP           } from './modules/fastp.nf'
include { BWAMEM2_INDEX   } from './modules/bwamem2.nf'
include { BWAMEM2_MEM     } from './modules/bwamem2.nf'
include { SAMTOOLS_SORT   } from './modules/samtools.nf'
include { SAMTOOLS_STATS  } from './modules/samtools.nf'
include { BCFTOOLS_CALL   } from './modules/bcftools.nf'
include { MULTIQC         } from './modules/multiqc.nf'

params {
    // CSV with the columns: sample,fastq_1,fastq_2
    input: Path
    // Reference genome, FASTA (plain or gzipped)
    fasta: Path
    // Minimum variant quality (phred scale) and read depth to keep a call
    min_qual: Integer = 30
    min_depth: Integer = 10
}

workflow {
    main:
    // Relative paths in the samplesheet count from the folder that holds the samplesheet.
    sheet_dir = params.input.parent
    ch_reads = channel.fromPath(params.input)
        .splitCsv(header: true)
        .map { row ->
            tuple(
                row.sample,
                file(sheet_dir.resolve(row.fastq_1), checkIfExists: true),
                file(sheet_dir.resolve(row.fastq_2), checkIfExists: true)
            )
        }

    ch_fasta = channel.value(params.fasta)

    FASTQC(ch_reads)
    FASTP(ch_reads)

    BWAMEM2_INDEX(ch_fasta)
    BWAMEM2_MEM(FASTP.out.reads, BWAMEM2_INDEX.out.index)
    SAMTOOLS_SORT(BWAMEM2_MEM.out.sam)

    SAMTOOLS_STATS(SAMTOOLS_SORT.out.bam)
    BCFTOOLS_CALL(SAMTOOLS_SORT.out.bam, ch_fasta, params.min_qual, params.min_depth)

    ch_multiqc = FASTQC.out.zip
        .mix(FASTP.out.json)
        .mix(SAMTOOLS_STATS.out.stats)
        .mix(SAMTOOLS_STATS.out.flagstat)
        .collect()
    MULTIQC(ch_multiqc)

    publish:
    bams      = SAMTOOLS_SORT.out.bam
    variants  = BCFTOOLS_CALL.out.vcf
    multiqc   = MULTIQC.out.report
}

output {
    bams {
        path 'alignments'
    }
    variants {
        path 'variants'
    }
    multiqc {
        path 'multiqc'
    }
}
```

Read it as a recipe. The reads go to FastQC and fastp. The trimmed reads are aligned against the indexed reference, then sorted. The sorted BAM feeds the statistics and the variant caller. MultiQC gathers every report. The `publish:` section names what leaves the pipeline, and the `output` block says where each goes.

### Step 4: Write the config

```groovy
manifest {
    name = 'ecoli-reads-to-report'
    description = 'Raw Illumina reads to QC, alignments, variants and a MultiQC report'
    nextflowVersion = '!>=26.10.0'
}

// Copy published files instead of linking them, so deleting the work folder is safe.
workflow.output.mode = 'copy'

process {
    cpus = 2
    memory = '4 GB'
    errorStrategy = 'terminate'
}

profiles {
    docker {
        docker.enabled = true
    }
    apptainer {
        apptainer.enabled = true
        apptainer.autoMounts = true
    }
    test {
        params.input = "${projectDir}/tests/samplesheet.csv"
        params.fasta = "${projectDir}/tests/data/ref_25kb.fa"
        params.min_depth = 5
    }
}
```

The `!>=` in `nextflowVersion` makes the pipeline refuse to start on an older Nextflow. The `copy` output mode matters. By default, published files are links into the `work` folder, so deleting `work` would break them.

### Step 5: Cut a tiny test dataset out of real reads

Use the 500,000-pair slice and BAM from lesson 3. The script takes a window of 25,000 bases of the reference and every read pair that lies fully inside it. Save the two files below in `scripts/`. This gives about 2,000 real pairs, which is under 1 MB of reads and small enough for git.

```bash
#!/usr/bin/env bash
# Cut a tiny, real test dataset out of a bigger run:
# a 25 kb window of the reference and every read pair that lies fully inside it.
set -euo pipefail

CONTIG=NC_012967.1
START=3890001     # 1-based, inclusive
END=3915000       # 25,000 bases
OUT=tests/data
mkdir -p "$OUT"

SAMTOOLS=quay.io/biocontainers/samtools:1.25--h9dcdb79_0

# 1. Names of read pairs whose two mates both map inside the window.
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/work -w /work "$SAMTOOLS" \
  samtools view aln/sub.sorted.bam "$CONTIG:$START-$END" \
  | awk -v s="$START" -v e="$END" '$9 != 0 && $4 >= s && $8 >= s && $4 <= e && $8 <= e { print $1 }' \
  | sort -u > "$OUT/pair_names.txt"
echo "pairs inside the window: $(wc -l < "$OUT/pair_names.txt")"

# 2. The reference window, and the reads of those pairs, cut with Biopython.
python3 scripts/cut_window.py data/REL606.fa "$CONTIG" "$START" "$END" "$OUT/pair_names.txt" \
  data/sub_1.fastq.gz data/sub_2.fastq.gz "$OUT"
rm "$OUT/pair_names.txt"
```

```python
"""Write a reference window and the reads whose names are listed in a file."""
import gzip
import sys

from Bio import SeqIO


def main(reference: str, contig: str, start: int, end: int, names_file: str,
         reads1: str, reads2: str, outdir: str) -> None:
    record = next(r for r in SeqIO.parse(reference, "fasta") if r.id == contig)
    window = record[start - 1 : end]               # convert 1-based inclusive to a Python slice
    window.id, window.description = "ref_25kb", ""
    SeqIO.write(window, f"{outdir}/ref_25kb.fa", "fasta")

    with open(names_file) as handle:
        names = {line.strip() for line in handle if line.strip()}
    for number, source in ((1, reads1), (2, reads2)):
        with gzip.open(source, "rt") as fin, gzip.open(f"{outdir}/test_{number}.fastq.gz", "wt") as fout:
            kept = SeqIO.write((r for r in SeqIO.parse(fin, "fastq") if r.id in names), fout, "fastq")
        print(f"test_{number}.fastq.gz: {kept} reads")


if __name__ == "__main__":
    if len(sys.argv) != 9:
        sys.exit("usage: cut_window.py REFERENCE.fa CONTIG START END NAMES.txt READS_1 READS_2 OUTDIR")
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8])
```

Then write `tests/samplesheet.csv`:

```text
sample,fastq_1,fastq_2
subset,data/test_1.fastq.gz,data/test_2.fastq.gz
```

### Step 6: Lint, run, and run again

```bash
nextflow lint .
nextflow run . -profile test,docker -output-dir results-test
nextflow run . -profile test,docker -output-dir results-test -resume
```

`nextflow lint` checks the code against the strict syntax. Outputs go to the folder named by `-output-dir`, which is `results` by default.

## 4. Worked example: the same E. coli reads, now repeatable

The reference run used the pipeline above with the same pinned tool versions as in lesson 3.

**Lint.** `nextflow lint .` reported "8 files had no errors".

**The test run.** On the tiny dataset the run ends with `[SUCCESS] completed=8 failed=0 cached=0`. Eight tasks ran. They were FastQC, fastp, index, align, sort, statistics, calling and MultiQC. The calls are exactly three:

```text
ref_25kb  5000   G  T
ref_25kb  11455  A  AC
ref_25kb  19807  G  T
```

The tiny reads came from the lesson 3 slice, and the same three calls came out of a second tiny set cut from the full dataset. That is a useful sign. It is still a regression check. It says the pipeline gives the same answer as before, not that the answer is true.

**Resume.** Running again with `-resume` ends with `[SUCCESS] completed=0 failed=0 cached=8`. Nothing re-ran, because nothing changed.

**The full dataset.** On all 1,553,259 read pairs of SRR2584863, the pipeline took about 3.5 minutes on a 28-core desktop and left a 1.6 GB `work` folder. It produced 27 variant records, 21 single-letter changes and 6 insertions or deletions, at a mean depth of about 80. The tools in that run came from Bioconda rather than from containers. The container versions of the same tags were run on the tiny data, with Podman instead of Docker, so the container paths are tested, but they were not timed on the full data.

**Two lessons from the build.**

1. Without `workflow.output.mode = 'copy'`, the published BAM and VCF were links into `work`. Deleting `work` to save disk would have emptied the results.
2. Passing `--outdir` stops the run with an error: "Parameter `outdir` was specified on the command line or params file but is not declared". With the `params` block, only declared parameters are allowed. The output folder is set with `-output-dir`.

## 5. Working with AI agents on this

**What the PDM decides.** The Nextflow version the pipeline needs, the tool versions, the test that counts as passing and the outputs that matter. An agent will happily write a pipeline in the style of an old tutorial, with `publishDir` and no pinned versions.

**What you delegate, and the exact brief.**

```text
Write a Nextflow pipeline in this repository. Target Nextflow 26.10 with the
strict syntax. Start from my commands in run_by_hand.sh.
Rules:
- One process per tool, in modules/<tool>.nf, one pinned container per
  process. Use only the image tags in run_by_hand.sh.
- Declare inputs in a params block with types. No publishDir: use workflow
  outputs (publish: and an output block).
- Input is a CSV samplesheet with sample,fastq_1,fastq_2.
- A test profile that points at tests/data and a tests/samplesheet.csv.
- nextflowVersion in the manifest, and workflow.output.mode = 'copy'.
- Do not add any process I did not list.
Acceptance: `nextflow lint .` has no errors, and
`nextflow run . -profile test,docker` ends in [SUCCESS] with exactly the
three variants in tests/expected_variants.tsv.
Output: all files, and a list of every assumption.
```

**How you verify.** Run the acceptance commands yourself. Read `nextflow.config` and look for the manifest version and the `copy` mode. Search the repository for `publishDir` and for `latest` in container names. Delete the `work` folder and check the published files are still there.

**Which disciplines are involved.** Security asks where the container images come from and who can change them. Legal reads every tool's licence. Operations asks what it costs to run and where. Science colleagues need the outputs in a form they can use.

**Where this sits on the ladder.** You **delegate** the whole pipeline with a written brief and a test. When several agents build several pipelines, you are **orchestrating**. The rule that keeps it safe is a gate: no merge unless the test profile passes in continuous integration. That gate is the first piece of **governing**. The capstone sets it up.

**Disclose.** Add to the README: "AI use: pipeline code drafted by an agent from my brief; I ran the lint and the test profile myself and read every process." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Copying an old tutorial.** The syntax and the output model changed. Match the style to the version in your manifest.
- **No pinned versions.** One `latest` tag and your pipeline is no longer repeatable.
- **Published files that are links.** Set the copy mode, or deleting `work` empties your results.
- **Hard-coded paths.** Put paths in the samplesheet and the params, not in the script.
- **Passing undeclared parameters.** An unknown `--flag` stops the run. Declare it in `params`.
- **Treating `-resume` as proof.** It reuses old results, right or wrong.
- **No test profile.** Without one, you can only find out it is broken on real data.
- **Using your own pipeline where a maintained one exists.** For standard human variant calling, look at nf-core first.
- **Committing data.** Commit the tiny test data only. Keep the big read files out of git.

## 7. Practice: a pipeline with a test

**Deliverable:** a folder `04-pipeline/` in your own git repository.

1. The pipeline: `main.nf`, `nextflow.config` and `modules/`, as in the steps.
2. `scripts/make_test_data.sh` and `scripts/cut_window.py`, and the tiny files in `tests/data/` they produce, plus `tests/samplesheet.csv`.
3. `tests/expected_variants.tsv`: the calls your test run gave, one per line, as `contig  position  ref  alt`.
4. `.gitignore` with `work/`, `results/`, `results-test/` and `.nextflow*`.
5. `README.md`: the Nextflow version, how to run the test, the output of `nextflow lint .`, the final line of the test run and of the `-resume` run, and the AI-use line.

**Check:** clone your repository into a new empty folder and run the test there. If it needs anything that was not in git, add it or write it down.

## 8. Checklist

- [ ] Every process has one pinned container tag.
- [ ] The inputs are declared in a `params` block, and the samplesheet is a CSV.
- [ ] The manifest states the Nextflow version the pipeline needs.
- [ ] Published files are copies, not links.
- [ ] `nextflow lint .` reports no errors.
- [ ] The test profile ends in `[SUCCESS]` and gives the expected calls.
- [ ] I ran it again with `-resume` and saw the tasks cached.
- [ ] I ran it from a fresh clone.
- [ ] The README has my AI-use line.

## 9. Further learning

The Nextflow training is the project's own course, and "Your first script" and "Preparing for strict syntax" show the current style. The nf-core pages explain what a community pipeline is and how `sarek` works for variant calling. The Bioconda project is where the tool packages come from, and the Apptainer user guide covers running containers where Docker is not available. The Turing Way guide to reproducible research puts all this in a wider frame. Next, in [Protein structure prediction tools](/library/tracks/bioinformatics/05-protein-structure-prediction-tools), you turn from reads to proteins and learn how far to trust a prediction.
