// popup.js

const DEFAULTS = {
  blockShorts: true,
  redirectShorts: true,
  videosOnly: true,
  gridColumns: 0,
  fullWidth: false,
};

const shortsToggle     = document.getElementById('toggle-shorts');
const redirectToggle   = document.getElementById('toggle-redirect');
const videosOnlyToggle = document.getElementById('toggle-videosonly');
const fullWidthToggle = document.getElementById('toggle-fullwidth');
const colsPicker      = document.getElementById('cols-picker');

// Settings written by versions ≤1.0 only had { blockShorts, fixGrid }.
function fromStored(stored) {
  const s = { ...DEFAULTS, ...stored };
  if (!('gridColumns' in stored) && stored.fixGrid) {
    s.gridColumns = 6;
    s.fullWidth = true;
  }
  return s;
}

function renderCols(cols) {
  for (const btn of colsPicker.querySelectorAll('button')) {
    btn.classList.toggle('active', Number(btn.dataset.cols) === cols);
  }
}

chrome.storage.sync.get(null, (stored) => {
  const s = fromStored(stored);
  shortsToggle.checked     = s.blockShorts;
  redirectToggle.checked   = s.redirectShorts;
  videosOnlyToggle.checked = s.videosOnly;
  fullWidthToggle.checked  = s.fullWidth;
  renderCols(s.gridColumns);
});

// Content scripts pick changes up via chrome.storage.onChanged — just save.
shortsToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ blockShorts: shortsToggle.checked });
});

redirectToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ redirectShorts: redirectToggle.checked });
});

videosOnlyToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ videosOnly: videosOnlyToggle.checked });
});

fullWidthToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ fullWidth: fullWidthToggle.checked });
});

colsPicker.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const cols = Number(btn.dataset.cols);
  renderCols(cols);
  chrome.storage.sync.set({ gridColumns: cols });
});
