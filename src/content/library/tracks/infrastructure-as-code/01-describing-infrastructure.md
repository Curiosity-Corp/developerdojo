---
title: "Describing infrastructure"
description: "Infrastructure as code from first principles: declarative files, resources, variables, and the plan and apply cycle, with enough reading skill to judge an agent's code."
section: "Infrastructure as code"
order: 1
track: "infrastructure-as-code"
level: "foundation"
duration: "75 min"
outcomes:
  - "Explain why infrastructure is written as code and what declarative means"
  - "Read a short Terraform or OpenTofu file: provider, resource, variable, output"
  - "Describe the init, plan and apply cycle and why the plan is the review point"
  - "Direct an agent to write a small piece of infrastructure and verify the plan"
prerequisites:
  - "the-way-five-rules"
  - "iac-gitops-and-drift"
resources:
  - "hashicorp/terraform-intro"
  - "hashicorp/terraform-tutorials"
  - "hashicorp/terraform-get-started-aws"
  - "opentofu/docs"
  - "youtube-freecodecamp/terraform-course-automate-your-aws-cloud-infrastructure"
  - "google-cloud/terraform-on-google-cloud"
updated: 2026-11-03
---

Lesson 1 of the Infrastructure as code track. It supports the Master Developer module on everything as code. It assumes you know the cloud building blocks from the Cloud platforms track.

## 1. Why this matters

Clicking through a cloud console is quick, and leaves nothing behind. No one can say later what was created, why, or by whom. Two environments built by hand never quite match. A mistake cannot be reviewed before it happens. When an agent is the one doing the work, that is worse: you cannot watch every click, and you cannot easily undo.

Writing infrastructure as code solves these at once. The description is a file. The file is reviewed in a merge request. A tool shows exactly what it will change before it changes it. History records who decided what. And the same description can build a second copy of the whole thing in minutes.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What infrastructure the product needs, in which accounts and regions, what is acceptable to create or destroy | Writing the files, explaining a plan, comparing providers' resources, drafting modules | Reading the plan line by line, checking that the plan matches the spec, confirming nothing is destroyed by surprise | Cloud and platform engineering (what is feasible), security (exposure, permissions), finance (what resources cost), operations (running it) |

## 2. Key ideas, explained

### Declarative: say what, not how

Most programming is **imperative**: step one, step two, step three. Infrastructure tools are usually **declarative**: you describe the end state ("one private storage bucket named X in region Y"), and the tool works out the steps. If the bucket already exists, it does nothing. If it is missing, it creates it. If it exists with the wrong setting, it changes the setting.

This matches the control loop idea from the Kubernetes track, and it has the same consequence: the description is the product. If the description is wrong, the tool will faithfully build the wrong thing.

HashiCorp's page [What is Terraform](https://developer.hashicorp.com/terraform/intro) gives the standard introduction. The open source fork [OpenTofu](https://opentofu.org/docs/) works the same way, with the same language.

### The pieces of a file

Here is a small file, annotated:

```hcl
terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  type    = string
  default = "eu-west-2"
}

resource "aws_s3_bucket" "site" {
  bucket = "trailmug-site-test"
  tags = {
    owner = "maya"
    issue = "41"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}
```

How to read it:

| Block | What it is | What to ask |
|---|---|---|
| `terraform` | Settings for the tool itself, including provider versions | Are versions pinned or constrained? |
| `provider` | Which cloud and which region to talk to | Is the region the one in the decision record? |
| `variable` | An input, so the same code can be used in different places | Is there a sensible default, or does the value come from the environment? |
| `resource` | One real thing to create: a bucket, a database, a permission | Is this what the spec asked for, and nothing more? |
| `output` | A value to print or pass on | Does it expose anything secret? |

The language is called HCL. You do not need to write it. You need to recognise the shapes. The pattern `type "name"` after `resource` gives the kind of resource and the local name. References such as `aws_s3_bucket.site.id` show that one resource depends on another, which tells the tool the order.

### Providers

A **provider** is a plug-in that knows how to talk to one service: AWS, Azure, Google Cloud, GitLab, Kubernetes and many others. The same tool, language and cycle work across all of them. Providers are versioned, and a provider update can change behaviour, so versions need constraining and updates need review, as with any dependency (CI/CD lesson 4).

### The cycle: init, plan, apply

| Step | What it does | Changes anything real? |
|---|---|---|
| **init** | Downloads the providers and sets up the working folder | No |
| **validate** | Checks that the files are well formed | No |
| **plan** | Compares the files to reality and shows what would change | No |
| **apply** | Makes the changes the plan showed | **Yes** |
| **destroy** | Removes everything the files describe | **Yes, and large** |

The [plan command reference](https://developer.hashicorp.com/terraform/cli/commands/plan) describes the plan. The plan is the review point. It prints each resource with a symbol:

| Symbol | Meaning |
|---|---|
| `+` | Will be created |
| `~` | Will be changed in place |
| `-` | Will be destroyed |
| `-/+` | Will be destroyed and created again (**replaced**) |

A replaced database loses its data unless it is protected. A replaced bucket loses its files. The most important habit in this whole track is: **read the plan for `-` and `-/+` before approving**. Lesson 4 returns to this.

### Idempotent: running twice is safe

Applying the same description twice should change nothing the second time. This property, called **idempotence**, is why the tool can run again and again from a pipeline. If a second run shows changes you did not make, you have found **drift**: someone changed the real thing outside the code, or something else is changing it.

### Everything has a name and an owner

Infrastructure that nobody can trace is a cost and a risk. Require tags such as owner and issue on every resource that supports tags, as in Cloud platforms lesson 4. A resource with no owner is the first one to forget, and the first to appear on a bill.

### Free practice

Practise with a throwaway account with a budget alert, or with the tool's local-only providers, which create files rather than cloud resources. Hashicorp's [tutorials](https://developer.hashicorp.com/terraform/tutorials) and its [AWS getting started](https://developer.hashicorp.com/terraform/tutorials/aws-get-started) walk through the cycle. Google Cloud has its own [Terraform documentation](https://docs.cloud.google.com/docs/terraform). The long freeCodeCamp video [Terraform Course](https://www.youtube.com/watch?v=SLB_c_ayRMo) is a thorough free introduction. Treat all hands-on work as disposable: destroy it when done.

## 3. Step by step: write and review a first piece

1. **Write the need** in a sentence: "A private bucket for the test site, in the region from the decision record, tagged with owner and issue."
2. **Write a spec** with acceptance criteria, including what must *not* be created.
3. **Direct an agent** to write the files on a branch, plan first.
4. **Read the files** with the table in section 2.
5. **Run init and validate,** or let the pipeline do it.
6. **Read the plan.** Count the `+`, `~`, `-` and `-/+`.
7. **Compare the plan to the spec.** Everything the plan creates should be traceable to an acceptance criterion.
8. **Ask what the plan does not show:** costs, permissions, public exposure.
9. **Merge** after review. Apply happens only in the pipeline (lesson 3), or in a throwaway account for practice.
10. **Run plan again.** It should show no changes. If it does, find the drift.
11. **Destroy** the practice resources.

## 4. Worked example: TrailMug

Maya needs a test bucket for the site files. Her spec:

```text
Issue 41: test site bucket
Acceptance criteria
1. One storage bucket named trailmug-site-test, in the UK region from decision D-04.
2. Public access fully blocked (the CDN will read it later, in a separate issue).
3. Tags owner=maya and issue=41.
4. No other resources, no IAM users, no access keys.
5. Provider and tool versions constrained.
6. The plan shows exactly two resources to add and nothing to change or destroy.
```

She briefs an agent: "Write the files only. Do not run apply. Show me the plan output." The agent produces the files, close to the example above, plus an IAM user "for uploads" with an access key. She rejects it: criterion 4. The agent removes it. The first plan shows three resources to add. She reads the third: a bucket versioning resource the agent added "for safety". It is harmless but out of spec. She asks whether she wants it. Versioning keeps old copies of files and costs more storage. She decides to add it as a separate issue, and has the agent remove it.

The second plan shows two to add, zero to change, zero to destroy. She approves. In her throwaway practice account, the apply creates the bucket. She runs plan again: no changes. She checks the console: the bucket is private and tagged. She destroys it and confirms it is gone.

What she did **not** do was trust the agent's sentence "the bucket is private". She read the block that makes it so, and the plan that shows it exists.

## 5. Working with AI agents on this

**What the PDM decides:** what infrastructure exists, in which account and region, what may be created or destroyed, who approves.

**Delegate:** writing the files, explaining each block, running validate and plan in a safe account, summarising a plan, drafting the tag convention.

**Verify:** the plan against the spec; that the second plan is empty; that the real resource matches the claim in the console; no `-` or `-/+` you did not expect.

**Prompt to write infrastructure code:**

```text
Write Terraform (OpenTofu compatible) files for the spec below, in the infra/test
folder. Use the provider and region in the spec, constrain provider and tool
versions, tag every resource with owner and issue, and create nothing that the
spec does not list. Do not run apply. Run init, validate and plan, and paste the
plan output. Then list each resource and the acceptance criterion it satisfies, and
anything you assumed.
<paste spec>
```

**Prompt to explain a plan to a manager:**

```text
Here is a plan output. Summarise it for a product manager: how many resources are
created, changed, destroyed and replaced. For every destroy or replace, say what
is lost and whether it can be recovered. Flag anything public, any permission
change and any cost driver. Mark anything you cannot tell. Do not edit the files.
<paste plan>
```

**Disclose** AI-written infrastructure in the merge request.

## 6. Common mistakes and how to avoid them

- **Approving without reading the plan.** Fix: count the symbols, read each `-`.
- **Letting the agent apply.** Fix: apply only in the pipeline or a throwaway account.
- **Extra resources "for safety".** Fix: spec says what is created and what is not.
- **Unpinned provider versions.** Fix: constrain, and review updates.
- **No tags.** Fix: owner and issue on everything.
- **Real account for practice.** Fix: throwaway with a budget alert.
- **Believing the agent's description of the result.** Fix: check the console and a second plan.
- **Not destroying practice resources.** Fix: destroy and confirm.

## 7. Practice

**Deliverable in git:** `specs/iac-01.md`, `briefs/iac-01.md`, `reviews/iac-01.md`, and a merge request with the files.

1. Choose one small resource: a private storage bucket, or a local file if you have no account.
2. Write a spec with at least six acceptance criteria, including what must not be created and the expected plan counts.
3. Brief an agent to write the files and show the plan. Plan first; no apply.
4. Review the files with the block table and the plan with the symbol table. Record each finding in `reviews/iac-01.md`.
5. Ask the agent to remove anything out of spec. Re-read the new plan.
6. In a throwaway account, apply, run plan again, check the real resource, then destroy.
7. Record one place the agent added something you did not ask for. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I can say what declarative means.
- [ ] I can name the five blocks in a file and what each is for.
- [ ] I read the plan and counted created, changed, destroyed, replaced.
- [ ] The plan matched the spec and nothing extra.
- [ ] A second plan was empty.
- [ ] Practice resources are destroyed.
- [ ] Every resource has an owner and issue tag.

## 9. Further learning

Begin with What is Terraform, then follow one hands-on tutorial through the full cycle. The OpenTofu documentation shows the open source equivalent. The long video is good if you prefer to follow along. The next lesson covers state and modules.
