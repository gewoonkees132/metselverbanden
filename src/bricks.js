// The one source of truth: every brick of the preview wall, built from a
// bond's course rule (data/verbanden.js). The 3D view, the thumbnails and
// the tests all read this module's bricks. Pure: no browser objects.
//
// The wall: two legs at a right angle and a free end on each. Leg A runs
// along x from the outer corner, its front face at y = 0; leg B runs along
// y, its outer face at x = 0. Lengths in mm, z up.
//
// Along a face, every piece takes a whole number of modules with its head
// joint: a module is half a kop and half a joint (55 mm for a brick of
// 100 mm and a joint of 10 mm). A klezoor takes one, a kop or a halve two,
// a drieklezoor three, a strek four.

export const PIECES = Object.freeze({ klezoor: 1, kop: 2, halve: 2, drieklezoor: 3, strek: 4 });
// Through the wall's thickness: a kop and a klezoor (a brick halved along
// its length) in a steens wall. A strek, a drieklezoor and a halve lie a
// brick's width deep, so a steens wall puts a second one behind them.
const THROUGH = new Set(['kop', 'klezoor']);

export const moduleOf = (format) => (format.width + format.joint) / 2;
export const faceLength = (kind, format) => PIECES[kind] * moduleOf(format) - format.joint;

const sum = (kinds) => kinds.reduce((s, k) => s + PIECES[k], 0);

// A leg's sequence for one course, from its head, its unit repeated and
// its tail, to exactly this many modules; null if no count of units fits.
export function fill(spec, modules) {
  const head = spec.head ?? [];
  const unit = spec.unit ?? [];
  const tail = spec.tail ?? [];
  const rest = modules - sum(head) - sum(tail);
  if (rest < 0) return null;
  const u = sum(unit);
  if (u === 0) return rest === 0 ? [...head, ...tail] : null;
  if (rest % u !== 0) return null;
  const out = [...head];
  for (let k = 0; k < rest / u; k++) out.push(...unit);
  return [...out, ...tail];
}

// How deep a piece reaches into the wall, in modules with its joint.
function depthModules(kind, throughModules) {
  return THROUGH.has(kind) ? throughModules : 2;
}

// The piece at the outer corner: the first of the leg that runs through it.
function cornerPiece(rc) {
  if (rc.kinds) return rc.kinds[rc.pass][0];
  const spec = rc[rc.pass];
  return (spec.head?.length ? spec.head : spec.unit)[0];
}

// Where a leg's own pieces begin along it, in modules: at the corner for
// the leg that runs through it, after the other leg's corner piece for the
// leg that butts against it.
function startOf(course, leg, throughModules) {
  if (course.pass === leg) return 0;
  return depthModules(cornerPiece(course), throughModules);
}

// The shortest leg at least min modules long in which every course closes.
function legLength(courses, leg, min, throughModules) {
  for (let n = min; n < min + 64; n++) {
    if (courses.every((c) => fill(c[leg], n - startOf(c, leg, throughModules)))) return n;
  }
  throw new Error(`no length of leg ${leg} closes every course`);
}

// A small, fixed pseudo-random sequence (mulberry32), so wild verband is
// the same wall on every load.
export function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The pieces of one leg in one course as boxes. along and across are the
// leg's own axes; leg B swaps them into x and y.
function legBricks({ leg, kinds, start, course, format, thickness, through, passingCornerDeep }) {
  const m = moduleOf(format);
  const j = format.joint;
  const w = format.width;
  const out = [];
  const put = (kind, a0, a1, c0, c1) => {
    const box = leg === 'A' ? { x0: a0, x1: a1, y0: c0, y1: c1 } : { x0: c0, x1: c1, y0: a0, y1: a1 };
    out.push({ course, leg, kind, ...box });
  };
  let s = start;
  kinds.forEach((kind, i) => {
    const a0 = s * m;
    const a1 = a0 + faceLength(kind, format);
    s += PIECES[kind];
    if (THROUGH.has(kind) || thickness === w) {
      put(kind, a0, a1, 0, THROUGH.has(kind) ? thickness : w);
      return;
    }
    put(kind, a0, a1, 0, w);
    // The piece behind it, unless the other leg's pieces fill that room:
    // they do near the corner when this leg runs through it with a piece
    // a brick's width deep.
    const cornerZone = start === 0 && !passingCornerDeep && a0 < (through * m) - 1e-9;
    if (!cornerZone) put(kind, a0, a1, w + j, thickness);
  });
  return out;
}

// One course from a rule's course: both legs' sequences, filled to length.
function courseBricks(rc, c, ctx) {
  const { lengths, through } = ctx;
  const bricks = [];
  for (const leg of ['A', 'B']) {
    const start = startOf(rc, leg, through);
    const kinds = rc.kinds?.[leg] ?? fill(rc[leg], lengths[leg] - start);
    if (!kinds) throw new Error(`course ${c}, leg ${leg} does not close`);
    const passingCorner = cornerPiece(rc);
    bricks.push(...legBricks({
      leg, kinds, start, course: c, format: ctx.format, thickness: ctx.thickness, through,
      passingCornerDeep: THROUGH.has(passingCorner) && ctx.thickness !== ctx.format.width,
    }));
  }
  return bricks;
}

// The head joints a leg's front face shows, in modules from the corner,
// for wild verband's search: the other leg's corner piece ends at start.
function jointsOf(kinds, start) {
  const out = start > 0 ? [start] : [];
  let s = start;
  for (const k of kinds.slice(0, -1)) {
    s += PIECES[k];
    out.push(s);
  }
  return out;
}

// Wild verband: per course, per leg, a random run of koppen, strekken and
// drieklezoren (the pieces KNB info 32 names) from a fixed seed, drawn again until no head joint of its face stands on
// one of the course below, no more strekken follow each other than the
// rule allows, and the free end shows something else than below.
function wildCourses(rule, lengths, through, courses) {
  const next = random(rule.wild.seed);
  const out = [];
  const below = { A: null, B: null };
  const endBelow = { A: null, B: null };
  for (let c = 0; c < courses; c++) {
    const pass = c % 2 === 0 ? 'A' : 'B';
    const kinds = {};
    for (const leg of ['A', 'B']) {
      const start = leg === pass ? 0 : 2; // the corner piece is a strek
      const total = lengths[leg];
      let found = null;
      for (let attempt = 0; attempt < 20000 && !found; attempt++) {
        const seq = leg === pass ? ['strek'] : [];
        let s = start + sum(seq);
        let run = seq.length;
        let ok = true;
        while (s < total && ok) {
          const left = total - s;
          const options = [];
          if (left >= 2) options.push('kop');
          if (left >= 4 && run < rule.wild.maxStrekken) options.push('strek');
          if (left >= 3) options.push('drieklezoor');
          if (!options.length || left === 1) {
            ok = false;
            break;
          }
          const kind = options[Math.floor(next() * options.length)];
          seq.push(kind);
          run = kind === 'strek' ? run + 1 : 0;
          s += PIECES[kind];
        }
        if (!ok || s !== total) continue;
        const joints = jointsOf(seq, start);
        // The next course's corner strek ends at module 4 on this face, so
        // the leg that butts against the corner keeps that place free.
        const clash = (below[leg] && joints.some((p) => below[leg].has(p))) || (leg !== pass && joints.includes(4));
        const end = seq[seq.length - 1];
        const endClash = end === 'strek' && endBelow[leg] === 'strek';
        if (!clash && !endClash) found = seq;
      }
      if (!found) throw new Error(`wild verband: no course ${c} for leg ${leg}`);
      kinds[leg] = found;
    }
    // The face of each leg also shows the other leg's corner piece.
    for (const leg of ['A', 'B']) {
      const start = leg === pass ? 0 : 2;
      below[leg] = new Set(jointsOf(kinds[leg], start));
      endBelow[leg] = kinds[leg][kinds[leg].length - 1];
    }
    out.push({ pass, kinds, A: {}, B: {} });
  }
  return out;
}

// The wall of a bond: its bricks, its format, its thickness, its legs.
export function buildWall(bond, { courses = 12, minA = 40, minB = 24 } = {}) {
  const { rule } = bond;
  const format = bond.format;
  // A bond with a long unit asks for a longer leg, so its repeat shows.
  minA = Math.max(minA, rule.minA ?? 0);
  if (format.length !== 2 * format.width + format.joint) throw new Error(`${bond.id}: a strek is not two koppen and a joint`);
  const thickness = rule.thickness === 'halfsteens' ? format.width : format.length;
  const through = thickness === format.width ? 2 : 4;
  let lengths;
  let plan;
  if (rule.wild) {
    lengths = { A: minA + (minA % 2), B: minB + (minB % 2) };
    plan = wildCourses(rule, lengths, through, courses);
  } else {
    lengths = {
      A: legLength(rule.courses, 'A', minA, through),
      B: legLength(rule.courses, 'B', minB, through),
    };
    plan = Array.from({ length: courses }, (_, c) => rule.courses[c % rule.courses.length]);
  }
  const ctx = { format, thickness, through, lengths };
  const step = format.height + format.bed;
  const bricks = plan.flatMap((rc, c) => courseBricks(rc, c, ctx)).map((b) => ({
    ...b,
    z0: b.course * step,
    z1: b.course * step + format.height,
  }));
  const m = moduleOf(format);
  return {
    id: bond.id,
    format,
    thickness,
    courses,
    legs: { A: lengths.A * m - format.joint, B: lengths.B * m - format.joint },
    bricks,
  };
}

// The front of leg A as rectangles, for a drawing of the bond: x along the
// wall from the corner, z up, both in mm, cut off at to.
export function elevation(wall, { to = Infinity, courses = wall.courses } = {}) {
  return wall.bricks
    .filter((b) => b.y0 === 0 && b.course < courses && b.x0 < to)
    .map((b) => ({ x: b.x0, z: b.z0, w: Math.min(b.x1, to) - b.x0, h: b.z1 - b.z0, kind: b.kind, course: b.course }));
}
