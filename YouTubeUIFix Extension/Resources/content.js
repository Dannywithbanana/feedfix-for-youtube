// content.js
//
// All styling lives in content.css; this script only:
//   1. mirrors the user's settings onto <html> as classes / data attributes
//   2. redirects /shorts/ URLs to the normal player
//   3. tags the few Shorts elements CSS can't match by itself (text-based chips)

const DEFAULTS = {
  blockShorts: true,
  redirectShorts: true,
  videosOnly: true,   // only video tiles in the feed grid
  gridColumns: 0,     // 0 = YouTube default, 3–6 = forced columns
  fullWidth: false,
  promoClickThrough: true, // paid-promotion label doesn't open a help page
};

let state = { ...DEFAULTS };

// Settings written by versions ≤1.0 only had { blockShorts, fixGrid }.
function fromStored(stored) {
  const s = { ...DEFAULTS, ...stored };
  if (!('gridColumns' in stored) && stored.fixGrid) {
    s.gridColumns = 6;
    s.fullWidth = true;
  }
  return s;
}

/* ── Apply settings ───────────────────────────────────────── */

function apply() {
  const html = document.documentElement;
  html.classList.toggle('ytfix-no-shorts', state.blockShorts);
  html.classList.toggle('ytfix-videos-only', state.videosOnly);
  html.classList.toggle('ytfix-full-width', state.fullWidth);
  html.classList.toggle('ytfix-promo-click-through', state.promoClickThrough);
  if (state.gridColumns >= 3) {
    html.dataset.ytfixCols = String(state.gridColumns);
  } else {
    delete html.dataset.ytfixCols;
  }
  redirectShortsUrl();
  tagShortsChips();
}

function redirectShortsUrl() {
  if (!state.redirectShorts) return;
  const m = location.pathname.match(/^\/shorts\/([^/?#]+)/);
  if (m) {
    location.replace('https://www.youtube.com/watch?v=' + m[1]);
  }
}

// Filter chips ("Shorts" pill above the feed) carry no attribute we can
// select on, so match their text here and let content.css hide the class.
function tagShortsChips() {
  if (!state.blockShorts) {
    document.querySelectorAll('.ytfix-hidden').forEach(el => el.classList.remove('ytfix-hidden'));
    return;
  }
  document.querySelectorAll('yt-chip-cloud-chip-renderer, yt-chip-shape').forEach(chip => {
    if (chip.textContent.trim().toLowerCase() === 'shorts') {
      chip.classList.add('ytfix-hidden');
    }
  });
}

/* ── React to YouTube SPA navigation / feed updates ───────── */

let debounceTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(apply, 150);
});
observer.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('yt-navigate-finish', apply);
document.addEventListener('yt-page-data-updated', apply);

/* ── React to settings changes (no message passing needed) ── */

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key in state) state[key] = newValue;
  }
  apply();
});

/* ── Load settings and start ──────────────────────────────── */

chrome.storage.sync.get(null, (stored) => {
  state = fromStored(stored);
  apply();
});
