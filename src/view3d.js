// The 3D view: the bricks of bricks.js as instanced meshes with softened
// arrises, the mortar set back behind their faces, a ground, a low sun
// from the front left and the sky, ambient occlusion in screen space when
// the view rests, three preset views and free orbit. It draws only when
// the wall, the colours or the camera change.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { el } from './ui/dom.js';
import { PALETTE } from './palette.js';
import { VIEWS } from './state.js';
import { TONES } from './drawing.js';
import {
  SUN, SKY, SKY_COLOUR, BOUNCE, EXPOSURE, SHADOW_MAP, SHADOW_SOFT,
  AO_RADIUS, AO_THICKNESS, AO_SCALE, airFor, sunDirection, shadowFrame,
} from './light.js';

const BACKGROUND = PALETTE.view;
const GROUND = '#e4ddd2'; // a light paving, a shade under the air, placeholder
const MORTAR = '#cdc6ba'; // a lime mortar, placeholder
const RECESS = 0.004; // m: how far the mortar lies behind the brick faces, by default
const SHADOW = 0.35; // how dark the cast shadow is, from 0 to 1
const EDGE = 0.0025; // m: the radius of a brick's softened arrises
const ROUGHNESS = 0.88;
// Brick tones for the plain view, picked per brick by a fixed hash, so a
// wall looks the same on every load. Placeholders: a red Waal brick.
const BRICK_TONES = ['#9b4a33', '#a85738', '#8e452f', '#aa5f42', '#95503a', '#a24f36'];
// The colours of the pieces when they are told apart: the elevation's,
// so the page has one colour code for the kinds.
export const KIND_COLOURS = TONES;
const REST = 200; // ms without a change before the ambient occlusion is drawn
const ORBIT_STEP = (8 * Math.PI) / 180; // an arrow key turns the view this far
const ZOOM_STEP = 1.15;

// Plan (x along leg A, y along leg B, z up), in mm, to the scene, in m, y up.
const toScene = (x, y, z) => [x / 1000, z / 1000, -y / 1000];

function webgl2(canvas) {
  try {
    return canvas.getContext('webgl2', {
      alpha: false, antialias: true, depth: true, stencil: false,
      premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'default',
    });
  } catch {
    return null;
  }
}

// Without WebGL the zone says in one line why it is empty; the rest of the
// page works as before.
function emptyView(root, texts, captionNode) {
  root.classList.add('no-webgl');
  root.replaceChildren(captionNode ?? '', el('p', { class: 'view-empty', role: 'status' }, texts.noWebgl));
  const nothing = () => {};
  return { setWall: nothing, setView: nothing, setColours: nothing, setLabel: nothing, setJoint: nothing, turn: nothing, zoom: nothing };
}

export function createView3d(root, options) {
  const canvas = document.createElement('canvas');
  const context = webgl2(canvas);
  if (!context) return emptyView(root, options.texts, options.captionNode);
  try {
    return buildView(root, canvas, context, options);
  } catch {
    return emptyView(root, options.texts, options.captionNode);
  }
}

// A small hash of three integers, from 0 to 1.
function hash(a, b, c) {
  let h = Math.imul(a + 0x9e37, 0x85ebca6b) ^ Math.imul(b + 0x7f4a, 0xc2b2ae35) ^ Math.imul(c + 0x1656, 0x27d4eb2f);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  return (h >>> 0) / 4294967296;
}

function buildView(root, canvas, context, { texts, controlsNode, captionNode }) {
  const stage = el('div', { class: 'view-stage' });
  const hint = el('p', { class: 'view-hint', id: 'muur-uitleg' },
    el('span', { class: 'hint-mouse' }, texts.hint), el('span', { class: 'hint-touch' }, texts.hintTouch));
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-describedby', 'muur-uitleg');
  stage.append(canvas, captionNode ?? '', hint);
  root.append(stage, controlsNode);

  const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BACKGROUND, 8, 30);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 200);
  const controls = new OrbitControls(camera, canvas);
  // OrbitControls claims every touch (touch-action: none, inline). The
  // style sheet decides instead: where the page scrolls, a vertical swipe
  // scrolls it and a sideways drag turns the wall.
  canvas.style.removeProperty('touch-action');
  controls.minDistance = 0.4;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // never below the ground
  controls.screenSpacePanning = true;

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: GROUND, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.0005;
  ground.receiveShadow = false;
  ground.renderOrder = 2;
  scene.add(ground);

  scene.add(new THREE.HemisphereLight(SKY_COLOUR, BOUNCE, SKY));
  const sun = new THREE.DirectionalLight('#ffffff', SUN);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW_MAP, SHADOW_MAP);
  sun.shadow.radius = SHADOW_SOFT;
  sun.shadow.intensity = SHADOW;
  scene.add(sun, sun.target);

  const wallGroup = new THREE.Group();
  scene.add(wallGroup);
  const brickMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: ROUGHNESS });
  const mortarMaterial = new THREE.MeshStandardMaterial({ color: MORTAR, roughness: 1 });

  // Ambient occlusion over a multisampled frame, then tone mapping and sRGB
  // in one last pass. Without a float colour buffer the renderer draws
  // straight to the canvas.
  let composer = null;
  let occlusion = null;
  if (renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')) {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    occlusion = new GTAOPass(scene, camera, 1, 1, undefined, {
      radius: AO_RADIUS, thickness: AO_THICKNESS, scale: AO_SCALE, samples: 16,
    }, { radius: 4 });
    composer.addPass(occlusion);
    composer.addPass(new OutputPass());
  }

  // While the camera or the wall moves the frame is drawn straight to the
  // canvas; once nothing has moved for REST ms, one frame with the
  // occlusion follows. The air is set so both show the zone's colour.
  let moving = true;
  let restTimer = null;
  let composedAir = null;
  const plainAir = new THREE.Color(BACKGROUND);
  const mappedAir = new THREE.Color().setRGB(...airFor(BACKGROUND));
  function setAir(throughComposer) {
    if (composedAir === throughComposer) return;
    composedAir = throughComposer;
    const air = throughComposer ? mappedAir : plainAir;
    scene.background = air;
    scene.fog.color.copy(air);
  }
  function rest() {
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      moving = false;
      requestDraw();
    }, REST);
  }
  function stir() {
    moving = true;
    rest();
  }

  let wall = null;
  let bricks = [];
  let meshes = [];
  let coloured = false;
  let view = 'hoek';
  let width = 1;
  let height = 1;
  let pending = false;
  let box = null; // the wall's bounds in the scene

  function draw() {
    pending = false;
    const throughComposer = Boolean(composer && wall && !moving);
    setAir(throughComposer);
    if (throughComposer) composer.render();
    else renderer.render(scene, camera);
    canvas.dataset.frames = String(Number(canvas.dataset.frames || 0) + 1);
  }

  function requestDraw() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(draw);
  }

  const geometries = new Map();
  function geometryFor(lx, ly, lz) {
    const key = `${lx.toFixed(4)}|${ly.toFixed(4)}|${lz.toFixed(4)}`;
    if (!geometries.has(key)) {
      const radius = Math.min(EDGE, lx / 3, ly / 3, lz / 3);
      geometries.set(key, new RoundedBoxGeometry(lx, ly, lz, 2, radius));
    }
    return geometries.get(key);
  }

  const colour = new THREE.Color();
  function paint() {
    for (const mesh of meshes) {
      mesh.userData.bricks.forEach((b, i) => {
        const tone = coloured ? KIND_COLOURS[b.kind] : BRICK_TONES[Math.floor(hash(b.course, Math.round(b.x0), Math.round(b.y0)) * BRICK_TONES.length)];
        mesh.setColorAt(i, colour.set(tone));
      });
      mesh.instanceColor.needsUpdate = true;
    }
  }

  function clearWall() {
    for (const child of [...wallGroup.children]) {
      wallGroup.remove(child);
      if (child.isInstancedMesh) child.dispose();
      else if (child.geometry) child.geometry.dispose();
    }
    meshes = [];
  }

  // The mortar: one box per leg, set back behind every face but the joints'.
  let recess = RECESS;
  function addMortar(w) {
    const t = w.thickness;
    const top = w.courses * (w.format.height + w.format.bed) - w.format.bed;
    const rects = [
      { x0: 0, x1: w.legs.A, y0: 0, y1: t },
      { x0: 0, x1: t, y0: t, y1: w.legs.B },
    ];
    for (const r of rects) {
      const lx = (r.x1 - r.x0) / 1000 - 2 * recess;
      const ly = (r.y1 - r.y0) / 1000 - (r.y0 === 0 ? 2 * recess : recess);
      const lz = top / 1000 - recess;
      const mortar = new THREE.Mesh(new THREE.BoxGeometry(lx, lz, ly), mortarMaterial);
      const [cx, cy, cz] = toScene((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2 + (r.y0 === 0 ? 0 : -recess * 500), top / 2);
      mortar.position.set(cx, cy - recess / 2, cz);
      mortar.castShadow = true;
      mortar.receiveShadow = true;
      wallGroup.add(mortar);
    }
  }

  function setWall(next) {
    stir();
    clearWall();
    wall = next;
    bricks = next.bricks;
    const groups = new Map();
    for (const b of bricks) {
      const dims = [(b.x1 - b.x0) / 1000, (b.z1 - b.z0) / 1000, (b.y1 - b.y0) / 1000];
      const key = dims.map((v) => v.toFixed(4)).join('|');
      if (!groups.has(key)) groups.set(key, { dims, list: [] });
      groups.get(key).list.push(b);
    }
    const matrix = new THREE.Matrix4();
    for (const { dims, list } of groups.values()) {
      const mesh = new THREE.InstancedMesh(geometryFor(...dims), brickMaterial, list.length);
      list.forEach((b, i) => {
        matrix.makeTranslation(...toScene((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2));
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, colour.set('#ffffff'));
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.bricks = list;
      wallGroup.add(mesh);
      meshes.push(mesh);
    }
    addMortar(next);
    paint();
    box = new THREE.Box3().setFromObject(wallGroup);
    placeSun();
    renderer.shadowMap.needsUpdate = true;
    placeCamera();
    canvas.dataset.bricks = String(bricks.length);
    requestDraw();
  }

  function placeSun() {
    const centre = box.getCenter(new THREE.Vector3());
    // In plan the front faces -y; the sun comes round from the front
    // toward -x, the side the corner view looks from, so the cast shadow
    // falls behind the wall and inside its corner.
    // From above the sun stands high, so the top course is lit.
    const [dx, dy, dz] = view === 'boven' ? sunDirection([0, -1, 0], [-1, 0, 0], undefined, (62 * Math.PI) / 180) : sunDirection([0, -1, 0], [-1, 0, 0]);
    sun.target.position.copy(centre);
    sun.position.copy(centre).add(new THREE.Vector3(...toScene(dx * 10000, dy * 10000, dz * 10000)));
    const points = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) points.push([x, y, z]);
    const frame = shadowFrame(points, sun.position.toArray(), centre.toArray(), 0.1, (box.max.y - box.min.y) * 4 + 1);
    Object.assign(sun.shadow.camera, frame);
    sun.shadow.camera.updateProjectionMatrix();
    const texel = Math.max(frame.right - frame.left, frame.top - frame.bottom) / SHADOW_MAP;
    sun.shadow.normalBias = texel * 1.5;
    sun.shadow.bias = -texel / (frame.far - frame.near);
    if (occlusion) occlusion.setSceneClipBox(box.clone().expandByScalar(AO_RADIUS * 2));
  }

  // The preset views: straight at the front of leg A, from outside the
  // corner, and from above. Each fits the whole wall in the frame.
  function placeCamera() {
    if (!box) return;
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // From above a long lens from far off, so the top reads as a plan and
    // the faces below it hardly show; the other views keep the usual lens.
    camera.fov = view === 'boven' ? 12 : 40;
    camera.updateProjectionMatrix();
    const aspect = width / height;
    const vfov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const fit = (w, h) => 1.3 * Math.max(h / 2 / Math.tan(vfov / 2), w / 2 / Math.tan(hfov / 2));
    // Every corner of the wall's box inside the frame, with a margin, and
    // above the hint line at the foot of the stage: the distance along the
    // view's direction is scaled until the farthest corner sits on the margin.
    const corners = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
    const foot = Math.min(0.5, (2 * (hint.offsetHeight + 16)) / Math.max(1, height));
    const framed = (dir, target, start) => {
      let d = start;
      for (let i = 0; i < 8; i++) {
        camera.position.copy(target).addScaledVector(dir, d);
        camera.lookAt(target);
        camera.updateMatrixWorld();
        let worst = 0;
        for (const c of corners) {
          const q = c.clone().project(camera);
          worst = Math.max(worst, Math.abs(q.x) / 0.88, q.y > 0 ? q.y / 0.88 : -q.y / (0.88 - foot));
        }
        d *= Math.min(2, Math.max(0.5, worst));
      }
      return target.clone().addScaledVector(dir, d);
    };
    let eye;
    let target = centre.clone();
    if (view === 'voor') {
      const front = box.max.z; // the front face of leg A
      target = new THREE.Vector3(centre.x, centre.y, front);
      eye = framed(new THREE.Vector3(0, size.y * 0.15, fit(size.x, size.y) + 0.02).normalize(), target, fit(size.x, size.y));
    } else if (view === 'boven') {
      eye = framed(new THREE.Vector3(0, 1, 0.001).normalize(), centre, fit(size.x, size.z) + size.y);
    } else {
      const reach = fit(Math.hypot(size.x, size.z) * 0.85, size.y * 1.6);
      const dir = new THREE.Vector3(-0.62, 0.48, 0.62).normalize();
      target = new THREE.Vector3(box.min.x + size.x * 0.32, centre.y * 0.8, box.max.z - size.z * 0.3);
      eye = framed(dir, target, reach);
    }
    camera.position.copy(eye);
    // The fog starts a little behind the wall, however far the camera stands.
    const reachOf = eye.distanceTo(target);
    scene.fog.near = reachOf + 5;
    scene.fog.far = reachOf + 25;
    controls.target.copy(target);
    controls.update();
    requestDraw();
  }

  function setView(next) {
    view = VIEWS.includes(next) ? next : 'hoek';
    stir();
    if (box) {
      placeSun();
      renderer.shadowMap.needsUpdate = true;
    }
    placeCamera();
  }

  function setColours(on) {
    coloured = Boolean(on);
    if (meshes.length) paint();
    stir();
    requestDraw();
  }

  function setLabel(text) {
    canvas.setAttribute('aria-label', text);
  }

  controls.addEventListener('start', () => {
    moving = true;
    clearTimeout(restTimer);
  });
  controls.addEventListener('end', rest);
  controls.addEventListener('change', requestDraw);

  // The keyboard holds the view: the arrows turn it round and up, plus and
  // minus bring it nearer and farther, Home goes back to the preset view.
  const spherical = new THREE.Spherical();
  const offset = new THREE.Vector3();
  function move({ theta = 0, phi = 0, zoom = 0 }) {
    offset.copy(camera.position).sub(controls.target);
    spherical.setFromVector3(offset);
    spherical.theta += theta;
    spherical.phi = Math.min(controls.maxPolarAngle, Math.max(0.01, spherical.phi + phi));
    spherical.radius = Math.min(controls.maxDistance, Math.max(controls.minDistance, spherical.radius * ZOOM_STEP ** -zoom));
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    stir();
  }
  canvas.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const steps = {
      ArrowLeft: { theta: -ORBIT_STEP }, ArrowRight: { theta: ORBIT_STEP }, ArrowUp: { phi: -ORBIT_STEP }, ArrowDown: { phi: ORBIT_STEP },
      '+': { zoom: 1 }, '=': { zoom: 1 }, '-': { zoom: -1 }, _: { zoom: -1 },
    };
    if (event.key === 'Home') {
      event.preventDefault();
      setView(view);
      return;
    }
    if (!steps[event.key]) return;
    event.preventDefault();
    move(steps[event.key]);
  });

  canvas.addEventListener('webglcontextrestored', () => {
    renderer.shadowMap.needsUpdate = true;
    requestDraw();
  });

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (w < 2 || h < 2 || (w === width && h === height)) return;
    width = w;
    height = h;
    renderer.setSize(width, height, false);
    if (composer) composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    placeCamera();
    stir();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // The joint: how far the mortar lies behind the faces, in mm (0.5 for
  // a flush joint, so the two faces do not fight).
  function setJoint(mm) {
    const next = Math.max(0.5, mm) / 1000;
    if (Math.abs(next - recess) < 1e-6) return;
    recess = next;
    if (wall) setWall(wall);
  }

  const turn = (dir) => move({ theta: dir * ORBIT_STEP * 2 });
  const zoom = (dir) => move({ zoom: dir });

  return { setWall, setView, setColours, setLabel, setJoint, turn, zoom };
}
