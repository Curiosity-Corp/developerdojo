---
title: "Map the whole product"
description: "Draw your product on one page: every part, every rented system, every partner and every competitor or workaround, with a clear mark for what exists today and what does not."
section: "Product discovery"
order: 3
track: "product-discovery"
level: "foundation"
duration: "2 hours"
outcomes:
  - "Draw a one-page map of a product with its layers, parts and connections"
  - "List the systems you rent and the part of the business each one serves"
  - "Mark every item as exists, planned or not found, and show your evidence"
  - "Map the alternatives and workarounds customers use today"
resources:
  - "nngroup/service-blueprints"
  - "gov-uk/service-standard"
  - "atlassian/project-dependencies"
  - "figma/competitive-analysis"
  - "nngroup/ux-research-cheat-sheet"
prerequisites:
  - "week-1-see-the-whole-product"
  - "repository-map-standard"
updated: 2026-11-03
---

**Supports:** Developer, week 1 (the Product Repository Map and the Integrations Register). **Time:** about two hours.

## 1. Why this matters

A beginner thinks "one product, one repo". A real product is a web of parts: a public website, an app, small services, workflows, systems you rent for payments and email, a customer list, a help centre, a status page, policies, and the infrastructure that runs it all. Each part may live in a different repository, belong to a different part of the business, and be touched by a different team or agent.

An AI agent sees **one repo at a time**. It cannot see that the sign-up form in one repo promises something the payment service in another repo cannot deliver. Only a human holds the whole picture. That human is the Product Development Manager (PDM), and the picture is the map.

The map is also your best defence against the most expensive kind of surprise: the thing that was "obviously part of the product" and that nobody planned. A missing privacy page, no way to refund a payment, no one watching if the site is down. Such gaps turn into epics later. Finding them on paper costs an afternoon. Finding them after launch costs customers.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What counts as "the product", where its edges are, and which gaps matter | Inventorying repos and files that already exist; drafting a first table of integrations from code | Every "exists" mark has evidence you opened yourself; every "planned" item has an owner | Engineering, operations, finance (rented systems cost money), security and privacy (data flows), sales and support |

## 2. Key ideas

### The product is bigger than the app

Think in layers. One way to remember them: a person **reaches** the product, **uses** it, and **pays** for it, while behind the scenes the team **runs** it, **connects** it to other systems and **plans** its future.

| Layer | Question it answers | Examples |
|---|---|---|
| Reach | How do people find us? | Website, landing pages, search, posters, social posts |
| Use | What do people use? | App, tools, calculators, dashboards |
| Pay | How does money move? | Pricing, checkout, invoices, refunds |
| Run | What does the work behind the scenes? | Small services, workflows, scheduled jobs |
| Connect | Which systems do we rent? | Email, payments, customer list (CRM), help desk, analytics |
| Operate | How do we keep it healthy and lawful? | Status page, backups, help pages, policies, privacy |
| Plan | How do we decide what comes next? | Briefs, journeys, decisions, roadmap, issues |

The UK government service standard asks teams to "solve a whole problem for users", not just build one part of a service. That is the same idea from another country, and its list of points is a strong checklist for whole-product thinking.

### Front stage and back stage

A **service blueprint** extends a journey map by adding what happens behind the scenes: the people, systems and steps that make each visible moment possible. NN/g's definition page is a good short read. For discovery, you do not need a full blueprint. You need the habit it teaches: for everything the customer sees, ask "what must exist behind it?".

### Exists, planned, not found

Honesty is the heart of the map. Every item gets one of three marks:

- **Exists.** You have opened it and seen it working. Note where.
- **Planned.** Someone has decided to build it and a human owns it.
- **Not found.** You looked and there is nothing. Often this is the most valuable finding.

Never mark something as existing because you expect it to. The Dojo's own worked example of a real product found that several things people assume (a payment gateway, a separate ops repo) were not there. Finding what is missing is part of the job.

### Rented systems are part of your product

Every tool from another company that your product uses is an **integration**. Each one has an owner on your side, a purpose, a cost and a data flow. If your customer list lives in a rented tool, then that tool's outage, its price changes and its privacy rules are yours to manage. Write them down in an [integrations register](/library/template-integrations-register) with the part of the business each serves: sales, marketing, finance, support, operations or identity.

### The alternatives map

Your real competitor is rarely another startup. It is whatever the customer does today: a spreadsheet, a habit, a workaround, doing nothing. List these **alternatives** next to your direct competitors. For each, write what it does well and where it hurts. This tells you what you have to beat, and it keeps you from fighting an imaginary rival.

### Dependencies

Some parts cannot start before others. A welcome email needs a customer list. A customer list needs a sign-up form. When you draw arrows between parts you see the **dependencies**, and these decide the order of the roadmap later. Atlassian's page on project dependencies explains the common kinds.

## 3. Step by step

### Step 1: Start from the customer's story

Open your interview notes. List every moment a person meets the product: finding it, learning about it, signing up, using it, paying, getting help, leaving. Each moment is a **touch point**. Write them on sticky notes or in a list.

### Step 2: Ask "what must exist behind it?"

For each touch point, write what must exist for it to work. A poster with a QR code needs a landing page. A landing page needs a form. A form needs a place to store the answers. A place to store answers needs rules about privacy. Keep going until the answers become things you can name.

### Step 3: Group into layers

Put each named thing under one of the seven layers above. If it does not fit, make a new layer, and say why. Empty layers are a warning: a product with nothing under Operate has no plan for when things go wrong.

### Step 4: Name each part as a repo or a rented system

Give each part a short, lowercase name with a prefix that tells the kind: `-site`, `-app`, `-svc-`, `-flow-`, `-int-`, `-ops`, `-docs`. Follow the [repository map standard](/library/repository-map-standard) so names stay tidy. Each part gets **one named human owner**. An AI agent is never an owner.

### Step 5: Mark exists, planned or not found, with evidence

Write the evidence next to each mark: a link, a file path or "searched all repos for payment code, nothing found on 2026-11-05". If you have no evidence, the mark is "not found" or "unknown".

### Step 6: Draw the connections

Draw arrows for the data that flows. "Sign-up form sends email address to customer list." "Payment service tells the app a member is paid." Label each arrow with **what** moves, because these labels become the interfaces that agents need later. Never write secret values on the map. Names only.

### Step 7: Map the alternatives

On a second page, list three to six alternatives and workarounds. For each, record: who uses it, what it does well, what hurts, and what it costs the customer in money, time or worry.

### Step 8: Count and review

Count the unique parts. A serious product usually has 12 to 25. If you counted three or four, look for touch points you missed. Then ask someone from another discipline (someone in sales, finance, support or operations if you have them) to find a part you forgot.

## 4. Worked example: TrailMug

TrailMug is fictional. The founder's first guess was four parts: planning, website, app and payments. After walking the customer story, the map grew.

| Layer | Part (repo or system) | Mark | Evidence or owner |
|---|---|---|---|
| Plan | trailmug-planning | exists | The notes and interviews folder, owner: founder |
| Reach | trailmug-site | exists | One page, live on the test domain |
| Reach | trailmug-lp-cafes | planned | Partner sign-up page, owner: founder |
| Use | trailmug-app | exists | Prototype with sign-in only |
| Run | trailmug-svc-returns | planned | Tracks which cup is where |
| Run | trailmug-flow-welcome | planned | Welcome email series |
| Pay | trailmug-pay | not found | Searched all repos on 2026-11-05, no payment code |
| Connect | Email provider (rented) | planned | Owner: founder; data: email address, name |
| Connect | Customer list (CRM, rented) | not found | No list exists; leads sit in a spreadsheet |
| Operate | trailmug-status | not found | Nobody can tell if the site is down |
| Operate | trailmug-ops (policies) | not found | No privacy notice or terms |
| Operate | trailmug-docs (help centre) | not found | Café owners have no setup guide |

**What the map showed:** a café partner cannot join because the partner page does not exist, and a member cannot pay because there is no payment. The interviews said payment trust matters, yet the product has no price page. These are not code tasks. They are gaps in the product, and each is a candidate epic in week 3.

**The alternatives page (extract):**

| Alternative | Who uses it | Does well | Hurts |
|---|---|---|---|
| Carry your own cup | Eco-minded commuters | Free, no new habit | Dirty cup in bag, forgotten at home |
| Café loyalty discount for own cup | Some cafés | Easy to understand | Still need to carry the cup |
| Throw-away cup | Most people | Zero effort | Guilt, waste, sometimes a fee |

The founder noticed that the best alternative is not another subscription. It is "carry your own cup", and its single weakness is the dirty cup in the bag. That is the place TrailMug must win.

## 5. Working with AI agents on this

This is a good task to delegate in part, because much of it is **inventory** of things that already exist and can be checked.

**Delegate:**

- **A read-only inventory.** "List every repo in this group with its README summary and last commit date." Or "Search these repos for any code that calls a payment service and report file paths."
- **A first draft of the integrations table** from configuration files and dependency lists, which you then correct.
- **Public research on alternatives:** names, prices and features, with source links.
- **Formatting** your map into a clean table or a diagram in text form.

**Do yourself:**

- Decide where the product's edges are and which parts matter.
- Open each "exists" claim and confirm it.
- Draw the connections and name the owners.
- Judge which "not found" items are real gaps.

**A brief you can adapt:**

```text
You have read-only access to the repositories in the group named below.
Task: produce an inventory. Do not change anything.
For each repository return: name, one-line purpose taken from its README,
last commit date, and the three most important files.
Then search all repositories for: payment code, email-sending code,
customer-list (CRM) calls, and any status or uptime page.
For each search, report either the file path and line, or the exact
sentence "Searched <repos>, nothing found." Do not guess. If you cannot
tell, say "unknown".
```

**How to check the output.** Open at least a third of the repos and files the agent names. Look for two failure modes. One is **false positives**: the agent found a file called `payment.md` that is only a note. The other is **false negatives**: it missed code stored under another name. Make the agent show the exact search it ran. Mark "exists" only on what you opened.

**Never** let an agent decide that something "should" exist and add it to the map as real. An agent that fills gaps with plausible things produces a map of a product that does not exist.

**Security habit.** Give agents the narrowest read access that does the job, and never paste secrets into a prompt. The map holds names of secrets, never values.

**Disclose.** In the map's footer, record which sections an agent inventoried and which you verified by hand.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on the **delegate** rung. A mapping task with a written brief and a list you verify is a whole task handed over. Several agents mapping different areas at once is orchestration, and then the shared names must live in one file that all briefs point to. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the two upper rungs.

## 6. Common mistakes

- **Drawing only the app.** Reach, pay, connect and operate are where most gaps hide.
- **Marking items as existing because they are expected.** Use evidence.
- **Forgetting rented systems.** Email, CRM and payment tools hold your customers' data and carry your risk.
- **No owners.** A part with no human owner will be built twice or not at all.
- **Ignoring alternatives.** If you cannot name what customers do today, you do not know your competitor.
- **A map made alone.** You cannot see your own blind spots. Ask someone from another discipline to read it.
- **Putting secrets on the map.** Write names of secrets, never their values.

## 7. Practice: the one-page map and alternatives page

**Deliverable:** three files in your git repo under `discovery/`.

1. `product-map.md`: the layered table with every part, its mark (exists, planned, not found), evidence and one human owner. Include a text diagram or a list of arrows with the data that flows.
2. `integrations-register.md`: every rented system, its purpose, its owner, the data that flows to it and the business area it serves. Start from the [integrations register template](/library/template-integrations-register).
3. `alternatives.md`: three to six alternatives, with who uses them, what works and what hurts.

Commit with a message such as `Add whole-product map and alternatives`. In the file's footer, add the AI-use line.

**Check:** count your parts. If you have fewer than ten, write a short paragraph on why your product is truly that small, or go back to step 1.

**Stretch:** brief an agent to inventory your real repos with the read-only brief above, and compare its report with your map. Write down every difference and who was right.

## 8. Checklist

- [ ] My map shows reach, use, pay, run, connect, operate and plan.
- [ ] Every part has a short name, a purpose and one human owner.
- [ ] Every part is marked exists, planned or not found, with evidence.
- [ ] Every rented system is in the integrations register.
- [ ] The arrows say what data moves, with no secret values.
- [ ] I listed real alternatives and workarounds.
- [ ] Someone from another discipline read the map and found a gap.
- [ ] I wrote down what an AI did and what I checked by hand.

## 9. Further learning

The NN/g service blueprint article shows how front-stage moments depend on back-stage work. The UK service standard is a free checklist for whole-product thinking. Atlassian explains dependencies, and Figma's competitive analysis guide gives frameworks for the alternatives page. In the next lesson you will take the evidence from your interviews and this map, and turn it into a decision.
