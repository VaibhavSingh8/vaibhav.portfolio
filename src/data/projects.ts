export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  badge: string;
  thumbLabel: string;
  kicker: string;
  title: string;
  description: string;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'sous-chef',
    badge: 'v0.4 · beta',
    thumbLabel: 'sous/chef · runtime',
    kicker: 'Open source · Rust + WebGPU',
    title: 'sous/chef',
    description:
      'A local-first ML runtime that runs small models where your data already lives. Async graph scheduler, typed tools, and a debugger that speaks in examples.',
    links: [
      { label: 'view repo →', href: '#' },
      { label: 'read notes', href: '#' },
    ],
  },
  {
    id: 'paperlane',
    badge: 'shipped · 2025',
    thumbLabel: 'paperlane',
    kicker: 'Client work · SwiftUI',
    title: 'Paperlane',
    description:
      'A reading app for people who annotate in margins. Built the sync engine and the gesture layer — holds 12k papers without dropping a frame.',
    links: [{ label: 'case study →', href: '#' }],
  },
  {
    id: 'tinyloom',
    badge: 'research',
    thumbLabel: 'tinyloom',
    kicker: 'Side quest · TypeScript',
    title: 'tinyloom',
    description:
      'A 200-line graph runtime for prompt chains. Inspectable, forkable, serializes to a single file. Used internally at two AI labs.',
    links: [
      { label: 'demo ↗', href: '#' },
      { label: 'source', href: '#' },
    ],
  },
];
