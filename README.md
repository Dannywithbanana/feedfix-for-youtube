# FeedFix for YouTube

A Safari extension that de-clutters YouTube: block Shorts, keep the feed to
actual videos, and take control of the grid layout. No tracking, no network
calls, no build step for the extension itself — plain Manifest V3, so it also
runs unmodified in Chromium browsers.

<p align="center">
  <img src="design/fullbleed-1024.png" width="128" alt="FeedFix icon">
</p>

## Options

All options live in the toolbar popup and apply to open tabs instantly.

| Option | What it does |
| --- | --- |
| **Block Shorts** | Hides Shorts from the home feed, sidebar, search results, channel tabs and filter chips |
| **Open Shorts in normal player** | Redirects `/shorts/...` links to the regular watch page |
| **Videos only** | Hides topic suggestions, community posts & promo shelves from the feed |
| **Videos per row** | Auto (YouTube default) or a fixed 3–6 columns |
| **Full-width feed** | Removes YouTube's feed width cap — pairs well with 5–6 columns on big monitors |

## Install

### Safari (macOS)

1. Open `YouTubeUIFix.xcodeproj` in Xcode and build/run once (⌘R).
2. Safari → Settings → Extensions → enable **FeedFix for YouTube**.
   For local builds, allow unsigned extensions first: Safari → Develop →
   Developer Settings → *Allow unsigned extensions*.

### Chrome / Edge / Brave

1. Open `chrome://extensions`, enable **Developer mode**.
2. **Load unpacked** → select `YouTubeUIFix Extension/Resources/`.

## How it works

The design goal is *no patchwork*: instead of chasing YouTube's ever-renamed
promo elements, the rules state invariants.

- All page styling lives in [`content.css`](YouTubeUIFix%20Extension/Resources/content.css),
  gated by classes/data-attributes that
  [`content.js`](YouTubeUIFix%20Extension/Resources/content.js) sets on `<html>`
  (`ytfix-no-shorts`, `ytfix-videos-only`, `data-ytfix-cols`, `ytfix-full-width`).
  Toggling an option off removes the class — YouTube's own layout returns
  untouched.
- **Videos only** is an allowlist, not a blocklist: a feed cell is kept only
  if it contains a real video tile; anything else (topic cards, community
  posts, ads, whatever ships next) is hidden without being named.
- Settings sync via `chrome.storage.sync`; content scripts react through
  `storage.onChanged` — no background message passing.

## Development

```sh
# Safari app + extension
xcodebuild -scheme YouTubeUIFix -configuration Debug build

# Chromium zip (for stores or sideloading)
cd "YouTubeUIFix Extension/Resources"
zip -r ../../dist/feedfix-for-youtube.zip . -x "*.DS_Store"
```

The icon is generated from [`design/icon-source.html`](design/icon-source.html)
(SVG → canvas → PNG, then `sips` for the size variants); `design/` holds the
1024px masters.

Internal identifiers (Xcode project, bundle IDs) intentionally keep the
original `YouTubeUIFix` name — renaming bundle IDs orphans the extension
registration Safari already knows about.
