// Drawings of a wall as SVG markup, from the bricks of bricks.js: the
// elevation of the front of leg A with its courses numbered from the
// bottom, and one course seen from above, at the corner or at the free
// end. The page shows and the visitor downloads the same markup. Also the
// rule course by course, read from the same bricks. Pure: strings only,
// no browser objects.

import { elevation, plan, moduleOf } from './bricks.js';

// The drawing's tones: strekken light, koppen darker, the cut pieces
// darkest, as in the old drawings of bonds; the joints are the paper.
export const TONES = Object.freeze({ strek: '#c98b6b', kop: '#94533a', halve: '#94533a', klezoor: '#5c3020', drieklezoor: '#5c3020' });
export const TONE_NAMES = Object.freeze([['strek', 'strek'], ['kop', 'kop of halve steen'], ['klezoor', 'klezoor of drieklezoor']]);
const FADED = '#ede4dd'; // the pieces a drawing does not point at
const INK = '#26221e';
const GREY = '#685f56';
const NUMBERS = 24; // px: the gutter of the course numbers

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const n2 = (v) => (Math.round(v * 100) / 100).toString();

function rectsMarkup(rects, { k, top, dx, highlight }) {
  return rects.map((r) => {
    const on = !highlight || highlight(r);
    const fill = on ? TONES[r.kind] : FADED;
    const stroke = highlight && on ? ` stroke="${INK}" stroke-width="1.5"` : '';
    return `<rect x="${n2(dx + r.x * k)}" y="${n2((top - r.z - r.h) * k)}" width="${n2(r.w * k)}" height="${n2(r.h * k)}" fill="${fill}"${stroke} data-kind="${r.kind}"/>`;
  }).join('');
}

// The front of leg A, from the corner, as an SVG. scale: px per mm.
// numbers: the course numbers in a gutter at the left. highlight(rect):
// the pieces drawn in their tone, the rest faded. standalone: a file of
// its own, with its namespace, a white ground, a title, a legend, a scale
// bar of one metre and a caption.
export function elevationSvg(wall, {
  length = 1100, courses = Math.min(wall.courses, 6), scale = 0.3, numbers = true, highlight = null,
  label = '', standalone = false, title = '', subtitle = '', caption = '',
} = {}) {
  const rects = elevation(wall, { to: length, courses });
  const top = Math.max(...rects.map((r) => r.z + r.h));
  const step = wall.format.height + wall.format.bed;
  const dx = numbers ? NUMBERS : 0;
  const drawn = Math.min(length, wall.legs.A);
  const width = Math.ceil(dx + drawn * scale);
  const body = rectsMarkup(rects, { k: scale, top, dx, highlight });
  const nums = numbers ? Array.from({ length: courses }, (_, c) => {
    const y = (top - c * step - wall.format.height / 2) * scale;
    return `<text x="${dx - 8}" y="${n2(y)}" text-anchor="end" dominant-baseline="central" font-size="13" fill="${GREY}">${c + 1}</text>`;
  }).join('') : '';
  const role = label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"';
  if (!standalone) {
    const height = Math.ceil(top * scale);
    return `<svg class="drawing" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"${role}>${body}${nums}</svg>`;
  }
  const font = 'font-family="system-ui, sans-serif"';
  const head = 52;
  const wallH = Math.ceil(top * scale);
  const legendY = head + wallH + 28;
  const metre = 1000 * scale;
  const legend = TONE_NAMES.map(([kind, name], i) => {
    const x = dx + i * 190;
    return `<rect x="${x}" y="${legendY - 11}" width="14" height="14" fill="${TONES[kind]}"/><text x="${x + 20}" y="${legendY}" font-size="12" fill="${INK}">${esc(name)}</text>`;
  }).join('');
  const barY = legendY + 28;
  const bar = `<rect x="${dx}" y="${barY - 6}" width="${n2(metre)}" height="6" fill="${INK}"/><text x="${dx}" y="${barY + 14}" font-size="12" fill="${INK}">0</text><text x="${n2(dx + metre)}" y="${barY + 14}" font-size="12" fill="${INK}" text-anchor="end">1 m</text>`;
  const height = barY + 24 + (caption ? 20 : 0);
  const fullWidth = Math.max(width, dx + 3 * 190);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${height}" width="${fullWidth}" height="${height}"${role}>`
    + `<title>${esc(label || title)}</title><rect width="${fullWidth}" height="${height}" fill="#ffffff"/>`
    + `<g ${font}>`
    + (title ? `<text x="0" y="18" font-size="15" font-weight="600" fill="${INK}">${esc(title)}</text>` : '')
    + (subtitle ? `<text x="0" y="38" font-size="12" fill="${GREY}">${esc(subtitle)}</text>` : '')
    + `<g transform="translate(0 ${head})">${body}${nums}</g>`
    + legend + bar
    + (caption ? `<text x="0" y="${height - 6}" font-size="11" fill="${GREY}">${esc(caption)}</text>` : '')
    + '</g></svg>\n';
}

// One course from above, as an SVG: at the corner (leg A to the right, leg
// B down, the front of A at the top) or at the free end of leg A.
export function planSvg(wall, { course = 0, at = 'hoek', reach = 640, scale = 0.3, highlight = null, label = '' } = {}) {
  const t = wall.thickness;
  const x0 = at === 'eind' ? Math.max(0, wall.legs.A - reach) : 0;
  const rects = plan(wall, course)
    .filter((r) => (at === 'eind' ? r.x + r.w > x0 && r.y < t + 1 : r.x < reach && r.y < reach))
    .map((r) => {
      const x = Math.max(r.x, x0) - x0;
      const w = Math.min(r.x + r.w, x0 + reach) - Math.max(r.x, x0);
      return { ...r, x, w, h: at === 'eind' ? r.h : Math.min(r.y + r.h, reach) - r.y };
    });
  const width = Math.ceil(reach * scale);
  const height = Math.ceil((at === 'eind' ? t : reach) * scale);
  const body = rects.map((r) => {
    const on = !highlight || highlight(r);
    const stroke = highlight && on ? ` stroke="${INK}" stroke-width="1.5"` : '';
    return `<rect x="${n2(r.x * scale)}" y="${n2(r.y * scale)}" width="${n2(r.w * scale)}" height="${n2(r.h * scale)}" fill="${on ? TONES[r.kind] : FADED}"${stroke} data-kind="${r.kind}"/>`;
  }).join('');
  const role = label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"';
  return `<svg class="drawing plan" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"${role}>${body}</svg>`;
}

const WORDS = { strek: ['strek', 'strekken'], kop: ['kop', 'koppen'], klezoor: ['klezoor', 'klezoren'], drieklezoor: ['drieklezoor', 'drieklezoren'], halve: ['halve steen', 'halve stenen'] };
const COUNT = ['', 'een', 'twee', 'drie', 'vier'];
const PIECES_OF = { klezoor: 1, kop: 2, halve: 2, drieklezoor: 3, strek: 4 };
const SHIFTS = { 1: 'een klezoor', 2: 'een halve steen', 3: 'drie klezoren' };

// The pieces on the front of leg A in one course, from the corner.
function frontOf(wall, course) {
  return wall.bricks.filter((b) => b.course === course && b.y0 === 0).sort((p, q) => p.x0 - q.x0);
}

// What a piece shows on the front of leg A: a piece of leg B shows its
// end (as wide as a kop) or, for a kop of leg B, its side (as long as a strek).
function faceOf(b, wall) {
  if (b.leg === 'A') return b.kind === 'halve' ? 'kop' : b.kind;
  return b.x1 - b.x0 > wall.format.width + 1 ? 'strek' : 'kop';
}

// The smallest repeating run of kinds in the middle of a course.
function runOf(kinds) {
  for (let p = 1; p <= kinds.length - 2; p++) {
    if (kinds.every((k, i) => k === kinds[i % p])) return kinds.slice(0, p);
  }
  return null;
}

function runWords(run) {
  if (run.length === 1) return `alleen ${WORDS[run[0]][1]}`;
  const counts = new Map();
  for (const k of run) counts.set(k, (counts.get(k) ?? 0) + 1);
  if (counts.size === 2 && counts.get('kop') === 1 && counts.has('strek')) {
    const n = counts.get('strek');
    return n === 1 ? 'om en om een strek en een kop' : `telkens ${COUNT[n]} strekken en een kop`;
  }
  return run.map((k) => WORDS[k][0]).join(', ');
}

// Whether the faces from index i on follow the run, in some rotation.
function followsRun(faces, i, run) {
  const L = run.length;
  if (faces.length - i < 2 * L) return false;
  for (let r = 0; r < L; r++) {
    let ok = true;
    for (let k = 0; k < 2 * L && ok; k++) ok = faces[i + k] === run[(r + k) % L];
    if (ok) return true;
  }
  return false;
}

// The pieces at the head of a course, from the corner, in words.
function headWords(head, wall, course) {
  const parts = [];
  const behind = (b) => wall.bricks.some((q) => q.course === course && q.leg === b.leg && q.kind === b.kind
    && Math.abs(q.x0 - b.x0) < 0.5 && q.y0 > 0 && q.y0 < wall.thickness);
  for (let i = 0; i < head.length; i++) {
    const b = head[i];
    if (b.leg === 'A') {
      parts.push(`een ${WORDS[b.kind][0]}${behind(b) && b.kind !== 'kop' ? ` met een tweede ${WORDS[b.kind][0]} erachter` : ''}`);
      continue;
    }
    // Pieces of the wall at right angles: count the same ones together.
    let n = 1;
    while (head[i + n] && head[i + n].leg === b.leg && head[i + n].kind === b.kind) n++;
    const side = faceOf(b, wall) === 'strek';
    parts.push(side
      ? `de zijkant van ${n === 1 ? 'een kop' : `${COUNT[n]} koppen`} uit de muur haaks erop`
      : `de kop${n === 1 ? '' : 'pen'} van ${n === 1 ? `een ${WORDS[b.kind][0]}` : `${COUNT[n]} ${WORDS[b.kind][1]}`} uit de muur haaks erop`);
    i += n - 1;
  }
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} en ${parts[parts.length - 1]}`;
}

// The rule course by course, as the model lays it: per course, what lies
// at the corner (the pieces of both walls, and any piece behind them), what
// runs along the wall after it, and how it lies against the last course
// below of the same kind. At least four courses, so a repeat of two shows
// twice. Wild verband has no repeat: null.
export function describeCourses(wall) {
  if (!wall.repeat) return null;
  const m = moduleOf(wall.format);
  const t = wall.thickness;
  const n = Math.min(wall.courses, Math.max(wall.repeat.courses, 4));
  const inMiddle = (b) => b.x0 > t + 8 * m && b.x1 < wall.legs.A - 8 * m;
  const seen = [];
  const out = [];
  for (let c = 0; c < n; c++) {
    const front = frontOf(wall, c);
    const faces = front.map((b) => faceOf(b, wall));
    const middle = front.filter(inMiddle);
    const halves = middle.some((b) => b.kind === 'halve');
    const run = runOf(middle.map((b) => faceOf(b, wall))) ?? middle.slice(0, 4).map((b) => faceOf(b, wall));
    const words = runWords(run) + (halves ? ', de koppen halve stenen' : '');
    // The head: the other wall's pieces at the corner, then this wall's
    // pieces until the run begins.
    let i = 0;
    while (i < front.length && front[i].leg !== 'A') i++;
    while (i < front.length && !followsRun(faces, i, run)) i++;
    const head = front.slice(0, Math.max(1, i));
    const period = run.reduce((sum, k) => sum + PIECES_OF[k], 0);
    const first = Math.round(middle[0].x0 / m);
    const parts = [`aan de hoek ${headWords(head, wall, c)}`, `verder ${words}`];
    const earlier = [...seen].reverse().find((e) => e.words === words);
    const same = seen.find((e) => e.words === words && (((first - e.first) % period) + period) % period === 0);
    const kop = run.length > 1 ? middle.find((b) => faceOf(b, wall) === 'kop') : null;
    if (earlier && kop) {
      const mid = (kop.x0 + kop.x1) / 2;
      const under = frontOf(wall, earlier.c).find((b) => b.x0 < mid && mid < b.x1);
      const centred = under && Math.abs((under.x0 + under.x1) / 2 - mid) < 1;
      if (!under) parts.push(`de koppen boven de voeg tussen twee strekken van laag ${earlier.c + 1}`);
      else if (under && faceOf(under, wall) === 'strek' && centred) parts.push(`de koppen midden op de strekken van laag ${earlier.c + 1}`);
      else if (under && faceOf(under, wall) === 'kop' && centred) parts.push(`de koppen recht boven de koppen van laag ${earlier.c + 1}`);
      else parts.push(`verschoven tegenover laag ${earlier.c + 1}`);
    } else if (same && same !== earlier) {
      parts.push(`recht boven laag ${same.c + 1}`);
    } else if (earlier) {
      const shift = (((first - earlier.first) % period) + period) % period;
      const d = Math.min(shift, period - shift);
      const way = d * 2 === period ? '' : shift === d ? ' van de hoek af' : ' naar de hoek toe';
      if (d === 0) parts.push(`recht boven laag ${earlier.c + 1}`);
      else parts.push(`${SHIFTS[d] ?? `${d} klezoren`}${way} verschoven tegenover laag ${earlier.c + 1}`);
    }
    seen.push({ c, words, first });
    out.push(parts.join('; '));
  }
  return out;
}

// A sheet for the site: every course of the repeat seen from above, at the
// corner and at the free end, large enough to read a klezoor, each with its
// course text; a legend and a metre bar. A file of its own, to print.
const SHEET_SCALE = 0.3; // px per mm: a klezoor of a Waal brick is 13.5 px
const SHEET_REACH = 900; // mm of the wall in each plan
const SHEET_GAP = 32;
const wrap = (text, max = 86) => {
  const out = [''];
  for (const w of String(text).split(' ')) {
    if ((out[out.length - 1] + ' ' + w).trim().length > max) out.push(w);
    else out[out.length - 1] = (out[out.length - 1] + ' ' + w).trim();
  }
  return out;
};

export function planSheetSvg(wall, { courses = null, title = '', subtitle = '', lines = null } = {}) {
  const n = courses ?? wall.repeat?.courses ?? 4;
  const k = SHEET_SCALE;
  const font = 'font-family="system-ui, sans-serif"';
  const side = Math.ceil(SHEET_REACH * k);
  const width = 2 * side + SHEET_GAP;
  const parts = [];
  let y = 56;
  for (let c = 0; c < n; c++) {
    parts.push(`<text x="0" y="${y + 14}" font-size="13" font-weight="600" fill="${INK}">Laag ${c + 1}</text>`);
    y += 20;
    for (const line of lines?.[c] ? wrap(`${lines[c]}.`) : []) {
      parts.push(`<text x="0" y="${y + 12}" font-size="12" fill="${INK}">${esc(line)}</text>`);
      y += 16;
    }
    y += 4;
    const corner = planSvg(wall, { course: c, at: 'hoek', reach: SHEET_REACH, scale: k, label: `Laag ${c + 1} van boven, bij de hoek` });
    const end = planSvg(wall, { course: c, at: 'eind', reach: SHEET_REACH, scale: k, label: `Laag ${c + 1} van boven, bij het vrije eind` });
    const endH = Math.ceil(wall.thickness * k);
    parts.push(corner.replace('<svg class="drawing plan"', `<svg x="0" y="${y}" class="drawing plan"`));
    parts.push(end.replace('<svg class="drawing plan"', `<svg x="${side + SHEET_GAP}" y="${y}" class="drawing plan"`));
    parts.push(`<text x="0" y="${y + side + 16}" font-size="12" fill="${GREY}">hoek</text>`);
    parts.push(`<text x="${side + SHEET_GAP}" y="${y + endH + 16}" font-size="12" fill="${GREY}">vrij eind</text>`);
    y += side + 32;
  }
  const legend = TONE_NAMES.map(([kind, name], i) => {
    const x = i * 190;
    return `<rect x="${x}" y="${y}" width="14" height="14" fill="${TONES[kind]}"/><text x="${x + 20}" y="${y + 11}" font-size="12" fill="${INK}">${esc(name)}</text>`;
  }).join('');
  y += 40;
  const metre = 1000 * k;
  const bar = `<rect x="0" y="${y - 6}" width="${n2(metre)}" height="6" fill="${INK}"/><text x="0" y="${y + 14}" font-size="12" fill="${INK}">0</text><text x="${n2(metre)}" y="${y + 14}" font-size="12" fill="${INK}" text-anchor="end">1 m</text>`;
  const height = y + 24;
  const label = `${title}: de lagen van boven`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" lang="nl" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" data-scale="${k}" role="img" aria-label="${esc(label)}">`
    + `<title>${esc(label)}</title><rect width="${width}" height="${height}" fill="#ffffff"/>`
    + `<g ${font}>`
    + `<text x="0" y="18" font-size="15" font-weight="600" fill="${INK}">${esc(title)}: de lagen van boven</text>`
    + (subtitle ? `<text x="0" y="38" font-size="12" fill="${GREY}">${esc(subtitle)}</text>` : '')
    + parts.join('') + legend + bar + '</g></svg>';
}
