---
title: "Protein structure prediction tools"
description: "Fetch a predicted protein structure from the AlphaFold Database, read its pLDDT and error scores, and compare the open prediction tools and their licences. You learn which parts of a prediction to trust."
section: "Bioinformatics"
order: 5
track: "bioinformatics"
level: "core"
duration: "3 hours"
outcomes:
  - "Fetch a predicted structure and its confidence files from the AlphaFold Database API"
  - "Read pLDDT and predicted aligned error, and name the parts of a prediction you would not rely on"
  - "Compare AlphaFold 3, ColabFold, ESMFold, Boltz, Chai-1 and OpenFold3 on licence, inputs and hardware"
  - "State what a predicted structure cannot tell you, in a sentence a reviewer can check"
  - "Write a short tool-choice note that cites each licence at its source"
resources:
  - "embl-ebi/alphafold-database"
  - "embl-ebi/alphafold-training"
  - "embl-ebi/alphafold-confidence-scores"
  - "google-deepmind/alphafold3"
  - "colabfold/colabfold"
  - "boltz/boltz"
  - "openfold/openfold3-documentation"
prerequisites:
  - "tracks/bioinformatics/02-biopython-for-everyday-sequence-work"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of reading a model's confidence before you rely on its answer. **Time:** about three hours.

## 1. Why this matters

A protein is a chain of amino acids that folds into a 3D shape, and the shape decides what it does. For decades, finding a shape needed a costly experiment. Today, AI models predict a shape from the sequence, and a large public database of predictions is free to download.

This is a frontier you can use now. It is also where a confident-looking picture can mislead. A prediction is a model's best guess, not a measurement. It comes with scores that tell you where the guess is firm and where it is not, and many people never look at them. An AI agent will happily summarise "the structure of protein X" without saying which half is a guess.

As a Product Development Manager you decide how far a prediction may be trusted for a given use, and which tool you are allowed to run. The second question is a licence question, and for some of these tools it is a hard limit.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which tool is allowed for this purpose, and how much trust a prediction can carry | Fetching files, computing score summaries, drafting the comparison table | Every licence statement against the source page; the score summary against the raw file | Legal (licences and terms), safety (what could the output be used for), privacy (where your sequence is sent), science colleagues |

## 2. Key ideas

### Prediction is not measurement

A predicted structure is a computed model. An experimental structure comes from a method such as X-ray crystallography or cryo-electron microscopy. The model gives one static shape. Real proteins move, bind partners and change with their surroundings. A prediction may leave out a bound metal, a small molecule or a modification that changes the shape.

### pLDDT: how sure is the model about each amino acid

Every residue, that is every amino acid in the chain, has a **pLDDT** score from 0 to 100. The AlphaFold Database groups it in four bands:

| pLDDT | Reading |
|---|---|
| 90 or more | Very high. The backbone and often the side chains are likely right |
| 70 to 90 | Confident. The backbone is probably right |
| 50 to 70 | Low. Treat with caution |
| below 50 | Very low. Often a flexible or disordered region, or a place the model has no information |

AlphaFold writes the pLDDT into the column of the structure file that normally holds the B-factor. So a viewer that colours by B-factor is showing you confidence.

### PAE: how sure is the model about relative positions

The **predicted aligned error**, PAE, is a table. For each pair of residues, it gives the expected error, in ångström, in the position of one residue when the structure is lined up on the other. Low values mean the model is sure of their relative placement. Two domains can each have a high pLDDT while the PAE between them is high. Then each domain is probably right, and their arrangement is a guess.

### The AlphaFold Database

The EMBL-EBI hosts the AlphaFold Database with Google DeepMind. It holds predicted structures for a large number of protein sequences, free to download. The data are under the CC-BY 4.0 licence. You must give credit. A public API returns, for a UniProt accession, links to the structure file and its confidence files. On 19 November 2026, the files carried version 6 in their names. The entry used in this lesson says it was made by the "AlphaFold Monomer v2.0 pipeline".

### The tools you can run yourself

You may want a structure that the database does not have: a mutated sequence, a complex of several chains, a protein with a small molecule. Then you run a model. Here is the field on 19 November 2026. Check each source before you rely on this, because licences change.

| Tool | Code licence | Weights and use | Notes |
|---|---|---|---|
| **AlphaFold 3** (Google DeepMind) | Apache-2.0 | Weights come only from Google, on request. Terms allow only non-commercial use by non-commercial organisations. You may not share the weights. You may not use the output to train a structure-prediction model | Also on the AlphaFold Server, for non-commercial use. Commercial use goes through Google Cloud |
| **ColabFold** | MIT (version 1.6.3) | Read the weights terms on the project page | Makes AlphaFold-style predictions faster. It gets related sequences from a shared server, so your sequence leaves your machine |
| **ESMFold** (Meta) | MIT | Read the weights terms on the project page | Predicts from a single sequence with no search for related sequences, so it is quick, but it has less information to use |
| **Boltz** | MIT | Read the weights terms on the project page | Handles complexes and small molecules |
| **Chai-1** | Apache-2.0 | Read the weights terms on the project page | Needs a CUDA GPU |
| **OpenFold3** (OpenFold) | Apache-2.0 | Read the weights terms on the project page | Described as a preview release when this lesson was written |

Read the terms for AlphaFold 3 closely. "Free" there does not mean "free for any use". Commercial use is outside the terms. The AlphaFold Server is also for non-commercial use only, and commercial use goes through Google Cloud. If you are not sure, you are not covered.

### Hardware

For a protein lookup you need nothing but a network connection. Running a model yourself generally needs a GPU. Chai-1 states that it needs a CUDA GPU. Check each project's page for memory needs before you start. If you have no GPU, use the database, or the AlphaFold Server where its terms fit your use. Say so in your report.

### Care with what you predict

This track uses harmless housekeeping proteins from *E. coli* K-12. Prediction tools can be pointed at any sequence, including toxins and other hazardous proteins. Do not use them to design or improve anything harmful. Real lab work with any organism needs a trained supervisor and institutional approval. See the [biosafety basics lesson](/library/tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate).

## 3. Step by step

You will write a short script that fetches a prediction and summarises how much of it to trust.

### Step 1: Find the accession

Search UniProt for a protein. A UniProt accession looks like `P0AA25`. This one is thioredoxin 1 of *E. coli* K-12. Another is `P0AES4`, the DNA gyrase subunit A.

### Step 2: Fetch the entry and the structure

The API address is `https://alphafold.ebi.ac.uk/api/prediction/<accession>`. It returns JSON with a list that has one entry. The entry has the sequence, the global score and the links for the structure and its confidence files.

### Step 3: Write the script

Install what you need with `pip install "biopython==1.88"`. Save this as `read_afdb.py`.

```python
"""Read an AlphaFold DB prediction and summarise how much of it to trust."""
import json
import sys
import urllib.request
from itertools import groupby

from Bio.PDB import PDBParser

API = "https://alphafold.ebi.ac.uk/api/prediction/"


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "dojo-bioinformatics-lesson"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def band(plddt: float) -> str:
    if plddt >= 90:
        return "very high"
    if plddt >= 70:
        return "confident"
    if plddt >= 50:
        return "low"
    return "very low"


accession = sys.argv[1]
entry = json.loads(get(API + accession))[0]
print(entry["uniprotDescription"], "|", entry["organismScientificName"], "|", entry["entryId"])

with open(f"{accession}.pdb", "wb") as handle:
    handle.write(get(entry["pdbUrl"]))

structure = PDBParser(QUIET=True).get_structure(accession, f"{accession}.pdb")
# AlphaFold writes pLDDT into the B-factor column. Every atom of a residue carries the same value.
residues = [(r.id[1], next(iter(r)).get_bfactor()) for r in structure.get_residues()]

counts: dict[str, int] = {}
for _, plddt in residues:
    counts[band(plddt)] = counts.get(band(plddt), 0) + 1
for name in ("very high", "confident", "low", "very low"):
    print(f"{name:>9}: {counts.get(name, 0):4d} residues ({counts.get(name, 0) / len(residues):.1%})")

# Print each stretch of 8 or more residues below 50. These are the parts to distrust most.
runs = []
for is_low, group in groupby(residues, key=lambda item: item[1] < 50):
    positions = [position for position, _ in group]
    if is_low and len(positions) >= 8:
        runs.append((positions[0], positions[-1]))
print("stretches below 50:", runs or "none")

pae = json.loads(get(entry["paeDocUrl"]))[0]
print("largest possible PAE in this file (angstrom):", pae["max_predicted_aligned_error"])
```

### Step 4: Run it on two proteins

```bash
python read_afdb.py P0AA25
python read_afdb.py P0AES4
```

### Step 5: Look at the picture

Open the structure file in a free viewer. The AlphaFold Database entry pages show the 3D model coloured by pLDDT. Find the low-confidence stretches that your script printed. Are they at the ends or in the middle?

## 4. Worked example: two E. coli proteins

These are the real outputs of the script today.

**Thioredoxin 1 (`P0AA25`, 109 residues).**

```text
Thioredoxin 1 | Escherichia coli (strain K12) | AF-P0AA25-F1
very high:  103 residues (94.5%)
confident:    4 residues (3.7%)
      low:    1 residues (0.9%)
 very low:    1 residues (0.9%)
stretches below 50: none
largest possible PAE in this file (angstrom): 31.75
```

Almost all of it is very high. This is the kind of small, well-folded protein the model handles well.

**DNA gyrase subunit A (`P0AES4`, 875 residues).**

```text
DNA gyrase subunit A | Escherichia coli (strain K12) | AF-P0AES4-F1
very high:  566 residues (64.7%)
confident:  222 residues (25.4%)
      low:   34 residues (3.9%)
 very low:   53 residues (6.1%)
stretches below 50: [(558, 573), (842, 875)]
largest possible PAE in this file (angstrom): 31.75
```

About 90% of this protein is at 70 or above. But 53 residues are very low, in two stretches: 558 to 573, and the last 34 residues at the end of the chain. A report that says "the structure of gyrase A" and shows one clean picture hides those stretches. A careful report says which residues you would not rely on. This lesson does not look into what these regions do. Low pLDDT often marks a flexible or disordered region, and it can also mean the model has too little information. The score alone does not tell you which.

**What neither prediction tells you.** Neither says whether the protein is bound to a partner or a small molecule, or which of its shapes it takes in a cell. Gyrase works as part of a larger assembly, and a single-chain prediction of one subunit is one piece of it. The database entry is a model of one chain.

**The comparison note.** Here is the kind of sentence a reviewer can check: "AlphaFold 3 weights are free for non-commercial use by non-commercial organisations only (source: the weights terms of use, page read on 19 November 2026), so this project, which is run by a company, may not use them."

## 5. Working with AI agents on this

**What the PDM decides.** Which tool is allowed, which parts of a prediction may support a claim, and what the report must say about limits. These are yours. An agent tends to write "the structure shows..." with no hedge.

**What you delegate, and the exact brief.**

```text
Write read_afdb.py for my repository. Input: a UniProt accession.
It must: call https://alphafold.ebi.ac.uk/api/prediction/<accession>,
download the PDB file named in the response, read pLDDT from the B-factor
column with Biopython 1.88, print the share of residues in the four pLDDT
bands (>=90, 70-90, 50-70, <50) and every stretch of 8 or more residues
below 50, and print the PAE maximum from the PAE JSON file.
Rules: no other URLs. Time out after 60 seconds. Stop with a clear message
if the response is empty. Do not hide errors.
Then write NOTES.md with a table of AlphaFold 3, ColabFold, ESMFold, Boltz,
Chai-1 and OpenFold3: code licence, weights licence, hardware. For each cell
give the URL of the page you read. If you cannot find a source, write
"not verified". Do not guess a licence.
Output: the script, the notes and a list of unverified cells.
```

**How you verify.** Open every URL the agent lists, and read the licence text there yourself. Check the script's band counts against a manual look at five residues in the file. Compare the table with the sources and strike anything the agent could not source.

**Which disciplines are involved.** Legal owns the licence question. Safety asks what a prediction could be used for and whether a given sequence is appropriate. Privacy asks whether your sequence is sent to a shared server. Science colleagues judge whether a low-confidence region matters for the question.

**Where this sits on the ladder.** You **delegate** a bounded task with a written brief and acceptance checks. If you ran several models on one protein through separate agents to compare them, you would be **orchestrating**. Then a written policy, such as "no licence claim without a source URL", becomes a gate. For more on reading a model's confidence, see [When not to trust a model](/library/tracks/safety-reports-and-review/01-when-not-to-trust-a-model).

**Disclose.** Add to the notes: "AI use: script and first draft of the table by an agent from my brief; I read every licence at its source and checked the band counts by hand." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Showing one clean picture.** Always show or list the low-confidence regions.
- **Reading pLDDT as accuracy.** It is the model's own confidence, not a measured error.
- **Ignoring PAE.** Two confident domains can still be placed wrongly against each other.
- **Treating a prediction as an experiment.** It is a model. Say so in the first sentence.
- **Assuming "free to download" means "free for any use".** Check licences, and for AlphaFold 3 check who may use it.
- **Sending a private sequence to a shared server.** Know where your input goes.
- **Forgetting attribution.** AlphaFold Database data are CC-BY 4.0. Credit them.
- **Training on outputs against the terms.** AlphaFold 3 output may not be used to train a similar structure model.
- **Using a prediction tool on a hazardous protein.** Stay with harmless examples, and ask a supervisor.

## 7. Practice: fetch, summarise and choose

**Deliverable:** a folder `05-structure/` in your own git repository.

1. `read_afdb.py`: your script, written by you or by an agent.
2. `thioredoxin.txt` and `gyrase.txt`: the printed output for the two proteins above. Then pick a third protein of your own, from a harmless organism, and add `third.txt`.
3. `NOTES.md`: for each of the six tools, a row with the code licence, the weights licence and the hardware, with the source URL and the date you read it. Add "not verified" where you could not check. Under the table, write a three-line decision: which tool a university lab would use, and which one a company would use, for a protein complex, with the licence reason.
4. `README.md`: the attribution line for the AlphaFold Database, what the predictions cannot tell you, and the AI-use line.

**Check:** a reviewer should be able to open each source URL and find the sentence you relied on.

## 8. Checklist

- [ ] I fetched at least three predictions with the API.
- [ ] I reported the share of residues in each pLDDT band.
- [ ] I listed the stretches below 50 and said I do not rely on them.
- [ ] I read PAE and said what it means for domains.
- [ ] Every licence claim has a source URL and a date.
- [ ] I wrote "not verified" where I could not check.
- [ ] I credited the AlphaFold Database under CC-BY 4.0.
- [ ] I used only harmless proteins.
- [ ] The README has my AI-use line.

## 9. Further learning

The AlphaFold Database page and the EMBL-EBI training course show how to search, read and download predictions. The EMBL-EBI guide to confidence scores explains pLDDT and PAE with pictures. The AlphaFold 3 repository holds the code, the weights terms of use and the instructions for asking Google for the weights. ColabFold, Boltz and OpenFold3 each publish their own documentation. Next, in [Statistics for noisy biological data](/library/tracks/bioinformatics/06-statistics-for-noisy-biological-data), you learn why thousands of tests produce false hits.
