// background.js

// Dim the toolbar icon when the tab isn't on YouTube
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('youtube.com')) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
});

// Seed defaults and migrate ≤1.0 settings ({ blockShorts, fixGrid })
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(null, (stored) => {
    const toSet = {};
    if (!('blockShorts' in stored)) toSet.blockShorts = true;
    if (!('redirectShorts' in stored)) toSet.redirectShorts = true;
    if (!('videosOnly' in stored)) toSet.videosOnly = true;
    if (!('gridColumns' in stored)) toSet.gridColumns = stored.fixGrid ? 6 : 0;
    if (!('fullWidth' in stored)) toSet.fullWidth = !!stored.fixGrid;
    if (Object.keys(toSet).length) chrome.storage.sync.set(toSet);
    if ('fixGrid' in stored) chrome.storage.sync.remove('fixGrid');
  });
});
