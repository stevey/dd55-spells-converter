# Chrome Web Store listing

Copy-paste text and answers for the Chrome Web Store developer dashboard. The images in this
folder are the right sizes for the store; `src/` has the HTML they were rendered from.

## Before you submit

1. Register as a Chrome Web Store developer at
   https://chrome.google.com/webstore/devconsole (one-time US$5 fee).
2. Bump `version` in `extension/manifest.json`. Every upload needs a higher version.
3. Run `sh scripts/package.sh` and upload the zip it prints (in `dist/`).
4. Fill in the fields below, then submit for review.

## Store listing tab

**Name:** Legacy Spell Updater for D&D Beyond

**Summary** (from the manifest, 132 characters max):
Updates legacy (2014) spell links in D&D Beyond monster stat blocks and the encounter builder to
their 2024 (5.5e) versions.

**Category:** Tools

**Language:** English

**Description:**

```
Playing with the 2024 rules but running legacy (2014) monsters? Their spell lists on D&D Beyond still link to the 2014 spells, so every hover and click shows the wrong text.

Legacy Spell Updater fixes that on the page:

• Spell links in legacy monster stat blocks open and preview the 2024 version
• A small purple "24" badge marks each swapped spell
• Click a badge to open the original 2014 spell
• The toolbar icon shows how many spells were swapped on the page
• Works on monster pages and in the encounter builder
• Beyond20's spell buttons roll the 2024 spell too

2024 stat blocks are left alone, and spells with no 2024 Player's Handbook version keep their legacy link.

Every feature can be turned on or off from the toolbar icon.

No data collection, no network requests, no analytics. Open source: https://github.com/stevey/dd55-spells-converter

Unofficial fan project. Not affiliated with or endorsed by D&D Beyond or Wizards of the Coast.
```

**Graphic assets:**

| Field | File |
| --- | --- |
| Store icon (128×128) | `extension/icons/icon-128.png` |
| Screenshots (1280×800) | `store/screenshot-1.png`, `store/screenshot-2.png` |
| Small promo tile (440×280) | `store/promo-small.png` |

**Homepage / support URL:** https://github.com/stevey/dd55-spells-converter

## Privacy practices tab

**Single purpose:**
Points legacy (2014) spell links in D&D Beyond monster stat blocks at their 2024 versions.

**Permission justifications:**

- `storage`: saves the user's on/off settings for the badge, badge link, toolbar count and the
  extension itself.
- Host access (`www.dndbeyond.com` monster, encounter builder, encounter and combat tracker
  pages): the content script rewrites spell links on those pages. It runs nowhere else.

**Remote code:** No, I am not using remote code.

**Data usage:** check none of the data types. The extension collects no user data.
Check all three certifications (no selling, no unrelated use, no creditworthiness use).

**Privacy policy URL:**
https://github.com/stevey/dd55-spells-converter/blob/main/PRIVACY.md
