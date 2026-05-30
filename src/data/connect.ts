export interface ConnectLink {
  label: string;
  href: string;
  /** Raw SVG path string(s) to use as <path d="..."> inside a <svg viewBox="0 0 24 24"> */
  paths: string[];
  /** true = fill="currentColor", false = stroke="currentColor" stroke-width="2" */
  filled: boolean;
}

export const connectLinks: ConnectLink[] = [
  {
    label: 'GitHub',
    href: '#',
    paths: [
      'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.17-1.12-1.48-1.12-1.48-.92-.63.07-.62.07-.62 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.7.11 2.5.33 1.9-1.3 2.74-1.03 2.74-1.03.56 1.37.21 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
    ],
    filled: true,
  },
  {
    label: 'X',
    href: '#',
    paths: [
      'M18 2h3l-7.5 8.6L22 22h-6.8l-4.6-6-5.3 6H2.3l8-9.2L2 2h7l4.2 5.5L18 2Zm-1.2 18h1.9L7.3 4H5.3l11.5 16Z',
    ],
    filled: true,
  },
  {
    label: 'LinkedIn',
    href: '#',
    paths: [
      'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8h4.56v14H.22V8Zm7.5 0h4.36v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v7.44h-4.56V15.5c0-1.67-.03-3.82-2.33-3.82-2.34 0-2.7 1.82-2.7 3.7v6.62H7.72V8Z',
    ],
    filled: true,
  },
  {
    label: 'Mail',
    href: 'mailto:ren@alvaro.dev',
    paths: ['M2 5h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z', 'm3 6 9 7 9-7'],
    filled: false,
  },
  {
    label: 'Essays',
    href: '#',
    paths: [
      'M4 5v14a2 2 0 0 0 2 2h14V7a2 2 0 0 0-2-2H4Z',
      'M8 9h8M8 13h8M8 17h5',
    ],
    filled: false,
  },
  {
    label: 'Résumé',
    href: '#',
    paths: [
      'M21 15.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3.5',
      'M7 10l5 5 5-5',
      'M12 15V3',
    ],
    filled: false,
  },
];
