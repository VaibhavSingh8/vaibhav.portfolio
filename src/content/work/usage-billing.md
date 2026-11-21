---
title: Making month-end billing safe to run twice
kicker: Backend · payments · DataPOEM
summary: >-
  Usage-based billing on Stripe for an AI model-training SDK and developer
  portal. I designed and built the metering, invoicing and payment lifecycle so
  that any job, event or webhook can run twice without charging anyone twice.
  It's tested end to end in Stripe's test mode, and the product hasn't
  launched yet.
outcome: >-
  Built, pre-launch · ~25 endpoints, 6 Lambda workers, 19 migrations ·
  ~256 tests where there were none
role: Designed and built it (about 66% of the Python on the branch, by git blame)
period: Jun – Oct 2026
# TODO(vaibhav): confirm whether FastAPI and PostgreSQL belong in this list.
stack:
  - Python
  - Stripe
  - AWS Lambda
  - Amazon EventBridge
status: built, pre-launch
order: 2
draft: true
---

## Context

The company was building an SDK and developer portal for training AI models on
cloud infrastructure, billed by usage. I designed and built the billing behind
it between June and October 2026.

**This product hasn't launched.** Billing is tested end to end in Stripe's test
mode, including a charge and its webhook, but it has processed no customer
money. This write-up is about the design and the correctness work, not
volume.

## The constraint

In billing, "usually works" isn't good enough. Every scheduled job in a system
like this will eventually run twice: a retry after a timeout, two workers
waking at the same moment, Stripe redelivering a webhook. Each duplicate means
someone charged twice or credits spent twice.

There were other constraints too:

- **Signup could not depend on billing.** If Stripe was slow or down, new orgs
  still had to get in.
- **Older orgs existed before billing did** and needed backfilling.
- **There were no tests.**

## What I did

### Meter usage from the infrastructure, not the app

When a cloud training job changes state, an EventBridge rule triggers a Lambda.
The Lambda reads the org and project tags off the job and posts a usage event
to an internal endpoint. That event is the source of truth for what gets
billed, so billing counts what the infrastructure says ran. Usage events are
idempotent, so a repeated event has no extra effect.

### Small workers with one job each

Six Lambda workers handle payment retry, month-end close, webhook processing,
setup retry, grace-period expiry and an outbox publisher. Behind them are the
billing data model, a Stripe client, the billing-cycle, invoice, payment and
webhook services, about 25 endpoints across 10 routers, and 19 database
migrations.

### Signup that doesn't wait for billing

Billing setup is queued through an outbox, with a backfill for older orgs, so
signup succeeds whatever state Stripe is in. The lifecycle covers trial and
grace periods, and it recovers an overdue account automatically when a valid
card is added. A summary endpoint shows estimated credit burn. I also built the
billing frontend: workspace switching, and invoice and card management.

### Making every money path safe to run twice

This is the core of the work. Each risk has its own mechanism:

| Risk | How it's prevented |
| --- | --- |
| Month-end invoicing runs twice | A row lock on the billing cycle plus an atomic claim, so the second run does nothing |
| Credits spent twice by concurrent requests | A row lock on the credit balance |
| An invoice charged twice | A guard before charging |
| The same usage event recorded twice | Idempotent usage events |
| Workers competing for the same retries or webhooks | `SELECT … FOR UPDATE SKIP LOCKED`, so each worker takes different rows |
| Two processes setting up the same org | Advisory locks on org setup |
| Duplicate trial credits or active cards | Partial unique indexes: one trial credit and one active card per org |
| Rounding errors in money | Money columns moved from floating point to exact decimals |
| Counters drifting under load | Atomic SQL counters instead of read-then-write |

These mechanisms do different jobs. A row lock serialises work on a row that
exists. `SKIP LOCKED` turns a table into a work queue that several workers can
drain without colliding. An advisory lock covers the case where there's no row
to lock yet, such as an org that is still being set up. The partial unique
indexes are the backstop: they hold in the database even if application code
gets it wrong.

### Tests where there were none

About 256 tests, including concurrency tests and a full loop through Stripe's test mode: charge, then webhook.

<details>
<summary>Designed but not merged: invoicing from a price catalog</summary>

The next stage is designed but not merged. Invoices come from a per-instance
price catalog, each one created in a single transaction and published through
an outbox, with one Stripe invoice per local invoice. A settlement service
applies Stripe events in any order and never moves a paid invoice backwards.
Cards are collected through a verified SetupIntent. None of this is shipped.

</details>

## Result

- **Built, pre-launch.** There are no real transactions or revenue to report.
- **The full billing backend**: data model, Stripe client, services, about 25
  endpoints, 19 migrations and six workers, plus the billing frontend.
- **About 256 tests** where there were none, including concurrency tests and a
  Stripe test-mode loop.
- **About 66% of the Python** on the billing branch is mine, by git blame.

## What I'd do differently

<!-- TODO(vaibhav): this section is required before draft can be set to false.
     Your brief doesn't record a retrospective for billing. Prompts:
     what would you design differently now that the catalog-based invoicing is designed?
     what was hardest to test, and what would you have built first?
     anything you'd push back on in the product's billing model? -->
