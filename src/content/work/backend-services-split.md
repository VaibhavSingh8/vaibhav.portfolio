---
format: note
title: Splitting the core backend by who it serves
kicker: Platform · DataPOEM
summary: >-
  I'm leading the split of two tightly coupled backend services by who uses
  them: clients, internal tools, and an AI service with restricted access.
  Long-running jobs move onto a staged pipeline, and I built the system that
  keeps those jobs from getting stuck, lost or run twice.
outcome: >-
  No frontend changes needed · Jobs kept from getting stuck, lost or run twice ·
  In rollout
role: Leading the split; built the job reconciler
period: Oct – Nov 2026
stack: [AWS Batch, Microsoft Entra ID]
status: in rollout
order: 12
---

<!-- TODO(vaibhav): is the rollout fully live? Did these jobs run on Kubernetes
     before, and who did that move? A deploy-time or stuck-jobs number would
     strengthen it. Promote to a case study once it's live. -->
