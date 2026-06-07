#!/usr/bin/env node
/*
 * Nanil color unification (one-shot codemod).
 * Collapses scattered amber / orange / yellow Tailwind utilities onto the
 * single Nanil "warm" highlight token, so panels stop reading as muddy brown
 * and every page shares one calm warm language.
 *
 * Mapping rules (per utility prefix):
 *   text|fill|stroke|caret|placeholder|decoration  -> <prefix>-warm
 *   border|divide|ring|outline                      -> <prefix>-warm/30
 *   from|to|via                                      -> <prefix>-warm/10
 *   bg  -> subtle if opacity present or shade<=200 or shade>=800  (bg-warm/10)
 *          medium for shade 300-400                               (bg-warm/20)
 *          solid for shade 500-700                                (bg-warm)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const files = execSync(
  `grep -rlE '(amber|orange|yellow)-[0-9]' ${root}src --include='*.jsx' --include='*.tsx' --include='*.ts' --include='*.js' || true`,
  { encoding: 'utf8' }
).split('\n').filter(Boolean);

const COLOR = '(?:amber|orange|yellow)';
const token = /\b(bg|text|border|divide|ring|outline|fill|stroke|caret|placeholder|decoration|from|to|via)-(amber|orange|yellow)-(\d{2,3})(\/\d{1,3})?\b/g;

let totalFiles = 0;
let totalHits = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let hits = 0;
  const out = src.replace(token, (m, prefix, _color, shadeStr, opacity) => {
    hits++;
    const shade = parseInt(shadeStr, 10);
    switch (prefix) {
      case 'text': case 'fill': case 'stroke':
      case 'caret': case 'placeholder': case 'decoration':
        return `${prefix}-warm`;
      case 'border': case 'divide': case 'ring': case 'outline':
        return `${prefix}-warm/30`;
      case 'from': case 'to': case 'via':
        return `${prefix}-warm/10`;
      case 'bg':
        if (opacity || shade <= 200 || shade >= 800) return 'bg-warm/10';
        if (shade <= 400) return 'bg-warm/20';
        return 'bg-warm';
      default:
        return m;
    }
  });
  if (hits > 0) {
    writeFileSync(file, out);
    totalFiles++;
    totalHits += hits;
    console.log(`  ${hits.toString().padStart(3)}  ${file.replace(root, '')}`);
  }
}

console.log(`\nNanil: unified ${totalHits} color utilities across ${totalFiles} files onto --warm.`);
