export type StackKind = 'lang' | 'fwk' | 'infra' | 'tool';

export interface StackChip {
  kind: StackKind;
  name: string;
  meta: string;
}

export const stackRows: Record<1 | 2 | 3, StackChip[]> = {
  1: [
    { kind: 'lang', name: 'TypeScript', meta: '5.6' },
    { kind: 'lang', name: 'Rust', meta: '1.82' },
    { kind: 'lang', name: 'Go', meta: '1.23' },
    { kind: 'lang', name: 'Python', meta: '3.12' },
    { kind: 'lang', name: 'Swift', meta: '6.0' },
    { kind: 'lang', name: 'SQL', meta: 'ansi' },
    { kind: 'lang', name: 'Zig', meta: '0.13' },
    { kind: 'lang', name: 'Elixir', meta: '1.17' },
  ],
  2: [
    { kind: 'fwk', name: 'React', meta: '19' },
    { kind: 'fwk', name: 'Next.js', meta: '15' },
    { kind: 'fwk', name: 'SwiftUI', meta: 'iOS 18' },
    { kind: 'fwk', name: 'FastAPI', meta: 'async' },
    { kind: 'fwk', name: 'Tauri', meta: '2.x' },
    { kind: 'fwk', name: 'Astro', meta: '5' },
    { kind: 'fwk', name: 'tRPC', meta: 'v11' },
    { kind: 'fwk', name: 'Solid', meta: '1.9' },
  ],
  3: [
    { kind: 'infra', name: 'Postgres', meta: '16' },
    { kind: 'infra', name: 'Redis', meta: '7' },
    { kind: 'infra', name: 'Kubernetes', meta: '1.31' },
    { kind: 'infra', name: 'Temporal', meta: 'wfms' },
    { kind: 'infra', name: 'gRPC', meta: 'proto3' },
    { kind: 'infra', name: 'WebGPU', meta: 'wgsl' },
    { kind: 'tool', name: 'Figma', meta: 'dev mode' },
    { kind: 'tool', name: 'Linear', meta: 'cycles' },
    { kind: 'tool', name: 'tmux', meta: '3.4' },
    { kind: 'tool', name: 'Raycast', meta: 'ext' },
  ],
};
