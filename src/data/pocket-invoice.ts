/**
 * Pocket Invoice: the fictional SaaS example for the UX kata pathway (UX-001 to UX-005, UX-R01).
 *
 * One source of truth for the user flow. Four things read it, so a change here reaches all of them or
 * fails a test:
 *   - the generator of the editable Penpot file (scripts/ux-pathway/build-penpot-file.ts), which draws
 *     the sitemap, the low-fidelity boards, the components and the high-fidelity boards from it;
 *   - the sitemap on /katas/ux-pathway;
 *   - the working implementation at /examples/pocket-invoice/;
 *   - tests/pocket-invoice.test.ts and e2e/ux-pathway.spec.ts, which check that every state is drawn,
 *     reachable and implemented, and that every transition has a way in and a way back.
 *
 * Pocket Invoice is invented for practice. It is not a product, and no real company, person or customer
 * is in it. The send failure uses the reserved .invalid top-level domain (RFC 2606), which can never
 * receive mail.
 *
 * Plain, erasable TypeScript only: the generator runs it with Node's type stripping.
 */

export const PRODUCT = {
  name: 'Pocket Invoice',
  job: 'A freelancer sends their first invoice to a client.',
  audience: 'Freelancers who have never used the app, on a phone or a computer, including people who use only a keyboard.',
} as const;

export const STATE_KINDS = ['screen', 'error', 'empty', 'overlay', 'success', 'boundary'] as const;
export type StateKind = (typeof STATE_KINDS)[number];

/** forward: the main path; branch: an optional route; error: a failure shown to the user; recover: the way out of an error; back: return without losing work; overlay: opens or closes a dialog. */
export const TRANSITION_KINDS = ['forward', 'branch', 'error', 'recover', 'back', 'overlay-open', 'overlay-close'] as const;
export type TransitionKind = (typeof TRANSITION_KINDS)[number];

export type Element =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'error-summary'; items: readonly string[] }
  | { type: 'field'; label: string; value: string; hint?: string; error?: string }
  | { type: 'summary'; rows: readonly (readonly [string, string])[] }
  | { type: 'table'; columns: readonly string[]; rows: readonly (readonly string[])[] }
  | { type: 'button'; label: string; variant: 'primary' | 'secondary' | 'link'; to: StateId };

export interface FlowState {
  id: StateId;
  /** The screen this state belongs to. States of one screen share a column on the sitemap. */
  screen: ScreenId;
  kind: StateKind;
  title: string;
  /** Why the state exists, in one sentence. */
  purpose: string;
  elements: readonly Element[];
}

export interface Transition {
  from: StateId;
  to: StateId;
  kind: TransitionKind;
  /** What the user does. */
  trigger: string;
}

export const SCREENS = [
  { id: 'start', name: 'Create a workspace' },
  { id: 'sign-in', name: 'Sign in (out of scope)' },
  { id: 'invoices', name: 'Invoices' },
  { id: 'new-invoice', name: 'New invoice' },
  { id: 'review', name: 'Check and send' },
  { id: 'sent', name: 'Sent' },
] as const;
export type ScreenId = (typeof SCREENS)[number]['id'];

export const STATE_IDS = [
  'signup', 'signup-error', 'sign-in', 'invoices-empty', 'invoice-new', 'invoice-new-error', 'discard-dialog',
  'invoice-review', 'send-error', 'invoice-sent', 'invoices-list',
] as const;
export type StateId = (typeof STATE_IDS)[number];

const workspaceFields = (error: boolean): Element[] => [
  { type: 'field', label: 'Email address', value: error ? 'sam@example' : 'sam@example.com', hint: 'We send your invoices from this address.', ...(error ? { error: 'Enter an email address in the correct format, like name@example.com' } : {}) },
  { type: 'field', label: 'Workspace name', value: error ? '' : 'Sam Rivera Design', ...(error ? { error: 'Enter a workspace name' } : {}) },
];

const invoiceFields = (error: boolean): Element[] => [
  { type: 'field', label: 'Client name', value: error ? '' : 'Harbour Bakery', ...(error ? { error: 'Enter the client name' } : {}) },
  { type: 'field', label: 'Client email', value: 'accounts@harbour-bakery.example' },
  { type: 'field', label: 'What the work was', value: 'Menu redesign, two rounds of changes' },
  { type: 'field', label: 'Amount in US dollars', value: error ? '0' : '480.00', hint: 'For example, 480.00', ...(error ? { error: 'Enter an amount greater than 0' } : {}) },
];

export const STATES: readonly FlowState[] = [
  {
    id: 'signup', screen: 'start', kind: 'screen', title: 'Create your workspace',
    purpose: 'The first screen: the fewest fields needed before the user can do real work.',
    elements: [
      { type: 'heading', text: 'Create your workspace' },
      ...workspaceFields(false),
      { type: 'button', label: 'Create workspace', variant: 'primary', to: 'invoices-empty' },
      { type: 'button', label: 'I already have an account', variant: 'link', to: 'sign-in' },
    ],
  },
  {
    id: 'signup-error', screen: 'start', kind: 'error', title: 'Create your workspace: fix two problems',
    purpose: 'Shows every problem at once, names how to fix each, and keeps what the user typed.',
    // The error summary comes before the heading, as the GOV.UK Design System's error summary guidance advises.
    elements: [
      { type: 'error-summary', items: ['Enter an email address in the correct format, like name@example.com', 'Enter a workspace name'] },
      { type: 'heading', text: 'Create your workspace' },
      ...workspaceFields(true),
      { type: 'button', label: 'Create workspace', variant: 'primary', to: 'invoices-empty' },
    ],
  },
  {
    id: 'sign-in', screen: 'sign-in', kind: 'boundary', title: 'Sign in',
    purpose: 'A branch the example does not build. It says so and offers the way back, so the user is never stranded.',
    elements: [
      { type: 'heading', text: 'Sign in' },
      { type: 'text', text: 'Signing in is not part of this practice example. Nothing you typed has been sent anywhere.' },
      { type: 'button', label: 'Back to create a workspace', variant: 'secondary', to: 'signup' },
    ],
  },
  {
    id: 'invoices-empty', screen: 'invoices', kind: 'empty', title: 'Invoices: none yet',
    purpose: 'The empty state explains what the screen is for and offers the one next step.',
    elements: [
      { type: 'heading', text: 'Invoices' },
      { type: 'text', text: 'You have not sent an invoice yet. Your first one takes about two minutes.' },
      { type: 'button', label: 'Create your first invoice', variant: 'primary', to: 'invoice-new' },
    ],
  },
  {
    id: 'invoice-new', screen: 'new-invoice', kind: 'screen', title: 'New invoice',
    purpose: 'The main task: the details a client needs to pay.',
    elements: [
      { type: 'heading', text: 'New invoice' },
      ...invoiceFields(false),
      { type: 'button', label: 'Check invoice', variant: 'primary', to: 'invoice-review' },
      { type: 'button', label: 'Cancel', variant: 'secondary', to: 'discard-dialog' },
    ],
  },
  {
    id: 'invoice-new-error', screen: 'new-invoice', kind: 'error', title: 'New invoice: fix two problems',
    purpose: 'Validation errors on the main task, with the summary linked to each field.',
    elements: [
      { type: 'error-summary', items: ['Enter the client name', 'Enter an amount greater than 0'] },
      { type: 'heading', text: 'New invoice' },
      ...invoiceFields(true),
      { type: 'button', label: 'Check invoice', variant: 'primary', to: 'invoice-review' },
      { type: 'button', label: 'Cancel', variant: 'secondary', to: 'discard-dialog' },
    ],
  },
  {
    id: 'discard-dialog', screen: 'new-invoice', kind: 'overlay', title: 'Discard this invoice?',
    purpose: 'A confirmation over the form, so a slip of the finger does not throw work away.',
    elements: [
      { type: 'heading', text: 'Discard this invoice?' },
      { type: 'text', text: 'What you entered will be lost.' },
      { type: 'button', label: 'Keep editing', variant: 'primary', to: 'invoice-new' },
      { type: 'button', label: 'Discard', variant: 'secondary', to: 'invoices-empty' },
    ],
  },
  {
    id: 'invoice-review', screen: 'review', kind: 'screen', title: 'Check the invoice',
    purpose: 'One look at everything before it goes to the client, with a way to change any of it.',
    elements: [
      { type: 'heading', text: 'Check the invoice' },
      { type: 'summary', rows: [['Client', 'Harbour Bakery'], ['Send to', 'accounts@harbour-bakery.example'], ['Work', 'Menu redesign, two rounds of changes'], ['Amount', '$480.00'], ['Due', 'In 30 days']] },
      { type: 'button', label: 'Send invoice', variant: 'primary', to: 'invoice-sent' },
      { type: 'button', label: 'Change details', variant: 'secondary', to: 'invoice-new' },
    ],
  },
  {
    id: 'send-error', screen: 'review', kind: 'error', title: 'The invoice was not sent',
    purpose: 'A failure after the user pressed Send: says what happened, that nothing was sent, and what to do.',
    elements: [
      { type: 'heading', text: 'The invoice was not sent' },
      { type: 'error-summary', items: ['The client email address cannot receive mail. Check the address and try again.'] },
      { type: 'text', text: 'Nothing was sent. Your invoice is saved as a draft.' },
      { type: 'button', label: 'Change the email address', variant: 'primary', to: 'invoice-new' },
    ],
  },
  {
    id: 'invoice-sent', screen: 'sent', kind: 'success', title: 'Invoice INV-0001 sent',
    purpose: 'Confirms the outcome in words, with the number to quote, and the way back to the list.',
    elements: [
      { type: 'heading', text: 'Invoice INV-0001 sent' },
      { type: 'text', text: 'Harbour Bakery will get it at accounts@harbour-bakery.example. It is due in 30 days.' },
      { type: 'button', label: 'Back to invoices', variant: 'primary', to: 'invoices-list' },
    ],
  },
  {
    id: 'invoices-list', screen: 'invoices', kind: 'screen', title: 'Invoices: one sent',
    purpose: 'The same screen as the empty state, now with the result of the journey in it.',
    elements: [
      { type: 'heading', text: 'Invoices' },
      { type: 'table', columns: ['Number', 'Client', 'Amount', 'Status'], rows: [['INV-0001', 'Harbour Bakery', '$480.00', 'Sent']] },
      { type: 'button', label: 'Create invoice', variant: 'primary', to: 'invoice-new' },
    ],
  },
];

export const TRANSITIONS: readonly Transition[] = [
  { from: 'signup', to: 'invoices-empty', kind: 'forward', trigger: 'Create workspace with a valid email address and a workspace name' },
  { from: 'signup', to: 'signup-error', kind: 'error', trigger: 'Create workspace with a badly formed email address or no workspace name' },
  { from: 'signup-error', to: 'invoices-empty', kind: 'recover', trigger: 'Fix both fields and create the workspace' },
  { from: 'signup', to: 'sign-in', kind: 'branch', trigger: 'Choose I already have an account' },
  { from: 'sign-in', to: 'signup', kind: 'back', trigger: 'Back to create a workspace' },
  { from: 'invoices-empty', to: 'invoice-new', kind: 'forward', trigger: 'Create your first invoice' },
  { from: 'invoice-new', to: 'invoice-review', kind: 'forward', trigger: 'Check invoice with every field valid' },
  { from: 'invoice-new', to: 'invoice-new-error', kind: 'error', trigger: 'Check invoice with no client name or an amount of 0 or less' },
  { from: 'invoice-new-error', to: 'invoice-review', kind: 'recover', trigger: 'Fix the fields and check the invoice' },
  { from: 'invoice-new', to: 'discard-dialog', kind: 'overlay-open', trigger: 'Cancel' },
  { from: 'invoice-new-error', to: 'discard-dialog', kind: 'overlay-open', trigger: 'Cancel' },
  { from: 'discard-dialog', to: 'invoice-new', kind: 'overlay-close', trigger: 'Keep editing, or press Escape' },
  { from: 'discard-dialog', to: 'invoices-empty', kind: 'back', trigger: 'Discard' },
  { from: 'invoice-review', to: 'invoice-new', kind: 'back', trigger: 'Change details: every value is kept' },
  { from: 'invoice-review', to: 'invoice-sent', kind: 'forward', trigger: 'Send invoice' },
  { from: 'invoice-review', to: 'send-error', kind: 'error', trigger: 'Send invoice to an address that cannot receive mail (in the example, any address ending in .invalid)' },
  { from: 'send-error', to: 'invoice-new', kind: 'recover', trigger: 'Change the email address' },
  { from: 'invoice-sent', to: 'invoices-list', kind: 'forward', trigger: 'Back to invoices' },
  { from: 'invoices-list', to: 'invoice-new', kind: 'forward', trigger: 'Create invoice' },
];

export const START_STATE: StateId = 'signup';

export function stateById(id: StateId): FlowState {
  const state = STATES.find((item) => item.id === id);
  if (!state) throw new Error(`Pocket Invoice: no state ${id}`);
  return state;
}

/** Field validation shared by the implementation and its tests. Each rule returns the message to show, or undefined. */
export const VALIDATION = {
  email: (value: string): string | undefined => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : 'Enter an email address in the correct format, like name@example.com'),
  workspace: (value: string): string | undefined => (value.trim() ? undefined : 'Enter a workspace name'),
  client: (value: string): string | undefined => (value.trim() ? undefined : 'Enter the client name'),
  clientEmail: (value: string): string | undefined => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : 'Enter the client email address in the correct format, like name@example.com'),
  work: (value: string): string | undefined => (value.trim() ? undefined : 'Describe the work'),
  amount: (value: string): string | undefined => {
    const text = value.trim().replace(/^\$/, '');
    if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return 'Enter the amount as a number, like 480.00';
    const amount = Number(text);
    if (amount <= 0) return 'Enter an amount greater than 0';
    if (amount > 1_000_000) return 'Enter an amount of 1,000,000 or less';
    return undefined;
  },
  /** The reserved .invalid top-level domain can never receive mail (RFC 2606); the example fails the send for it. */
  deliverable: (value: string): boolean => !/\.invalid$/i.test(value.trim()),
} as const;
