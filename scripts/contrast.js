#!/usr/bin/env node
// WCAG 2.1 contrast-ratio calculator for the brand palette.
// Run: node scripts/contrast.js

const BRAND = {
  white:  '#FFFFFF',
  cyan:   '#01ADEF',
  cyan2:  '#0192C7',
  blue:   '#144586',
  blue9:  '#0E2F5C',
  mint:   '#5CC4A8',
  coral:  '#FF5A6E',
  coral2: '#E63F55',
  sky:    '#DFEAF2',
  sky2:   '#F2F7FB',
  ink:    '#202020',
  ink2:   '#4A5562',
  line:   '#E4ECF3',
};

// Relative luminance per WCAG 2.x
const lum = (hex) => {
  const c = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};

const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// Combinations actually used in the design — text on surface.
const PAIRS = [
  // White as text on coloured surfaces
  ['white', 'cyan',   'Hero / coral / cyan surfaces — body white text'],
  ['white', 'cyan2',  'Cyan hover state'],
  ['white', 'blue',   'Section headings on blue tile'],
  ['white', 'blue9',  'Footer / deep surfaces'],
  ['white', 'coral',  'Primary CTA button label'],
  ['white', 'coral2', 'Primary CTA hover'],
  ['white', 'mint',   'Mint badge'],

  // Ink (body text) on light surfaces
  ['ink',  'white',  'Body text on white'],
  ['ink',  'sky',    'Body text on pale sky band'],
  ['ink',  'sky2',   'Body text on subtle hover surface'],
  ['ink2', 'white',  'Secondary text on white'],
  ['ink2', 'sky',    'Secondary text on pale sky band'],
  ['ink2', 'sky2',   'Secondary text on subtle hover surface'],

  // Brand blue as heading text
  ['blue', 'white',  'Section headings on white'],
  ['blue', 'sky',    'Section headings on pale sky band'],
  ['blue', 'sky2',   'Section headings on subtle hover'],

  // Cyan as eyebrow / link
  ['cyan',  'white', 'Cyan eyebrow / link on white'],
  ['cyan',  'sky',   'Cyan eyebrow on pale sky band'],
  ['cyan',  'sky2',  'Cyan eyebrow on subtle hover'],
  ['cyan2', 'white', 'Cyan hover-text on white'],
  ['cyan',  'blue9', 'Cyan eyebrow / link on footer (deep blue)'],
  ['cyan',  'blue',  'Cyan eyebrow on brand-blue surface'],

  // Coral as link/text (rare — coral is mainly a button bg)
  ['coral',  'white', 'Coral text on white'],
  ['coral2', 'white', 'Coral hover text on white'],

  // Mint as text (we use it for ticks)
  ['mint', 'white',  'Mint tick on white'],
  ['mint', 'sky',    'Mint tick on pale sky band'],

  // Sky tint as text on cyan hero (used in "Wherever they live." accent)
  ['sky', 'cyan',    'Sky-tint accent text on cyan hero'],
  ['sky', 'blue',    'Sky-tint text on blue surface'],
  ['sky', 'blue9',   'Sky-tint text on deep blue surface'],
];

const STANDARD = (r) => {
  if (r >= 7)   return 'AAA';
  if (r >= 4.5) return 'AA';
  if (r >= 3)   return 'AA Large';
  return 'FAIL';
};

const rows = PAIRS.map(([fg, bg, label]) => {
  const r = ratio(BRAND[fg], BRAND[bg]);
  return {
    fg, bg, label,
    fgHex: BRAND[fg], bgHex: BRAND[bg],
    ratio: Math.round(r * 100) / 100,
    level: STANDARD(r),
  };
});

console.log('\n=== WCAG 2.1 Contrast Audit — Total Uptime brand palette ===\n');
console.log('fg            bg            ratio   level       use');
console.log('────────────  ────────────  ──────  ──────────  ───────────────────────────────────────');
for (const r of rows) {
  const pad = (s, w) => s.padEnd(w);
  console.log(
    `${pad(r.fg, 12)}  ${pad(r.bg, 12)}  ${pad(r.ratio.toFixed(2), 6)}  ${pad(r.level, 10)}  ${r.label}`
  );
}

// Emit JSON for brand.html to consume.
require('fs').writeFileSync(
  require('path').join(__dirname, 'contrast.json'),
  JSON.stringify(rows, null, 2)
);
console.log('\nWrote scripts/contrast.json\n');
