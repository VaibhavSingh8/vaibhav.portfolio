---
title: Migrating the service everything logs in through
kicker: Backend migration · identity · DataPOEM
summary: >-
  I own the identity and access service that the core platform and 3+ internal
  products sign in through. I led its migration from Java Spring Boot to
  FastAPI, so the whole team could work on it, and decoded Java-serialized data
  in Python to unblock go-live.
outcome: >-
  ~120 APIs · 2 engineers · ~2 months to production ·
  ~40 APIs migrated and 45 of 48 PRs reviewed by me
role: Service owner; led the migration
team: Two engineers
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

- **View-based access control.** A new access entity with fixed view values,
  APIs to read views by user and by org and to assign them, views carried in
  the sign-in and org-switch responses, and plan sharing limited by view.
- **Production fixes after that launch.** Admins were being logged out when
  loading views, a stale views cache showed outdated access, and org switching
  returned the wrong org.
- **Refresh-token sessions and logout.** A refresh-token entity and service, a
  reworked token utility and a logout API. The FastAPI port carried the design
  over.
- **Microsoft sign-in fixes** for permission errors in the login flow.
- **Remediated findings from an external security audit**, with no recurrence
  in the next audit.

## The constraint

- **One language out of step.** Nobody on the team had deep Java knowledge, and
  every other backend service was Python. A service every product depends on
  could, in practice, be changed by very few people.
- **About 120 APIs and two engineers**, while I kept other work running in
  parallel.
- **It's the front door.** A mistake in a sign-in flow doesn't degrade one
  feature. It locks people out of all of them.
- **Data written for Java.** Some stored data could only be read back by Java,
  as it turned out.

## What I did

### Split the work so review was where I spent my time

A teammate wrote the initial port and the auth core. I led the migration,
migrated about 40 APIs myself, and reviewed the rest. I reviewed and merged 45
of the service's 48 merged pull requests.

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

The Java service had stored arrays of brand IDs as Java-serialized objects in a
PostgreSQL binary column. Java's object serialization is a binary format meant
to be read back by Java, and Python couldn't read it. The first attempt parsed
only 2 of 5 IDs, which on a service that decides who can see which brand is not
a partial success.

I decoded Java's serialization format in Python and wrote a migration script
that converts the stored data. That unblocked the go-live.

### Owning it afterwards

Any feature request or production issue on the service now comes to me.

One example: an edge authentication layer puts an API Gateway with a Lambda
authorizer in front of services. The authorizer validates the JWT and passes
trusted user headers on, and a FastAPI middleware rejects any request whose
tenant doesn't match the signed-in user. When a QA rollout of it had to be
rolled back, I traced it to two coupled authorizer bugs. The gateway token
never reached the authorizer context, and claim names had drifted between the
identity service and the authorizer. Fixing either one alone would have exposed
the other, so both fixes shipped together.

<!-- TODO(vaibhav): is edge authentication live in production, or still in QA? Say which here. -->

## Result

- **On FastAPI in production** after about two months, with two engineers.
- **In the team's language.** The service is now Python like every other
  backend service, so the whole team can maintain it.
- **The core platform and 3+ internal products** authenticate through it, and
  I'm the point of contact for all of it.
- **Audit findings remediated**, with no recurrence in the following audit.

<!-- TODO(vaibhav): a before/after latency or incident comparison would strengthen this, if you have one. -->

## What I'd do differently

<!-- TODO(vaibhav): this section is required before draft can be set to false.
     Your brief doesn't record a retrospective for the migration. Prompts:
     would you have found the serialized-data problem earlier (a data audit before porting)?
     would you split the porting and review work differently between the two engineers?
     anything about cut-over or rollback you'd plan differently? -->
