// The map of the Netherlands: one projection for the provinces' outlines
// (made once by tools/make-map.js into data/provincies.svg) and for the
// dots of example buildings, so the two can never drift apart. Pure: no
// browser objects.
//
// A plain projection is enough at this size: longitude scaled by the
// cosine of 52.2 degrees north, latitude as it is, north up.

export const MAP = Object.freeze({
  west: 3.3, // degrees east: the map's left edge
  north: 53.6, // degrees north: its top edge
  scale: 100, // map units per degree of latitude
  refLat: 52.2, // degrees north: where a degree of longitude is measured
  width: 244,
  height: 290,
});

const COS = Math.cos((MAP.refLat * Math.PI) / 180);

// Longitude and latitude (WGS 84) to the map's units, rounded to a tenth.
export function project(lon, lat) {
  const x = (lon - MAP.west) * COS * MAP.scale;
  const y = (MAP.north - lat) * MAP.scale;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// The rings of an SVG path written as M, L and Z only.
export function ringsOf(d) {
  const rings = [];
  for (const part of d.split(/(?=M)/)) {
    const nums = part.replace(/[MLZ]/g, ' ').trim().split(/[\s,]+/).map(Number);
    const ring = [];
    for (let i = 0; i + 1 < nums.length; i += 2) ring.push([nums[i], nums[i + 1]]);
    if (ring.length > 2) rings.push(ring);
  }
  return rings;
}

// Whether a point lies inside a path, by the even-odd rule over its rings.
export function insidePath(point, d) {
  const [px, py] = point;
  let inside = false;
  for (const ring of ringsOf(d)) {
    for (let i = 0, k = ring.length - 1; i < ring.length; k = i++) {
      const [xi, yi] = ring[i];
      const [xk, yk] = ring[k];
      if ((yi > py) !== (yk > py) && px < ((xk - xi) * (py - yi)) / (yk - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

// A province's name as an id: lower case, no accents, words joined by a hyphen.
export function provinceId(name) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
}
