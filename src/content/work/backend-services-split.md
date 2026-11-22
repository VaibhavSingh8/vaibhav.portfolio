---
format: note
title: Backend services split and a staged AWS Batch job pipeline
kicker: Platform · DataPOEM
summary: >-
  Architecting the split of two tightly coupled backend services by audience
  (client-facing, internal tools, and an AI service with restricted access), with
  long-running jobs on a prepare, compute, finalize pipeline. I built the
  reconciler that keeps jobs from getting stuck, lost or run twice.
outcome: >-
  Zero frontend changes required · A reconciler for stuck, lost or double-run jobs ·
  in rollout
role: Architected and led the split
period: Oct – Nov 2026
stack: [AWS Batch, Microsoft Entra ID]
status: in rollout
order: 12
---

<!-- TODO(vaibhav): is the rollout fully live? Did these jobs run on Kubernetes
     before, and who did that move? A deploy-time or stuck-jobs number would
     strengthen it. Promote to a case study once it's live. -->
