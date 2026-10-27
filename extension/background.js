// Shows the number of swapped spells on the current tab as the toolbar icon's badge.
chrome.runtime.onMessage.addListener(({ count }, sender) => {
  const tabId = sender.tab?.id;
  if (tabId === undefined) return;
  chrome.action.setBadgeText({ tabId, text: count ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#6d4bb8' });
  chrome.action.setBadgeTextColor?.({ tabId, color: '#fff' });
});
