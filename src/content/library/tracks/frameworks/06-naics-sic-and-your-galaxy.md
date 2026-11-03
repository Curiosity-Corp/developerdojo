---
title: "NAICS, SIC and your galaxy"
description: "How to use official industry codes (NAICS, SIC, and the international ISIC and NACE) to define the boundary of a galaxy, find real data about it and avoid arguing about words."
section: "Frameworks"
order: 6
track: "frameworks"
level: "foundation"
duration: "55 min"
outcomes:
  - "Explain what an industry code is and read a six-digit NAICS code"
  - "Choose the code that matches what a business mainly does, and justify the choice"
  - "Find the matching codes in the older SIC system and in the international ISIC and NACE systems"
  - "Use a code to find public statistics about your galaxy and write the source in git"
resources:
  - "us-census-bureau/naics"
  - "us-census-bureau/county-business-patterns"
  - "us-osha/sic-manual"
  - "un-statistics-division/isic"
  - "eurostat/nace"
  - "gov-uk/standard-industrial-classification"
prerequisites:
  - "05-ubf-the-business-galaxy"
updated: 2026-11-03
---

This is lesson 6 of the Frameworks track. It supports **Developer week 1**: it gives you a precise answer to "what industry is my product in?" and a way to find real data about it.

## 1. Why this matters

In the last lesson a galaxy was "a whole industry". That sounds clear until two people disagree. Is a reusable-cup service part of the café industry, the packaging industry or the software industry? Without a shared definition, the team argues about words and nobody collects any facts.

Governments solved this problem long ago. They give every kind of business an **industry code**: a number that stands for what a business mainly does. When you use the code, three good things happen.

1. **You end the word argument.** "We are in 532289" is shorter and clearer than a debate.
2. **You find real data.** Statistics offices count businesses, jobs and sales by code. If you know your code, you can find how many businesses exist near you, and how that number changes.
3. **You speak the language of finance, law and procurement.** Banks, insurers, grant forms, tax forms and public buyers often ask for an industry code. Your finance colleague has probably used one already.

For a Product Development Manager (PDM), the code is the first fact in the UBF galaxy page. It is also a good test of honesty: if you cannot name your galaxy's code, you may not know your galaxy.

## 2. Key ideas, explained

### What is an industry classification?

An **industry classification** is an official list of industries with a code for each one. Statistics offices publish them so that every business can be counted in the same way. A business gets a code based on its **main activity**: the thing that earns it the most income. A business that does several things still gets one main code.

### NAICS

**NAICS** (pronounced "nakes") is the North American Industry Classification System. It is used by the United States, Canada and Mexico. The US Census Bureau publishes the US version, and the latest version at the time of writing is NAICS 2022. A code has up to six digits. Each extra digit zooms in.

| Digits | Level | Example (a café) |
|---|---|---|
| 2 | Sector | **72** Accommodation and Food Services |
| 3 | Subsector | **722** Food Services and Drinking Places |
| 4 | Industry group | **7225** Restaurants and Other Eating Places |
| 5 | Industry | **72251** Restaurants and Other Eating Places |
| 6 | National industry | **722515** Snack and Nonalcoholic Beverage Bars |

So a coffee shop's galaxy is, in NAICS words, "Snack and Nonalcoholic Beverage Bars". A shorter code means a wider galaxy. You can choose the zoom level: use six digits to count coffee shops, use three digits to talk about all food service.

### SIC

**SIC** is the Standard Industrial Classification. It is the older US system with four-digit codes. NAICS replaced it for most US government statistics, but SIC codes are still printed in many company records and databases, and some of your older documents or foreign partners may use them. The US Occupational Safety and Health Administration (OSHA) still hosts the SIC manual online, which is a handy free place to look codes up. The UBF source mentions SIC codes for classifying solar systems, so it is worth knowing both.

### Codes outside North America

Most of the world uses a related system:

- **ISIC**: the International Standard Industrial Classification, maintained by the United Nations Statistics Division. Many national systems are built from it.
- **NACE**: the classification used in the European Union, kept by Eurostat. It is closely aligned with ISIC.
- **UK SIC**: the United Kingdom's own Standard Industrial Classification of economic activities.

If you live outside North America, start with your own national statistics office, then look at the ISIC code. A good habit: *write the code from your own country and the ISIC code side by side*, so your galaxy page is understood in both places.

### Main activity, not product

A code describes **what the business does to earn money**, not what product it sells or what it wishes to become. A company that makes a mobile app and earns its income from a monthly subscription for cups is not in "software" just because the app is software. This rule is the source of most arguments, and it is also the key to settling them: ask "where does the money come from?"

## 3. Step by step: choose and use your code

1. **Describe the business in one sentence, by activity.** Not "we are an eco brand", but "we rent reusable cups to cafés and their customers and collect them again."
2. **Write down where the income comes from.** Subscriptions? Fees per cup? Software licences? Many products have two or three streams. The largest stream decides the code.
3. **Open the official search.** The US Census Bureau's NAICS page lets you search by word or number. Try three or four words that describe your business. Write the codes you find.
4. **Read the full definition for each candidate.** The definition tells you what is *included* and what is *excluded*. The excluded list is often the useful part.
5. **Pick one primary code and one or two neighbours.** Write why. Your galaxy is the primary code. The neighbours are *adjacent galaxies* worth watching.
6. **Find the same code in the other systems.** Look up the old SIC code, and the ISIC or NACE code for your region if you do not work in North America.
7. **Use the code to find data.** The US Census Bureau's County Business Patterns, for example, reports the number of business locations, employees and payroll by industry and place, for businesses with paid employees. Many countries publish similar tables. Write what you find, with the link and the date.
8. **Record it in git.** Put code, definition link, reasoning and data links in `frameworks/galaxy.md` (from the last lesson).
9. **Review when things change.** Classifications are revised every few years, and your business will change too.

## 4. Worked example: TrailMug

TrailMug's offer: "We lend reusable cups to partner cafés, who lend them to customers. Customers return them at any partner café. We collect, wash and redistribute them." Income streams in the plan (invented): a monthly fee from each café and a small deposit scheme.

Maya finds five candidates. (All codes are checked against the 2022 NAICS list.)

| Candidate | NAICS 2022 code and title | Why it might fit | Why it might not |
|---|---|---|---|
| Café customers' industry | 722515 Snack and Nonalcoholic Beverage Bars | These are her *customers*. | TrailMug does not sell drinks. |
| Cup makers | 326199 All Other Plastics Product Manufacturing | She buys cups from this industry. | She does not manufacture them. |
| Rental of goods | 532289 All Other Consumer Goods Rental | She lends cups for a fee and takes them back. | The cups are rented to cafés and customers, not to consumers only. A lawyer or accountant should confirm the best fit. |
| Support services | 561990 All Other Support Services | A catch-all for services supporting other businesses. | Catch-all codes are weak; use them only if nothing fits. |
| Software | 541511 Custom Computer Programming Services | She builds an app. | Programming is not where her income comes from. |

**Her decision:** primary code 532289 (rental of consumer goods), because the main income is a fee for lending a reusable item. Adjacent galaxies to watch: 722515 (her customers) and 326199 (her suppliers). She notes: "Needs confirmation by my accountant. Software is a tool, not the galaxy."

The older **SIC** codes for the same candidates (from the OSHA manual): 5812 Eating Places (customers), 3089 Plastics Products, Not Elsewhere Classified (suppliers), 7359 Equipment Rental and Leasing, Not Elsewhere Classified (the closest rental code), 7371 Computer Programming Services and 7372 Prepackaged Software for the software side.

Then she follows step 7. She searches County Business Patterns for 722515 in her county and finds how many cafés exist. That gives her an honest ceiling for the pilot: she writes "N cafés, source: Census, opened on this date" instead of a guess. (In the real exercise you will use real numbers. Here we do not invent them.)

## 5. Working with AI agents on this

| | For industry codes |
|---|---|
| **What the PDM decides** | The one-sentence description of the business. The primary code. Which neighbours to watch. |
| **What agents do** | Search the official code lists for candidates. Draft the "why it fits / why not" table. Find the equivalent ISIC and NACE code. Pull numbers from a public table and put them in a markdown table. |
| **How the PDM verifies** | Open the official definition of the code the agent proposes and read the "excludes" list. Check the code exists in the current year's list. Check the numbers in the source table. |
| **Who else is involved** | Finance or an accountant (tax and registration use the code), marketing (who the customers are), legal. |

Agents often get codes wrong in a confident way: they mix old and new versions, or invent a six-digit code that looks right. The fix is easy and non-negotiable: **only trust a code that you looked up on the official site.**

```text
Task: propose candidate industry codes for the business below.
Business (by activity and income source): <paragraph>.
Use only the official NAICS 2022 list from census.gov that I give you
as a file: reference/naics-2022-codes.xlsx.
For each candidate give: code, exact official title, one reason it fits,
one reason it does not. Maximum five candidates.
If the list does not contain a code, say NOT IN LIST. Never invent a code.
```

Giving the agent the official file removes most of the risk, because it can only choose from real codes. This is a good general pattern: *hand the agent the source of truth and forbid it to go beyond it.*

## 6. Common mistakes and how to avoid them

- **Choosing by pride.** Picking the "cooler" code (technology) rather than the true one (rental). Ask where the money comes from.
- **Using a code you did not look up.** Verify on the official site.
- **Mixing versions.** NAICS is revised every few years. Write the year next to the code.
- **Using a six-digit code when a three-digit one would help.** Zoom out when you need a bigger market view.
- **Forgetting adjacent galaxies.** Your customers and suppliers sit in other codes. Watch them.
- **Treating the code as legal advice.** Registrations and taxes depend on local rules. Ask a professional.

## 7. Practice

**Goal:** define your galaxy by code and find one real data source.

1. Write the one-sentence activity description and the income streams for TrailMug or for your product.
2. Search the official NAICS site (or your national classification) and list three to five candidates in a table like the one above.
3. Read the official definition of each. Add "included" and "excluded" notes.
4. Choose a primary code and two neighbours. Write your reasons.
5. Find the same industry in SIC and in ISIC or NACE. Add them.
6. Find one public statistic about your primary code (for example, the number of business locations in your county or country). Record the number, the link, the date and the year the data covers.
7. Update `frameworks/galaxy.md` and open a merge request. If an agent helped, give it the official file and say so in the header.

**Deliverable:** `frameworks/galaxy.md` updated with the code table, your decision, one sourced statistic and the three codes (NAICS or national, SIC, ISIC or NACE).

## 8. Checklist

- [ ] I described the business by activity and income.
- [ ] I looked every code up on an official site.
- [ ] I wrote the classification year next to each code.
- [ ] I chose a primary code and explained why.
- [ ] I found the same industry in at least one other system.
- [ ] I recorded one public statistic with its link and date.
- [ ] If an agent helped, it only used the official list I gave it.
