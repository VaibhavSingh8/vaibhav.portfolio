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
    org: 'DataPOEM',
    title: 'Software Engineer',
    type: 'Full-time',
    period: '03.2025 — Present',
    tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'Temporal', 'PostgreSQL'],
    description:
      'Platform owner across 5-6 live products and 10 enterprise clients. Built frontend for a chat-based AI analytics platform, co-architected an MLOps automation platform on Temporal.io reducing pipeline execution from 1-2 days to a few hours, led Java to FastAPI migration shipping 100+ APIs in under 2 months, and resolved 9 OWASP vulnerabilities ahead of external pen testing.',
  },
  {
    org: 'TCS',
    title: 'Systems Engineer',
    type: 'Full-time',
    period: '08.2022 — 03.2025',
    tags: ['React', 'JavaScript', 'Azure', 'Docker'],
    description:
      'Built frontend for a multilingual document translation tool. Supported 5+ enterprise data science teams on Azure and Domino Data Labs, improving system uptime by 20%.',
  },
];
