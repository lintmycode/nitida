// Services and Contact-form "needs" copy — copied verbatim from
// renderVals() in design_handoff_nitida_redesign/Nitida Site Mockups.dc.html.
// See redesign-spec.md §Data for the proof -> {label, slug} mapping.

export interface Service {
  kind: string;
  // May contain <br> to force a two-line break (titles are balanced at two lines); rendered with set:html.
  title: string;
  line: string;
  long: string;
  stack: string;
  // The mockup's `proof` was a free-text string naming the project(s).
  // Here it links to the matching Works card (`/works#<slug>`). Cleanup &
  // rescue has no nameable project yet, so it's null and the proof row
  // is hidden — never render the mockup's "[add a rescue case]" placeholder.
  proof: { label: string; slug: string } | null;
  items: string[];
}

export const services: Service[] = [
  {
    kind: 'CREATE',
    title: 'WordPress, SPAs<br> & Web Design',
    line: 'Bespoke themes and plugins built to your brand, not bent out of a template.',
    long: "Bespoke theme built to the design, custom post types and editor blocks your team can actually use, plugin work where the plugin doesn't exist yet.",
    stack: 'WordPress · PHP · ACF',
    proof: { label: 'CINCA, OneForma, Casino', slug: 'cinca' },
    items: ['Custom theme from design', 'Editor-friendly blocks', 'Plugin development'],
  },
  {
    kind: 'SELL',
    title: 'Shopify, WooCommerce<br> & E-commerce',
    line: 'Storefronts that sell — catalogue, variants, checkout, and the boring parts done right.',
    long: 'Theme development, product architecture for large catalogues, size and age filtering, checkout tuning and post-purchase flows.',
    stack: 'Shopify · Liquid · Woo',
    proof: { label: 'Everbean Kids', slug: 'everbean' },
    items: ['Theme development', 'Catalogue architecture', 'Checkout & post-purchase'],
  },
  {
    kind: 'RUN',
    title: 'Apps, Integrations<br> & Workflows',
    line: 'Web apps, portals and the plumbing that connects them to the systems running the business.',
    long: "Internal tools, customer portals and product front-ends, plus the ERP, CRM, payment and booking integrations behind them — queued, logged and retried, so a failed call doesn't become a lost order.",
    stack: 'Node · React · REST',
    proof: { label: 'Borealis', slug: 'borealis' },
    items: ['Web apps & portals', 'Third-party APIs & webhooks', 'Payments, bookings, data sync'],
  },
  {
    kind: 'GROWTH',
    title: 'SEO, Local & Performance',
    line: 'A report you can act on, then the work that moves the numbers — search, local and speed.',
    long: 'Technical audit, Core Web Vitals and content mapping, plus Google Business Profile setup, local schema and review flow. Delivered as a prioritised list, then implemented.',
    stack: 'GSC · CWV · GBP',
    proof: { label: 'Júlia Neves, Prisminfinito', slug: 'jna' },
    items: ['Technical audit & report', 'Core Web Vitals work', 'Google tools & analytics setup'],
  },
  {
    kind: 'EXPAND',
    title: 'AI in the Workflow',
    line: 'Models put to work on real problems — search, recommendations, and the content grind.',
    long: 'Search by image, recommendation engines, and LLM pipelines that clean, tag and enrich CMS data. Scoped to a measurable job, not bolted on as a feature.',
    stack: 'Vision · LLM · Vector search',
    proof: { label: 'CINCA, Everbean Kids', slug: 'cinca' },
    items: ['Fuzzy search', 'Recommendation engines', 'LLM data processing'],
  },
  {
    kind: 'RESCUE',
    title: 'Cleanup & Rescue',
    line: 'Inherited a half-finished, AI-generated codebase? We make it something you can actually ship.',
    long: "Audit of what's there, what's dead and what's dangerous. Then we stabilise: real data models, removed duplication, tests where they earn their keep, and a deploy that doesn't need luck. You get a written verdict before any rebuild.",
    stack: 'Audit · Refactor · Handover',
    proof: null, // no publicly nameable case yet; a 4th item fills the space instead
    items: ['Codebase audit & written verdict', 'Refactor, de-duplicate, secure', 'Reliable deploys', 'Take over or hand back clean'],
  },
  {
    kind: 'CARE',
    title: 'Hosting & Care',
    line: 'Managed hosting, updates, backups and monitoring on sites we know inside out.',
    long: 'Managed hosting with staging, weekly updates, off-site backups, uptime and error monitoring, and a named person who answers.',
    stack: 'Managed · Staging · Backups',
    proof: null, // removed on purpose (2026-09-25); a 4th item fills the space instead
    items: ['Managed hosting + staging', 'Updates & backups', 'Monitoring & support SLA', 'Domains, email & SSL'],
  },
];

// Contact form "What do you need?" chips.
export const needs: string[] = [
  'WordPress site',
  'Shopify store',
  'App or integration',
  'SEO, local & performance',
  'AI in the workflow',
  'Cleanup & rescue',
  'Hosting & care',
  'Other',
];
