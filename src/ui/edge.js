// A scrolling zone shows whole lines, as a page of a book ends on a whole
// line. Its top edge rests on the start of a block (scroll-snap in
// style.css); at its bottom edge a band of paper covers the line the edge
// would cut, until that line scrolls fully into view. The band is drawn
// only where the zone scrolls: on a laptop.

import { el } from './dom.js';

const STEP = 16; // px between the points tried along the edge
const MOST = 48; // px: a taller box is a figure, not a line
// The blocks the panel comes to rest on (scroll-snap in style.css).
const BLOCKS = 'header, nav, p, li, dt, dd, h2, h3, h4, figure, table, .variant-row, .term-entry, .answer, .cite-keys, .field, .tool-actions';

// The height of the band: from the top of the highest line the edge cuts
// down to the edge, or 0.
export function cutOf(lines, bottom) {
  let top = bottom;
  for (const r of lines) if (r.top < bottom && r.bottom > bottom && r.height <= MOST) top = Math.min(top, r.top);
  return Math.round(bottom - top);
}

// The line boxes of the text the edge runs through.
function linesAt(zone, bottom) {
  const box = zone.getBoundingClientRect();
  const right = box.left + zone.clientLeft + zone.clientWidth;
  const blocks = new Set();
  for (let x = box.left + zone.clientLeft + 2; x < right; x += STEP) {
    const hit = document.elementFromPoint(x, bottom - 1);
    if (hit && hit !== zone && zone.contains(hit) && hit.getBoundingClientRect().height < 3 * zone.clientHeight) blocks.add(hit);
  }
  const range = document.createRange();
  const lines = [];
  for (const block of blocks) {
    const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      // Text for a screen reader alone draws no line.
      if (!n.data.trim() || n.parentElement.closest('.sr')) continue;
      range.selectNodeContents(n);
      lines.push(...range.getClientRects());
    }
  }
  return lines;
}

export function wholeLines(zone, name) {
  const band = el('div', { class: `cover cover-${name}`, 'aria-hidden': 'true' });
  zone.after(band);
  const update = () => {
    if (getComputedStyle(band).display === 'none') return;
    const box = zone.getBoundingClientRect();
    const bottom = box.top + zone.clientTop + zone.clientHeight;
    const cut = zone.scrollHeight > zone.clientHeight + 1 ? cutOf(linesAt(zone, bottom), bottom) : 0;
    band.style.height = `${cut}px`;
    band.style.width = `${zone.clientLeft + zone.clientWidth}px`;
  };
  // A control that takes the focus shows whole, above the band: the block
  // that holds it comes to the top edge, where the panel rests anyway.
  zone.addEventListener('focusin', (event) => {
    const target = event.target;
    requestAnimationFrame(() => {
      if (!zone.contains(target) || zone.scrollHeight <= zone.clientHeight + 1) return;
      const top = zone.getBoundingClientRect().top + zone.clientTop;
      const bottom = top + zone.clientHeight - band.offsetHeight;
      const r = target.getBoundingClientRect();
      if (r.top >= top - 1 && r.bottom <= bottom + 1) return;
      const block = target.closest(BLOCKS) ?? target;
      const b = block.getBoundingClientRect();
      zone.scrollTop += (r.bottom - b.top > zone.clientHeight - 48 ? r.top - 8 : b.top) - top;
    });
  });

  // A scroll moves the lines; a resize, new content or a late font may too.
  zone.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(zone);
  new MutationObserver(update).observe(zone, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'open', 'class'] });
  document.fonts?.ready.then(update);
  return { update };
}
