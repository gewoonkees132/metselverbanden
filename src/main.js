// Wires the page: the state in the address picks a bond, its variant,
// brick and joint, a view, the colours and the tool in the panel; the
// catalog, the 3D view, the elevation, the map and the panel show it.
// Every brick comes from bricks.js. Every link inside the page is an
// address; one handler follows them without a reload, so Back steps back.

import { TEXTS } from './texts.js';
import { BONDS, SOURCES, FORMATS, JOINTS, CANDIDATES, SESSION_DATE } from './data/verbanden.js';
import { TERMS } from './data/begrippen.js';
import { buildWall } from './bricks.js';
import { readState, writeState, catalogOf, VIEWS } from './state.js';
import { isPath } from './key.js';
import { elevationSvg, planSheetSvg, describeCourses, TONES, TONE_NAMES } from './drawing.js';
import { createCatalog } from './ui/catalog.js';
import { createInfo } from './ui/info.js';
import { createKeyView, createCompareView, createGlossaryView } from './ui/tools.js';
import { createMap } from './ui/map.js';
import { createView3d } from './view3d.js';
import { el } from './ui/dom.js';
import { wholeLines } from './ui/edge.js';

// The modules run, so the line for a browser that cannot run them goes.
document.getElementById('no-modules')?.remove();

const byId = (id) => document.getElementById(id);
const bondOf = (id) => BONDS.find((b) => b.id === id);
const formatIdsOf = (bond) => Object.entries(FORMATS).filter(([, f]) => f !== bond.format && (!f.bonds || f.bonds.includes(bond.id))).map(([id]) => id);
const defaultJoint = Object.values(JOINTS).find((j) => j.default) ?? null;
const catalog = catalogOf({
  ids: BONDS.map((b) => b.id),
  variants: (id) => (bondOf(id).variants ?? []).map((v) => v.id),
  formats: (id) => formatIdsOf(bondOf(id)),
  joints: Object.entries(JOINTS).filter(([, j]) => !j.default).map(([id]) => id),
  terms: TERMS.map((t) => t.id),
  keyPath: isPath,
});
const phone = () => window.matchMedia('(max-width: 759px)').matches;

const walls = new Map();
function wallOf(id, variant = null, steen = null) {
  const key = `${id}|${variant ?? ''}|${steen ?? ''}`;
  if (!walls.has(key)) walls.set(key, buildWall(bondOf(id), { variant, format: steen ? FORMATS[steen] : null }));
  return walls.get(key);
}
const plainWalls = new Map(BONDS.map((b) => [b.id, wallOf(b.id)]));
let state = readState(location.search, catalog);
const hrefOf = (part) => writeState({ ...state, ...part });

// What is shown besides the bond's own wall: its variant, brick, joint.
function showingOf(bond, s) {
  const parts = [];
  if (s.variant) parts.push(bond.variants.find((v) => v.id === s.variant).name.toLowerCase());
  if (s.steen) parts.push(FORMATS[s.steen].name.toLowerCase());
  if (s.voeg) parts.push(`voeg ${JOINTS[s.voeg].name.toLowerCase()}`);
  return parts.join(', ');
}

// The header's tools, on every page.
const toolLinks = {
  sleutel: el('a', { class: 'tool-link' }, TEXTS.tools.key),
  vergelijk: el('a', { class: 'tool-link' }, TEXTS.tools.compare),
  begrip: el('a', { class: 'tool-link' }, TEXTS.tools.glossary),
};
byId('tools').append(...Object.values(toolLinks));

// The view's keys: three views, the colours, and turning and zooming
// without a drag. A view key pressed again puts the view back.
const viewKeys = VIEWS.map((v) => el('button', {
  type: 'button', class: 'key view-key', 'data-view': v, 'aria-pressed': 'false',
  onclick: () => (state.zicht === v ? view.setView(v) : go({ ...state, zicht: v })),
}, TEXTS.view.views[v]));
const colourKey = el('button', {
  type: 'button', class: 'key colour-key', 'aria-pressed': 'false',
  onclick: () => go({ ...state, kleur: !state.kleur }),
}, TEXTS.view.colours);
const moveKeys = el('div', { class: 'move-keys', role: 'group', 'aria-label': TEXTS.view.moveLabel },
  el('button', { type: 'button', class: 'key move-key', 'aria-label': TEXTS.view.turnLeft, onclick: () => view.turn(-1) }, '<'),
  el('button', { type: 'button', class: 'key move-key', 'aria-label': TEXTS.view.turnRight, onclick: () => view.turn(1) }, '>'),
  el('button', { type: 'button', class: 'key move-key', 'aria-label': TEXTS.view.nearer, onclick: () => view.zoom(1) }, '+'),
  el('button', { type: 'button', class: 'key move-key', 'aria-label': TEXTS.view.farther, onclick: () => view.zoom(-1) }, '-'));
const viewControls = el('div', { class: 'view-controls' },
  el('div', { class: 'view-keys', role: 'group', 'aria-label': TEXTS.view.viewsLabel }, viewKeys),
  colourKey,
  moveKeys);

const stageName = el('p', { class: 'stage-name', tabindex: '-1' });
const view = createView3d(byId('view'), { texts: TEXTS.view, controlsNode: viewControls, captionNode: stageName });
const map = createMap({ texts: TEXTS.map });
const elevationHolder = el('div', { class: 'aanzicht-drawing' });
const elevationNote = el('span', { class: 'aanzicht-note' });
// One colour code for the kinds: the elevation's, and the 3D view's when
// it tells the kinds apart.
const toneLegend = el('span', { class: 'tone-legend', role: 'list', 'aria-label': TEXTS.view.legend }, TONE_NAMES.map(([kind, name]) => el('span', { class: 'tone', role: 'listitem' },
  el('span', { class: 'chip', style: `background:${TONES[kind]}` }), name)));
const band = el('div', { class: 'band' },
  el('figure', { class: 'aanzicht' },
    el('figcaption', { class: 'aanzicht-caption' }, el('span', { class: 'aanzicht-title' }, TEXTS.band.elevation), ' ', elevationNote, ' ', toneLegend),
    elevationHolder),
  map.node);
byId('view').append(band);

const info = createInfo({ texts: TEXTS.info, sources: SOURCES, terms: TERMS });
const keyView = createKeyView({ texts: TEXTS.key, bonds: BONDS, terms: TERMS, wallOf: (id) => plainWalls.get(id), candidates: CANDIDATES });
const compareView = createCompareView({ texts: TEXTS.compare, infoTexts: TEXTS.info, bonds: BONDS, sources: SOURCES });
const glossaryView = createGlossaryView({ texts: TEXTS.glossary, infoTexts: TEXTS.info, terms: TERMS, sources: SOURCES, wallOf: (id, variant) => wallOf(id, variant ?? null), candidates: CANDIDATES, bondName: (id) => bondOf(id)?.name ?? id });
const panel = byId('info');
const announce = el('p', { class: 'sr', role: 'status' });
document.body.append(announce);
// On a laptop the panel and the catalog scroll; each shows whole lines.
wholeLines(panel, 'info');
wholeLines(byId('catalog'), 'catalog');

const list = createCatalog(byId('catalog'), {
  bonds: BONDS, walls: plainWalls, texts: TEXTS.catalog, candidates: CANDIDATES,
  onPick: (id) => {
    go({ ...state, verband: id, variant: null, steen: null, voeg: null, sleutel: null, vergelijk: null, begrip: null }, { push: true, scrollTo: 'stage' });
    list.folded();
  },
});

const capital = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const lede = (bond) => [capital(bond.pattern), bond.periodShort ? capital(bond.periodShort) : null].filter(Boolean).join('. ').concat('.');
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// The elevation in the band, fitted to its room: six courses high, as
// long as the room allows, the scale the same both ways.
let elevationFor = null;
function drawElevation(bond, wall) {
  const box = elevationHolder.getBoundingClientRect();
  const width = Math.max(160, Math.floor(box.width));
  const height = Math.max(80, Math.floor(box.height));
  const courses = 6;
  const top = courses * (wall.format.height + wall.format.bed);
  const scale = Math.min((height - 4) / top, 0.6);
  // Whole bricks only: stop at a joint before the room runs out.
  const room = Math.floor((width - 28) / scale);
  const ends = wall.bricks.filter((b) => b.y0 === 0 && b.course < courses).map((b) => b.x1).filter((x) => x <= room).sort((p, q) => p - q);
  const length = Math.min(wall.legs.A, ends.length ? ends[ends.length - 1] : room);
  elevationHolder.innerHTML = elevationSvg(wall, { length, courses, scale, label: TEXTS.band.label(bond.name) });
  elevationNote.textContent = TEXTS.band.elevationNote(courses);
  elevationFor = `${wall.id}|${wall.variant}|${wall.format.name}|${width}|${height}`;
}
new ResizeObserver(() => {
  const bond = bondOf(state.verband);
  const wall = wallOf(bond.id, state.variant, state.steen);
  const box = elevationHolder.getBoundingClientRect();
  if (elevationFor !== `${wall.id}|${wall.variant}|${wall.format.name}|${Math.floor(box.width)}|${Math.floor(box.height)}`) drawElevation(bond, wall);
}).observe(elevationHolder);

// The drawing to download, as a file of its own: the whole front of leg A.
let svgUrl = null;
function download(bond, wall) {
  if (svgUrl) URL.revokeObjectURL(svgUrl);
  const showing = showingOf(bond, state);
  const text = elevationSvg(wall, {
    length: wall.legs.A, courses: 8, scale: 0.5, standalone: true,
    title: `${bond.name}, aanzicht van de voorkant${showing ? ` (${showing})` : ''}`,
    subtitle: `${wall.format.name}, ${wall.format.length} x ${wall.format.width} x ${wall.format.height} mm; lagen 1 tot 8 van onder; links de hoek, rechts het vrije eind; de balk is 1 m.`,
    label: TEXTS.band.label(bond.name),
    caption: `Nederlandse metselverbanden, ${location.origin}${location.pathname}${writeState({ verband: bond.id, variant: state.variant, steen: state.steen, voeg: state.voeg })}, stand ${SESSION_DATE}`,
  });
  svgUrl = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
  const name = [bond.id, state.variant, state.steen].filter(Boolean).join('-');
  return { url: svgUrl, name: `${name}-aanzicht.svg` };
}

// The courses from above, large, for the site: a file to print.
let sheetUrl = null;
function sheet(bond, wall) {
  if (sheetUrl) URL.revokeObjectURL(sheetUrl);
  const showing = showingOf(bond, state);
  const text = planSheetSvg(wall, {
    title: `${bond.name}${showing ? ` (${showing})` : ''}`,
    subtitle: `${wall.format.name}, ${wall.format.length} x ${wall.format.width} x ${wall.format.height} mm; links de hoek, rechts het vrije eind van muur A; de balk is 1 m.`,
    lines: describeCourses(wall),
  });
  sheetUrl = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
  const name = [bond.id, state.variant, state.steen].filter(Boolean).join('-');
  return { url: sheetUrl, name: `${name}-lagen.svg` };
}

let shown = {};

function render() {
  const bond = bondOf(state.verband);
  const wall = wallOf(bond.id, state.variant, state.steen);
  const showing = showingOf(bond, state);
  const wallChanged = shown.verband !== state.verband || shown.variant !== state.variant || shown.steen !== state.steen;
  if (wallChanged) {
    list.select(bond.id);
    map.show(bond);
    view.setWall(wall);
    view.setLabel(TEXTS.view.label(bond.name, wall.courses, wall.bricks.length));
    drawElevation(bond, wall);
  }
  // A variant, brick or joint is named on the stage, on a phone too.
  stageName.replaceChildren(el('strong', {}, bond.name), ' ', el('span', { class: `stage-pattern${showing ? ' stage-showing' : ''}` }, showing ? `${capital(showing)}.` : bond.pattern));
  const joint = state.voeg ? JOINTS[state.voeg] : defaultJoint;
  view.setJoint(joint?.recess ?? 4);
  if (shown.zicht !== state.zicht || wallChanged) view.setView(state.zicht);
  if (shown.kleur !== state.kleur) view.setColours(state.kleur);
  for (const key of viewKeys) key.setAttribute('aria-pressed', String(key.dataset.view === state.zicht));
  colourKey.setAttribute('aria-pressed', String(state.kleur));

  // The tools in the header: each opens its tool, or closes it when open.
  const alike = bond.lookalikes?.[0]?.id ?? BONDS.find((b) => b.id !== bond.id).id;
  const open = { sleutel: state.sleutel ? null : 'begin', vergelijk: state.vergelijk ? null : alike, begrip: state.begrip ? null : 'lijst' };
  for (const [tool, link] of Object.entries(toolLinks)) {
    link.setAttribute('href', writeState({ ...state, sleutel: null, vergelijk: null, begrip: null, [tool]: open[tool] }));
    if (state[tool]) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  list.setKeyHref(writeState({ ...state, sleutel: 'begin', vergelijk: null, begrip: null }));

  // The panel.
  let node;
  let title = `${bond.name}${showing ? ` (${showing})` : ''}`;
  if (state.sleutel) {
    keyView.show({ path: state.sleutel, current: state.verband, hrefOf });
    node = keyView.node;
    title = `${TEXTS.tools.key}: ${title}`;
  } else if (state.vergelijk) {
    const other = bondOf(state.vergelijk);
    compareView.show({
      a: bond, b: other, wallA: wallOf(bond.id, null, 'waalformaat'), wallB: wallOf(other.id, null, 'waalformaat'), hrefOf,
      onPick: (id) => go({ ...state, vergelijk: id }, { push: true }),
    });
    node = compareView.node;
    title = `${TEXTS.compare.title(bond.name, other.name)}`;
  } else if (state.begrip) {
    glossaryView.show({ term: state.begrip, bondName: bond.name, hrefOf });
    node = glossaryView.node;
    const t = TERMS.find((x) => x.id === state.begrip);
    title = `${TEXTS.tools.glossary}${t ? `: ${t.term}` : ''}`;
  } else {
    const svg = download(bond, wall);
    const plans = sheet(bond, wall);
    info.show({
      bond, state, wall, bonds: BONDS, formats: FORMATS, joints: JOINTS, formatIdsOf, hrefOf,
      permalink: `${location.origin}${location.pathname}${writeState({ verband: bond.id, variant: state.variant, steen: state.steen, voeg: state.voeg })}`,
      edition: SESSION_DATE, today: today(), svgUrl: svg.url, svgName: svg.name, sheetUrl: plans.url, sheetName: plans.name, lede: lede(bond),
      showing: showing ? TEXTS.info.showing(showing) : '', title: bond.name + (showing ? ` (${showing})` : ''),
    });
    node = info.node;
  }
  document.title = `${title} - ${TEXTS.title}`;
  if (shown.verband && ['verband', 'variant', 'steen', 'voeg'].some((k) => shown[k] !== state[k])) announce.textContent = TEXTS.view.announce(bond.name + (showing ? ` (${showing})` : ''));
  if (panel.firstChild !== node) panel.replaceChildren(node);
  shown = { ...state };
}

const panelKey = (s) => `${s.verband}|${s.sleutel}|${s.vergelijk}|${s.begrip === null ? '' : 'g'}`;

// To a new state: write the address, draw, and bring the right part into
// view. A new bond, a tool or a step in the key is a new history entry;
// a view, the colours or a variant replace the current one.
function go(next, { push = null, scrollTo = null } = {}) {
  const before = state;
  // A link in the panel that keeps its place: focus it again after drawing.
  const active = document.activeElement;
  const keep = active && panel.contains(active) ? active.getAttribute('href') : null;
  state = readState(writeState(next), catalog);
  const address = writeState(state);
  const isPush = push ?? (before.verband !== state.verband || before.sleutel !== state.sleutel || before.vergelijk !== state.vergelijk || before.begrip !== state.begrip);
  if (address !== location.search) history[isPush ? 'pushState' : 'replaceState'](null, '', address);
  render();
  arrive(before, scrollTo, keep);
}

function arrive(before, scrollTo, keep = null) {
  const small = phone();
  const wallChanged = before.verband !== state.verband || before.variant !== state.variant || before.steen !== state.steen;
  const leftKey = before.sleutel && !state.sleutel;
  if (small && (scrollTo === 'stage' || (wallChanged && leftKey))) {
    byId('view').scrollIntoView({ block: 'start' });
    stageName.focus({ preventScroll: true });
    return;
  }
  if (panelKey(before) === panelKey(state) && before.begrip === state.begrip) {
    // The same panel, drawn again: the focus goes back where it was.
    if (keep) {
      const again = [...panel.querySelectorAll('a[href]')].find((a) => a.getAttribute('href') === writeState(state)) ?? [...panel.querySelectorAll('a[href]')].find((a) => a.getAttribute('href') === keep);
      again?.focus({ preventScroll: true });
    }
    return;
  }
  if (state.begrip && state.begrip !== 'lijst') {
    glossaryView.entryOf(state.begrip)?.scrollIntoView({ block: 'start' });
  } else {
    panel.scrollTop = 0;
    if (small && scrollTo !== 'stage' && (state.sleutel || state.vergelijk || state.begrip)) panel.scrollIntoView({ block: 'start' });
  }
  const target = state.begrip && state.begrip !== 'lijst' ? glossaryView.entryOf(state.begrip) : panel.querySelector('h2');
  if (target && scrollTo !== 'stage') {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

// Every link inside the page is an address: follow it here.
document.addEventListener('click', (event) => {
  const a = event.target.closest('a[href^="?"]');
  if (!a || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  const [search, place] = a.getAttribute('href').split('#');
  go(readState(search, catalog));
  const target = place ? document.getElementById(place) : null;
  if (target) {
    target.scrollIntoView({ block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

window.addEventListener('popstate', () => {
  const before = state;
  const next = readState(location.search, catalog);
  // Back or Forward between places on the same page (a jump): the panel
  // stays as it is, and the focus goes to the place, or stays.
  if (writeState(next) === writeState(state)) {
    const place = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (place) {
      if (!place.hasAttribute('tabindex')) place.setAttribute('tabindex', '-1');
      place.focus({ preventScroll: true });
    } else if (!panel.contains(document.activeElement)) panel.querySelector('h2')?.focus({ preventScroll: true });
    return;
  }
  state = next;
  render();
  arrive(before, null);
});

// The address always names the bond shown.
if (writeState(state) !== location.search) history.replaceState(null, '', writeState(state));
render();
if (state.begrip && state.begrip !== 'lijst') glossaryView.entryOf(state.begrip)?.scrollIntoView({ block: 'start' });
