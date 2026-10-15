// The page's state lives in the address: which bond, which variant, brick
// and joint, which view, whether the pieces are coloured by kind, and
// which tool the panel shows (the key, the comparison or the glossary).
// Pure: no browser objects.
//
// A value that does not fit the bond is dropped, so an old or a wrong
// address opens the bond as before. One tool at a time: the key before the
// comparison before the glossary.

export const VIEWS = Object.freeze(['voor', 'hoek', 'boven']);
const DEFAULT_VIEW = 'hoek';
// The order of the keys in an address.
export const KEYS = Object.freeze(['verband', 'variant', 'steen', 'voeg', 'zicht', 'kleur', 'sleutel', 'vergelijk', 'begrip']);
export const TOOLS = Object.freeze(['sleutel', 'vergelijk', 'begrip']);

// What an address may name. ids: the bonds, the first is the default;
// variants(id): a bond's variant ids; formats(id): the format ids offered
// with a bond, its own excluded; joints: the joint ids but the default;
// terms: the term ids; keyPath(path): whether a path of the key exists.
export function catalogOf({ ids, variants = () => [], formats = () => [], joints = [], terms = [], keyPath = () => false }) {
  return { ids, variants, formats, joints, terms, keyPath };
}

export function readState(search, catalog) {
  const c = Array.isArray(catalog) ? catalogOf({ ids: catalog }) : catalog;
  const p = new URLSearchParams(search);
  const get = (k) => p.get(k);
  const verband = c.ids.includes(get('verband')) ? get('verband') : c.ids[0];
  const variant = c.variants(verband).includes(get('variant')) ? get('variant') : null;
  const steen = c.formats(verband).includes(get('steen')) ? get('steen') : null;
  const voeg = c.joints.includes(get('voeg')) ? get('voeg') : null;
  const zicht = VIEWS.includes(get('zicht')) ? get('zicht') : DEFAULT_VIEW;
  const kleur = get('kleur') === '1';
  let sleutel = get('sleutel') !== null && c.keyPath(get('sleutel')) ? get('sleutel') : null;
  let vergelijk = !sleutel && c.ids.includes(get('vergelijk')) && get('vergelijk') !== verband ? get('vergelijk') : null;
  const begrip = !sleutel && !vergelijk && (get('begrip') === 'lijst' || c.terms.includes(get('begrip'))) ? get('begrip') : null;
  if (sleutel === '') sleutel = null;
  if (vergelijk === '') vergelijk = null;
  return { verband, variant, steen, voeg, zicht, kleur, sleutel, vergelijk, begrip };
}

export function writeState(state) {
  const params = new URLSearchParams({ verband: state.verband });
  if (state.variant) params.set('variant', state.variant);
  if (state.steen) params.set('steen', state.steen);
  if (state.voeg) params.set('voeg', state.voeg);
  if (state.zicht && state.zicht !== DEFAULT_VIEW) params.set('zicht', state.zicht);
  if (state.kleur) params.set('kleur', '1');
  if (state.sleutel) params.set('sleutel', state.sleutel);
  else if (state.vergelijk) params.set('vergelijk', state.vergelijk);
  else if (state.begrip) params.set('begrip', state.begrip);
  return `?${params}`;
}

// A state with one tool open and the others closed.
export function withTool(state, tool, value) {
  return { ...state, sleutel: null, vergelijk: null, begrip: null, ...(tool ? { [tool]: value } : {}) };
}

// The bond's own wall again: no variant, its own brick and joint.
export function plain(state) {
  return { ...state, variant: null, steen: null, voeg: null };
}
