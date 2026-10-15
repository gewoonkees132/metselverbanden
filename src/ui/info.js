// The panel: the background of a bond, field by field. Each claim ends in
// the number of its source and, when it is not verified, one grey word for
// its strength. The terms a section uses are linked once, in a row at its
// foot, so the text itself stays plain. Each course of the rule has its
// plan at the corner and at the free end. Sources are numbered in the order
// they appear; the list closes the panel, with one line for the fields no
// source gives. A variant's own fields stand in for the bond's.

import { el } from './dom.js';
import { splitTerms } from '../terms.js';
import { describeCourses, planSvg } from '../drawing.js';

const DERIVED = 'afleiding';
const FIELD_ORDER = ['recognise', 'lookalikes', 'rule', 'repeat', 'thickness', 'corner', 'end', 'variants', 'period', 'region', 'use', 'names', 'en', 'de', 'fr'];

// The fields shown: the bond's, with a variant's own in their place.
export function fieldsFor(bond, variantId) {
  const v = variantId ? bond.variants.find((x) => x.id === variantId) : null;
  return { ...bond.fields, ...(v?.fields ?? {}) };
}

// The sources a bond cites, in the order they first appear; derivations
// are not numbered.
export function citedSources(bond, sources, extra = [], variantId = null) {
  const order = [];
  const visit = (claim) => {
    if (!claim || claim.gap) return;
    for (const id of claim.sources ?? []) if (!order.includes(id) && sources[id]?.kind !== DERIVED) order.push(id);
  };
  const f = fieldsFor(bond, variantId);
  for (const key of FIELD_ORDER) visit(f[key]);
  for (const l of bond.lookalikes ?? []) visit(l.difference);
  for (const v of bond.variants ?? []) visit(v.claim);
  for (const c of extra) visit(c);
  visit(bond.format.claim);
  for (const p of bond.map.provinces) visit(p.claim);
  for (const e of bond.map.examples) visit(e.claim);
  visit(bond.examplesNote);
  return order;
}

// A Dutch quote inside a field of foreign names is not marked foreign.
const DUTCH = /\b(het|een|ons|van|met|zijn|wordt|verband)\b/i;
const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, (c) => `\\${c}`);

// The text of a field of names, with each name and each foreign quote in
// a span that says its language, so a screen reader reads it as such.
export function foreignParts(text, names, lang) {
  const quotes = [...text.matchAll(/"[^"]+"/g)].filter((m) => !DUTCH.test(m[0])).map((m) => m[0]);
  const marks = [...new Set([...quotes, ...(names ?? [])])].filter(Boolean).sort((a, b) => b.length - a.length);
  if (!marks.length) return [{ text }];
  const re = new RegExp(marks.map(escape).join('|'), 'g');
  const out = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], lang });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

const svgNode = (markup, cls) => {
  const holder = el('span', { class: cls });
  holder.innerHTML = markup;
  return holder;
};

export function createInfo({ texts, sources, terms }) {
  const root = el('div', { class: 'bond-info' });
  let ctx = null;
  let sectionTerms = null; // the terms met in the section being built

  // A claim's text, its source numbers and its strength. Its terms are
  // noted for the section's row of links.
  function claimParts(claim, lang = null) {
    if (!claim || claim.gap) return [];
    if (sectionTerms) for (const p of splitTerms(claim.text, terms)) if (p.term) sectionTerms.add(p.term);
    const nodes = lang ? foreignParts(claim.text, claim.names, lang).map((part) => (part.lang ? el('span', { lang: part.lang }, part.text) : part.text)) : [claim.text];
    const refs = (claim.sources ?? []).map((id) => ctx.numbers.get(id)).filter(Boolean);
    const word = texts.strength[claim.strength];
    if (refs.length || word) {
      nodes.push(' ', el('span', { class: 'mark' },
        refs.length ? el('span', { class: 'ref' }, el('span', { class: 'sr' }, 'bron '), refs.join(', ')) : null,
        word ? el('span', { class: 'strength' }, refs.length ? ' ' : '', el('span', { class: 'sr' }, texts.strengthLabel), word) : null));
    }
    return nodes;
  }
  const para = (claim, cls = 'claim', lang = null) => (claim && !claim.gap ? el('p', { class: cls, lang }, claimParts(claim)) : null);
  const row = (label, claim, lang = null) => (claim && !claim.gap ? [el('dt', {}, label), el('dd', {}, claimParts(claim, lang))] : []);

  // A section: its heading, its body, and the terms its text used.
  function section(id, title, build) {
    sectionTerms = new Set();
    const body = [build()].flat(Infinity).filter(Boolean);
    const used = [...sectionTerms];
    sectionTerms = null;
    if (!body.length) return null;
    const termRow = used.length ? el('p', { class: 'term-row' },
      el('span', { class: 'term-row-label' }, `${texts.termsHere}:`), ' ',
      used.map((tid) => el('a', { class: 'term', href: ctx.hrefOf({ begrip: tid }) }, terms.find((t) => t.id === tid).term))) : null;
    return el('section', { class: 'info-section', id, 'aria-labelledby': `kop-${id}`, tabindex: '-1' },
      el('h3', { class: 'info-heading', id: `kop-${id}` }, title), body, termRow);
  }

  function lookalikes(bond) {
    const list = bond.lookalikes ?? [];
    if (!list.length) return null;
    return [
      el('h4', { class: 'info-subheading' }, texts.lookalikes),
      el('ul', { class: 'alike', role: 'list' }, list.map((l) => {
        const other = ctx.bonds.find((b) => b.id === l.id);
        return el('li', {},
          el('p', { class: 'claim' }, el('strong', {}, `${other.name}. `), claimParts(l.difference)),
          el('a', { class: 'action', href: ctx.hrefOf({ vergelijk: l.id }) }, texts.compareWith(other.name)));
      })),
    ];
  }

  function courses(wall) {
    const lines = describeCourses(wall);
    const corner = ctx.fields.corner?.strength === 'assumed';
    const end = ctx.fields.end?.strength === 'assumed';
    const which = corner && end ? 'both' : corner ? 'corner' : end ? 'end' : null;
    return [
      el('h4', { class: 'info-subheading' }, texts.courses),
      el('p', { class: 'help' }, lines ? texts.plansCaption : texts.wildPlans),
      which ? el('p', { class: 'note derived-note' }, texts.plansDerived(texts.plansDerivedParts[which])) : null,
      wall.repeat?.modules ? el('p', { class: 'help' }, texts.closes((wall.repeat.modules * (wall.format.width + wall.format.joint)) / 2)) : null,
      el('p', { class: 'print-only' }, texts.plansPrint),
      el('ol', { class: 'courses', role: 'list' }, (lines ?? [null, null, null, null]).map((line, i) => el('li', {},
        el('p', { class: 'course-text' }, el('span', { class: 'course-n' }, texts.course(i + 1)), line ? ` ${line}.` : ''),
        el('span', { class: 'plans' },
          el('span', { class: 'plan-fig' }, svgNode(planSvg(wall, { course: i, at: 'hoek', reach: 640, scale: 0.22, label: texts.planCorner(i + 1) }), 'plan-svg'), el('span', { class: 'plan-word' }, texts.planCornerWord)),
          el('span', { class: 'plan-fig' }, svgNode(planSvg(wall, { course: i, at: 'eind', reach: 640, scale: 0.22, label: texts.planEnd(i + 1) }), 'plan-svg'), el('span', { class: 'plan-word' }, texts.planEndWord)))))),
    ];
  }

  function variants(bond, state) {
    const group = (kind, items, quiet) => {
      if (items.length < 2) return null;
      return el('div', { class: 'variant-row', role: 'group', 'aria-labelledby': `soort-${kind}` },
        el('span', { class: 'variant-kind', id: `soort-${kind}` }, texts.variantKinds[kind]),
        el('span', { class: 'variant-links' }, items.map(([name, part, current]) => el('a', {
          class: 'variant', href: ctx.hrefOf(part), 'aria-current': current ? 'true' : 'false',
        }, name))));
    };
    const rule = group('regel', [
      [bond.ownVariant ?? texts.own, { variant: null }, !state.variant],
      ...(bond.variants ?? []).map((v) => [v.name, { variant: v.id }, state.variant === v.id]),
    ], false);
    const steen = group('steen', [
      [bond.format.name, { steen: null }, !state.steen],
      ...ctx.formatIdsOf(bond).map((id) => [ctx.formats[id].name, { steen: id }, state.steen === id]),
    ], true);
    const joints = Object.entries(ctx.joints);
    const voeg = group('voeg', joints.map(([id, j]) => [j.name, { voeg: j.default ? null : id }, j.default ? !state.voeg : state.voeg === id]), true);
    const shown = [];
    if (state.variant) {
      const v = bond.variants.find((x) => x.id === state.variant);
      shown.push(el('p', { class: 'claim' }, el('strong', {}, `${v.name}. `), claimParts(v.claim)));
    }
    const format = state.steen ? ctx.formats[state.steen] : bond.format;
    shown.push(el('p', { class: 'claim' }, el('strong', {}, `${format.name}. `), claimParts(format.claim)));
    if (state.voeg) shown.push(el('p', { class: 'claim' }, el('strong', {}, `${ctx.joints[state.voeg].name}. `), claimParts(ctx.joints[state.voeg].claim)));
    return [
      para(ctx.fields.variants),
      el('p', { class: 'help' }, texts.variantsHelp),
      el('div', { role: 'group', 'aria-label': texts.variants, class: 'variants' }, rule, steen, voeg),
      ...shown,
      el('p', { class: 'note' }, texts.notDrawn),
    ];
  }

  function examples(bond) {
    if (!bond.map.examples.length) return null;
    const refs = [...new Set(bond.map.examples.flatMap((e) => e.claim.sources))].map((id) => ctx.numbers.get(id)).filter(Boolean);
    return [
      el('ul', { class: 'examples', role: 'list' }, bond.map.examples.map((e) => {
        const nr = e.url.match(/(\d+)$/)[1];
        return el('li', {}, el('a', { class: 'example', href: e.url },
          el('span', { class: 'example-name' }, e.name),
          el('span', { class: 'example-line' }, texts.exampleLine(e.place, e.built, nr))));
      })),
      el('p', { class: 'note examples-from' }, texts.examplesFrom, ' ', el('span', { class: 'ref' }, el('span', { class: 'sr' }, 'bron '), refs.join(', '))),
    ];
  }

  function names(f) {
    const items = [...row(texts.otherNames, f.names), ...row(texts.en, f.en, 'en'), ...row(texts.de, f.de, 'de'), ...row(texts.fr, f.fr, 'fr')];
    return items.length ? el('dl', { class: 'facts' }, items) : null;
  }

  function cite(bond) {
    const citation = el('p', { class: 'citation' }, texts.citation({ name: ctx.title, url: ctx.permalink, edition: ctx.edition, today: ctx.today }));
    const status = el('span', { class: 'copied', role: 'status' });
    const copy = el('button', {
      type: 'button', class: 'key',
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(citation.textContent);
          status.textContent = texts.copied;
        } catch {
          const range = document.createRange();
          range.selectNodeContents(citation);
          getSelection().removeAllRanges();
          getSelection().addRange(range);
          status.textContent = texts.copyByHand;
        }
      },
    }, texts.copy);
    const download = el('a', { class: 'key', href: ctx.svgUrl, download: ctx.svgName }, texts.download);
    const print = el('button', { type: 'button', class: 'key', onclick: () => window.print() }, texts.print);
    const sheet = el('a', { class: 'key', href: ctx.sheetUrl, download: ctx.sheetName }, texts.sheet);
    return el('section', { class: 'info-section cite', id: 'citeren', 'aria-label': texts.cite, tabindex: '-1' },
      el('h3', { class: 'info-heading' }, texts.cite), citation, el('div', { class: 'cite-keys' }, copy, download, print, sheet, status),
      el('p', { class: 'help' }, texts.sheetHelp));
  }

  function sourceList(f) {
    // One opened date for every source: said once, under the list.
    const dates = new Set([...ctx.numbers.keys()].map((id) => sources[id].opened).filter(Boolean));
    const once = dates.size === 1 ? [...dates][0] : null;
    const items = [...ctx.numbers.keys()].map((id) => {
      const s = sources[id];
      const body = [el('span', { class: 'source-title', lang: s.lang }, s.title), el('span', { class: 'source-line' }, `${s.publisher}${s.opened && !once ? `, ${texts.opened(s.opened)}` : ''}`)];
      return el('li', { id: `bron-${ctx.numbers.get(id)}` }, s.url ? el('a', { class: 'source', href: s.url }, body) : el('span', { class: 'source' }, body));
    });
    const gaps = Object.entries(f).filter(([, v]) => v?.gap).map(([k]) => texts.gapNames[k] ?? k);
    return el('section', { class: 'info-section', id: 'bronnen', 'aria-labelledby': 'kop-bronnen', tabindex: '-1' },
      el('h3', { class: 'info-heading', id: 'kop-bronnen' }, texts.sources, once ? el('span', { class: 'heading-note' }, ` ${texts.openedAll(once)}`) : null),
      el('ol', { class: 'sources', 'aria-label': texts.sources, role: 'list' }, items),
      el('p', { class: 'note' }, texts.strengths),
      [...ctx.numbers.keys()].some((id) => sources[id]?.status === 'kandidaat') ? el('p', { class: 'note' }, texts.candidateNote) : null,
      [...ctx.numbers.keys()].some((id) => sources[id]?.rce && /Thesaurus/.test(sources[id].title)) ? el('p', { class: 'note' }, texts.haslinghuis) : null,
      gaps.length ? el('p', { class: 'note' }, texts.gaps(gaps.join(', '))) : null);
  }

  // c: { bond, state, wall, bonds, formats, joints, formatIdsOf, hrefOf, permalink, edition, today, svgUrl, svgName, lede, showing, title }
  function show(c) {
    const { bond, state, wall } = c;
    const extra = [state.steen ? c.formats[state.steen].claim : null, state.voeg ? c.joints[state.voeg].claim : null];
    const f = fieldsFor(bond, state.variant);
    ctx = { ...c, fields: f, numbers: new Map(citedSources(bond, sources, extra, state.variant).map((id, i) => [id, i + 1])) };
    const jumps = el('nav', { class: 'jumps', 'aria-label': texts.onPage },
      Object.entries(texts.jumps).map(([id, label]) => el('a', { class: 'jump', href: `#${id}` }, label)));
    root.replaceChildren(...[
      el('header', { class: 'bond-head' },
        el('h2', { class: 'info-title' }, bond.name),
        el('p', { class: 'lede' }, c.lede),
        c.showing ? el('p', { class: 'showing' }, c.showing) : null),
      jumps,
      el('p', { class: 'note strengths-key' }, texts.strengthsTop),
      section('herkennen', texts.recognise, () => [para(f.recognise), lookalikes(bond)]),
      // The variants come next: they change the wall above, so they stand near it.
      section('varianten', texts.variants, () => variants(bond, state)),
      section('laagregel', texts.rule, () => [para(f.rule), courses(wall),
        el('dl', { class: 'facts' }, row(texts.repeat, f.repeat), row(texts.thickness, f.thickness))]),
      section('hoek', texts.cornerEnd, () => el('dl', { class: 'facts' }, row(texts.corner, f.corner), row(texts.end, f.end))),
      section('periode', texts.periodRegion, () => el('dl', { class: 'facts' }, row(texts.period, f.period), row(texts.region, f.region), row(texts.use, f.use))),
      section('voorbeelden', texts.examples, () => [examples(bond), para(bond.examplesNote, 'claim note-claim')]),
      section('namen', texts.names, () => names(f)),
      cite(bond),
      sourceList(f),
    ].filter(Boolean));
    for (const dl of root.querySelectorAll('dl.facts')) if (!dl.children.length) dl.remove();
  }

  return { node: root, show };
}
