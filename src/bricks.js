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
// Through the wall's thickness: a kop, in a steens wall. A strek, a
// drieklezoor, a halve and a klezoor (a quarter of a brick, cut across, as
// the RCE thesaurus after Haslinghuis has it) lie a brick's width deep, so
// a steens wall puts a second one behind them: two klezoren, one behind
// the other, fill the depth of a kop.
const THROUGH = new Set(['kop']);

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
  // The leg through the corner may fill the whole corner square itself
  // (spec.cornerBack: a piece behind its corner piece too); then the
  // other leg begins past the square.
  if (course[course.pass]?.cornerBack) return throughModules;
  return depthModules(cornerPiece(course), throughModules);
}

// Where a leg's back row begins, in modules, when a course lays it apart
// (spec.back): past the corner square for the leg that runs through the
// corner, behind its own first piece for the leg that butts against it.
function backStartOf(course, leg, throughModules) {
  return course.pass === leg ? throughModules : startOf(course, leg, throughModules);
}

// Whether a leg of this many modules closes a course, back row included.
function closes(course, leg, n, throughModules) {
  if (!fill(course[leg], n - startOf(course, leg, throughModules))) return false;
  return !course[leg]?.back || Boolean(fill(course[leg].back, n - backStartOf(course, leg, throughModules)));
}

// The shortest leg at least min modules long in which every course closes.
function legLength(courses, leg, min, throughModules) {
  for (let n = min; n < min + 64; n++) {
    if (courses.every((c) => closes(c, leg, n, throughModules))) return n;
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
function legBricks({ leg, kinds, back, backStart, start, course, format, thickness, through, passingCornerDeep, cornerBack }) {
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
    if (back) return; // the back row is laid apart, below
    // The piece behind it, unless the other leg's pieces fill that room:
    // they do near the corner when this leg runs through it with a piece
    // a brick's width deep.
    const cornerZone = start === 0 && !passingCornerDeep && !cornerBack && a0 < (through * m) - 1e-9;
    if (!cornerZone) put(kind, a0, a1, w + j, thickness);
  });
  // A back row of its own: pieces a brick's width deep, along the inner
  // face, so its head joints can fall elsewhere than the front's.
  if (back) {
    let b = backStart;
    for (const kind of back) {
      if (THROUGH.has(kind)) throw new Error(`course ${course}: a ${kind} cannot lie in the back row`);
      put(kind, b * m, b * m + faceLength(kind, format), w + j, thickness);
      b += PIECES[kind];
    }
  }
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
    const backStart = backStartOf(rc, leg, through);
    const back = rc[leg]?.back && ctx.thickness !== ctx.format.width ? fill(rc[leg].back, lengths[leg] - backStart) : null;
    if (rc[leg]?.back && ctx.thickness !== ctx.format.width && !back) throw new Error(`course ${c}, leg ${leg}: the back row does not close`);
    const passingCorner = cornerPiece(rc);
    bricks.push(...legBricks({
      leg, kinds, back, backStart, start, course: c, format: ctx.format, thickness: ctx.thickness, through, cornerBack: Boolean(rc[leg]?.cornerBack),
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

// Wild verband: per course, per leg, a run of strekken, koppen and now and
// then a drieklezoor (the pieces KNB info 32 names), drawn from a fixed
// seed until it keeps the rules the sources give: no head joint on one of
// the course below; no more strekken or koppen side by side than the rule
// allows (a lesboek calls more than five strekken or three koppen a
// fault); no two drieklezoren side by side; no stair of head joints a
// klezoor apart over more courses than the rule allows (the KNB: not more
// than six jumps); no run that looks like Vlaams verband; no course like the
// one two below; and a free end
// of a kop and a drieklezoor by turns.
const WILD_WEIGHTS = [['strek', 0.55], ['kop', 0.33], ['drieklezoor', 0.12]];

function wildCourses(rule, lengths, through, courses) {
  const { seed, maxStrekken, maxKoppen, maxStair, maxShared = 1 } = rule.wild;
  const next = random(seed);
  const out = [];
  // Per course laid: its head joints, the stairs they end (each way) and
  // its free ends, per leg.
  const laid = [];
  const none = { below: { A: null, B: null }, stairs: { A: null, B: null }, endBelow: { A: null, B: null } };
  const pick = (options) => {
    const total = options.reduce((t, k) => t + WILD_WEIGHTS.find((w) => w[0] === k)[1], 0);
    let r = next() * total;
    for (const k of options) {
      r -= WILD_WEIGHTS.find((w) => w[0] === k)[1];
      if (r <= 0) return k;
    }
    return options[options.length - 1];
  };
  // A course that cannot be laid on the one below sends the search back
  // to lay that one again.
  let backs = 0;
  for (let c = 0; c < courses;) {
    const pass = c % 2 === 0 ? 'A' : 'B';
    const { below, stairs, endBelow } = laid[c - 1] ?? none;
    const twoBelow = laid[c - 2]?.below ?? none.below;
    const kinds = {};
    const found = {};
    for (const leg of ['A', 'B']) {
      // The leg through the corner starts with a strek; the other leg's
      // face starts with the end of that strek, which looks like a kop.
      const start = leg === pass ? 0 : 2;
      const total = lengths[leg];
      for (let attempt = 0; attempt < 4000 && !found[leg]; attempt++) {
        const seq = leg === pass ? ['strek'] : [];
        const face = leg === pass ? ['strek'] : ['kop'];
        let s = start + sum(seq);
        let ok = true;
        while (s < total && ok) {
          const left = total - s;
          const last = face[face.length - 1];
          let run = 0;
          for (let i = face.length - 1; i >= 0 && face[i] === last; i--) run++;
          const options = [];
          if (left >= 4 && !(last === 'strek' && run >= maxStrekken)) options.push('strek');
          if (left >= 2 && !(last === 'kop' && run >= maxKoppen)) options.push('kop');
          if (left >= 3 && last !== 'drieklezoor') options.push('drieklezoor');
          const fits = options.filter((k) => PIECES[k] === left || left - PIECES[k] >= 2);
          if (!fits.length) {
            ok = false;
            break;
          }
          const kind = pick(fits);
          seq.push(kind);
          face.push(kind);
          s += PIECES[kind];
        }
        if (!ok || s !== total) continue;
        // Five pieces kop and strek in turn read as Vlaams verband.
        const text = face.map((k) => k[0]).join('');
        if (/ksksk|sksks/.test(text)) continue;
        const joints = jointsOf(seq, start);
        // The next course's corner strek ends at module 4 on this face, so
        // the leg that butts against the corner keeps that place free.
        if ((below[leg] && joints.some((p) => below[leg].has(p))) || (leg !== pass && joints.includes(4))) continue;
        // Not like the course two below: that would be a regular bond.
        if (twoBelow[leg] && joints.filter((p) => twoBelow[leg].has(p)).length >= maxShared * Math.max(joints.length, twoBelow[leg].size)) continue;
        const climb = new Map();
        let tall = false;
        for (const p of joints) {
          const up = stairs[leg]?.get(`${p - 1}+`) ?? 0;
          const down = stairs[leg]?.get(`${p + 1}-`) ?? 0;
          climb.set(`${p}+`, up + 1);
          climb.set(`${p}-`, down + 1);
          if (up + 1 > maxStair || down + 1 > maxStair) tall = true;
        }
        if (tall) continue;
        const end = seq[seq.length - 1];
        // The free end: a kop and a drieklezoor by turns, as the German Wikipedia
        // has it, so no joint runs up through the end.
        if (end !== (endBelow[leg] === 'kop' ? 'drieklezoor' : 'kop')) continue;
        found[leg] = { seq, climb };
      }
      if (!found[leg]) break;
      kinds[leg] = found[leg].seq;
    }
    if (!found.A || !found.B) {
      if (c === 0 || ++backs > 2000) throw new Error(`wild verband: no course ${c}`);
      laid.pop();
      out.pop();
      c--;
      continue;
    }
    // The face of each leg also shows the other leg's corner piece.
    const state = { below: {}, stairs: {}, endBelow: {} };
    for (const leg of ['A', 'B']) {
      const start = leg === pass ? 0 : 2;
      state.below[leg] = new Set(jointsOf(kinds[leg], start));
      state.stairs[leg] = found[leg].climb;
      state.endBelow[leg] = kinds[leg][kinds[leg].length - 1];
    }
    laid.push(state);
    out.push({ pass, kinds, A: {}, B: {} });
    c++;
  }
  return out;
}

// The rule and the brick a wall is built from: the bond's own, or a
// variant's rule (variant: its id in bond.variants) and another format.
export function ruleOf(bond, variant = null) {
  const v = variant ? bond.variants?.find((x) => x.id === variant) : null;
  return v?.rule ?? bond.rule;
}

// The wall of a bond: its bricks, its format, its thickness, its legs.
// A variant (its id) changes the rule; a format changes the brick.
export function buildWall(bond, { courses = 12, minA = 40, minB = 24, variant = null, format: brick = null } = {}) {
  const rule = ruleOf(bond, variant);
  const format = brick ?? bond.format;
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
    variant: variant && bond.variants?.some((x) => x.id === variant) ? variant : null,
    format,
    thickness,
    courses,
    repeat: rule.repeat ?? null,
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

// One course seen from above, as rectangles, for a drawing of the wall's
// thickness and its corner: x and y in mm, as the bricks lie.
export function plan(wall, course = 0) {
  return wall.bricks
    .filter((b) => b.course === course)
    .map((b) => ({ x: b.x0, y: b.y0, w: b.x1 - b.x0, h: b.y1 - b.y0, kind: b.kind, leg: b.leg }));
}
