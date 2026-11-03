---
title: "M is for Milvus"
description: "Search by meaning, explained for decision makers: what embeddings and vector search are, what Milvus adds to a product, how it ties to your permissions and deletion promises, and when a simpler option is the better choice."
section: "The PHANTOMS stack"
order: 10
track: "phantoms-stack"
level: "advanced"
duration: "100 min"
outcomes:
  - "Explain embeddings, vectors, similarity search and hybrid search in plain words"
  - "Say what a retrieval service must respect: permissions, freshness and deletion"
  - "Compare plain SQL search, search inside PostgreSQL and a dedicated vector database"
  - "Write a retrieval test plan and a go or no-go decision for adding M"
prerequisites:
  - "the-way-five-rules"
resources:
  - "milvus/what-is-milvus"
  - "milvus/milvus-quickstart"
  - "milvus/hybrid-search-with-milvus"
  - "milvus/index-explained"
  - "postgresql/tutorial"
  - "owasp/llm-applications-top-10"
updated: 2026-11-03
---

This is lesson 10 of the PHANTOMS track. It supports the Master Developer module on AI-agent orchestration, because retrieval is how AI features use your own information. M is optional, and in most first products the right answer is "not yet". This lesson gives you the words and the tests to decide.

## 1. Why this matters

Ordinary search matches **words**. Search for "late delivery" and you find texts that contain those words. You miss "my cups still haven't turned up". A person reading would connect the two at once. Search by **meaning** tries to do the same.

The technique works like this. A model turns a piece of text (or an image) into a long list of numbers called an **embedding**. Pieces with similar meaning get similar lists of numbers. To search, you turn the question into numbers too, and ask: "which stored items are closest?" The lists of numbers are called **vectors**, and a program built to store and search them quickly is a **vector database**. **Milvus** is an open source one.

This matters most when you combine search with a language model: you find the most relevant pieces of your own documents, and give them to the model along with the question, so its answer is based on your facts and not its memory. That pattern is called **retrieval-augmented generation**, usually shortened to **RAG**.

It is powerful and easy to over-buy. A dedicated vector database is another stateful service, with all the costs listed in lesson 1, and it also copies your data into a second place. The starter's architecture guide is clear: add Milvus "when vector or hybrid search has a measured need", and "benchmark indexing, query quality, memory, and backup/restore before production".

The 2030 Product Development Manager decides whether meaning-based search will measurably improve a customer journey, what information it may touch, who may see what it finds, and how to make sure deleted data stays deleted. Those are product, privacy and quality questions.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Whether semantic search beats the simple option for a real user task, what data goes in, who may see results, how long data stays | Building the indexing pipeline, writing queries, benchmarking, drafting the test plan | Running a labelled test set, checking permissions on results, testing that deletion works end to end | Security and privacy (who can retrieve what), legal (retention and deletion), finance (memory and storage), operations (backups and rebuilds), support and content owners (what the corpus holds) |

## 2. Key ideas, explained

### What Milvus stores and does

In Milvus you create a **collection**, similar to a table. Each item has an id, a vector and usually extra fields called **metadata** (the source document, the owner, the date). You insert items. You **search** by giving a vector and asking for the closest matches, optionally filtered by metadata. Milvus also supports **hybrid search**: combine meaning-based search with keyword-style search and merge the results, which helps when exact words matter, such as product codes and names.

### Indexes: speed, memory, accuracy

Searching every vector one by one is slow when there are millions. An **index** is a structure that makes search fast by being slightly approximate. There are several index types, and the Milvus documentation explains the trade-offs in speed, memory use and accuracy. For a manager the point is: **there is a dial between fast, cheap and exact, and someone has to choose a setting and test it.**

### Where Milvus sits in PHANTOMS

The architecture diagram shows Milvus as an optional service the API may call for semantic retrieval. Milvus itself stores blocks and indexes in an **object store**, and the PHANTOMS design suggests SeaweedFS (lesson 11) for that role. So adding M can mean adding S. The starter's version policy lists Milvus v3.0.2 and SeaweedFS 4.48 as **reference pins**, and adds the caution: verify object-store behaviour, backups, query workload and exact compatibility before adoption. In other words, nobody has promised that these two work together for your workload. You must test it.

### What a retrieval layer must respect

This is the section most teams skip, and it is where the real risk lives. The starter says: "Track source IDs, authorization, freshness, and deletion through every index."

- **Source IDs.** Every vector must point back to the document it came from, so an answer can cite its source and a deletion can find the vector.
- **Authorization.** Search must only return what the asker may see. If TrailMug's index holds every café's messages, a search by one café must never return another café's. Filtering by owner must happen **in the query**, not afterwards in the page.
- **Freshness.** When a document changes, the vector must change too. Stale vectors give confident wrong answers.
- **Deletion.** If a customer asks to delete their data, it must be removed from the database, the file store, **the vector index** and any caches and logs. The security guide asks you to define retention and deletion for "the database, file store, vector index, caches, and logs".

A vector is not anonymous. It is derived from the text, and the index usually holds the text or a pointer to it. Treat it as personal data when the source is.

### Retrieved text is untrusted

Retrieved documents can contain hidden instructions. When you give them to a model, they can steer it (prompt injection, lesson 9). The rule stands: instructions inside retrieved data are not policy.

### A cheaper first step may be enough

Before you add M, try simpler options and measure.

| Option | Good for | Cost |
|---|---|---|
| **Plain SQL search** | Exact fields, filters, small data | Nothing extra: you already run PostgreSQL |
| **Full-text search in PostgreSQL** | Word-based search with ranking | Nothing extra, and one source of truth |
| **Vector search inside PostgreSQL** | Meaning-based search for modest volumes, using an extension | One database to run, back up and secure |
| **A dedicated vector database such as Milvus** | Large volumes, heavy query load, advanced indexing | A new stateful service, a possible object store, and a second copy of data |

Honest note from the Dojo, not from the starter: the middle options are often the right first step because they keep one source of truth, one backup and one set of permissions. If you consider them, check the PostgreSQL documentation for the extension's current status and your hosting's support. Move to a dedicated engine when a **measured** limit forces it.

## 3. Step by step: how to decide whether to add M

1. **Write the user task in a sentence.** "A café owner types a question about late deliveries and finds the right help article."
2. **Build a test set of 30 real questions** with the correct answers, written by a person. This is your retrieval eval, like lesson 6's.
3. **Measure the simple option.** Run those questions through plain SQL or full-text search. Record how many return the right result in the top five.
4. **Try the meaning-based option on a copy of the data**, ideally inside the database you already run. Record the same measure.
5. **Compare the gap.** Is the improvement big enough to change a customer outcome? Write it down in numbers from your own test, not from a vendor's slide.
6. **List what the retrieval layer must respect:** source IDs, permissions, freshness, deletion.
7. **Estimate the cost of a new service:** memory, storage, backups, upgrades, who is on call.
8. **Decide**: go, no-go or later with a trigger. Write the decision record.
9. **If go:** prove the whole chain in a test: index, search with permissions, update, delete, back up, restore, rebuild from scratch.

## 4. Worked example: TrailMug

Maya's café owners email questions to TrailMug support: "How do I return cups?" "What if some are chipped?" "Can we change delivery day?" She has about forty help articles. Jo, the support person, answers the same ten questions over and over. Maya imagines a help search that understands what people mean.

She follows the steps. The user task is written. Jo and Maya write **30 real-style questions** and, for each, the help article that answers it. Maya is careful not to ask an agent to write the questions, because an agent would write questions that match the articles' wording and make the test too easy.

They try the simple option first: PostgreSQL full-text search over the article text. Suppose it finds the right article in the top five for 21 of the 30 questions. (All numbers in this example are invented to show the method. They are not measurements of any real product, and in your own work numbers must come only from your own test.) Suppose the misses are mostly questions that use different words from the article.

They then try meaning-based search on a copy of the articles, and suppose the result improves to 28 of 30. That would be a real improvement. But the articles are public help text. There are forty of them. There is no permissions problem, no personal data, and no deletion request. Maya looks at the cost side: a new service with a possible object store, for forty documents.

Her decision, in a record: **do not add Milvus.** She will test meaning-based search inside PostgreSQL, because forty documents are tiny, and keep one database. The trigger for a dedicated engine is written down: "when the corpus holds customer messages (which need permissions and deletion) or passes a size where measured query time hurts users". Notice that she got the benefit (a better score) and avoided the service. The test set made the decision a matter of evidence.

## 5. Working with AI agents on this

**What to delegate.** Building the test harness, running the comparisons, writing the indexing and query code, producing the benchmark table, drafting the deletion and rebuild tests.

**What you must do yourself.** Write the test questions and the correct answers. Decide what data may be indexed and who may retrieve it. Judge whether the improvement matters. Decide retention and deletion rules. Make the go or no-go decision.

**A prompt you can adapt:**

> Work in the PHANTOMS starter on a branch. Read docs/architecture.md, docs/security.md and docs/version-policy.md. Task: build a retrieval comparison harness in a new folder retrieval-eval. Inputs: help-articles.json (id, title, text) and my questions.json (question, correct article id). Implement two retrievers: (1) PostgreSQL full-text search, (2) the option I name below. For each question output whether the correct article is in the top 1, top 3 and top 5, and print a table. Rules: do not add a vector database or any new service to the default stack; use the disposable local PostgreSQL only; no real customer data; every result must carry its source id; tests use fixed fixtures. Report your method, the numbers and what the numbers cannot tell us. Do not recommend adoption. Option for retriever 2: <name it>.

**How to check the output.** Run it yourself. Read five misses by hand and see why they failed. Check that every result carries a source id. Check that no new service entered the default Compose file.

**Disclose.** Say in the merge request that an agent built the harness and that the questions and answers are yours. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Adding a vector database because "AI needs one".** It needs a measured retrieval problem.
- **Letting an agent write the test questions.** They will mirror the documents and flatter the result.
- **Retrieving without permissions.** Filter by owner inside the query.
- **Forgetting deletion.** Plan how a customer's data leaves the index, with a test.
- **Never refreshing.** Define what happens when a source document changes.
- **Trusting vendor benchmarks.** Test on your data and questions.
- **Treating vectors as anonymous.** They come from the source text. Treat them the same way.
- **Skipping backup and rebuild.** An index you cannot rebuild is a risk.

## 7. Practice

**Exercise: "Is semantic search worth it?"**

1. Choose a text collection you could search: help pages, product notes, or TrailMug's forty articles (write ten sample articles yourself if you need a set).
2. Write 20 realistic questions and the correct source for each, by hand.
3. Ask an agent to build the comparison harness with the prompt above, using full-text search and one meaning-based option inside PostgreSQL. Do not add a new service.
4. Run it. Record top 1, top 3 and top 5 results. Read the misses.
5. Write the decision: no-go, go (with the test plan for permissions, update, delete, backup and rebuild), or later with a trigger.

**Deliverable in git:** `retrieval-eval/questions.json` (yours), the harness code, `docs/decisions/004-retrieval.md` with your numbers and decision, and a merge request describing what the agent did.

## 8. Checklist

- [ ] I can explain embeddings, vectors and hybrid search in plain words.
- [ ] I wrote the test questions and answers myself.
- [ ] I compared the simple option with the meaning-based option on my own data.
- [ ] I know what the retrieval layer must respect: source IDs, permissions, freshness, deletion.
- [ ] I counted the cost of a new service before deciding.
- [ ] My decision record states a trigger for changing the decision.

## 9. Further learning

The Milvus overview and quickstart show what the product does, and the quickstart takes about half an hour. The hybrid search and index pages explain the two ideas that matter most when you evaluate it for real use. The PostgreSQL tutorial is worth re-reading with this lesson in mind: much of what teams reach for a new service to do, the database they already run can do. The OWASP list of risks for language-model applications covers the data and injection risks of retrieval.

**Next:** [S is for SeaweedFS](/library/tracks/phantoms-stack/11-s-seaweedfs/).
