// Settings popup. Changes are picked up live by content.js via chrome.storage.onChanged.
const DEFAULTS = { showBadge: true };
const showBadge = document.getElementById('showBadge');

chrome.storage.sync.get(DEFAULTS).then((settings) => {
  showBadge.checked = settings.showBadge;
});
showBadge.addEventListener('change', () => {
  chrome.storage.sync.set({ showBadge: showBadge.checked });
});

fetch(chrome.runtime.getURL('spell-map.json'))
  .then((r) => r.json())
  .then((map) => {
    const { version } = chrome.runtime.getManifest();
    document.getElementById('info').textContent =
      `v${version} · ${Object.keys(map).length} legacy spells mapped`;
  });
