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
  const licence = el('p', { class: 'map-licence' }, texts.licence);
  figure.append(holder, caption, licence);
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
    const lines = [];
    lines.push(!bond.map.periodOnly ? texts.shaded : bond.periodKnown === false ? texts.noRegion : texts.periodOnly);
    if (bond.map.note) lines.push(bond.map.note.text);
    lines.push(bond.map.examples.length ? texts.dots : texts.noDots);
    caption.replaceChildren(...lines.map((line) => el('span', { class: 'map-line' }, line)));
    figure.dataset.verband = bond.id;
    if (!ready) return;
    const shaded = new Set(bond.map.provinces.map((p) => p.id));
    for (const path of drawing.querySelectorAll('path[id^="prov-"]')) {
      path.classList.toggle('shaded', shaded.has(path.id.slice(5)));
    }
    dots.replaceChildren(...bond.map.examples.map((e) => {
      const [x, y] = project(e.lon, e.lat);
      return svg('circle', { class: 'map-dot', cx: x, cy: y, r: 4 }, svg('title', {}, `${e.name}, ${e.place}`));
    }));
    drawing.setAttribute('aria-label', describe(bond));
    drawing.dataset.shaded = [...shaded].sort().join(' ');
    drawing.dataset.dots = String(bond.map.examples.length);
  }

  return { node: figure, show };
}
