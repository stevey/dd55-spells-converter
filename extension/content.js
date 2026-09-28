// Rewrites legacy spell links in monster stat blocks to their 2024 versions.
(async () => {
  const map = await fetch(chrome.runtime.getURL('spell-map.json')).then((r) => r.json());
  const ID_RE = /\/spells\/(\d+)(?:-|\/)/;

  function legacyId(a) {
    return (a.getAttribute('data-tooltip-href') || '').match(ID_RE)?.[1]
      ?? (a.getAttribute('href') || '').match(ID_RE)?.[1];
  }

  function swap(a) {
    const oldId = legacyId(a);
    const target = oldId && map[oldId];
    a.dataset.dd55 = target ? oldId : '';
    if (!target) return;

    const newId = target.split('-')[0];
    a.href = `/spells/${target}`;
    a.setAttribute('data-tooltip-href', `//www.dndbeyond.com/spells/${newId}-tooltip`);

    const badge = document.createElement('sup');
    badge.className = 'dd55-badge';
    badge.textContent = '24';
    badge.title = `Swapped from legacy spell #${oldId}`;
    a.after(badge);
  }

  // Beyond20 caches the spell URL on an icon it inserts after the link.
  function fixBeyond20(a) {
    const oldId = a.dataset.dd55;
    const icon = a.parentElement?.querySelector(
      `img.ct-beyond20-spell-icon[x-beyond20-spell-url*="/spells/${oldId}/"]`
    );
    if (icon) {
      icon.setAttribute('x-beyond20-spell-url', `https://www.dndbeyond.com/spells/${map[oldId].split('-')[0]}/tooltip`);
    }
  }

  function swapAll() {
    const block = document.querySelector('.mon-stat-block');
    if (!block) return; // 2024 stat blocks already link to 2024 spells
    block.querySelectorAll('a.spell-tooltip:not([data-dd55])').forEach(swap);
    block.querySelectorAll('a.spell-tooltip[data-dd55]:not([data-dd55=""])').forEach(fixBeyond20);
  }

  swapAll();
  let pending;
  new MutationObserver(() => {
    clearTimeout(pending);
    pending = setTimeout(swapAll, 100);
  }).observe(document.body, { childList: true, subtree: true });
})();
