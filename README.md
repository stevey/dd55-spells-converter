# dd55-spells-converter

Chrome extension that points legacy (2014) spell links on D&D Beyond monster stat blocks at their
2024 (5.5e) versions. It rewrites both the link and the hover tooltip, and adds a small **24** badge
to each swapped spell. It also patches Beyond20's spell buttons so they use the 2024 spell.

## Install
1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and pick the `extension/` folder.
3. Open any legacy monster, e.g. https://www.dndbeyond.com/monsters/16789-archmage.

## How it works
- `extension/spell-map.json` maps legacy spell IDs to the 2024 `id-slug`, e.g.
  `"1989": "2618844-acid-splash"`.
- `extension/content.js` runs on `/monsters/*`. It reads the spell ID from each
  `a.spell-tooltip[data-tooltip-href]` in a legacy `.mon-stat-block`, then rewrites `href` and
  `data-tooltip-href`.
- 2024 stat blocks are left alone. Spells with no 2024 PHB version, e.g. Absorb Elements, are
  left as they are.

## Regenerate the map
```sh
node scripts/build-spell-map.mjs            # add --verbose to list spells with no 2024 version
```
This scrapes the public spell listing at https://www.dndbeyond.com/spells, taking about a minute
at 1 request per second. It matches spells by slug. `scripts/aliases.json` handles names that
differ between editions, e.g. `acid-arrow` → `melfs-acid-arrow` and `feeblemind` → `befuddlement`.
