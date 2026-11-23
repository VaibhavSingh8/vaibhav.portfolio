export interface Principle {
  /** the rule, in one line */
  rule: string;
  /** what I actually did that shows it — every principle needs one */
  proof: string;
}

export const principles: Principle[] = [
  {
    rule: 'Settle disagreements with evidence, not opinion.',
    proof:
      'Three sample payloads contradicted each other, so I compared the stored job records of a failed and an accepted run. A stored run also settled whether budgets were being scaled correctly.',
  },
  {
    rule: 'Wrong data is worse than missing data.',
    proof:
      'After finding several plausible-looking wrong numbers, I introduced a rule: a missing value shows a dash, never a zero.',
  },
  {
    rule: 'Measure first, then fix the algorithm, then prove it.',
    proof:
      'I measured input delay, replaced an O(n²) validator, and proved the new output byte-identical before it shipped.',
  },
  {
    rule: 'Make it safe to run twice.',
    proof:
      'Idempotent billing jobs and usage events, and a job reconciler with database locks and leases.',
  },
  {
    rule: 'Write decisions down.',
    proof:
      'A decision log, numbered open questions cited from the code, and written conventions the other engineer adopted.',
  },
];
