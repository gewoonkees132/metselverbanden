// The page's system: one palette, one type scale, one module. Paper for
// the page, ink for text and lines, grey for the second ink, green for the
// one signal (what is chosen), red for an error only. The brick and mortar
// tones of the preview belong to the bricks and to nothing else.
// style.css declares the same values; a test keeps the two in step.
// Pure: no browser objects.

import { hexToRgb } from './colour.js';

export const PALETTE = Object.freeze({
  paper: '#ffffff', // the page, and the text on a green or ink fill
  ink: '#26221e', // text, lines, points
  grey: '#685f56', // labels, captions, help, what cannot be pressed
  rule: '#e5e0da', // rules and the map's borders
  view: '#f4f2ef', // the air of the 3D view
  green: '#2e6b3c', // what is chosen, and nothing else
  red: '#b3261e', // an error, and nothing else
});

// Type: a caption, the text, the title. Weights: the text and a label.
export const TYPE = Object.freeze([13, 15, 20]);
export const WEIGHTS = Object.freeze([400, 600]);
// Every length is a multiple of the module, but for 1 and 2 px lines.
export const MODULE = 4;

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// The WCAG contrast ratio of two colours, from 1 to 21.
export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// The ink for a mark on a fill: the ink or the paper, whichever stands out more.
export function inkOn(fill) {
  return contrast(PALETTE.ink, fill) >= contrast(PALETTE.paper, fill) ? PALETTE.ink : PALETTE.paper;
}
