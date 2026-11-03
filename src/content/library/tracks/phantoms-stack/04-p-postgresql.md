---
title: "P is for PostgreSQL"
description: "Durable data for a product: tables, constraints, transactions, migrations and backups in plain words, and how to judge an agent's database design before real customers depend on it."
section: "The PHANTOMS stack"
order: 4
track: "phantoms-stack"
level: "core"
duration: "100 min"
outcomes:
  - "Explain tables, keys, constraints, transactions and migrations without jargon"
  - "Read a small schema and say whether it protects the product's promises"
  - "Review a migration for risk to data, and ask for a backup and restore test"
  - "Say why database access lives in one package and what that protects"
prerequisites:
  - "the-way-five-rules"
resources:
  - "postgresql/tutorial"
  - "postgresql/constraints"
  - "postgresql/backup-and-restore"
  - "pgexercises/postgresql-exercises"
  - "youtube-freecodecamp/learn-postgresql-full-course"
  - "drizzle/drizzle-orm-overview"
updated: 2026-11-03
---

This is lesson 4 of the PHANTOMS track. It supports the Master Developer modules on platform and production launch, and Developer week 6, where your demo must work on real data. P is the first letter and the one you may never skip: a product that loses its records has lost its customers' trust.

## 1. Why this matters

Everything a customer cares about is a record: an order, a payment, a cup lent, a cup returned. If the record is wrong or gone, the promise is broken, whatever the interface looks like.

A **database** is a program whose whole job is to keep records safe and answer questions about them. **PostgreSQL** (often called Postgres) is a free, open source, relational database that has been in use for decades. "Relational" means the data lives in **tables**, like spreadsheets with strict rules, and tables can point to each other.

The 2030 Product Development Manager does not write SQL all day. But they must be able to look at a data model and ask: *does this protect the promise we made to the customer?* Agents will create tables quickly. Only you know that an order must never exist without a café, or that a delivered order must not go back to "placed".

The starter calls this the **durable relational data and transactions** layer. The word *durable* is the point: if the power fails one second after the customer clicks "order", the order is still there.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What must always be true about the data, how long to keep it, who may see it, what loss is acceptable | Writing table definitions, migrations, queries and tests | Reading the schema against the rules, checking the migration, asking for a restore test | Security (who can read what), legal (personal data, retention), finance (storage and backup cost), operations (recovery) |

## 2. Key ideas, explained

### Tables, rows, keys

A **table** holds one kind of thing: orders, cafés, cups. A **row** is one item. A **column** is one fact about it. A **primary key** is a column (or set) that identifies a row uniquely. A **foreign key** says "this value must match a row in another table", for example every order points to a café that exists.

The starter's sample table is called `tasks`. It has an id (a UUID, a long random identifier), a title of up to 200 characters that cannot be empty, and a creation time stored **with time zone**. Small, but already making three good decisions: a safe id, a limit, and unambiguous time.

### Constraints: the database says no

A **constraint** is a rule that the database itself enforces. Examples: `NOT NULL` (a value is required), `CHECK` (a value must meet a test), `UNIQUE`, and foreign keys. This matters because application code has bugs and agents write application code. A constraint is the last line of defence: even a buggy program cannot store a bad record.

Rule of thumb for review: **every promise that must never be broken should be a constraint, not only a line of application code.** The PostgreSQL manual's chapter on constraints is short and worth reading.

### Transactions: all or nothing

A **transaction** groups several changes so that either all of them happen or none do. If a customer places an order with three line items, you do not want a crash to leave the order with one item. Postgres guarantees that committed transactions survive a crash. This is what "durable" means. You will not write transactions by hand often, but when you review code that changes several tables, ask: *is this inside one transaction?*

### Migrations: changing the shape safely

A product changes. A column is added, a rule is tightened. A **migration** is a small, numbered file that describes one change to the database's structure. Migrations live in git and run in order, so every environment ends up with the same shape. The starter uses a SQL-first TypeScript library called **Drizzle** for this. The workflow, from the root scripts:

| Step | Command | What happens |
|---|---|---|
| Describe the change | edit `packages/db/src/schema.ts` | The desired shape, in TypeScript |
| Generate the migration | `bun run db:generate` | A SQL file appears in `packages/db/drizzle/` |
| Review the SQL | read it | **You or a person you trust reads the generated SQL** |
| Apply it | `bun run db:migrate` | The database changes |
| Check consistency | `bun run db:check` | The migration history is consistent |

The starter's rule: "use reviewed migrations for schema changes." The word *reviewed* matters. A migration that drops a column deletes data. Generated SQL is a proposal. Before you apply a migration to a database that holds valuable data, a person reads it. Plan for a way back, or a forward fix, in case a change goes wrong. We fix forward ([the Way](/library/fix-forward)): a new migration repairs the problem, we do not rewrite history.

### One package owns the database

In the starter, all database code lives in `packages/db`: the connection, the schema and the queries. The API calls functions from it, and does not talk to the database directly. `AGENTS.md` says: "keep database access in `packages/db`". Why? So you have one place to review, one place to change when you swap a library, and one place to enforce rules such as connection limits and timeouts. When an agent writes a database query inside a route handler, it breaks this boundary. Reject it.

### Local database, production database

Locally, the starter runs PostgreSQL in a container with one command (`docker compose up -d postgres`). The container listens only on the local machine (`127.0.0.1`), and the password in `.env.example` is a placeholder for a disposable database. In production the rules change: use a managed or carefully run database, a strong secret from a secret manager, TLS, and an approved image identified by its digest (an exact fingerprint), not just a version tag. The version policy lists PostgreSQL 18.6 for the local container only.

## 3. Step by step: how to review a data model

Use this procedure when an agent proposes a schema or a migration.

1. **List the nouns and promises.** Write in plain words what the product stores and what must always be true. "Every order belongs to one café." "An order has one status." "A delivered order is never changed back."
2. **Read each table.** For each column ask: is it required? Is there a limit? Is the type right? Money should not be a floating-point number. Times should have a time zone.
3. **Match promises to constraints.** For each promise, find the constraint that enforces it. If there is none, ask for one, or for a written reason.
4. **Check relationships.** Foreign keys exist where one record depends on another. Deleting a café does what you intend to its orders: block, or remove.
5. **Check personal data.** What fields identify a person? Do you need them? Who can read them? How long do you keep them?
6. **Read the migration SQL.** Look for `DROP`, `DELETE`, `TRUNCATE` or a type change. Each needs a reason and a safe plan.
7. **Ask for the evidence.** Tests run against a disposable PostgreSQL, a migration applied to a fresh database, and a statement of how restore was tested.
8. **Ask who may connect.** The app uses a database account with only the rights it needs, separate from the account that applies migrations. The security guide asks for exactly this.

## 4. Worked example: TrailMug

Maya's order tracker needs an `orders` table. She writes the promises herself:

- Every order belongs to one café.
- An order has a cup count that is a whole number above zero.
- Status is one of: placed, packed, shipped, delivered.
- We keep the café's name and a delivery contact, but no home addresses.

She briefs an agent and reviews the SQL that comes back. A simplified version looks like this:

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  cafe_name varchar(120) not null,
  cup_count integer not null check (cup_count > 0),
  status varchar(20) not null default 'placed'
    check (status in ('placed','packed','shipped','delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

This is an illustration, not the starter's code. Maya reads it against her promises. Cup count above zero: constraint, good. Status in a fixed list: constraint, good. Café: stored as a name, not a link to a cafés table. She notes that two cafés may share a name, and asks the agent to add a `cafes` table and a foreign key. The agent does. She also asks: can a delivered order move back to placed? The schema alone does not stop that. She decides it is a rule for the API and tests, and writes it into the acceptance criteria for the status-change feature.

Sam, the operations lead, asks the question managers forget: "If we lose the database tonight, how do we get orders back?" Maya adds an epic called "Backups and restore drill" to the roadmap. Writing it herself, not an agent. Until a restore has been tested, she writes in the README, the tracker is a demo, not a system of record.

## 5. Working with AI agents on this

**What to delegate.** Drafting table definitions from your promises, generating the migration, writing queries inside `packages/db`, writing tests that run against a disposable database, explaining what a SQL statement does.

**What you must do yourself.** Write the promises. Decide retention and what personal data you keep. Read the migration. Decide who gets database credentials. Own the backup and restore plan.

**A prompt you can adapt:**

> Work in the PHANTOMS starter. Read AGENTS.md, docs/architecture.md and docs/security.md first. Task: replace the sample `tasks` table with an `orders` table that meets these promises: <paste your promises>. Rules: all database code stays in packages/db; use the existing Drizzle workflow (bun run db:generate); every promise that must never break is a database constraint, not only application code; keep the existing migration history, add a new migration instead of editing an old one. Show me the generated SQL before you apply it, and explain each line in one plain sentence. Add tests that run against the disposable local PostgreSQL. Run the checks listed in AGENTS.md and paste the results. Do not log personal data.

**How to check the output.** Read the SQL line by line against your promises. Look for what is missing: a limit, a time zone, a relationship, an index for the lookup you expect to be common. Run the migration on a fresh disposable database. Ask for a test that tries to insert a bad row and expects a refusal.

**Disclose.** Say in the merge request that an agent generated the schema and that you verified each promise against a constraint. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Trusting application code alone.** Make the database enforce the important promises.
- **Applying generated migrations without reading them.** A harmless-looking change can delete a column. Read every migration.
- **Editing an old migration.** History must not change. Add a new migration.
- **Using the local password or database in production.** The local `.env` values are for disposable use only.
- **Giving the app the migration account.** Use least-privilege accounts: one for the app, one for migrations.
- **Never testing a restore.** A backup you have not restored is a hope. Schedule a drill.
- **Keeping personal data "just in case".** Store what the promise needs. Delete when the retention rule says so.
- **Letting authentication stand in for authorization.** Knowing who the user is does not tell you which orders they may see. Check each lookup against user and café.

## 7. Practice

**Exercise: "Promises first, schema second."**

1. Write five promises about the data for a product you care about, or for TrailMug's orders. One page, your words.
2. In a clone of the public starter, brief an agent with the prompt above on a branch.
3. Read the generated SQL. Make a table with two columns: "my promise" and "constraint that enforces it, or 'none'".
4. For each "none", decide: ask for a constraint, or write the rule as an API test, or accept the risk and say why.
5. Write down the restore question: what is the first step you would take to prove you can recover the data? You do not have to build it yet.

**Deliverable in git:** `docs/data-promises.md` (your promises and the constraint table), the migration, and a merge request that says what the agent did and what you changed after review.

## 8. Checklist

- [ ] I wrote the data promises in my own words.
- [ ] Every must-never-break promise maps to a constraint, or I recorded why not.
- [ ] I read the migration SQL, especially anything that removes or changes data.
- [ ] Database code lives only in `packages/db`.
- [ ] The app and the migrations use different, least-privilege accounts in production.
- [ ] A restore test is on the roadmap, written by me.
- [ ] I know what personal data is stored and why.

## 9. Further learning

Start with the official PostgreSQL tutorial. It is clear and free. Then read the constraints and backup chapters, which map directly to the promises and the restore drill above. PG Exercises gives you hands-on practice for reading agent-written queries, and the freeCodeCamp video is a good option if you prefer to watch first. The Drizzle overview explains the library the starter uses for the schema and migrations.

**Next:** [H is for Hono](/library/tracks/phantoms-stack/05-h-hono/).
