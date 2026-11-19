---
title: "Bioinformatics"
description: "Go from raw DNA reads to a result you can defend. Read sequence files, align reads, call variants, build a pipeline anyone can re-run, read protein structure predictions and test your claims."
group: "biotechnology"
order: 1
icon: "dna"
level: "core"
skills: [bioinformatics, data-analytics, git-gitlab, ai-evaluation]
outcomes:
  - "Read the common sequence file formats and say what each one holds"
  - "Align reads to a reference genome and call variants with free, open tools"
  - "Wrap the steps in a Nextflow pipeline that anyone can re-run and check"
  - "Read a protein structure prediction and say which parts you would not trust"
  - "Use statistics that fit noisy biological data, and report what the data cannot show"
  - "Direct an AI agent on a pipeline, and verify every result against a known answer"
---

## In short

This track turns raw DNA data into results you can defend. You do not need a biology degree. You need a laptop that runs Docker. You will read the common file formats. You will align reads to a reference genome and find variants. You will say how sure you are. You will wrap the steps in a pipeline that anyone can re-run. You will read protein structure predictions and their confidence scores. Everything uses public data and free software. There is no patient data and no wet lab.

An AI agent can write a pipeline fast. It cannot know if the answer is right. On the agent ladder, you delegate the typing. You keep the check. Every pipeline is tested against a known answer.

### Key words

- **Sequencing read:** A short piece of DNA text that a sequencing machine reports.
- **Reference genome:** An agreed full DNA sequence that new reads are compared with.
- **Variant:** A place where a sample's DNA differs from the reference genome.
- **False discovery rate:** The share of your reported findings that you expect to be false.
- **Nextflow:** An open-source language and runner for repeatable data analysis pipelines.
- **pLDDT:** A 0 to 100 score of a model's confidence in each amino acid.

Biology now produces data faster than people can read it. One sequencing run gives millions of short DNA reads. Nobody checks them by eye. A person writes the analysis as code, and that code has to be right, repeatable and honest about its limits. That is bioinformatics. It is also exactly where AI agents help and where they quietly go wrong: they write a fluent pipeline, and the output looks fine even when a step is broken.

This track teaches you to build the whole chain on a real public dataset and to check every link in it.

## Who this track is for

This track is for you if you build or direct software and want to work where biology and computing meet. You may be a developer, a data analyst, a career changer, or a product person who must judge what a bioinformatics team hands back. You do not need to know any biology beyond school level. You need to be comfortable with a terminal and git. The first lesson explains each file format from scratch.

You do not need a lab, a sequencing machine or any patient data. Everything in the track uses public data and free open-source software. Where a tool has limits, such as model weights that are for non-commercial use only, the lessons say so.

## What you will be able to do

By the end of the track you will be able to:

- Open a FASTA, FASTQ, SAM/BAM, VCF or GFF file and say what each line means.
- Fetch public data from a sequence archive, and check that the download is intact.
- Write short Python with Biopython to read, filter and translate sequences.
- Align reads to a reference genome, look at the result and call variants.
- Say how a variant call can be wrong, and test your calls against a known truth set.
- Write a Nextflow pipeline with pinned tool versions, a test profile and continuous integration.
- Read a predicted protein structure, its pLDDT score and its error map, and name what the prediction cannot tell you.
- Run a statistical test that fits count data, and correct for testing thousands of things at once.
- Hand a reviewer a repository that goes from raw reads to a written report, with every number traceable.

## How the seven lessons build

1. **[Sequence data and file formats](/library/tracks/bioinformatics/01-sequence-data-and-file-formats).** You learn what a read, a reference and a quality score are. You open real files from a public E. coli dataset and check a download with a checksum.
2. **[Biopython for everyday sequence work](/library/tracks/bioinformatics/02-biopython-for-everyday-sequence-work).** You read, filter, translate and align sequences in Python, and you fetch records from NCBI politely.
3. **[Alignment and variant calling](/library/tracks/bioinformatics/03-alignment-and-variant-calling).** You run quality control, align reads with bwa-mem2, call variants with bcftools and look at them in a genome viewer.
4. **[Reproducible pipelines with Nextflow](/library/tracks/bioinformatics/04-reproducible-pipelines-with-nextflow).** You turn the commands from lesson 3 into a pipeline with containers and a test.
5. **[Protein structure prediction tools](/library/tracks/bioinformatics/05-protein-structure-prediction-tools).** You fetch a predicted structure, read its confidence scores and compare the open tools and their licences.
6. **[Statistics for noisy biological data](/library/tracks/bioinformatics/06-statistics-for-noisy-biological-data).** You see why thousands of tests produce false hits, and how replicates and correction fix that.
7. **[Capstone: raw reads to a report](/library/tracks/bioinformatics/07-capstone-raw-reads-to-a-report).** You ship a pipeline repository and a written report that a Sensei or peer can review.

Each lesson has the same shape: why it matters, key ideas, step by step, a worked example on real public data, how to work with AI agents, common mistakes, a practice exercise that ends in a file in git, and a checklist. Every lesson also points to free outside material from the tool makers, public archives and universities.

## What you need

- **Computer.** A laptop or desktop with a 64-bit processor. Linux, macOS and Windows with WSL2 all work for the tools in this track, as long as Docker runs. The capstone pipeline asks for up to 4 GB of memory per step, and you can lower that for the tiny test dataset. A machine with 8 GB or more is the safe choice. Check that each tool's container supports your processor type.
- **Disk space.** About 5 GB free. The real E. coli reads in the worked example are about 375 MB to download, and the pipeline's working folder grows to a few gigabytes on the full dataset.
- **Software.** Git, Docker (or Apptainer on a shared computer), Java 17 or newer for Nextflow, and Python 3. Every lesson names the exact install page. Use the version that page names today.
- **Accounts.** A free account on a git host, for your own repository and its continuous integration. You do not need accounts at the sequence archives to read public data. An optional free NCBI key lets you make more requests per second.
- **No GPU needed.** The tools in lessons 1 to 4, 6 and 7 run on a CPU. Protein structure prediction with your own software, in lesson 5, is where a GPU helps. The lesson shows what to do without one, and the capstone does not need it.
- **If your laptop is weak.** The tiny test dataset in the capstone also runs in the free continuous integration of your own repository, so you can still show a green test. The full dataset takes longer on fewer cores. In the reference run for this track, the full pipeline took about 3.5 minutes on a 28-core machine. Time yours and write the number in your README.

## Time needed

Plan about three hours for each of lessons 1 to 6. The first run of a pipeline takes longer, because Docker downloads each tool once. Plan a full day, spread over several, for the capstone.

## Safety, privacy and what is out of scope

- **Public data only.** Every dataset here is open. The one dataset from human samples that the track mentions, Genome in a Bottle, is published for research use with consent. Real patient data is different. It is protected by privacy rules, and you must have the right approvals before you touch it.
- **No wet lab.** This track never tells you how to grow, handle or modify an organism. The E. coli strain in the worked example is a harmless laboratory strain, and you only analyse its published sequence. Real lab work needs a trained supervisor and institutional approval. Read the [biosafety basics lesson](/library/tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate) and the World Health Organization's laboratory biosafety manual before you ever work near an organism.
- **Not medical advice.** Nothing here diagnoses anyone. Variant calling in this track is a software exercise on a bacterium.

## What the 2030 Product Development Manager does here

Four jobs stay with you:

- **Decide the question.** What are we asking of the data, and what answer would change a decision? An agent can run any analysis. It cannot choose the one that matters.
- **Decide what counts as correct.** You choose the truth set, the test data and the pass mark before the pipeline runs. Without a known answer, a pipeline that finishes is not a pipeline that works.
- **Own the claim.** When a report says "27 variants", your name is behind it. You can say how each was called, how sure you are and what was filtered out.
- **Judge risk and licence.** You decide which tools you may use for which purpose. Some prediction tools are free for research but not for commercial use.

Agents are a fast workforce for the typing: shell commands, Python, pipeline code, plots and a first draft of the write-up. They also make quiet mistakes. They pick a default that silently drops reads, mix up two reference versions or report a p-value with no correction. So the rule of this track is: **an agent may write the pipeline, and you must run it on data with a known answer before you believe it.**

Other disciplines care about this work. Security and privacy ask what data may leave your machine and what you may paste into an agent. Legal asks what each tool's licence allows. Finance asks what the compute costs. Operations wants runs that repeat. Science colleagues want to know how you reached a number.

## How it maps to the Dojo

- **Safety, reports and review.** Read [When not to trust a model](/library/tracks/safety-reports-and-review/01-when-not-to-trust-a-model) alongside lesson 5. Use [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report) for the capstone write-up, and [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review) to set up the review.
- **Lab automation in code.** After this track, go to [Lab automation in code](/library/tracks/lab-automation-in-code). It covers experiment design and closed loops in simulation, which is where your analysis skills feed back into what to measure next.
- **Robot learning.** The checking habits in this track carry over to [Robot learning](/library/tracks/robot-learning): test on data the model never saw, and report failures.
- **CI/CD.** The capstone uses a test pipeline on every push. See [CI/CD](/library/tracks/ci-cd) for the ideas behind it.
- **Working with AI agents.** Read [Working with AI agents](/library/tracks/working-with-ai-agents) for how to write a brief, and [Disclose AI use](/library/disclose-ai-use) for the one line every deliverable carries.
- **Research and evidence.** The evidence log from [Research and evidence](/library/tracks/research-and-evidence) is where you record each version and licence fact you rely on.

## Before you begin

Create an empty git repository called `bio-dojo` (or any name you like). Each lesson saves one deliverable in it, in a folder named for the lesson. The capstone builds on them. Read [Disclose AI use](/library/disclose-ai-use) first. Every file you make with an agent's help carries a short note saying so.
