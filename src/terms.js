// Finds the glossary's terms in a text, so each can link to its entry: the
// first time a term appears in a text, in any of its forms, longer forms
// first (koppenlaag before kop). Pure: no browser objects.

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The text in parts: { text } for plain text, { text, term } for a term.
export function splitTerms(text, terms) {
  const forms = terms.flatMap((t) => (t.forms ?? [t.term]).map((form) => ({ form: form.toLowerCase(), id: t.id })))
    .sort((a, b) => b.form.length - a.form.length);
  if (!forms.length || !text) return [{ text: text ?? '' }];
  const re = new RegExp(`(^|[^\\p{L}])(${forms.map((f) => escape(f.form)).join('|')})(?=[^\\p{L}]|$)`, 'giu');
  const parts = [];
  const used = new Set();
  let last = 0;
  for (const m of text.matchAll(re)) {
    const word = m[2];
    const start = m.index + m[1].length;
    const id = forms.find((f) => f.form === word.toLowerCase())?.id;
    if (!id || used.has(id)) continue;
    used.add(id);
    if (start > last) parts.push({ text: text.slice(last, start) });
    parts.push({ text: word, term: id });
    last = start + word.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
