// Scrapes the public D&D Beyond spell listing and writes extension/spell-map.json:
// { "<legacyId>": "<newId>-<newSlug>" } for every legacy spell with a 2024 version.
// Usage: node scripts/build-spell-map.mjs
import { readFile, writeFile } from 'node:fs/promises';

const BASE = 'https://www.dndbeyond.com/spells';
const NEW_SOURCES = ['filter-source=145', 'filter-source=148']; // PHB 2024, Free Rules 2024
// Everything else: 2014 PHB/Basic plus Xanathar's, Tasha's, etc. that were reprinted in the 2024 PHB.
const LEGACY_SOURCES = ['filter-search='];
const DELAY_MS = 1000;

const aliases = JSON.parse(await readFile(new URL('./aliases.json', import.meta.url), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrape(filter) {
  const found = new Map(); // id -> slug
  for (let page = 1; ; page++) {
    const res = await fetch(`${BASE}?${filter}&page=${page}`, {
      headers: { 'User-Agent': 'dd55-spells-converter map builder (personal use)' },
    });
    if (!res.ok) throw new Error(`${filter} page ${page}: HTTP ${res.status}`);
    const html = await res.text();
    let added = 0;
    for (const [, id, slug] of html.matchAll(/data-slug="(\d+)-([a-z0-9-]+)"/g)) {
      if (!found.has(id)) { found.set(id, slug); added++; }
    }
    process.stderr.write(`  ${filter} page ${page}: +${added}\n`);
    if (added === 0) break;
    await sleep(DELAY_MS);
  }
  return found;
}

const newBySlug = new Map(); // slug -> "id-slug"
const newIds = new Set();
for (const f of NEW_SOURCES) {
  for (const [id, slug] of await scrape(f)) { newBySlug.set(slug, `${id}-${slug}`); newIds.add(id); }
}

const legacy = new Map();
for (const f of LEGACY_SOURCES) {
  for (const [id, slug] of await scrape(f)) if (!newIds.has(id)) legacy.set(id, slug);
}

const map = {};
const unmapped = [];
for (const [id, slug] of [...legacy].sort((a, b) => a[0] - b[0])) {
  const target = newBySlug.get(aliases[slug] ?? slug);
  if (target) map[id] = target;
  else unmapped.push(`${id}-${slug}`);
}

await writeFile(new URL('../extension/spell-map.json', import.meta.url), JSON.stringify(map, null, 2) + '\n');
console.log(`2024 spells: ${newBySlug.size}, other spells: ${legacy.size}, mapped: ${Object.keys(map).length}`);
console.log(`Other spells with no 2024 PHB version: ${unmapped.length}`);
if (process.argv.includes('--verbose')) console.log(unmapped.join('\n'));
