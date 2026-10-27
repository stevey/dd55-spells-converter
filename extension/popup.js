// Settings popup. Changes are picked up live by content.js via chrome.storage.onChanged.
const DEFAULTS = { enabled: true, showBadge: true, badgeLinksToLegacy: true, showCount: true };
const inputs = [...document.querySelectorAll('input[data-setting]')];

// Grey out settings whose parent setting is off (data-requires lists the parents).
function refresh() {
  for (const input of inputs) {
    const parents = (input.dataset.requires || '').split(' ').filter(Boolean);
    const off = parents.some((key) => !document.querySelector(`[data-setting="${key}"]`).checked);
    input.disabled = off;
    input.closest('label').classList.toggle('disabled', off);
  }
}

chrome.storage.sync.get(DEFAULTS).then((settings) => {
  for (const input of inputs) input.checked = settings[input.dataset.setting];
  refresh();
});
for (const input of inputs) {
  input.addEventListener('change', () => {
    chrome.storage.sync.set({ [input.dataset.setting]: input.checked });
    refresh();
  });
}

fetch(chrome.runtime.getURL('spell-map.json'))
  .then((r) => r.json())
  .then((map) => {
    const { version } = chrome.runtime.getManifest();
    document.getElementById('info').textContent =
      `v${version} · ${Object.keys(map).length} legacy spells mapped`;
  });
