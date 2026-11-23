---
title: An AI planning workspace, from product idea to production in 10 weeks
kicker: Product and frontend architecture · DataPOEM
summary: >-
  The product team wanted one guided workspace in place of three separate
  planning tools. I took it from their prototype to production: shaping scope,
  flow and accessibility with them, leading the architecture, and taking their
  changes right up to launch. AI agents wrote the code; I directed and reviewed
  every change.
outcome: >-
  ~10 weeks, idea to production · 3 legacy tools → 1 workspace ·
  835 ms → 14 ms per keystroke on a 3,000-row table
role: Owned delivery end to end, from product shaping to production
team: Me, one consultant engineer, the product team and the backend team
period: Aug – Oct 2026
stack:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Redux Toolkit
  - TanStack Query
  - Tailwind CSS v4
  - shadcn/ui · Radix
status: shipped
order: 1
draft: false
---

## Context

You're a marketing planner at a large consumer brand, deciding how to split a
budget across media channels. You have three tools for it. One answers *"what
media mix hits these KPI targets?"*, one answers *"what KPIs will this spend
produce?"*, and one forecasts a plan you've already filled in. Each has its own
interface, and none of them lets you save a half-finished plan or hand it to a
colleague.

DataPOEM builds decision AI on a causal model, and a new family of those models
needed a new planning flow. The idea came from the product team. I picked it up
from scratch and owned it until it reached clients:

- one guided, step-by-step wizard for all three planning tools
- autosaved, resumable drafts
- sharing: you open a colleague's plan read-only, and your first edit creates
  your own copy
- a plans workbench for your plans and the ones shared with you
- access control by module permission

<!-- TODO(vaibhav): scope of the module: number of pages/screens, wizard steps per tool, shared components. -->

## The constraint

- **The legacy tools had to keep running.** Clients used them every day.
- **The product was still taking shape.** Changes kept arriving close to
  completion, and they had to land without a rewrite.
- **The API contract moved under us.** The optimization and forecasting
  endpoints went through a major contract change, and the sample payloads
  contradicted each other.
- **Real data is big.** Feature hierarchies go six levels deep, and constraint
  tables run to about 3,000 rows. I tested them to 12,000.
- **Ten weeks.** First commit on 4 Aug, QA on 29 Sep, preprod on 11 Oct,
  production on 16 Oct.

## What I did

### Shaped it with the product team before building it

The product team designed the prototype in Lovable. I worked through it with
them: what belonged in the workspace and what didn't, how the flow should run
from step to step, what the experience should feel like, and what it needed to
be accessible. The prototype settled the product questions, so the build could
focus on getting it right.

<!-- TODO(vaibhav): one or two concrete examples of a change you argued for in the prototype (cut, added, reordered, an accessibility fix), and what changed because of it. -->

### Directed AI agents instead of typing

I didn't write the production code by hand, and it wasn't vibe-coded. I set
the architecture, the conventions and the state rules, and split the work into
scoped tasks for Claude Code subagents for planning, building, auditing and
review. Every UI change went through build, audit and review before it was
committed. The ten weeks went into deciding what to build, proving it against
real data and absorbing changes, not into typing.

### Built it alongside the old tools, not in place of them

Rewriting the legacy tools in place risked regressions in software people
depended on daily. So the workspace went in next to them. The cost was two
codebases for a while, and I chose to pay it.

### One wizard, thin adapters

Before building the second optimizer, I audited the two side by side. They
differed at about seven points. So the wizard is a page shell (stepper, setup
chips, step, footer) over four shared panels: constraints, cost rates, targets
and review. Each tool gets a thin adapter on top. The second tool was mostly
extracted rather than written, and a change to a shared panel lands in every
tool at once.

### One rule for where state lives

If the server owns it, it's a TanStack Query query. If the user is composing
it, it's Redux, with one slice per tool built from a shared reducer factory. If
it should survive a shared link, it's in the URL: filters, tab, search, page
and the wizard step. Deriving query keys from the URL removed every effect
whose only job was keeping two copies of state in sync.

| Where it lives | What lives there |
| --- | --- |
| The URL | Filters, tab, search, page and the wizard step |
| TanStack Query | All server data, with query keys derived from the URL |
| Redux | Only the drafts a user is composing, one slice per tool |

Putting the step in the URL gives deep links, a working back button and safe
refreshes. The catch is that each step is its own route, so the wizard remounts
on every navigation. Drafts therefore live in a provider in the Next.js layout,
which stays mounted across child routes and owns load, autosave and flush.

### Mocks from day one, with the real envelope

The API clients are typed, and the mocks return the same envelope as the real
API. UI work started before the endpoints existed, and switching to the real
API meant changing one function body per endpoint. Payload builders are pure
functions, tested against payloads the backend had already accepted.

### Evidence over sample payloads

The first runs failed with save errors and worker crashes. I compared the
stored job records of a failed run and an accepted run on the same model. The
backend cleaned up budget values but not cost-rate features, so month ranges
crashed the worker. After that I changed one variable per live run, pinned each
fix with a script that byte-compares the payload to an accepted one, and logged
every field decision.

The same habit caught a late change just before QA. A stored run showed a $3M
budget had become $3 trillion, because the frontend and backend disagreed about
the unit budgets are sent in. That was a contract ambiguity only real data
could reveal. I reverted the change and recorded the evidence in the commit.

Two rules came out of this. Rows are matched by their full hierarchy path,
never by position, because API responses reorder rows. And a missing value
shows a dash, never a zero, because I had already found plausible-looking wrong
numbers, such as 400,000 leads rescaled to 0.4. Wrong data is worse than
missing data.

<details>
<summary>Deep dive: a 1.6-second input lag in a 3,000-row table</summary>

At six hierarchy levels, interaction delay measured 1,592 ms. Most of it, 835
ms, was the validator: every keystroke compared every row to every other row,
O(n²). I indexed rows by hierarchy path with a parent index, which made lookups
O(1). The keys are joined with a NUL character, because level names contain
spaces. I proved the new output byte-identical to the old and memoized the
columns.

That took it from 835 ms to 14 ms per keystroke at 3,000 rows, and from 13 s to
45 ms at 12,000. I caught it in development, before release. About 3,000
dropdown components still mount, so the next step is mount-on-click or
virtualization.

</details>

<div data-demo="validator">
  <p>An interactive version of this comparison runs here with JavaScript enabled.</p>
</div>

<details>
<summary>Deep dive: autosave when every step is its own route</summary>

Change tracking works by exclusion. A revision counter increments on every
action except a known list of automatic ones, so a forgotten case costs one
extra save, never lost work. Saves debounce at one second, and a keepalive
request flushes the draft when the tab closes (its 64 KB limit is documented).
Draft IDs are generated on the client. I tested the draft API's real behaviour
on QA before writing the code against it.

</details>

### Writing the decisions down

The progress doc holds a decision log, numbered backend questions cited from
code comments, and the convention rules. I cut the entry doc to about a sixth
of its length, and the other engineer adopted the docs.

## Result

- **In production on 16 Oct 2026**, about ten weeks after the first commit,
  and in front of clients.
- **Three tools became one workspace**, with drafts that save themselves and
  plans that can be shared.
- **I owned it from idea to launch.** The consultant engineer built most of the
  results pages and charts, the forecasting API integration, spreadsheet
  downloads and the early prototype of one tool.
- **Real runs accepted** against the live contract.
- **The validator** went from 835 ms to 14 ms per keystroke at 3,000 rows (60×
  faster), and from 13 s to 45 ms at 12,000 (about 290×).
- **Moving the prototype onto the shared panels**, a planned step, made nine
  components shared, cut its bundle from 25.2 to 18.6 kB and fixed
  nested-landmark accessibility issues.

<!-- TODO(vaibhav): usage since launch, if you can share it (plans created, runs, client brands). -->

## What I'd do differently

- **Agree the API contract first**, with a spec and generated types. It would
  have prevented most of the payload and number bugs above.
- **Design the big table for virtualization from day one**, instead of
  optimising the validator and leaving 3,000 dropdowns mounted.
- **Give each file format one writer from the start.** The server made a blank
  template, the browser made a pre-filled one, and upload took only CSV, so
  users couldn't re-upload their own downloads. The server owns the format now.
- **Write a small end-to-end smoke suite** over the three wizard paths. There
  isn't one. Verification is test scripts over the real reducers and payload
  builders, with each fix mutation-checked, and an end-to-end suite would still
  have shortened QA.
- **Build access control earlier.** It arrived just before preprod.
