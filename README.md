# Kuan-Wei Tseng’s website

A buildless static site for GitHub Pages. `index.html` is the profile and publication list; `ArtNV.html` is the research project page. Both pages use `style/style.css`. The only application JavaScript is `scripts/site.js`, which adapts one navigation list to the available space.

## Preview

Run `python3 -m http.server 8765`, then visit `http://localhost:8765`. There is no package installation or build step. Publish the repository using its existing GitHub Pages configuration.

## Update content

- Edit the biography in `#about` and add experience or education as an `article.entry`. Keep its date, `h3` organization, role, and optional `details.entry-details` in that order. Keep headings outside `summary` so screen readers retain heading navigation.
- Add publications to `#publication` or preprints to `#projects` as an `article.publication`. Keep the title, authors, venue, and resource links in the HTML so they remain available without JavaScript. Use links for destinations and buttons only for actions. Omit unavailable resource links rather than adding empty buttons.
- Set the actual `width` and `height` on every image or video. Add responsive WebP sources with an original PNG/JPEG fallback. Lazy-load below-fold images; keep the hero and the ArtNV method figure eager. Each page’s likely largest image uses `fetchpriority="high"`.
- Use native `video controls preload="none"` with a poster for silent animated previews. Original GIF files remain available at their existing URLs. New videos with speech also need captions and transcripts.
- Keep existing page names, section IDs (`top`, `about`, `experience`, `education`, `publication`, `projects`), document URLs, original media, and Google verification files. The older CSS files remain available at their original paths for compatibility, but neither page loads them.

## Media

Optimized assets are committed in `images/optimized/`; the originals are unchanged. Regenerate them with `python3 scripts/optimize-media.py` (requires FFmpeg and FFprobe). This is optional authoring tooling, not a deployment build step. Check the results visually before committing.

## Browser behavior and checks

Grid, Flexbox, and native details provide the base layout and disclosures. Navigation uses native Popover when available, with a visible-link fallback in older browsers. Without JavaScript, native popover navigation and disclosures still work; JavaScript only adds the inline desktop layout and closes the menu after section selection. New features must preserve the base experience when unsupported.

Before publishing, check both pages at 320, 390, 640, 768, 1024, and 1440 CSS pixels, and with 200% text scaling. Check keyboard focus, Escape dismissal, an open menu during resize, disclosures with JavaScript disabled, media playback, local links, and horizontal overflow. Run an HTML validator and axe or Lighthouse, then compare loading under the same device and network settings. Automated scores supplement keyboard and screen-reader testing.
