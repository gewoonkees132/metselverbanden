// The background of a bond: its names, its rule, its repeat, thickness and
// corner, its period and use, each with its strength and its sources;
// then the map, the example buildings and the numbered list of sources.

import { el } from './dom.js';
import { SOURCES } from '../data/verbanden.js';

// The sources a bond cites, in the order they first appear, numbered.
export function citedSources(bond) {
  const order = [];
  const visit = (claim) => {
    for (const id of claim?.sources ?? []) if (!order.includes(id)) order.push(id);
  };
  [bond.otherNames, bond.english, ...Object.values(bond.facts), bond.format.claim].forEach(visit);
  for (const p of bond.map.provinces) visit(p.claim);
  visit(bond.map.note);
  for (const e of bond.map.examples) visit(e.claim);
  return order;
}

export function createInfo(root, { texts, mapNode }) {
  const heading = el('h2', { class: 'info-title', id: 'achtergrond-titel' });
  const facts = el('dl', { class: 'facts' });
  const mapHeading = el('h3', { class: 'info-heading' }, texts.map);
  const examples = el('ul', { class: 'examples' });
  const examplesHeading = el('h3', { class: 'info-heading' }, texts.examples);
  const sourcesHeading = el('h3', { class: 'info-heading' }, texts.sources);
  const sources = el('ol', { class: 'sources' });
  root.append(heading, facts, mapHeading, mapNode, examplesHeading, examples, sourcesHeading, sources);

  function claimNode(claim, numbers) {
    if (!claim) return null;
    const refs = claim.sources.map((id) => numbers.get(id));
    return el('dd', {},
      el('span', { class: 'claim' }, claim.text),
      claim.strength ? el('span', { class: 'cite' }, texts.cite(refs, texts.strength[claim.strength])) : null);
  }

  function show(bond) {
    const numbers = new Map(citedSources(bond).map((id, i) => [id, i + 1]));
    heading.textContent = bond.name;
    const rows = [
      [texts.names, bond.otherNames],
      [texts.english, bond.english ?? { text: texts.noEnglish, strength: null, sources: [] }],
      [texts.rule, bond.facts.rule],
      [texts.repeat, bond.facts.repeat],
      [texts.thickness, bond.facts.thickness],
      [texts.corner, bond.facts.corner],
      [texts.period, bond.facts.period],
      [texts.use, bond.facts.use],
      [texts.format, bond.format.claim],
    ];
    facts.replaceChildren(...rows.filter(([, claim]) => claim).flatMap(([label, claim]) => [el('dt', {}, label), claimNode(claim, numbers)]));
    examples.replaceChildren(...bond.map.examples.map((e) => el('li', {},
      el('a', { class: 'example', href: e.url },
        el('span', { class: 'example-name' }, e.name),
        el('span', { class: 'cite' }, `${e.place}${e.built ? `, ${texts.built(e.built)}` : ''}, ${texts.cite([numbers.get(e.claim.sources[0])], texts.strength[e.claim.strength])}`)))));
    examplesHeading.hidden = bond.map.examples.length === 0;
    examples.hidden = bond.map.examples.length === 0;
    sources.replaceChildren(...[...numbers.keys()].map((id) => {
      const s = SOURCES[id];
      const body = [el('span', { class: 'source-title' }, s.title), el('span', { class: 'cite' }, `${s.publisher}${s.opened ? `, ${texts.opened(s.opened)}` : ''}`)];
      return el('li', { id: `bron-${numbers.get(id)}` }, s.url ? el('a', { class: 'source', href: s.url }, ...body) : el('span', { class: 'source' }, ...body));
    }));
  }

  return { show };
}
