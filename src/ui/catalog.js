// The catalog: a search field and one row per bond, each a link to the
// bond's address with a small drawing of its front, its name and its
// pattern in a few words. The search finds a bond by any of its names:
// Dutch, regional, English, German, French; a whole phrase first, then all
// its words, then names a letter or two off. A row found by another name
// says which. The arrow keys move through the rows; Enter in the field
// opens the first match. On a phone the rows fold under the field and open
// when the visitor types or taps the fold.

import { el, svg } from './dom.js';
import { elevation } from '../bricks.js';
import { TONES } from '../drawing.js';

const THUMB_WIDTH = 112; // px
const THUMB_COURSES = 6;
const THUMB_LENGTH = 1100; // mm of the front shown, from the corner
const PHONE = '(max-width: 759px)';

export const fold = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const words = (text) => fold(text).split(/[^a-z0-9]+/).filter(Boolean);

// Every name a bond goes by, for the search.
export function namesOf(bond) {
  const f = bond.fields ?? {};
  return [bond.name, ...['names', 'en', 'de', 'fr'].flatMap((k) => f[k]?.names ?? [])];
}

// Whether every word of a search is in one of a bond's names.
export function matches(bond, query) {
  const ws = words(query);
  if (!ws.length) return true;
  const hay = namesOf(bond).map(fold).join(' | ');
  return ws.every((w) => hay.includes(w));
}

// The number of single-letter edits from a to b, up to a cap.
function distance(a, b, cap = 3) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row.push(Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    prev = row;
  }
  return prev[b.length];
}
const nearWord = (w, name) => words(name).some((n) => n.startsWith(w) || distance(w, n) <= (w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0));

// The search, in three tiers: a name that holds the whole phrase; names
// that hold every word; names a letter or two off. Each hit with the name
// it was found by, when that is not the bond's own.
export function search(bonds, query) {
  const q = words(query).join(' ');
  if (!q) return { how: 'all', hits: bonds.map((b) => ({ id: b.id, alias: null })) };
  const tier = (test) => bonds.flatMap((b) => {
    const names = namesOf(b);
    const hit = names.find((n) => test(n, names));
    return hit ? [{ id: b.id, alias: hit === b.name ? null : hit }] : [];
  });
  // A name typed without its spaces counts as the name.
  const squeezed = q.replace(/ /g, '');
  const phrase = tier((n) => words(n).join(' ').includes(q) || words(n).join('').includes(squeezed));
  if (phrase.length) return { how: 'phrase', hits: phrase };
  const all = tier((n, names) => words(q).every((w) => names.some((m) => words(m).join(' ').includes(w))) && words(q).some((w) => words(n).join(' ').includes(w)));
  if (all.length) return { how: 'words', hits: all };
  const near = tier((n) => words(q).every((w) => nearWord(w, n)));
  return { how: near.length ? 'near' : 'none', hits: near };
}

// A name this catalog leaves out, or holds as another name of a bond,
// that the search names: its candidate. Only for four letters or more,
// and never for the word every bond shares.
export function outOf(candidates, query, bonds = []) {
  const q = words(query).join(' ');
  const squeezed = q.replace(/ /g, '');
  if (squeezed.length < 4 || 'verbanden'.startsWith(squeezed)) return null;
  if (bonds.some((b) => words(b.name).join('').startsWith(squeezed))) return null;
  // A plural or singular of the name: rollaag finds rollagen.
  const stem = squeezed.length >= 6 ? squeezed.slice(0, -2) : null;
  return candidates.find((c) => {
    const name = words(c.name).join(' ');
    return name.includes(q) || name.replace(/ /g, '').includes(squeezed) || (stem && name.split(' ').some((w) => w.startsWith(stem)));
  }) ?? null;
}

// The drawing of a bond's front, from the same bricks as the 3D view.
export function thumbnail(wall, label, hidden = false) {
  const rects = elevation(wall, { to: THUMB_LENGTH, courses: THUMB_COURSES });
  const top = Math.max(...rects.map((r) => r.z + r.h));
  const k = THUMB_WIDTH / THUMB_LENGTH;
  const h = Math.round(top * k);
  return svg('svg', {
    class: 'thumb', viewBox: `0 0 ${THUMB_WIDTH} ${h}`, width: THUMB_WIDTH, height: h, ...(hidden ? { 'aria-hidden': 'true' } : { role: 'img', 'aria-label': label }),
  }, rects.map((r) => svg('rect', {
    x: (r.x * k).toFixed(2), y: ((top - r.z - r.h) * k).toFixed(2), width: (r.w * k).toFixed(2), height: (r.h * k).toFixed(2),
    fill: TONES[r.kind],
  })));
}

export function createCatalog(root, { bonds, walls, texts, onPick, candidates = [] }) {
  const field = el('input', {
    id: 'zoek', class: 'search', type: 'search', autocomplete: 'off', spellcheck: 'false',
    'aria-describedby': 'aantal zoek-uitleg', placeholder: texts.placeholder,
  });
  const count = el('p', { id: 'aantal', class: 'count', role: 'status' });
  const keyLink = el('a', { class: 'action to-key', href: '?sleutel=begin' }, texts.toKey);
  const keyLink2 = el('a', { class: 'action to-key', href: '?sleutel=begin' }, texts.toKey);
  const near = el('p', { class: 'none', role: 'status', hidden: true }, texts.near);
  const shared = el('p', { class: 'none', role: 'status', hidden: true });
  const none = el('p', { class: 'none', role: 'status', hidden: true }, texts.none, ' ', keyLink2);
  const outNote = el('p', { class: 'none out-note', role: 'status', hidden: true });
  const aliases = new Map();
  const rows = bonds.map((bond) => {
    const alias = el('span', { class: 'bond-alias', hidden: true });
    aliases.set(bond.id, alias);
    const link = el('a', { class: 'bond', href: `?verband=${bond.id}`, 'data-id': bond.id },
      // The drawing says nothing the row's words do not: hidden from the link's name.
      thumbnail(walls.get(bond.id), texts.drawing(bond.name), true),
      el('span', { class: 'bond-words' },
        el('span', { class: 'bond-name' }, bond.name),
        el('span', { class: 'bond-pattern' }, bond.pattern),
        alias));
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      pick(bond.id);
    });
    return el('li', {}, link);
  });
  const list = el('ul', { class: 'bonds', 'aria-label': texts.list, role: 'list' }, rows);
  const summary = el('summary', { class: 'fold-summary' }, texts.fold(bonds.length));
  const details = el('details', { class: 'catalog-fold' }, summary, el('p', { class: 'keys-hint' }, texts.keys), outNote, shared, near, none, list);
  root.append(
    el('label', { class: 'search-label', for: 'zoek' }, texts.search),
    field,
    el('p', { id: 'zoek-uitleg', class: 'search-help' }, texts.searchHelp),
    count,
    el('p', { class: 'unknown' }, texts.unknown, ' ', keyLink),
    details,
  );

  // On a laptop the rows are always open; on a phone they fold.
  const phone = window.matchMedia(PHONE);
  const settle = () => {
    if (!phone.matches) details.open = true;
  };
  phone.addEventListener('change', () => {
    details.open = !phone.matches || Boolean(field.value.trim());
  });
  settle();

  const visible = () => rows.filter((row) => !row.hidden).map((row) => row.firstChild);

  function filter() {
    const found = search(bonds, field.value);
    const byId = new Map(found.hits.map((h) => [h.id, h]));
    bonds.forEach((bond, i) => {
      const hit = byId.get(bond.id);
      rows[i].hidden = !hit;
      const alias = aliases.get(bond.id);
      alias.hidden = !hit?.alias;
      alias.textContent = hit?.alias ? texts.alias(hit.alias) : '';
    });
    // The rows in the order found, the bond's own order within a tier.
    count.textContent = texts.count(found.hits.length, bonds.length);
    // A name of a bond this catalog leaves out: say so, and why.
    const out = outOf(candidates, field.value, bonds);
    const seeId = out ? out.see ?? (out.status === 'in' ? out.bond : null) : null;
    outNote.hidden = !out;
    outNote.replaceChildren(...(out ? [
      out.status === 'in' ? texts.inNote(out.name, out.reason.text) : texts.outNote(out.name, out.reason.text),
      ...(seeId ? [' ', seeLink(seeId)] : []),
    ] : []));
    near.hidden = found.how !== 'near';
    // One name for several bonds: say so, so Enter is not a silent choice.
    const alias = found.hits.length > 1 && found.hits.every((h) => h.alias && h.alias === found.hits[0].alias) ? found.hits[0].alias : null;
    shared.hidden = !alias;
    shared.textContent = alias ? texts.shared(alias, found.hits.length) : '';
    none.hidden = found.how !== 'none';
    if (field.value.trim()) details.open = true;
    settle();
  }

  // From a note on a name to the bond it stands for, as a row would.
  function seeLink(id) {
    const link = el('a', { class: 'action', href: `?verband=${id}` }, texts.see(bonds.find((b) => b.id === id).name));
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      pick(id);
    });
    return link;
  }

  function pick(id) {
    onPick(id);
    // The search has done its work: clear it, so the list is whole again.
    if (field.value) {
      field.value = '';
      filter();
    }
  }

  field.addEventListener('input', filter);
  field.addEventListener('keydown', (event) => {
    const links = visible();
    if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      details.open = true;
      links[0].focus();
    } else if (event.key === 'Enter' && links.length) {
      event.preventDefault();
      // Enter opens a bond typed by its own name, or the one match; with
      // more matches it goes to the list.
      const typed = words(field.value).join(' ');
      const own = links.find((a) => words(bonds.find((b) => b.id === a.dataset.id).name).join(' ') === typed);
      if (own || links.length === 1) pick((own ?? links[0]).dataset.id);
      else {
        details.open = true;
        links[0].focus();
      }
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
    // On a laptop the list scrolls in its column: bring the chosen row into
    // view there, so a link from outside shows where the bond stands.
    const chosen = rows.find((row) => row.firstChild.dataset.id === id)?.firstChild;
    if (!phone.matches && chosen && root.scrollHeight > root.clientHeight) {
      const r = chosen.getBoundingClientRect();
      const z = root.getBoundingClientRect();
      if (r.top < z.top || r.bottom > z.bottom - 24) root.scrollTop += r.top - z.top - (root.clientHeight - r.height) / 2;
    }
  }
  // After a pick on a phone the rows fold again, so the bond comes next.
  function folded() {
    if (phone.matches) details.open = false;
  }
  function setKeyHref(href) {
    keyLink.setAttribute('href', href);
    keyLink2.setAttribute('href', href);
  }
  return { select, folded, setKeyHref };
}
