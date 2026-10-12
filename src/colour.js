// Colours as hex and as numbers. Pure: no browser objects.

export function normaliseHex(value) {
  if (typeof value !== 'string') return null;
  const match = /^#?([0-9a-fA-F]{6})$/.exec(value.trim());
  return match ? `#${match[1].toLowerCase()}` : null;
}

export function hexToRgb(hex) {
  const h = normaliseHex(hex);
  if (!h) throw new TypeError(`not a colour: ${hex}`);
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgbToHex(rgb) {
  return `#${rgb
    .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
    .join('')}`;
}
