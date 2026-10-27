// Rewrites legacy spell links in monster stat blocks to their 2024 versions.
(async () => {
  const map = await fetch(chrome.runtime.getURL('spell-map.json')).then((r) => r.json());
  const ID_RE = /\/spells\/(\d+)(?:-|\/)/;
  const DEFAULTS = { enabled: true, showBadge: true, badgeLinksToLegacy: true, showCount: true };
  let settings = await chrome.storage.sync.get(DEFAULTS);
  let lastCount;

  function legacyId(a) {
    return (a.getAttribute('data-tooltip-href') || '').match(ID_RE)?.[1]
      ?? (a.getAttribute('href') || '').match(ID_RE)?.[1];
  }

  function badgeFor(a) {
    const next = a.nextElementSibling;
    return next?.classList.contains('dd55-badge') ? next : null;
  }

  function updateBadge(badge, a) {
    if (settings.badgeLinksToLegacy) {
      badge.href = a.dataset.dd55Href;
      badge.title = '2024 version shown. Click for the 2014 version.';
    } else {
      badge.removeAttribute('href');
      badge.title = 'Swapped to the 2024 version';
    }
  }

  function swap(a) {
    const oldId = legacyId(a);
    const target = oldId && map[oldId];
    a.dataset.dd55 = target ? oldId : '';
    if (!target) return;

    // Keep the originals so the swap can be undone and the badge can link back.
    a.dataset.dd55Href = a.getAttribute('href');
    a.dataset.dd55Tooltip = a.getAttribute('data-tooltip-href');
    const newId = target.split('-')[0];
    a.href = `/spells/${target}`;
    a.setAttribute('data-tooltip-href', `//www.dndbeyond.com/spells/${newId}-tooltip`);

    const badge = document.createElement('a');
    badge.className = 'dd55-badge';
    badge.textContent = '24';
    updateBadge(badge, a);
    a.after(badge);
  }

  function revert(a) {
    if (a.dataset.dd55) {
      a.setAttribute('href', a.dataset.dd55Href);
      a.setAttribute('data-tooltip-href', a.dataset.dd55Tooltip);
      badgeFor(a)?.remove();
      const icon = a.parentElement?.querySelector('img.ct-beyond20-spell-icon[data-dd55-url]');
      if (icon) {
        icon.setAttribute('x-beyond20-spell-url', icon.dataset.dd55Url);
        delete icon.dataset.dd55Url;
      }
    }
    delete a.dataset.dd55;
    delete a.dataset.dd55Href;
    delete a.dataset.dd55Tooltip;
  }

  // Beyond20 caches the spell URL on an icon it inserts after the link.
  function fixBeyond20(a) {
    const oldId = a.dataset.dd55;
    const icon = a.parentElement?.querySelector(
      `img.ct-beyond20-spell-icon[x-beyond20-spell-url*="/spells/${oldId}/"]`
    );
    if (icon) {
      icon.dataset.dd55Url = icon.getAttribute('x-beyond20-spell-url');
      icon.setAttribute('x-beyond20-spell-url', `https://www.dndbeyond.com/spells/${map[oldId].split('-')[0]}/tooltip`);
    }
  }

  // 2024 stat blocks use different markup and already link to 2024 spells.
  const swapped = () => document.querySelectorAll('.mon-stat-block a.spell-tooltip[data-dd55]:not([data-dd55=""])');

  function reportCount() {
    const count = settings.enabled && settings.showCount ? swapped().length : 0;
    if (count === lastCount) return;
    lastCount = count;
    chrome.runtime.sendMessage({ count }).catch(() => {}); // fails harmlessly after an extension reload
  }

  function swapAll() {
    if (settings.enabled) {
      document.querySelectorAll('.mon-stat-block a.spell-tooltip:not([data-dd55])').forEach(swap);
      swapped().forEach(fixBeyond20);
    }
    reportCount();
  }

  function applySettings() {
    document.documentElement.classList.toggle('dd55-hide-badges', !settings.showBadge);
    if (!settings.enabled) document.querySelectorAll('a.spell-tooltip[data-dd55]').forEach(revert);
    swapped().forEach((a) => {
      const badge = badgeFor(a);
      if (badge) updateBadge(badge, a);
    });
    swapAll();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [key, { newValue }] of Object.entries(changes)) settings[key] = newValue ?? DEFAULTS[key];
    applySettings();
  });

  applySettings();
  let pending;
  new MutationObserver(() => {
    clearTimeout(pending);
    pending = setTimeout(swapAll, 100);
  }).observe(document.body, { childList: true, subtree: true });
})();
