'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from '@phosphor-icons/react/dist/ssr';
import { buildPlantRoom } from '@/lib/three/plantRoom';
import { marbleTexture, tileTexture, woodTexture } from '@/lib/three/finishes';

// "Follow one drop": a real residential tower at dusk, among its neighbours. The water line glows through the
// building like an x-ray. Scrolling (or "Play the journey") carries one drop from the plant room below ground,
// up the core past every floor, into one flat on floor 7, through the window into its kitchen, past the Moya1
// control unit and out of the Moya One tap into a glass. No part is named and nothing shows how the water is
// treated (CLAUDE.md non-negotiables 2 and 7). Reduced motion: one still frame and the captions as a list.

const C = { base: 0xfafaf7, ink: 0x111827, orange: 0xf97316, yellow: 0xffd60a, grey: 0xf3f4f6, water: 0xbfe3f0 };

const W = 2.4; // tower width
const D = 1.6; // tower depth
const F = -0.62; // plant room floor
const PODIUM = 0.4; // lobby height
const FLOOR_H = 0.3;
const FLOORS = 14;
const HOME = 6; // the drop's flat: floor 7, counted from 1
const BAYS = [-0.9, -0.3, 0.3, 0.9]; // window bays across the front
const HOME_BAY = 0.3;
const RISER = { x: 0, z: -0.2 }; // the line rises in the core
const K = { x: HOME_BAY, y: PODIUM + HOME * FLOOR_H, z: D / 2 - 0.42, s: 0.1 }; // the kitchen, in kitchen units, scaled in

export const MOMENTS = [
  {
    at: 0,
    title: 'It leaves the plant room.',
    // PLACEHOLDER: "its own plant room" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
    text: 'Your water starts below ground, in your tower’s own plant room.',
  },
  { at: 0.16, title: 'It climbs one line.', text: 'A dedicated line runs up the tower, laid while it was built.' },
  { at: 0.5, title: 'It turns into your flat.', text: 'A branch reaches your kitchen. Every flat has its own.' },
  { at: 0.68, title: 'It passes your Moya1™ control unit.', text: 'One unit in every kitchen, beside the extra tap.' },
  { at: 0.84, title: 'It lands in your glass.', text: 'From its own tap. Your usual tap stays as it is.' },
];

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.max(0, Math.min(1, t));

// a lit-window facade for the neighbouring towers, painted in code
function windowsTexture(THREE, seed) {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#1b2230';
  g.fillRect(0, 0, 256, 512);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 512; y += 24) {
    for (let x = 0; x < 256; x += 32) {
      const lit = rnd() > 0.55;
      g.fillStyle = lit ? `rgba(255, ${190 + Math.floor(rnd() * 40)}, 130, ${0.55 + rnd() * 0.4})` : '#263041';
      g.fillRect(x + 6, y + 6, 20, 13);
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function DropJourney() {
  const section = useRef(null);
  const host = useRef(null);
  const auto = useRef(null);
  const [moment, setMoment] = useState(0);
  const [floor, setFloor] = useState(null);
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStill(reduce);
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      let THREE, RoomEnvironment, RoundedBoxGeometry;
      try {
        THREE = await import('three');
        ({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'));
        ({ RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js'));
      } catch (err) {
        console.error('3D journey failed to load', err);
        return;
      }
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true; // taste-skill-ignore: 3D lighting, not a CSS effect
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.45;
      scene.fog = new THREE.Fog(0x111827, 9, 24);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.004, 80);
      const textures = [];

      const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.6, ...o });
      const add = (geo, mat, x, y, z, parent = scene, casts = true) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.castShadow = casts;
        m.receiveShadow = true;
        parent.add(m);
        return m;
      };
      const V = (x, y, z) => new THREE.Vector3(x, y, z);
      const kw = (x, y, z) => V(K.x + x * K.s, K.y + y * K.s, K.z + z * K.s); // kitchen units to world
      const tube = (pts, r, mat, parent = scene) => {
        const path = new THREE.CurvePath();
        for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
        const m = add(new THREE.TubeGeometry(path, 16 * (pts.length - 1), r, 12), mat, 0, 0, 0, parent);
        pts.slice(1, -1).forEach((p) => add(new THREE.SphereGeometry(r, 12, 12), mat, p.x, p.y, p.z, parent));
        return m;
      };

      // ---- materials of a real tower ----
      const concrete = phys({ color: 0xe9e6df, roughness: 0.82 });
      const darkFrame = phys({ color: 0x3a4250, roughness: 0.5, metalness: 0.4 });
      const glassDark = phys({ color: 0x23303f, metalness: 0.6, roughness: 0.08, clearcoat: 1 });
      const glassLit = phys({ color: 0x3a3226, emissive: 0xffc98a, emissiveIntensity: 0.9, roughness: 0.1 });
      const railGlass = phys({ color: 0x9fb2c0, roughness: 0.05, transparent: true, opacity: 0.3, depthWrite: false });
      const steel = phys({ color: 0xc9cfd6, metalness: 1, roughness: 0.3 });
      // the line, seen through the building like an x-ray
      const xray = new THREE.MeshBasicMaterial({ color: C.orange, transparent: true, opacity: 0.9, depthTest: false });

      let seed = 21;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

      // ---- ground: a dusk-lit plot, cut open in front so the plant room shows in section ----
      const cutZ = D / 2 + 0.3;
      const roomW = 2.6;
      const asphalt = phys({ color: 0x1c222c, roughness: 0.95 });
      const earth = phys({ color: 0x2b2f36, roughness: 0.95 });
      add(new THREE.BoxGeometry(14, 0.05, 8), asphalt, 0, -0.025, cutZ - 4, scene, false); // behind the cut
      add(new THREE.BoxGeometry(14, 0.05, 8), asphalt, 0, -0.025, cutZ + 1.3 + 4, scene, false); // in front of the trench
      [-1, 1].forEach((s) => add(new THREE.BoxGeometry(7 - roomW / 2, -F, 0.04), earth, s * (roomW / 2 + (7 - roomW / 2) / 2), F / 2, cutZ, scene, false));
      add(new THREE.BoxGeometry(14, 0.04, 1.3), earth, 0, F - 0.1, cutZ + 0.65, scene, false); // the trench floor
      const plant = buildPlantRoom(THREE, {
        scene,
        RoundedBoxGeometry,
        floorY: F,
        x0: -roomW / 2,
        x1: roomW / 2,
        z0: -D / 2,
        z1: cutZ,
        riser: RISER,
      });

      // ---- the tower ----
      // lobby: lit glass box with a canopy
      add(new THREE.BoxGeometry(W, PODIUM - 0.02, D), phys({ color: 0x4a3f30, emissive: 0xffd9a8, emissiveIntensity: 0.55, roughness: 0.2 }), 0, PODIUM / 2, 0);
      add(new THREE.BoxGeometry(1.2, 0.03, 0.5), concrete, -0.5, PODIUM - 0.04, D / 2 + 0.25);
      // floors: slab, front balconies with glass rails, windows all round, AC units on the sides
      const homePane = { mesh: null };
      for (let i = 0; i < FLOORS; i++) {
        const y = PODIUM + i * FLOOR_H;
        add(new THREE.BoxGeometry(W + 0.06, 0.04, D + 0.06), concrete, 0, y + FLOOR_H - 0.02, 0);
        add(new THREE.BoxGeometry(W, 0.035, 0.2), concrete, 0, y + FLOOR_H - 0.02, D / 2 + 0.1);
        add(new THREE.BoxGeometry(W, 0.09, 0.008), railGlass, 0, y + FLOOR_H + 0.045, D / 2 + 0.2, scene, false);
        add(new THREE.BoxGeometry(W, 0.008, 0.014), steel, 0, y + FLOOR_H + 0.09, D / 2 + 0.2, scene, false);
        BAYS.forEach((bx) => {
          const isHome = i === HOME && bx === HOME_BAY;
          const pane = add(new THREE.BoxGeometry(0.52, 0.22, 0.012), isHome ? glassDark.clone() : rnd() > 0.55 ? glassLit : glassDark, bx, y + 0.13, D / 2, scene, false);
          if (isHome) homePane.mesh = pane;
          add(new THREE.BoxGeometry(0.52, 0.22, 0.012), rnd() > 0.6 ? glassLit : glassDark, bx, y + 0.13, -D / 2, scene, false);
        });
        [-1, 1].forEach((sx) => {
          [-0.4, 0.4].forEach((z) => add(new THREE.BoxGeometry(0.012, 0.22, 0.5), rnd() > 0.6 ? glassLit : glassDark, sx * (W / 2), y + 0.13, z, scene, false));
          if (i % 2 === 0) add(new RoundedBoxGeometry(0.07, 0.07, 0.13, 2, 0.008), phys({ color: 0xd9dcdf, roughness: 0.5 }), sx * (W / 2 + 0.045), y + 0.06, 0.15);
        });
      }
      // the structural frame: columns along the front and back
      [-1.2, -0.6, 0, 0.6, 1.2].forEach((x) =>
        [-1, 1].forEach((sz) => add(new THREE.BoxGeometry(0.06, FLOORS * FLOOR_H, 0.06), concrete, x, PODIUM + (FLOORS * FLOOR_H) / 2, sz * (D / 2))),
      );
      // roof: parapet, lift room, water tanks
      const roofY = PODIUM + FLOORS * FLOOR_H;
      add(new THREE.BoxGeometry(W + 0.06, 0.1, D + 0.06), concrete, 0, roofY + 0.05, 0);
      add(new RoundedBoxGeometry(0.5, 0.32, 0.4, 2, 0.02), concrete, -0.5, roofY + 0.26, -0.3);
      [0.4, 0.75].forEach((x) => add(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24), phys({ color: 0xd5d8dc, roughness: 0.4 }), x, roofY + 0.21, -0.25));

      // the neighbourhood: two towers with lit windows, a road, street lamps and trees
      [
        { x: -4.4, z: -2.6, w: 2.0, h: 5.2, d: 1.8, s: 7 },
        { x: 4.6, z: -3.4, w: 2.3, h: 4.4, d: 2.0, s: 13 },
      ].forEach((n) => {
        const tex = windowsTexture(THREE, n.s);
        textures.push(tex);
        add(new THREE.BoxGeometry(n.w, n.h, n.d), phys({ color: 0x1b2230, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.7, map: tex, roughness: 0.6 }), n.x, n.h / 2, n.z);
      });
      add(new THREE.BoxGeometry(14, 0.01, 0.9), phys({ color: 0x2a313c, roughness: 0.9 }), 0, 0.006, cutZ + 2.3, scene, false);
      [-3, -1, 1, 3].forEach((x) => {
        add(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), darkFrame, x, 0.275, cutZ + 1.75);
        add(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe3b0 }), x, 0.56, cutZ + 1.75, scene, false);
        const lamp = new THREE.PointLight(0xffd29a, 0.6, 1.6);
        lamp.position.set(x, 0.5, cutZ + 1.75);
        scene.add(lamp);
      });
      const leaf = phys({ color: 0x2f4a3a, roughness: 0.8, flatShading: true });
      [[-2.2, 1.6], [-1.6, 2.0], [2.0, 1.7], [2.7, 2.1], [-3.4, -1.0], [3.2, -1.4]].forEach(([x, z]) => {
        add(new THREE.CylinderGeometry(0.02, 0.025, 0.25, 8), darkFrame, x, 0.125, z);
        add(new THREE.IcosahedronGeometry(0.18, 0), leaf, x, 0.36, z);
      });

      // ---- the line: up the core, with a branch to a flat on every floor ----
      const riserTop = roofY - 0.05;
      const riserLen = riserTop - plant.riserY;
      const riser = add(new THREE.CylinderGeometry(0.03, 0.03, riserLen, 16), xray, RISER.x, plant.riserY + riserLen / 2, RISER.z, scene, false);
      riser.renderOrder = 5;
      const xrayParts = [riser];
      for (let i = 0; i < FLOORS; i++) {
        if (i === HOME) continue;
        const b = add(new THREE.BoxGeometry(0.012, 0.012, D / 2 - 0.2 - RISER.z), xray, RISER.x, PODIUM + i * FLOOR_H + 0.09, (RISER.z + D / 2 - 0.2) / 2, scene, false);
        b.renderOrder = 5;
        xrayParts.push(b);
      }

      // ---- the flat on floor 7: a lived-in kitchen, built in kitchen units and scaled into the tower ----
      const kitchen = new THREE.Group();
      kitchen.position.set(K.x, K.y, K.z);
      kitchen.scale.setScalar(K.s);
      scene.add(kitchen);
      const marble = marbleTexture(THREE);
      const wood = woodTexture(THREE);
      const tiles = tileTexture(THREE);
      tiles.repeat.set(4, 2);
      textures.push(marble, wood, tiles);
      const kAdd = (geo, mat, x, y, z) => add(geo, mat, x, y, z, kitchen);
      const stone = phys({ map: marble, roughness: 0.18, clearcoat: 0.7 });
      const walnut = phys({ map: wood, roughness: 0.6 });
      const chrome = phys({ color: 0xe8ebef, metalness: 1, roughness: 0.08 });
      const matteInk = phys({ color: C.ink, roughness: 0.42, metalness: 0.2, clearcoat: 0.4 });
      const line = phys({ color: C.orange, roughness: 0.3, clearcoat: 0.8, emissive: C.orange, emissiveIntensity: 0.45 });
      const TOP = 0.92;
      kAdd(new THREE.BoxGeometry(5.2, 0.02, 4.2), phys({ color: 0xcdbfa9, roughness: 0.7 }), 0, 0.01, 1.2); // floor
      kAdd(new THREE.BoxGeometry(2.4, 0.86, 0.86), walnut, 0, 0.43, 0);
      kAdd(new THREE.BoxGeometry(2.52, 0.06, 0.98), stone, 0, TOP - 0.03, 0);
      kAdd(new THREE.BoxGeometry(5.2, 2.6, 0.04), phys({ map: tiles, roughness: 0.35 }), 0, 1.3, -0.52);
      kAdd(new THREE.CylinderGeometry(0.024, 0.026, 0.28, 24), chrome, -0.2, TOP + 0.14, -0.3);
      const mixer = new THREE.CatmullRomCurve3([V(-0.2, TOP + 0.28, -0.3), V(-0.2, TOP + 0.36, -0.25), V(-0.2, TOP + 0.33, -0.08), V(-0.2, TOP + 0.27, -0.04)]);
      kAdd(new THREE.TubeGeometry(mixer, 32, 0.016, 16), chrome, 0, 0, 0);
      kAdd(new THREE.CylinderGeometry(0.016, 0.018, 0.3, 24), matteInk, 0.3, TOP + 0.17, -0.3);
      kAdd(new THREE.TorusGeometry(0.031, 0.005, 10, 32), line, 0.3, TOP + 0.024, -0.3).rotation.x = Math.PI / 2;
      const gooseneck = new THREE.CatmullRomCurve3([V(0.3, TOP + 0.32, -0.3), V(0.3, TOP + 0.45, -0.24), V(0.3, TOP + 0.43, -0.06), V(0.3, TOP + 0.37, 0.02)]);
      kAdd(new THREE.TubeGeometry(gooseneck, 32, 0.011, 16), matteInk, 0, 0, 0);
      kAdd(new RoundedBoxGeometry(0.34, 0.46, 0.08, 6, 0.04), phys({ color: 0xffffff, roughness: 0.25, clearcoat: 1 }), 0.8, 1.42, -0.46);
      const unitScreen = kAdd(new RoundedBoxGeometry(0.22, 0.09, 0.01, 3, 0.004), new THREE.MeshStandardMaterial({ color: C.ink, emissive: C.water, emissiveIntensity: 0 }), 0.8, 1.5, -0.416);
      const unitLed = kAdd(new THREE.SphereGeometry(0.013, 16, 16), new THREE.MeshStandardMaterial({ color: C.yellow, emissive: C.yellow, emissiveIntensity: 0 }), 0.8, 1.33, -0.416);
      const glassMat = phys({ color: 0xffffff, roughness: 0.03, transparent: true, opacity: 0.28, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
      kAdd(new THREE.CylinderGeometry(0.048, 0.042, 0.14, 32, 1, true), glassMat, 0.3, TOP + 0.07, 0.02);
      const glassWater = kAdd(new THREE.CylinderGeometry(0.043, 0.039, 1, 32), phys({ color: C.water, roughness: 0.08, transparent: true, opacity: 0.92 }), 0.3, TOP, 0.02);
      // the line in the kitchen, and this floor's branch from the riser to it
      const kLine = [[-1.02, TOP, -0.475], [-1.02, 1.85, -0.475], [0.8, 1.85, -0.475], [0.8, 1.66, -0.475]].map((p) => V(...p));
      const kFeed = [[0.8, 1.19, -0.475], [0.8, 0.99, -0.475], [0.3, 0.99, -0.475], [0.3, TOP + 0.02, -0.3]].map((p) => V(...p));
      tube(kLine, 0.018, line, kitchen);
      tube(kFeed, 0.012, line, kitchen);
      const by = K.y + 0.092;
      const branch = [V(RISER.x, by, RISER.z), V(RISER.x, by, K.z - 0.0475), kw(-1.02, TOP, -0.475)];
      const branchMesh = tube(branch, 0.012, xray);
      branchMesh.renderOrder = 5;
      xrayParts.push(branchMesh);
      // a warm light in the flat, which comes up as the drop arrives
      const flatLight = new THREE.PointLight(0xffd3a0, 0, 1.2);
      flatLight.position.copy(kw(0, 2.3, 1.2));
      scene.add(flatLight);
      const kitchenFill = new THREE.PointLight(0xffffff, 0.35, 0.6);
      kitchenFill.position.copy(kw(0.2, 2.0, 1.5));
      scene.add(kitchenFill);

      // ---- the drop's route, in five legs ----
      const leg = (pts) => {
        const path = new THREE.CurvePath();
        for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
        return path;
      };
      const legs = [
        leg([V(plant.pumpXs[0] + 0.08, plant.riserY, plant.headerZ), V(RISER.x, plant.riserY, plant.headerZ), V(RISER.x, plant.riserY, RISER.z), V(RISER.x, PODIUM, RISER.z)]),
        leg([V(RISER.x, PODIUM, RISER.z), V(RISER.x, by, RISER.z)]),
        leg([...branch, kw(-1.02, 1.85, -0.475), kw(0.8, 1.85, -0.475)]),
        leg([kw(0.8, 1.85, -0.475), kw(0.8, 1.42, -0.42), kw(0.8, 1.19, -0.475), ...kFeed.slice(1).map((p) => kw(p.x, p.y, p.z))]),
        leg([kw(0.3, TOP + 0.02, -0.3), kw(0.3, TOP + 0.32, -0.3), kw(0.3, TOP + 0.45, -0.24), kw(0.3, TOP + 0.43, -0.06), kw(0.3, TOP + 0.37, 0.02), kw(0.3, TOP + 0.08, 0.02)]),
      ];
      // camera: a wide dusk shot, the climb up the facade, the approach to the window, then inside the kitchen
      const OFFSET = [V(4.6, 3.0, 8.8), V(2.8, 0.7, 4.6), V(0.42, 0.06, 1.35), V(0.2, 0.03, 0.3), V(0.14, 0.035, 0.22)];
      // where the camera looks, relative to the drop: up at the whole tower first, then on the drop
      const LOOK = [V(0, 2.0, 0), V(0, 0.35, 0), V(0, 0, 0), V(0, 0, 0), V(0, 0, 0)];
      const lookAt = new THREE.Vector3();
      const SIZE = [0.05, 0.05, 0.012, 0.004, 0.003];

      // the drop: drawn over everything, so it reads through the building
      const drop = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), new THREE.MeshBasicMaterial({ color: 0xe6f6fc, depthTest: false }));
      drop.renderOrder = 10;
      scene.add(drop);
      const halo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), new THREE.MeshBasicMaterial({ color: 0x7cc7e3, transparent: true, opacity: 0.4, depthTest: false }));
      halo.renderOrder = 9;
      scene.add(halo);
      const trail = [0.5, 0.32, 0.18].map((o) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xbfe3f0, transparent: true, opacity: o, depthTest: false }));
        m.renderOrder = 8;
        scene.add(m);
        return m;
      });

      // dusk light: cool sky, a low moon, warm windows
      scene.add(new THREE.HemisphereLight(0x8fa3c4, 0x0b0f17, 0.75));
      const moon = new THREE.DirectionalLight(0xb7c6e0, 1.1);
      moon.position.set(-4, 8, 6);
      moon.castShadow = true;
      moon.shadow.mapSize.set(2048, 2048);
      Object.assign(moon.shadow.camera, { left: -6, right: 6, top: 7, bottom: -2 });
      scene.add(moon);

      // ---- placing everything for a progress p (0 to 1) ----
      const bounds = [...MOMENTS.map((m) => m.at), 1];
      const offset = new THREE.Vector3();
      const pos = new THREE.Vector3();
      let narrow = false;
      let lastMoment = -1;
      let lastFloor;
      const place = (p) => {
        let i = MOMENTS.length - 1;
        while (i > 0 && p < bounds[i]) i--;
        const local = clamp01((p - bounds[i]) / (bounds[i + 1] - bounds[i]));
        legs[i].getPointAt(local, pos);

        const prev = Math.max(0, i - 1);
        const blend = i > 0 ? smooth(clamp01(local / 0.32)) : 1;
        offset.copy(OFFSET[prev]).lerp(OFFSET[i], blend).multiplyScalar(narrow ? 1.35 : 1);
        const size = SIZE[prev] + (SIZE[i] - SIZE[prev]) * blend;

        drop.position.copy(pos);
        drop.scale.setScalar(size);
        drop.visible = !(i === 4 && local > 0.97);
        halo.position.copy(pos);
        halo.scale.setScalar(size * 1.9);
        halo.visible = drop.visible;
        trail.forEach((m, k) => {
          legs[i].getPointAt(clamp01(local - (k + 1) * 0.025), m.position);
          m.scale.setScalar(size * (0.75 - k * 0.18));
          m.visible = drop.visible && local > 0.03;
        });

        // the flat lights up as the drop turns into it; the unit wakes; the glass fills
        const arrive = i > 2 ? 1 : i === 2 ? smooth(clamp01(local / 0.4)) : 0;
        flatLight.intensity = 0.9 * arrive;
        homePane.mesh.material.emissive.setHex(0xffc98a);
        homePane.mesh.material.emissiveIntensity = 0.9 * arrive;
        const wake = i > 3 ? 1 : i === 3 ? smooth(clamp01((local - 0.15) / 0.35)) : 0;
        unitLed.material.emissiveIntensity = 1.4 * wake;
        unitScreen.material.emissiveIntensity = 0.5 * wake;
        const fill = i === 4 ? smooth(clamp01((local - 0.82) / 0.18)) : 0;
        const lvl = 0.006 + 0.1 * fill;
        glassWater.scale.y = lvl;
        glassWater.position.y = TOP + 0.008 + lvl / 2;

        lookAt.copy(LOOK[prev]).lerp(LOOK[i], blend).add(pos);
        camera.position.copy(pos).add(offset);
        camera.lookAt(lookAt);
        // the x-ray line shows the route from outside; it fades as the camera reaches the window,
        // and inside the flat only the kitchen's own pipes show
        const xr = i < 2 ? 0.9 : i === 2 ? 0.9 * (1 - smooth(clamp01(local / 0.5))) : 0;
        xray.opacity = xr;
        xrayParts.forEach((m) => (m.visible = xr > 0.01));
        // the home window opens up once the camera passes through it
        homePane.mesh.visible = camera.position.z > D / 2 + 0.03;
        renderer.render(scene, camera);

        if (i !== lastMoment) {
          lastMoment = i;
          setMoment(i);
        }
        const f = i === 0 ? 0 : i === 1 ? Math.max(1, Math.min(HOME + 1, Math.floor((pos.y - PODIUM) / FLOOR_H) + 1)) : HOME + 1;
        if (f !== lastFloor) {
          lastFloor = f;
          setFloor(f);
        }
      };

      // ---- scroll drives the progress; the display eases towards it ----
      let target = reduce ? 1 : 0;
      let shown = target;
      let raf = null;
      const readScroll = () => {
        const s = section.current;
        if (!s) return;
        const r = s.getBoundingClientRect();
        const run = s.offsetHeight - window.innerHeight;
        target = run > 0 ? clamp01(-r.top / run) : 1;
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const tick = () => {
        shown += (target - shown) * 0.12;
        if (Math.abs(target - shown) < 0.0004) shown = target;
        place(shown);
        raf = shown === target ? null : requestAnimationFrame(tick);
      };
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        narrow = w < 700;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        place(shown);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      setReady(true);
      if (!reduce) {
        window.addEventListener('scroll', readScroll, { passive: true });
        readScroll();
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('scroll', readScroll);
        textures.forEach((t) => t.dispose());
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    start();
    return () => {
      disposed = true;
      cleanup();
      cancelAnimationFrame(auto.current);
    };
  }, []);

  // "Play the journey": scrolls through the section on its own, like a film; any scroll, touch or key hands control back
  const play = () => {
    const s = section.current;
    if (!s) return;
    const from = window.scrollY;
    const to = s.offsetTop + s.offsetHeight - window.innerHeight;
    const dur = 15000;
    const t0 = performance.now();
    setPlaying(true);
    const stop = () => {
      cancelAnimationFrame(auto.current);
      setPlaying(false);
      ['wheel', 'touchstart', 'keydown'].forEach((e) => window.removeEventListener(e, stop));
    };
    ['wheel', 'touchstart', 'keydown'].forEach((e) => window.addEventListener(e, stop, { passive: true }));
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo({ top: from + (to - from) * p, behavior: 'instant' }); // not the page's smooth scrolling
      if (p < 1) auto.current = requestAnimationFrame(step);
      else stop();
    };
    auto.current = requestAnimationFrame(step);
  };

  const m = MOMENTS[moment];

  return (
    <section
      ref={section}
      className={`drop${still ? ' is-still' : ''}${ready ? ' is-ready' : ''}${moment === 0 ? ' is-start' : ''}`}
      aria-labelledby="drop-title"
    >
      <div className="drop-stage">
        <div
          ref={host}
          className="drop-canvas"
          role="img"
          aria-label="A residential tower at dusk among its neighbours. The water line glows through the building. One drop travels from the plant room below ground, up the tower, into a flat on floor 7, through its window into the kitchen, past the Moya1 control unit and out of the Moya One tap into a glass."
        />

        <div className="drop-copy container">
          <div className={`drop-intro${moment > 0 && !still ? ' is-away' : ''}`}>
            <h2 id="drop-title" className="drop-title">
              Now see it happen.
            </h2>
            <p className="drop-lede">Follow one drop from the plant room to your glass. Scroll, or play it like a film.</p>
            {!still && (
              <button type="button" className="drop-play" onClick={play} disabled={playing}>
                <Play size={18} aria-hidden="true" />
                {playing ? 'Playing…' : 'Play the journey'}
              </button>
            )}
          </div>
          {!still && (
            <div className="drop-caption" aria-live="polite" key={moment}>
              <p className="drop-caption-title">{m.title}</p>
              <p className="drop-caption-text">{m.text}</p>
            </div>
          )}
        </div>

        {!still && (
          <>
            <ol className="drop-rail" aria-hidden="true">
              {MOMENTS.map((x, i) => (
                <li key={x.title} className={i < moment ? 'is-past' : i === moment ? 'is-now' : undefined}>
                  <span />
                </li>
              ))}
            </ol>
            <div className="drop-hud" data-ui aria-hidden="true">
              <span>{floor ? 'Floor' : 'Where it is'}</span>
              <strong>{floor ? floor : 'Plant room'}</strong>
              <em className="sample">Illustrative</em>
            </div>
          </>
        )}
      </div>

      {still && (
        <ol className="drop-list container">
          {MOMENTS.map((x) => (
            <li key={x.title}>
              <strong>{x.title}</strong>
              <span>{x.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
