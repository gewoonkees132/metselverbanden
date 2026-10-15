// The panel's three tools: the key (Herkennen), the comparison
// (Vergelijking) and the glossary (Begrippen). Each is reached from the
// header on every page; each closes back to the bond. Answers, bonds and
// terms are links to their own addresses, so Back steps back.

import { el } from './dom.js';
import { KEY, walk, extend, back, remaining, BEGIN } from '../key.js';
import { elevationSvg, planSvg } from '../drawing.js';
import { splitTerms } from '../terms.js';

// An SVG string as a node.
function markup(svgText, cls) {
  const holder = el('span', { class: cls });
  holder.innerHTML = svgText;
  return holder;
}

// The terms in a few texts, each opening its definition in place, so the
// key stays where it is.
function termNotes(label, texts, terms) {
  const ids = new Set();
  for (const t of texts) for (const p of splitTerms(t, terms)) if (p.term) ids.add(p.term);
  if (!ids.size) return null;
  return el('div', { class: 'term-notes' }, el('p', { class: 'term-row-label' }, `${label}:`),
    [...ids].map((id) => {
      const t = terms.find((x) => x.id === id);
      return el('details', { class: 'term-note' }, el('summary', {}, t.term), el('p', { class: 'claim' }, t.definition.text));
    }));
}

// The terms in a few texts, as a row of links.
function termRow(label, texts, terms, hrefOf) {
  const ids = new Set();
  for (const t of texts) for (const p of splitTerms(t, terms)) if (p.term) ids.add(p.term);
  if (!ids.size) return null;
  return el('p', { class: 'term-row' }, el('span', { class: 'term-row-label' }, `${label}:`), ' ',
    [...ids].map((id) => el('a', { class: 'term', href: hrefOf({ begrip: id }) }, terms.find((t) => t.id === id).term)));
}

export function createKeyView({ texts, bonds, terms, wallOf, candidates = [] }) {
  const root = el('section', { class: 'tool key-tool', 'aria-label': texts.region });

  function answerDrawing(bondId) {
    const wall = wallOf(bondId);
    return markup(elevationSvg(wall, { length: 700, courses: 4, scale: 0.16, numbers: false }), 'answer-drawing');
  }

  // c: { path, current (the bond shown), hrefOf }
  function show({ path, hrefOf, current }) {
    const at = walk(path);
    const nameOf = (id) => bonds.find((b) => b.id === id).name;
    const trail = at.trail.length ? el('ol', { class: 'trail', 'aria-label': texts.trail }, at.trail.map((t) => el('li', {}, t.answer.text))) : null;
    const nav = [];
    if (path !== BEGIN) nav.push(el('a', { class: 'action', href: hrefOf({ sleutel: back(path), verband: current }) }, texts.back));
    if (at.bond || at.out) nav.push(el('a', { class: 'action', href: hrefOf({ sleutel: BEGIN }) }, texts.restart));
    nav.push(el('a', { class: 'action', href: hrefOf({ sleutel: null }) }, texts.close));
    if (at.bond) {
      const bond = bonds.find((b) => b.id === at.bond);
      const alike = bond.lookalikes?.[0];
      root.replaceChildren(...[
        el('h2', { class: 'info-title', id: 'sleutel-titel' }, texts.result(bond.name)),
        trail,
        markup(elevationSvg(wallOf(bond.id), { length: 1000, courses: 6, scale: 0.3, numbers: false, label: `Tekening van ${bond.name}` }), 'result-drawing'),
        el('p', { class: 'help' }, texts.resultHelp),
        el('div', { class: 'tool-actions' },
          el('a', { class: 'key', href: hrefOf({ verband: bond.id, sleutel: null }) }, texts.open(bond.name)),
          alike ? el('a', { class: 'action', href: hrefOf({ verband: bond.id, sleutel: null, vergelijk: alike.id }) }, `Vergelijk met ${nameOf(alike.id)}`) : null),
        el('nav', { class: 'tool-nav', 'aria-label': texts.region }, nav),
      ].filter(Boolean));
      return;
    }
    // A way out: the wall fits none of the answers.
    if (at.out) {
      const cand = candidates.find((k) => k.name.toLowerCase() === at.out);
      root.replaceChildren(...[
        el('h2', { class: 'info-title', id: 'sleutel-titel' }, cand ? texts.outNamed(cand.name) : texts.outTitle),
        trail,
        el('p', { class: 'claim' }, cand ? cand.reason.text : texts.outAny),
        el('p', { class: 'help' }, texts.outMore),
        el('div', { class: 'tool-actions' }, el('a', { class: 'action', href: `${hrefOf({ sleutel: null, begrip: 'lijst' })}#niet-opgenomen` }, texts.outList)),
        el('nav', { class: 'tool-nav', 'aria-label': texts.region }, nav),
      ].filter(Boolean));
      return;
    }
    const q = KEY.questions[at.question];
    const still = remaining(at.question);
    root.replaceChildren(...[
      el('p', { class: 'tool-kicker' }, `${texts.region}: ${texts.step(at.trail.length + 1).toLowerCase()}`),
      el('h2', { class: 'info-title', id: 'sleutel-titel' }, q.text),
      el('p', { class: 'help' }, q.help),
      trail,
      el('div', { role: 'group', 'aria-label': texts.answers, class: 'answers' }, q.answers.map((a) => el('a', {
        class: 'answer', href: hrefOf({ sleutel: extend(path, a.id), verband: a.bond ?? current }),
      }, a.drawing ? answerDrawing(a.drawing) : el('span', { class: 'answer-none', 'aria-hidden': 'true' }, '?'), el('span', { class: 'answer-text' }, a.text)))),
      at.trail.length ? el('p', { class: 'help' }, texts.remaining(still.map(nameOf).join(', '))) : null,
      termNotes(texts.termsHere, [q.text, q.help, ...q.answers.map((a) => a.text)], terms),
      el('nav', { class: 'tool-nav', 'aria-label': texts.region }, nav),
    ].filter(Boolean));
  }
  return { node: root, show };
}

export function createCompareView({ texts, infoTexts, bonds, sources }) {
  const root = el('section', { class: 'tool compare-tool', 'aria-label': texts.region });
  // c: { a, b, wallA, wallB, hrefOf, onPick }
  function show({ a, b, wallA, wallB, hrefOf, onPick }) {
    const select = el('select', { id: 'vergelijk-met', class: 'select' }, bonds.filter((x) => x.id !== a.id).map((x) => el('option', { value: x.id, selected: x.id === b.id }, x.name)));
    // The choice applies with the button, not on every arrow key.
    const apply = el('button', { type: 'button', class: 'key', onclick: () => onPick(select.value) }, texts.apply);
    const pair = (a.lookalikes ?? []).find((l) => l.id === b.id) ?? (b.lookalikes ?? []).find((l) => l.id === a.id);
    const numbers = new Map();
    const text = (claim) => {
      if (!claim || claim.gap) return texts.noSource;
      const refs = (claim.sources ?? []).filter((id) => sources[id]?.kind !== 'afleiding').map((id) => {
        if (!numbers.has(id)) numbers.set(id, numbers.size + 1);
        return numbers.get(id);
      });
      const word = infoTexts.strength[claim.strength];
      return [claim.text, ' ', el('span', { class: 'mark' },
        refs.length ? el('span', { class: 'ref' }, el('span', { class: 'sr' }, 'bron '), refs.join(', ')) : null,
        word ? el('span', { class: 'strength' }, ' ', el('span', { class: 'sr' }, infoTexts.strengthLabel), word) : null)];
    };
    // The same length and scale for both drawings, so the courses line up.
    const length = Math.min(wallA.legs.A, wallB.legs.A, 1400);
    const drawing = (bond, wall) => el('figure', { class: 'pair-figure' },
      el('figcaption', { class: 'pair-name' }, `${bond.name}, ${wall.format.name.toLowerCase()}`),
      markup(elevationSvg(wall, { length, courses: 6, scale: 0.24, numbers: true, label: `Aanzicht van ${bond.name}` }), 'pair-drawing'));
    // Field by field, each bond's text at the panel's full width.
    const rows = Object.entries(texts.rows).flatMap(([key, label]) => [
      el('dt', {}, label),
      el('dd', {}, el('p', { class: 'claim' }, el('strong', {}, `${a.name}: `), text(a.fields[key]))),
      el('dd', {}, el('p', { class: 'claim' }, el('strong', {}, `${b.name}: `), text(b.fields[key])))]);
    const list = el('ol', { class: 'sources compact', 'aria-label': texts.sources, role: 'list' });
    root.replaceChildren(...[
      el('p', { class: 'tool-kicker' }, texts.region),
      el('h2', { class: 'info-title', id: 'vergelijk-titel' }, texts.title(a.name, b.name)),
      el('div', { class: 'field' }, el('label', { for: 'vergelijk-met' }, texts.with), el('span', { class: 'field-row' }, select, apply)),
      el('h3', { class: 'info-heading' }, texts.difference),
      pair ? el('p', { class: 'claim' }, text(pair.difference)) : el('p', { class: 'claim' }, texts.noDifference),
      el('div', { class: 'pair' }, drawing(a, wallA), drawing(b, wallB)),
      el('p', { class: 'help' }, texts.sameBrick(wallA.format.name)),
      el('dl', { class: 'facts compare-list', 'aria-label': texts.title(a.name, b.name) }, rows),
      el('h3', { class: 'info-heading' }, texts.sources),
      list,
      el('nav', { class: 'tool-nav', 'aria-label': texts.region }, el('a', { class: 'action', href: hrefOf({ vergelijk: null }) }, texts.back(a.name))),
    ].filter(Boolean));
    list.replaceChildren(...[...numbers].map(([id]) => {
      const s = sources[id];
      return el('li', {}, s.url ? el('a', { class: 'source', href: s.url }, el('span', { class: 'source-title', lang: s.lang }, s.title), el('span', { class: 'source-line' }, s.publisher)) : el('span', { class: 'source' }, s.title));
    }));
  }
  return { node: root, show };
}

export function createGlossaryView({ texts, infoTexts, terms, sources, wallOf, candidates = [], bondName = (id) => id }) {
  const root = el('section', { class: 'tool glossary-tool', 'aria-label': texts.region });
  let built = false;
  const entries = new Map();
  const backs = new Map(); // per entry: the line with the way back, shown at the chosen one
  const sees = []; // the links from a name left out to its bond
  const sorted = [...terms].sort((p, q) => p.term.localeCompare(q.term, 'nl'));

  function drawingOf(t) {
    const d = t.drawing;
    if (!d) return null;
    const wall = wallOf(d.bond, d.variant);
    const highlight = d.kinds ? (r) => d.kinds.includes(r.kind) : d.course !== undefined ? (r) => r.z !== undefined && Math.round(r.z / (wall.format.height + wall.format.bed)) === d.course : null;
    const svgText = d.view === 'plan'
      ? planSvg(wall, { course: d.course ?? 0, at: d.end ? 'eind' : 'hoek', reach: 640, scale: 0.28, highlight: d.kinds ? (r) => d.kinds.includes(r.kind) : null })
      : elevationSvg(wall, { length: 760, courses: 4, scale: 0.28, numbers: false, highlight });
    return markup(svgText, 'term-drawing');
  }

  // A name left out that stands for a bond of the catalog links to it.
  function see(k) {
    const id = k.see ?? (k.status === 'in' ? k.bond : null);
    if (!id) return null;
    const link = el('a', { class: 'action' }, texts.see(bondName(id)));
    sees.push([link, id]);
    return el('p', {}, link);
  }

  // The letters the terms begin with, each a link to its first term.
  function index() {
    const first = new Map();
    for (const t of sorted) {
      const letter = t.term[0].toLowerCase();
      if (!first.has(letter)) first.set(letter, t.id);
    }
    return el('nav', { class: 'letters', 'aria-label': texts.index }, [...first].map(([letter, id]) => el('a', { class: 'jump', href: `#begrip-${id}` }, letter)), el('a', { class: 'jump', href: '#niet-opgenomen' }, texts.out));
  }

  function build() {
    const numbers = new Map();
    const list = el('dl', { class: 'terms' }, sorted.map((t) => {
      const refs = (t.definition.sources ?? []).filter((id) => sources[id]?.kind !== 'afleiding').map((id) => {
        if (!numbers.has(id)) numbers.set(id, numbers.size + 1);
        return numbers.get(id);
      });
      const word = infoTexts.strength[t.definition.strength];
      const back = el('p', { class: 'entry-back', hidden: true });
      backs.set(t.id, back);
      const entry = el('div', { class: 'term-entry', id: `begrip-${t.id}`, tabindex: '-1' },
        el('dt', {}, el('dfn', {}, t.term)),
        el('dd', {}, drawingOf(t), el('p', { class: 'claim' }, t.definition.text, ' ', el('span', { class: 'mark' },
          refs.length ? el('span', { class: 'ref' }, el('span', { class: 'sr' }, 'bron '), refs.join(', ')) : null,
          word ? el('span', { class: 'strength' }, ' ', el('span', { class: 'sr' }, infoTexts.strengthLabel), word) : null)), back));
      entries.set(t.id, entry);
      return entry;
    }));
    const srcs = el('ol', { class: 'sources compact', 'aria-label': texts.sources, role: 'list' }, [...numbers].map(([id]) => {
      const s = sources[id];
      return el('li', {}, el('a', { class: 'source', href: s.url }, el('span', { class: 'source-title', lang: s.lang }, s.title), el('span', { class: 'source-line' }, `${s.publisher}, geopend ${s.opened}`)));
    }));
    const outList = el('dl', { class: 'terms candidates' }, candidates.map((k) => {
      const refs = (k.reason.sources ?? []).filter((id) => sources[id]?.kind !== 'afleiding').map((id) => {
        if (!numbers.has(id)) numbers.set(id, numbers.size + 1);
        return numbers.get(id);
      });
      return el('div', { class: 'term-entry' },
        el('dt', {}, k.name, el('span', { class: 'candidate-status' }, ` (${k.status === 'in' ? `${texts.status.in}: ${bondName(k.bond)}` : texts.status.out})`)),
        el('dd', {}, el('p', { class: 'claim' }, k.reason.text, ' ', el('span', { class: 'mark' }, el('span', { class: 'ref' }, el('span', { class: 'sr' }, 'bron '), refs.join(', ')))), see(k)));
    }));
    srcs.replaceChildren(...[...numbers].map(([id]) => {
      const s = sources[id];
      return el('li', {}, el('a', { class: 'source', href: s.url }, el('span', { class: 'source-title', lang: s.lang }, s.title), el('span', { class: 'source-line' }, `${s.publisher}, geopend ${s.opened}`)));
    }));
    built = { list, srcs, outList, letters: index() };
  }

  // c: { term ('lijst' or an id), bondName, hrefOf }
  function show({ term, bondName, hrefOf }) {
    if (!built) build();
    for (const [id, entry] of entries) entry.classList.toggle('current', id === term);
    const backLink = () => el('a', { class: 'action', href: hrefOf({ begrip: null }) }, texts.back(bondName));
    // The way back stands at the chosen entry too, not only at the top.
    for (const [id, line] of backs) {
      line.hidden = id !== term;
      line.replaceChildren(...(id === term ? [backLink()] : []));
    }
    for (const [link, id] of sees) link.setAttribute('href', hrefOf({ verband: id, begrip: null }));
    root.replaceChildren(
      el('h2', { class: 'info-title', id: 'begrippen-titel' }, texts.region),
      el('p', { class: 'help' }, texts.intro),
      el('nav', { class: 'tool-nav', 'aria-label': texts.region }, backLink()),
      built.letters,
      built.list,
      el('h3', { class: 'info-heading', id: 'niet-opgenomen', tabindex: '-1' }, texts.out),
      el('p', { class: 'help' }, texts.outIntro),
      built.outList,
      el('h3', { class: 'info-heading' }, texts.sources),
      built.srcs,
      el('p', { class: 'tool-nav' }, backLink()),
    );
  }
  const entryOf = (id) => entries.get(id) ?? null;
  return { node: root, show, entryOf };
}
