// Wires the page: the state in the address picks a bond, a view and the
// colours; the catalog, the 3D view, the background and the map show it.
// Every brick comes from bricks.js, once per bond.

import { TEXTS } from './texts.js';
import { BONDS } from './data/verbanden.js';
import { buildWall } from './bricks.js';
import { readState, writeState, VIEWS } from './state.js';
import { createCatalog } from './ui/catalog.js';
import { createInfo } from './ui/info.js';
import { createMap } from './ui/map.js';
import { createView3d, KIND_COLOURS } from './view3d.js';
import { el } from './ui/dom.js';

// The modules run, so the line for a browser that cannot run them goes.
document.getElementById('no-modules')?.remove();

const byId = (id) => document.getElementById(id);
const ids = BONDS.map((b) => b.id);
const walls = new Map(BONDS.map((bond) => [bond.id, buildWall(bond)]));
let state = readState(location.search, ids);

// The view's keys: three views and the colours, under the stage.
const viewKeys = VIEWS.map((view) => el('button', {
  type: 'button', class: 'key view-key', 'data-view': view, 'aria-pressed': 'false',
  onclick: () => change({ zicht: view }),
}, TEXTS.view.views[view]));
const colourKey = el('button', {
  type: 'button', class: 'key colour-key', 'aria-pressed': 'false',
  onclick: () => change({ kleur: !state.kleur }),
}, TEXTS.view.colours);
const legend = el('ul', { class: 'legend', 'aria-label': TEXTS.view.legend });
const viewControls = el('div', { class: 'view-controls' },
  el('div', { class: 'view-keys', role: 'group', 'aria-label': TEXTS.view.viewsLabel }, viewKeys),
  colourKey,
  legend);

const view = createView3d(byId('view'), { texts: TEXTS.view, controlsNode: viewControls });
const map = createMap({ texts: TEXTS.map });
const info = createInfo(byId('info'), { texts: TEXTS.info, mapNode: map.node });
const catalog = createCatalog(byId('catalog'), { bonds: BONDS, walls, texts: TEXTS.catalog, onPick: (id) => change({ verband: id }, true) });

let shown = {};

function render() {
  const bond = BONDS.find((b) => b.id === state.verband);
  const wall = walls.get(bond.id);
  if (shown.verband !== state.verband) {
    catalog.select(bond.id);
    info.show(bond);
    map.show(bond);
    view.setWall(wall);
    view.setLabel(TEXTS.view.label(bond.name, wall.courses, wall.bricks.length));
    document.title = `${bond.name} - ${TEXTS.title}`;
    const kinds = [...new Set(wall.bricks.map((b) => b.kind))];
    legend.replaceChildren(...Object.keys(KIND_COLOURS).filter((k) => kinds.includes(k)).map((k) => el('li', { class: 'legend-item' },
      el('span', { class: 'chip', style: `background:${KIND_COLOURS[k]}` }), TEXTS.kinds[k])));
  }
  if (shown.zicht !== state.zicht || shown.verband !== state.verband) view.setView(state.zicht);
  if (shown.kleur !== state.kleur) view.setColours(state.kleur);
  for (const key of viewKeys) key.setAttribute('aria-pressed', String(key.dataset.view === state.zicht));
  colourKey.setAttribute('aria-pressed', String(state.kleur));
  legend.hidden = !state.kleur;
  shown = { ...state };
}

// A new bond is a new entry in the history, so Back returns to the last
// one; a view or the colours replace the current entry.
function change(part, push = false) {
  state = { ...state, ...part };
  const address = writeState(state);
  if (address !== location.search) history[push ? 'pushState' : 'replaceState'](null, '', address);
  render();
}

window.addEventListener('popstate', () => {
  state = readState(location.search, ids);
  render();
});

// The address always names the bond shown.
if (writeState(state) !== location.search) history.replaceState(null, '', writeState(state));
render();
