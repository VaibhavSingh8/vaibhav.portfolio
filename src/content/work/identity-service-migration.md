---
title: Migrating the service everything logs in through
kicker: Backend migration · identity · DataPOEM
summary: >-
  I own the identity and access service that the core platform and 3+ internal
  products sign in through. I led its migration from Java Spring Boot to
  FastAPI with consultant engineers who were new to the platform: I decided
  what moved when and why, made the architectural calls and planned the
  go-live.
outcome: >-
  ~2 months to production · Java → Python, the team's language ·
  Go-live unblocked by decoding Java-serialized data
role: Service owner; led the migration and the go-live
# TODO(vaibhav): how many consultant engineers worked on the migration?
team: Me and consultant engineers
period: Aug 2025 – present
stack:
  - Python
  - FastAPI
  - PostgreSQL
  - Java Spring Boot (source)
  - MSAL · OIDC
  - JWT
status: shipped
order: 3
draft: true
---

## Context

Every session on the company's core platform, and on 3+ internal products,
starts at one service. It handles login and sessions (JWT with refresh tokens),
single sign-on with Microsoft over OIDC, multi-tenant organizations, users and
admins, role-based access, and view-based access to plans.

I became its owner in August 2025, when the previous owner left. It was a Java
Spring Boot service, and I shipped on it before migrating it:

- **View-based access control**: views carried through sign-in and org
  switching, and plan sharing limited by view.
- **Production fixes after that launch**: admins being logged out when loading
  views, a stale cache showing outdated access, and org switching returning the
  wrong org.
- **Refresh-token sessions and logout.** The FastAPI port carried the design
  over.
- **Microsoft sign-in fixes** for permission errors in the login flow.
- **Remediated findings from an external security audit**, with no recurrence
  in the next audit.

## The constraint

- **One language out of step.** Nobody on the team had deep Java knowledge, and
  every other backend service was Python. A service every product depends on
  could, in practice, be changed by very few people.
- **A team new to the platform.** The other engineers were consultants. They
  could port code, but they didn't know the platform, its flows, or which
  products depended on what.
- **It's the front door.** A mistake in a sign-in flow doesn't degrade one
  feature. It locks people out of all of them.
- **Data written for Java.** Some stored data could only be read back by Java,
  as it turned out.

## What I did

### Supplied the context the team didn't have

The migration needed someone who knew what happens when, where and why across
the whole platform. That was me. I set the order of the work, made the
architectural decisions, and reviewed the port against how each product
actually signs in. A teammate wrote the initial port and the auth core; I
migrated a share of the APIs myself and reviewed the rest.

<!-- TODO(vaibhav): how you brought the consultants up to speed (flow maps, docs, walkthroughs), if worth a line. -->

### Changed its shape, not only its language

A line-by-line port would have moved the Java design into Python. I used the
migration to make the service easier to work on:

- a versioned API layout with a single response contract
- class-heavy code refactored into a simpler functional style
- token handling moved to a maintained JWT library, with the refresh-token and
  org-switch flows fixed along the way
- Microsoft SSO through MSAL, where the Microsoft auth code is exchanged for
  the service's own tokens, and account lockout applies to SSO sign-ins as well

### The problem that blocked go-live

The Java service had stored some access data as Java-serialized objects. Java's
object serialization is a binary format meant to be read back by Java, and
Python couldn't read it. The first attempt recovered only some of the values,
which, on a service that decides who can see what, is not a partial success.

I decoded Java's serialization format in Python and wrote a migration script
that converts the stored data. That unblocked the go-live.

### Planned the go-live

<!-- TODO(vaibhav): how the cut-over worked (all at once, gradual, run side by side), the rollback plan, and whether sign-in had any downtime. -->

### Owning it afterwards

Any feature request or production issue on the service now comes to me. When
the QA rollout of a new edge authentication layer had to be rolled back, I
traced it to two coupled bugs. Fixing either one alone would have exposed the
other, so both fixes shipped together.

<!-- TODO(vaibhav): is edge authentication live in production, or still in QA? Say which here. -->

## Result

- **On FastAPI in production** after about two months.
- **In the team's language.** The service is now Python like every other
  backend service, so the whole team can maintain it.
- **The core platform and 3+ internal products** authenticate through it, and
  I'm the point of contact for all of it.
- **Audit findings remediated**, with no recurrence in the following audit.

<!-- TODO(vaibhav): any incident or sign-in reliability comparison before and after, if you have one. -->

## What I'd do differently

<!-- TODO(vaibhav): this section is required before draft can be set to false.
     Your brief doesn't record a retrospective for the migration. Prompts:
     would you have found the serialized-data problem earlier (a data audit before porting)?
     would you onboard the consultants or split the work differently?
     anything about cut-over or rollback you'd plan differently? -->
