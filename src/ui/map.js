// The map: the provinces from data/provincies.svg (made by
// tools/make-map.js from the Kadaster's open data), shaded where the
// sources call the bond traditional, with a dot for each example
// building. Where the sources tie a bond to a period and not to a region,
// the caption says so and nothing is shaded.

import { el, svg } from './dom.js';
import { project } from '../kaart.js';

export function createMap({ texts }) {
  const figure = el('figure', { class: 'map' });
  const holder = el('div', { class: 'map-holder' });
  const caption = el('figcaption', { class: 'map-caption' });
  const licence = el('span', { class: 'map-line map-licence' }, texts.licence);
  figure.append(caption, holder);
  let drawing = null;
  let dots = null;
  let wanted = null;
  let ready = false;

  // The outlines come as a file of their own; until it is in, the caption
  // already tells what the map will show.
  fetch(new URL('../../data/provincies.svg', import.meta.url))
    .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
    .then((text) => {
      const parsed = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
      drawing = document.importNode(parsed, true);
      drawing.querySelector('title')?.remove();
      drawing.querySelector('desc')?.remove();
      drawing.setAttribute('class', 'map-drawing');
      drawing.setAttribute('role', 'img');
      drawing.removeAttribute('width');
      drawing.removeAttribute('height');
      // A hatch for the shaded provinces: lines in the grey ink, which stand
      // out against the paper, as the caption's word "gearceerd" says.
      drawing.prepend(svg('defs', {}, svg('pattern', { id: 'arcering', width: 4, height: 4, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        svg('rect', { width: 4, height: 4, fill: '#f6ece6' }), svg('line', { x1: 0, y1: 0, x2: 0, y2: 4, stroke: '#685f56', 'stroke-width': 1.4 }))));
      dots = svg('g', { class: 'map-dots' });
      drawing.append(dots);
      holder.append(drawing);
      ready = true;
      if (wanted) show(wanted);
    })
    .catch(() => {
      holder.append(el('p', { class: 'map-missing' }, '-'));
    });

  function describe(bond) {
    const names = bond.map.provinces.map((p) => p.name);
    const parts = [names.length ? texts.provinces(names) : texts.none, texts.examples(bond.map.examples.length)];
    return texts.label(bond.name, parts.join(', '));
  }

  function show(bond) {
    wanted = bond;
    const names = bond.map.provinces.map((p) => p.name);
    const lines = [names.length ? texts.shadedNames(names) : bond.fields?.region && !bond.fields.region.gap ? texts.regionWords : texts.noRegion, bond.map.examples.length ? texts.dots : texts.noDots];
    caption.replaceChildren(el('span', { class: 'map-title' }, texts.title), ...lines.map((line) => el('span', { class: 'map-line' }, line)), licence);
    figure.dataset.verband = bond.id;
    if (!ready) return;
    const shaded = new Set(bond.map.provinces.map((p) => p.id));
    for (const path of drawing.querySelectorAll('path[id^="prov-"]')) {
      path.classList.toggle('shaded', shaded.has(path.id.slice(5)));
    }
    dots.replaceChildren(...bond.map.examples.map((e) => {
      const [x, y] = project(e.lon, e.lat);
      return svg('circle', { class: 'map-dot', cx: x, cy: y, r: 4.5 }, svg('title', {}, `${e.name}, ${e.place}`));
    }));
    drawing.setAttribute('aria-label', describe(bond));
    drawing.dataset.shaded = [...shaded].sort().join(' ');
    drawing.dataset.dots = String(bond.map.examples.length);
  }

  return { node: figure, show };
}
