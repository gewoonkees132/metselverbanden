// The page's state lives in the address: which bond, which view, and
// whether the pieces are coloured by kind. Pure: no browser objects.

export const VIEWS = Object.freeze(['voor', 'hoek', 'boven']);
const DEFAULT_VIEW = 'hoek';

export function readState(search, ids) {
  const params = new URLSearchParams(search);
  const verband = ids.includes(params.get('verband')) ? params.get('verband') : ids[0];
  const zicht = VIEWS.includes(params.get('zicht')) ? params.get('zicht') : DEFAULT_VIEW;
  const kleur = params.get('kleur') === '1';
  return { verband, zicht, kleur };
}

export function writeState({ verband, zicht, kleur }) {
  const params = new URLSearchParams({ verband });
  if (zicht !== DEFAULT_VIEW) params.set('zicht', zicht);
  if (kleur) params.set('kleur', '1');
  return `?${params}`;
}
