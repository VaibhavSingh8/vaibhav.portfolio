export interface ExperienceEntry {
  org: string;
  location: string;
  title: string;
  type: string;
  period: string;
  /** one line, always visible */
  summary: string;
  /** concrete, scoped results: shown when the row is open */
  highlights: string[];
  tags: string[];
  /** open by default */
  open?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    org: 'DataPOEM',
    location: 'Bengaluru',
    title: 'Software Engineer (Full Stack)',
    type: 'Full-time',
    period: '04.2026 – Present',
    summary:
      'Own the identity platform, lead the frontend, and build features and core services that clients use in production.',
    highlights: [
      'Owned an AI planning workspace from the product team’s idea to production in about 10 weeks, replacing three legacy planning tools. Shaped scope, flow and accessibility with the product team, led the architecture, and directed AI agents through a reviewed build.',
      'Cut per-keystroke validation on a 3,000-row editable table from 835 ms to 14 ms by replacing an O(n²) validator, with the output proved byte-identical.',
      'Leading a split of the core backend into separate services for clients, internal tools and AI work (in rollout), and built the system that keeps long-running jobs from getting stuck, lost or run twice.',
      'Designed and built usage-based billing on Stripe for an AI model-training product (built, pre-launch), so a repeated job or webhook never charges anyone twice.',
      'Own the identity and access service that the core platform and 3+ internal products sign in through. Every feature request and production issue on it comes to me.',
      'Lead the frontend: review decisions and changes before they go live.',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'AWS', 'Stripe'],
    open: true,
  },
  {
    org: 'DataPOEM',
    location: 'Bengaluru',
    title: 'Frontend Developer',
    type: 'Full-time',
    period: '03.2025 – 03.2026',
    summary:
      'A frontend title, but the work went fullstack: an identity migration, workflow orchestration and security fixes.',
    highlights: [
      'Co-designed a workflow orchestration system with two other engineers and built its visual editor, where a workflow is drawn instead of scripted. A manual process across several teams went from 3 days to under 5 hours.',
      'Led the migration of the identity service from Java Spring Boot to FastAPI: about two months to production. The other engineers were consultants new to the platform, so I set the order of work, made the architectural calls, reviewed the port and planned the go-live.',
      'Proposed moving the platform from Vue 2 to Next.js and migrated one module: its JS payload fell 81% and Lighthouse performance went from 65 to 98. The migration as a whole cut total JS by 80%.',
      'Remediated findings from an external security audit, with no recurrence in the next audit.',
      'Built a client-facing insights dashboard with drill-down charts in the Vue 2 app.',
    ],
    tags: ['React', 'Next.js', 'Vue', 'FastAPI', 'Temporal', 'React Flow'],
  },
  {
    org: 'Tata Consultancy Services',
    location: 'Noida',
    title: 'Systems Engineer',
    type: 'Full-time',
    period: '08.2022 – 03.2025',
    summary:
      'Testing, then cloud platform support, then React development, which I asked to move into.',
    highlights: [
      'Built a permissions and access-management UI for an enterprise data-science platform, including access toggles and reusable design-system components (last ~6 months).',
      'Supported enterprise data-science clients on Domino Data Lab and Microsoft Azure, resolving memory and configuration issues on production servers.',
      'Designed and executed test cases in HP ALM for Automation Anywhere bots in a pharmaceutical client’s automation program.',
    ],
    tags: ['React', 'Azure', 'Domino Data Lab', 'HP ALM'],
  },
];
