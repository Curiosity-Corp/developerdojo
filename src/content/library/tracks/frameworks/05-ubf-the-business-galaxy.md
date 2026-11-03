---
title: "UBF: the business galaxy"
description: "The Universal Business Framework pictures an industry as a galaxy. Learn every term, and use the map to choose integrations, spot platform risk and read big events."
section: "Frameworks"
order: 5
track: "frameworks"
level: "foundation"
duration: "60 min"
outcomes:
  - "Define galaxy, black hole, super nova, solar system, sun, super star, star, moon and comet in your own words"
  - "Map the industry of a product, with a source for every claim"
  - "Spot platform risk (a black hole) before choosing an integration"
  - "Write down a super nova and what you would do if it happened"
resources:
  - "strategyzer/business-model-canvas"
  - "learn-wardley-mapping/learn-wardley-mapping"
  - "youtube-y-combinator/competition-is-for-losers-peter-thiel"
  - "youtube-seacom-global/introduction-to-wardley-maps-simon-wardley"
  - "university-of-virginia/foundations-of-business-strategy"
  - "mit-ocw/new-enterprises"
prerequisites:
  - "01-the-frameworks-map"
  - "03-frameworks-cheat-sheet"
updated: 2026-11-03
---

This is lesson 5 of the Frameworks track and the first of three about UBF. It supports **Developer week 1** (see the whole product) and gives the **Master Developer** the market view needed for platform decisions.

## 1. Why this matters

A product does not live alone. It lives inside an industry with powerful companies, rules, habits and sudden events. A developer who only looks at the code sees none of it. Then, one day, a payment provider changes its prices, a city passes a law, or the biggest company in the market launches the same feature for free. The product suffers, and nobody saw it coming.

The **Universal Business Framework (UBF)** is a way to *see the industry on one page*. It uses the picture of a galaxy because everyone already knows the shape: a few giant objects in the middle, many smaller ones around them, all pulling on each other, with occasional explosions that change everything.

A Product Development Manager (PDM) uses UBF to make three kinds of decisions:

1. **Which tools and partners to depend on.** Some dependencies are safe. Some give a giant company the power to change your product overnight.
2. **Which risks are real.** A change in a law or a platform can matter more than any bug.
3. **Where to aim.** Where is there room for a small product, and where is the ground already taken?

Be clear about what UBF is. It was created by World Enterprise Group to help organisations plan across many projects and companies at once. It is **not** an official standard and it does not predict the future. It is a *vocabulary and a checklist* for looking at a market. We show similar well-known ideas in the further-learning list so you can compare and choose.

## 2. Key ideas, explained

UBF has ten kinds of object. Here is each one with a plain definition, what to look for, and a note on how a developer uses it. TrailMug's examples come later in the lesson. (The companies named in TrailMug's galaxy are invented.)

### Galaxy: the whole industry

A **galaxy** is a whole industry: all the companies, organisations and people that offer similar products or services and compete for the same customers. Companies also depend on each other (suppliers, customers, partners), so a change in one place can ripple through the rest. You *define* a galaxy with an official industry code, which we cover in the [next lesson](/library/tracks/frameworks/06-naics-sic-and-your-galaxy/).

*Developer use:* the galaxy tells you who your integrations, your competitors and your customers' other suppliers are.

### Black hole: the largest company at the centre

A **black hole** is a very large company (or holding company) at the centre of a galaxy. Its size gives it a strong pull on the companies around it: on its subsidiaries, on competitors, even on the new ideas that start nearby. The source says a black hole "slowly consumes all its competitors". That is a dramatic way to say that dominant firms often absorb or crush smaller ones. It does not always happen, and not every large company behaves that way. Treat it as a *risk to check*, not a law.

*Developer use:* **platform risk.** If your product depends on one huge platform (an app store, a cloud provider, a payment system, a social network), that platform is a black hole for you. It can change its rules, raise prices or build your feature. Ask: *what happens to us if this one company changes its mind?* Keep an exit route: a second provider, or open standards.

### Super nova: an event felt across the industry

A **super nova** is a big event that changes the whole galaxy. Examples that are well known and easy to check: a major new law (the European Union's General Data Protection Regulation started to apply in May 2018 and changed how many companies handle personal data), a platform change (Apple's App Tracking Transparency, introduced with iOS 14.5 in 2021, changed how apps could track users for advertising), a large merger, or a technology jump.

*Developer use:* you cannot stop a super nova. You can *list the likely ones* and write what you would do. That list is a cheap and powerful habit.

### Solar system: a group under one owner

A **solar system** is a cluster of companies under the same holding company (a company whose business is owning other companies). It also includes the suppliers, customers and competitors around that cluster. Solar systems are classified by size, market share and industry codes.

*Developer use:* two companies that look independent may belong to the same group. If you integrate with both, you may have one dependency, not two.

### Sun: the visible centre of a solar system

A **sun** is the largest publicly visible company in a solar system, or the headquarters of an organisation. It is where decisions are made and attention gathers.

*Developer use:* suns decide standards and buying. If you sell to one, learn how it buys.

### Super star: a rising flagship

A **super star** is a flagship or role-model company, or a fast-growing project, that might one day become a sun. It needs a lot of resources and aims at big goals.

*Developer use:* super stars are good partners and good teachers, and they are the competitors that can surprise you.

### Star: a small company or project

A **star** is a small company or project. It is described using the **STAR** framework (Space, Track, Assist, Reach), which has [its own lessons](/library/tracks/frameworks/08-star-describe-a-project/). Most of us start as stars. Do not confuse the *object called a star* with the *framework called STAR*: the framework is how you describe the star.

### Moon: a side project, startup, subsidiary or department

A **moon** is something that orbits a bigger thing and supports it: a side project, a startup inside a group, a subsidiary or a department. Moons are planned with **ORBITAL** (Objective, Resources, Budget, Indicators, Transport, Activities, Logistics).

*Developer use:* a new product inside an existing organisation is a moon. Plan it with ORBITAL.

### Comet and asteroid: unstable projects

A **comet** or **asteroid** is a project that is unstable: badly planned, off course or likely to hit something. These need better planning or must be avoided.

*Developer use:* check your own project list. Which one has no owner, no objective, no budget? That is a comet. Fix it or stop it.

### Droid: one unit of work

Inside all of this sits the **droid**: one focused unit of work, owned by someone. A droid may be a project, a task, or an AI agent doing a defined job.

### How the objects relate

| Object | Is | Planned or described with |
|---|---|---|
| Galaxy | An industry | An industry code (NAICS or SIC) |
| Black hole | The dominant company | Platform-risk check |
| Super nova | An industry-wide event | A list of events and responses |
| Solar system | A holding group and its ecosystem | An ownership map |
| Sun | The visible centre of a group | Buying and decision notes |
| Super star | A rising flagship | Watch list |
| Star | A small company or project | **STAR** |
| Moon | A side project, startup or department | **ORBITAL** |
| Comet / asteroid | An unstable project | Risk review |

### UBF and Agile are not rivals

The source compares UBF to Agile and says UBF adds structure. They work at different scales. Agile's work items (initiative, epic, user story, feature, task) break a *project* into pieces. UBF describes the *business world* the project lives in. You use both: UBF to choose where to play, Agile to deliver.

### The growth ladder

The source describes how a small project (droid) can grow into a company, then into a group, and perhaps into a leader in its industry. It lists five stages: ideation, planning, execution and monitoring, scaling and growth, and integration into the wider ecosystem. Read this as a *possible path*, not a promise. Most projects stay small, and that is fine.

## 3. Step by step: map a galaxy

1. **Choose the boundary.** Write one sentence: "The galaxy is ____." Be specific. "Food" is too wide. "Cafés and their packaging" is useful.
2. **Find the industry code.** Look it up (next lesson). Write the code and the source.
3. **List the big players.** Who are the five largest by size or market share? Use public sources. Write the link and the date.
4. **Find the black holes.** Which one or two companies shape the rules? For each, write what they control and how you would be hurt if they changed their mind.
5. **Draw the solar systems.** Who owns whom? Which of your potential partners belong to the same group?
6. **List the super novas.** Write three to five possible big events: a law, a platform change, a merger, a new technology. For each write the *signal* that would warn you, and what you would do.
7. **Place yourself.** Are you a star (project) or a moon? Which solar system are you closest to?
8. **List your comets.** Which of your own bets is unstable?
9. **Mark the evidence.** For each claim, write **KNOWN** (I opened the source), **BELIEVED** (someone told me) or **GUESS**.
10. **Save it in git** as `frameworks/galaxy.md`. Set a review date. Galaxies move.

## 4. Worked example: TrailMug's galaxy

**TrailMug** is the fictional reusable-cup service for cafés. Everything in this table is invented for teaching, including the companies. Do not copy it as if it were real market data.

**Boundary:** "Cafés, and the packaging and delivery services around them, in Maya's pilot city."

| UBF object | In TrailMug's galaxy (fictional) | What Maya learns |
|---|---|---|
| **Galaxy** | Cafés and snack and beverage bars, plus the cup and packaging suppliers around them. | The code choice matters, because it decides which data she can use. |
| **Black hole** | "BigBean Cafés", the largest chain in the city. A cup supplier, "CupCo", sells most of the paper cups. | If BigBean starts its own reuse scheme, it could be a free alternative for most customers. Maya's plan must work for independent cafés that BigBean ignores. |
| **Black hole (for the software)** | The payment provider, the cloud host and the app stores. | She will keep the payment provider behind an adapter in her code so that she can change it. She will launch a web app first, so the app stores cannot block her. |
| **Super nova** | A city rule that bans single-use cups from a future date. | Demand would jump. She writes a response plan: a waiting list, a fast onboarding process, and a cap on new cafés per week so cup stock does not run out. |
| **Super nova** | The payment provider changes its fee structure. | She writes down today's fee as a baseline and sets an alert. |
| **Solar system** | "BigBean Group" owns BigBean Cafés and also a delivery app. | Partnering with the delivery app is not independent of BigBean. |
| **Sun** | BigBean's head office, which decides the group's purchasing. | Not a target for the pilot. |
| **Super star** | A small chain of eight cafés that is growing fast and likes sustainability. | The ideal first partner and a future competitor to watch. |
| **Star** | TrailMug, a small project. | Described with STAR in lesson 8. |
| **Moon** | A possible later TrailMug spin-off: cup-washing as a service. | Planned with ORBITAL when it is real. |
| **Comet** | "Café tablet app" idea that nobody owns. | Maya gives it an owner or drops it. |

**What Maya decides from this:** (1) start with independent cafés and the eight-café chain; (2) keep the payment provider replaceable; (3) prepare a response plan for the cup rule; (4) do not rely on any partner from BigBean's group.

Notice how the map made four concrete product decisions. Each is cheap now and expensive later.

## 5. Working with AI agents on this

| | For UBF |
|---|---|
| **What the PDM decides** | The galaxy boundary. Which companies count as black holes. Which super novas matter. Which risks to accept. |
| **What agents do** | Gather public facts with links. Draft a first galaxy table from sources you name. Search for news that matches a super-nova signal. Check ownership relations in public filings. |
| **How the PDM verifies** | Open every link. Check dates. Compare two sources for any number. Ask the agent which rows it is least sure of. |
| **Who else is involved** | Founder (strategy), finance (market size, pricing), marketing (customers), legal (rules). |

Here is a brief you can adapt. Put it in a [droid card](/library/tracks/frameworks/04-directing-agents-across-the-frameworks/).

```text
Task: gather public facts for a UBF galaxy page.
Galaxy boundary (mine, do not change): <one sentence>.
Industry code (mine): <code and link>.
Produce research/galaxy-facts.md with a table:
claim | source URL | date you opened it | confidence (HIGH/MEDIUM/LOW).
Rules: only use pages you opened. Never invent a number. If you cannot
find a source, write NOT FOUND. Do not write conclusions. Do not
rank companies unless a source ranks them, and then cite it.
```

**Never** let an agent name "black holes" and "super novas" as final. Those are *judgments*. It may propose candidates with evidence. You decide.

## 6. Common mistakes and how to avoid them

- **Making the galaxy too big.** "Technology" is not a galaxy. It is a dozen.
- **Treating the metaphor as fact.** A big company is not automatically a black hole. Check what it controls.
- **Naming real companies without proof.** If you say a company is the largest, cite a source. Otherwise write "believed" or leave it out.
- **Mapping once and forgetting.** Put a review date in the file.
- **Ignoring your own dependencies.** The most dangerous black hole is often a tool you already use.
- **Listing super novas with no response.** A list without actions is a worry list. Add "if X, then we do Y".
- **Letting an agent invent a ranking.** Rankings need a source.

## 7. Practice

**Goal:** map the galaxy of TrailMug, or of your own product, in git.

1. Create `frameworks/galaxy.md` with the headings: Boundary, Industry code, Black holes, Solar systems, Super stars, Super novas, My place (star or moon), Comets, Decisions.
2. Fill every heading. For every claim, add a source link and KNOWN, BELIEVED or GUESS.
3. List at least three super novas, each with a *signal* and a *response*.
4. Mark one dependency of your own product as a black hole and write your exit route.
5. Use an agent with the brief above for the facts only. Add `AI use:` to the header. Then write the Decisions section yourself.
6. Merge request. Ask someone from finance or marketing to challenge one row.

**Deliverable:** `frameworks/galaxy.md` merged, with at least ten sourced facts, three super novas with responses and a Decisions section in your own words.

## 8. Checklist

- [ ] I can define all ten UBF objects in plain words.
- [ ] My galaxy boundary is one specific sentence.
- [ ] Every fact has a source and a confidence mark.
- [ ] I named one dependency as platform risk and wrote an exit route.
- [ ] Each super nova has a signal and a response.
- [ ] The Decisions section is in my own words.
- [ ] AI use is disclosed in the file.
