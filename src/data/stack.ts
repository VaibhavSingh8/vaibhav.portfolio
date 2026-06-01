export type StackKind = 'lang' | 'fwk' | 'infra' | 'tool';

export interface StackChip {
  kind: StackKind;
  name: string;
  meta: string;
}

export const stackRows: Record<1 | 2 | 3, StackChip[]> = {
  1: [
    { kind: 'lang', name: 'TypeScript', meta: '5.6' },
    { kind: 'lang', name: 'Python', meta: '3.12' },
    { kind: 'lang', name: 'SQL', meta: 'ansi' },
  ],
  2: [
    { kind: 'fwk', name: 'React', meta: '19' },
    { kind: 'fwk', name: 'Next.js', meta: '15' },
    { kind: 'fwk', name: 'Astro', meta: '5' },
    { kind: 'fwk', name: 'TanStack', meta: 'query/table' },
    { kind: 'fwk', name: 'Zustand', meta: 'state' },
    { kind: 'fwk', name: 'FastAPI', meta: 'async' },
  ],
  3: [
    { kind: 'infra', name: 'Postgres', meta: '16' },
    { kind: 'infra', name: 'MongoDB', meta: 'atlas' },
    { kind: 'infra', name: 'Temporal', meta: 'wfms' },
    { kind: 'infra', name: 'AWS', meta: 'cloud' },
    { kind: 'tool', name: 'Claude Code', meta: 'ai' },
  ],
};
