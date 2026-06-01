export type StackKind = 'lang' | 'fwk' | 'infra' | 'tool';

export interface StackChip {
  kind: StackKind;
  name: string;
  icon?: string;
  color?: string;
  darkColor?: string;
  meta?: string;
}

export const stackRows: Record<1 | 2 | 3, StackChip[]> = {
  1: [
    { kind: 'lang', name: 'typescript',    icon: '/icons/typescript.svg',  color: '#3178C6' },
    { kind: 'lang', name: 'python',        icon: '/icons/python.svg',       color: '#3776AB' },
    { kind: 'fwk',  name: 'react',         icon: '/icons/react.svg',        color: '#61DAFB' },
    { kind: 'fwk',  name: 'vue',           icon: '/icons/vuedotjs.svg',     color: '#4FC08D' },
    { kind: 'fwk',  name: 'next.js',       icon: '/icons/nextdotjs.svg',    color: '#000000', darkColor: '#ffffff' },
    { kind: 'fwk',  name: 'fastapi',       icon: '/icons/fastapi.svg',      color: '#009688' },
    { kind: 'fwk',  name: 'redux toolkit', icon: '/icons/redux.svg',        color: '#764ABC' },
    { kind: 'fwk',  name: 'astro',         icon: '/icons/astro.svg',        color: '#BC52EE' },
  ],
  2: [
    { kind: 'tool',  name: 'git',          icon: '/icons/git.svg',          color: '#F03C2E' },
    { kind: 'infra', name: 'postgresql',   icon: '/icons/postgresql.svg',   color: '#4169E1' },
    { kind: 'infra', name: 'mongodb',      icon: '/icons/mongodb.svg',      color: '#47A248' },
    { kind: 'infra', name: 'temporal',     icon: '/icons/temporal.svg',     color: '#000000', darkColor: '#ffffff' },
    { kind: 'tool',  name: 'claude code',  icon: '/icons/claudecode.svg',   color: '#D97757' },
    { kind: 'fwk',   name: 'react query',  icon: '/icons/reactquery.svg',   color: '#FF4154' },
  ],
  3: [],
};
