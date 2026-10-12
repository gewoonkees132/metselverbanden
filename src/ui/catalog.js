// The catalog: a search field and one row per bond, each a link to the
// bond's address with a small drawing of its front, its name and period.
// The arrow keys move through the rows; Enter in the field opens the
// first match.

import { el, svg } from './dom.js';
import { elevation } from '../bricks.js';

const THUMB_WIDTH = 112; // px
const THUMB_COURSES = 6;
const THUMB_LENGTH = 1100; // mm of the front shown, from the corner
// The drawing's tones: strekken light, koppen darker, the cut pieces
// darkest, as in the old drawings of bonds; the joints are the paper.
const THUMB_TONES = { strek: '#c98b6b', kop: '#94533a', halve: '#94533a', klezoor: '#5c3020', drieklezoor: '#5c3020' };

const fold = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// The drawing of a bond's front, from the same bricks as the 3D view.
export function thumbnail(wall, label) {
  const rects = elevation(wall, { to: THUMB_LENGTH, courses: THUMB_COURSES });
  const top = Math.max(...rects.map((r) => r.z + r.h));
  const k = THUMB_WIDTH / THUMB_LENGTH;
  const h = Math.round(top * k);
  return svg('svg', {
    class: 'thumb', viewBox: `0 0 ${THUMB_WIDTH} ${h}`, width: THUMB_WIDTH, height: h, role: 'img', 'aria-label': label,
  }, rects.map((r) => svg('rect', {
    x: (r.x * k).toFixed(2), y: ((top - r.z - r.h) * k).toFixed(2), width: (r.w * k).toFixed(2), height: (r.h * k).toFixed(2),
    fill: THUMB_TONES[r.kind],
  })));
}

export function createCatalog(root, { bonds, walls, texts, onPick }) {
  const field = el('input', {
    id: 'zoek', class: 'search', type: 'search', autocomplete: 'off', spellcheck: 'false', 'aria-describedby': 'aantal',
  });
  const count = el('p', { id: 'aantal', class: 'count', role: 'status' });
  const none = el('p', { class: 'none', hidden: true }, texts.none);
  const rows = bonds.map((bond) => {
    const link = el('a', { class: 'bond', href: `?verband=${bond.id}`, 'data-id': bond.id },
      thumbnail(walls.get(bond.id), texts.elevation(bond.name)),
      el('span', { class: 'bond-words' },
        el('span', { class: 'bond-name' }, bond.name),
        el('span', { class: 'bond-period' }, bond.periodShort)));
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      onPick(bond.id);
    });
    return el('li', {}, link);
  });
  const list = el('ul', { class: 'bonds', 'aria-label': texts.list }, rows);
  root.append(
    el('label', { class: 'search-label', for: 'zoek' }, texts.search),
    field,
    count,
    el('p', { class: 'keys-hint' }, texts.keys),
    none,
    list,
  );

  const visible = () => rows.filter((row) => !row.hidden).map((row) => row.firstChild);

  function filter() {
    const words = fold(field.value).trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    bonds.forEach((bond, i) => {
      const hay = fold([bond.name, bond.english?.text ?? '', ...(bond.otherNames?.text ? [bond.otherNames.text] : []), bond.periodShort].join(' '));
      const match = words.every((w) => hay.includes(w));
      rows[i].hidden = !match;
      if (match) shown++;
    });
    count.textContent = texts.count(shown, bonds.length);
    none.hidden = shown > 0;
  }
  field.addEventListener('input', filter);
  field.addEventListener('keydown', (event) => {
    const links = visible();
    if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      links[0].focus();
    } else if (event.key === 'Enter' && links.length) {
      event.preventDefault();
      onPick(links[0].dataset.id);
    }
  });
  list.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;
    const links = visible();
    const at = links.indexOf(document.activeElement);
    if (at < 0) return;
    event.preventDefault();
    if (event.key === 'Home') links[0].focus();
    else if (event.key === 'End') links[links.length - 1].focus();
    else if (event.key === 'ArrowDown') links[Math.min(links.length - 1, at + 1)].focus();
    else if (at === 0) field.focus();
    else links[at - 1].focus();
  });
  filter();

  function select(id) {
    for (const row of rows) {
      const link = row.firstChild;
      if (link.dataset.id === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
  return { select };
}
