export interface ExperienceEntry {
  org: string;
  title: string;
  type: string;
  period: string;
  tags: string[];
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    org: 'Independent',
    title: 'Engineer & maker',
    type: 'Self-employed',
    period: '06.2025 — Present',
    tags: ['Rust', 'TypeScript', 'WebGPU', 'Postgres', 'Swift'],
    description:
      'Shipping <em>sous/chef</em> and small client engagements. Mostly runtime and tool-use work for teams who want their ML pipeline to fit in one head.',
  },
  {
    org: 'Runloop',
    title: 'Senior Engineer · Platform',
    type: 'Full-time',
    period: '03.2023 — 05.2025',
    tags: ['Go', 'Kubernetes', 'gRPC', 'Temporal'],
    description:
      'Led the evaluations platform: sandboxed execution, streaming logs, and a UI for comparing model runs side-by-side. Took the p95 from 9s to 300ms.',
  },
  {
    org: 'Mezzanine Labs',
    title: 'Founding Engineer',
    type: 'Full-time',
    period: '09.2021 — 02.2023',
    tags: ['TypeScript', 'React', 'Postgres', 'Design systems'],
    description:
      "Zero to first paying cohort. Owned the design system, the billing stack, and the onboarding flow — which, if you've been in a seed-stage startup, is the whole company.",
  },
];
