---
format: note
title: Workflow orchestration with a visual DAG editor
kicker: Fullstack · DataPOEM
summary: >-
  Co-architected a Temporal-based orchestration system with two other
  engineers. I built the React Flow editor where a workflow is drawn rather
  than scripted, and the layer that runs the drawn workflow on Temporal.
outcome: A manual process across several teams went from 3 days to under 5 hours
role: Co-architect; built the DAG editor and the orchestration layer
team: 3 engineers
# TODO(vaibhav): add a period; the brief only says "before March 2026".
stack: [React, React Flow, Temporal, AWS S3, FastAPI]
status: shipped
order: 10
---

<!-- Notes are not rendered. To promote this to a case study, set
     `format: case-study` and fill the sections below. -->

## Context

<!-- TODO(vaibhav): what the process produced, in plain words; how often it
     runs, and for how many client orgs. -->

## The constraint

Running the process meant several teams executing scripts by hand, in order,
handing results to each other. It was slow, fragile, and depended on people
being available.

## What I did

- A visual DAG editor (React Flow): steps are nodes, dependencies are edges.
- The orchestration layer: the drawn workflow runs on Temporal, with S3 holding
  inputs and outputs between steps.

<!-- TODO(vaibhav): why Temporal rather than Airflow, Celery or a plain queue;
     what happens when a step fails halfway (retries, resume, rerun); how the
     editor validates a graph (no cycles, all inputs connected) and how it's
     saved and sent to the backend. -->

## Result

A manual multi-team process went from 3 days to under 5 hours.

## What I'd do differently

<!-- TODO(vaibhav) -->
