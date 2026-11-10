'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { SAMPLE_BALANCE_L, SAMPLE_PACKS_L } from '@/lib/content';
import { marbleTexture, tileTexture, woodTexture } from '@/lib/three/finishes';

// A real-time 3D Moya One kitchen, built in code (no downloaded model, no raster images), staged like a
// showroom: marble worktop, walnut cabinets, an undermount steel sink, the resident's usual mixer and the
// slim Moya One drinking-water tap. It plays like a short film: the line rises, the unit wakes, the phone
// recharges, the tap pours. Nothing shows how the water is treated (CLAUDE.md non-negotiable 2).
// UI colours are DESIGN.md tokens; the 3D materials (stone, wood, metal) are real-world finishes.
const C = {
  base: 0xfafaf7,
  ink: 0x111827,
  orange: 0xf97316,
  yellow: 0xffd60a,
  grey: 0xf3f4f6,
  line: 0xe5e7eb,
  water: 0xbfe3f0,
};

const FROM_L = SAMPLE_BALANCE_L;
const TO_L = SAMPLE_BALANCE_L + SAMPLE_PACKS_L[1];
const STEP = 2.8; // seconds per chapter; DESIGN.md: never over 3s per step

const TOP = 0.92; // worktop surface
const SINK = { x: 0.1, z: 0.02, w: 0.62, d: 0.4, depth: 0.2 };
const MOYA_TAP = { x: 0.3, z: -0.3 };
const MIXER = { x: -0.06, z: -0.3 };
const GLASS = { x: 0.3, z: 0.02 };

// Camera framing per chapter: [position, look-at].
const OVERVIEW = [[1.75, 2.2, 4.5], [0, 1.05, 0]];
const CHAPTERS = [
  { id: 'line', title: 'Its own water line', cam: [[-1.95, 1.75, 2.45], [-0.75, 1.38, -0.45]] },
  { id: 'unit', title: 'Moya1™ control unit', cam: [[1.6, 1.62, 1.7], [0.78, 1.38, -0.44]] },
  { id: 'phone', title: 'Moya One app', cam: [[-0.42, 1.62, 1.12], [-0.62, TOP, 0.18]] },
  { id: 'tap', title: 'Your sink, two taps', cam: [[0.62, 1.62, 1.25], [0.12, 1.0, -0.12]] },
];

// Labels, each tied to a chapter: shown while that chapter plays, all of them at the end.
const MARKS = [
  { id: 'line', ch: 0, at: [-1.02, 1.5, -0.455], side: -1, title: 'Its own water line', text: 'Laid while the tower is built' },
  { id: 'unit', ch: 1, at: [0.8, 1.42, -0.4], side: 1, title: 'Moya1™ control unit', text: 'One in every kitchen' },
  { id: 'phone', ch: 2, at: [-0.62, TOP + 0.03, 0.18], side: -1, title: 'Moya One app', text: 'Recharge litres, like a mobile plan' },
  { id: 'tap', ch: 3, at: [MOYA_TAP.x, 1.36, MOYA_TAP.z + 0.02], side: 1, title: 'Moya One tap', text: 'Drinking water only' },
  { id: 'mixer', ch: 3, at: [MIXER.x, 1.2, MIXER.z], side: -1, title: 'Your usual tap', text: 'Stays as it is' },
];

function drawPhone(g, w, h, litres, fill) {
  g.fillStyle = '#FAFAF7';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#111827';
  g.font = '700 30px sans-serif';
  g.textAlign = 'left';
  g.fillText('Moya One', 30, 70);
  g.fillStyle = '#4B5563';
  g.font = '500 22px sans-serif';
  g.fillText('Sample data', 30, 108);
  g.fillStyle = '#F3F4F6';
  g.beginPath();
  g.roundRect(24, 150, w - 48, 230, 28);
  g.fill();
  g.fillStyle = '#4B5563';
  g.font = '500 22px sans-serif';
  g.fillText('Available balance', 48, 200);
  g.fillStyle = '#111827';
  g.font = '700 84px sans-serif';
  const num = String(Math.round(litres));
  g.fillText(num, 44, 296);
  const numW = g.measureText(num).width;
  g.font = '600 26px sans-serif';
  g.fillStyle = '#4B5563';
  g.fillText('litres', 56 + numW, 296);
  g.fillStyle = '#FAFAF7';
  g.beginPath();
  g.roundRect(48, 326, w - 96, 18, 9);
  g.fill();
  g.fillStyle = '#BFE3F0';
  g.beginPath();
  g.roundRect(48, 326, Math.max(18, (w - 96) * fill), 18, 9);
  g.fill();
  g.fillStyle = '#F97316';
  g.beginPath();
  g.roundRect(24, 600, w - 48, 72, 36);
  g.fill();
  g.fillStyle = '#111827';
  g.font = '600 26px sans-serif';
  g.textAlign = 'center';
  g.fillText(`Recharge ${SAMPLE_PACKS_L[1]} litres`, w / 2, 646);
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.max(0, Math.min(1, t));

// Without `stage` it plays its film on its own (home hero). With `stage` (0 to 3) a page drives it,
// one chapter at a time, and the film's controls are hidden.
export default function KitchenScene({ stage }) {
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const host = useRef(null);
  const marks = useRef({});
  const api = useRef(null);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(-1); // -1: not started; CHAPTERS.length: finished
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
        console.error('3D scene failed to load', err);
        return;
      }
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // no WebGL: the captions still tell the story
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true; // taste-skill-ignore: 3D lighting, not a CSS shadow
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
      const textures = [];

      const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.55, ...o });
      const add = (geo, m, x, y, z, parent = scene) => {
        const mesh = new THREE.Mesh(geo, m);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };

      // finishes
      const marble = marbleTexture(THREE);
      const wood = woodTexture(THREE);
      const tiles = tileTexture(THREE);
      tiles.repeat.set(4, 2);
      textures.push(marble, wood, tiles);
      const stone = phys({ map: marble, roughness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.12 });
      const walnut = phys({ map: wood, roughness: 0.6 });
      const chrome = phys({ color: 0xe8ebef, metalness: 1, roughness: 0.08 });
      const brushed = phys({ color: 0xc9ced4, metalness: 1, roughness: 0.32 });
      const matteInk = phys({ color: C.ink, roughness: 0.42, metalness: 0.2, clearcoat: 0.4 });

      // walnut cabinets: carcass, three doors with fine gaps, slim steel pulls, recessed plinth
      add(new THREE.BoxGeometry(2.4, 0.08, 0.84), phys({ color: 0x1a1a1a, roughness: 0.9 }), 0, 0.04, -0.03);
      // carcass stops below the sink basin, side panels close the ends
      add(new THREE.BoxGeometry(2.36, 0.56, 0.86), walnut, 0, 0.36, 0);
      [-1.19, 1.19].forEach((x) => add(new THREE.BoxGeometry(0.02, 0.78, 0.86), walnut, x, 0.47, 0));
      add(new THREE.BoxGeometry(2.36, 0.22, 0.02), walnut, 0, 0.75, -0.42);
      [-0.8, 0, 0.8].forEach((x) => {
        add(new RoundedBoxGeometry(0.78, 0.74, 0.03, 2, 0.006), walnut, x, 0.47, 0.445);
        add(new RoundedBoxGeometry(0.42, 0.016, 0.022, 2, 0.006), brushed, x, 0.8, 0.47);
      });

      // marble worktop, cut around an undermount sink
      const T = 0.06;
      const y = TOP - T / 2;
      const sx0 = SINK.x - SINK.w / 2;
      const sx1 = SINK.x + SINK.w / 2;
      const sz0 = SINK.z - SINK.d / 2;
      const sz1 = SINK.z + SINK.d / 2;
      const top = (x0, x1, z0, z1) => add(new THREE.BoxGeometry(x1 - x0, T, z1 - z0), stone, (x0 + x1) / 2, y, (z0 + z1) / 2);
      top(-1.26, sx0, -0.5, 0.5);
      top(sx1, 1.26, -0.5, 0.5);
      top(sx0, sx1, sz1, 0.5);
      top(sx0, sx1, -0.5, sz0);

      // the sink: brushed steel basin with walls and a drain
      const sinkY = TOP - T - SINK.depth;
      add(new THREE.BoxGeometry(SINK.w, 0.01, SINK.d), brushed, SINK.x, sinkY, SINK.z);
      add(new THREE.BoxGeometry(SINK.w, SINK.depth, 0.01), brushed, SINK.x, sinkY + SINK.depth / 2, sz0);
      add(new THREE.BoxGeometry(SINK.w, SINK.depth, 0.01), brushed, SINK.x, sinkY + SINK.depth / 2, sz1);
      add(new THREE.BoxGeometry(0.01, SINK.depth, SINK.d), brushed, sx0, sinkY + SINK.depth / 2, SINK.z);
      add(new THREE.BoxGeometry(0.01, SINK.depth, SINK.d), brushed, sx1, sinkY + SINK.depth / 2, SINK.z);
      add(new THREE.CylinderGeometry(0.035, 0.035, 0.006, 32), chrome, SINK.x - 0.12, sinkY + 0.008, SINK.z);

      // stone-tile splashback and wall
      add(new THREE.BoxGeometry(2.52, 1.36, 0.04), phys({ map: tiles, roughness: 0.35, clearcoat: 0.3 }), 0, 1.6, -0.52);

      // the resident's usual mixer tap: chrome, tall spout, side lever
      add(new THREE.CylinderGeometry(0.035, 0.04, 0.03, 32), chrome, MIXER.x, TOP + 0.015, MIXER.z);
      add(new THREE.CylinderGeometry(0.024, 0.026, 0.26, 32), chrome, MIXER.x, TOP + 0.16, MIXER.z);
      const mixerSpout = new THREE.CatmullRomCurve3([
        new THREE.Vector3(MIXER.x, TOP + 0.28, MIXER.z),
        new THREE.Vector3(MIXER.x, TOP + 0.36, MIXER.z + 0.04),
        new THREE.Vector3(MIXER.x, TOP + 0.34, MIXER.z + 0.2),
        new THREE.Vector3(MIXER.x, TOP + 0.27, MIXER.z + 0.26),
      ]);
      add(new THREE.TubeGeometry(mixerSpout, 48, 0.016, 20), chrome, 0, 0, 0);
      const lever = add(new THREE.BoxGeometry(0.11, 0.012, 0.016), chrome, MIXER.x + 0.07, TOP + 0.24, MIXER.z);
      lever.rotation.z = 0.25;

      // the Moya One tap: slim matte ink column, orange ring, fine gooseneck in brushed steel
      add(new THREE.CylinderGeometry(0.03, 0.034, 0.02, 32), matteInk, MOYA_TAP.x, TOP + 0.01, MOYA_TAP.z);
      add(new THREE.TorusGeometry(0.031, 0.005, 12, 48), phys({ color: C.orange, roughness: 0.35, emissive: C.orange, emissiveIntensity: 0.25 }), MOYA_TAP.x, TOP + 0.024, MOYA_TAP.z).rotation.x = Math.PI / 2;
      add(new THREE.CylinderGeometry(0.016, 0.018, 0.3, 32), matteInk, MOYA_TAP.x, TOP + 0.17, MOYA_TAP.z);
      const moyaSpout = new THREE.CatmullRomCurve3([
        new THREE.Vector3(MOYA_TAP.x, TOP + 0.32, MOYA_TAP.z),
        new THREE.Vector3(MOYA_TAP.x, TOP + 0.45, MOYA_TAP.z + 0.06),
        new THREE.Vector3(MOYA_TAP.x, TOP + 0.43, MOYA_TAP.z + 0.24),
        new THREE.Vector3(MOYA_TAP.x, TOP + 0.37, MOYA_TAP.z + 0.32),
      ]);
      add(new THREE.TubeGeometry(moyaSpout, 48, 0.011, 20), matteInk, 0, 0, 0);
      const spoutEnd = moyaSpout.getPoint(1);

      // water from the Moya One tap into a glass standing in the sink
      const waterMat = phys({ color: C.water, roughness: 0.04, transparent: true, opacity: 0.85, emissive: C.water, emissiveIntensity: 0.2 });
      const stream = add(new THREE.CylinderGeometry(0.007, 0.009, 1, 16), waterMat, spoutEnd.x, 1, spoutEnd.z);
      const glassMat = phys({ color: 0xffffff, roughness: 0.03, transparent: true, opacity: 0.25, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
      const glassBase = sinkY + 0.006;
      add(new THREE.CylinderGeometry(0.048, 0.042, 0.14, 40, 1, true), glassMat, GLASS.x, glassBase + 0.07, GLASS.z);
      add(new THREE.CylinderGeometry(0.042, 0.042, 0.008, 40), glassMat, GLASS.x, glassBase + 0.004, GLASS.z);
      const glassWater = add(new THREE.CylinderGeometry(0.043, 0.039, 1, 40), phys({ color: C.water, roughness: 0.08, transparent: true, opacity: 0.9 }), GLASS.x, glassBase, GLASS.z);
      const streamTop = spoutEnd.y - 0.01;
      const streamBottom = glassBase + 0.02;

      // the Moya1 control unit: white glass-front box, dark screen, one status light
      add(new RoundedBoxGeometry(0.34, 0.46, 0.08, 6, 0.04), phys({ color: 0xffffff, roughness: 0.25, clearcoat: 1 }), 0.8, 1.42, -0.46);
      const unitScreen = add(new RoundedBoxGeometry(0.22, 0.09, 0.01, 3, 0.004), new THREE.MeshStandardMaterial({ color: C.ink, emissive: C.water, emissiveIntensity: 0, roughness: 0.15 }), 0.8, 1.5, -0.416);
      const led = add(new THREE.SphereGeometry(0.013, 24, 24), new THREE.MeshStandardMaterial({ color: C.yellow, emissive: C.yellow, emissiveIntensity: 0 }), 0.8, 1.33, -0.416);

      // its own water line: up the wall into the unit, then on to the Moya One tap
      const lineMat = phys({ color: C.orange, roughness: 0.4, clearcoat: 0.5 });
      const pipePath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-1.02, TOP, -0.475),
          new THREE.Vector3(-1.02, 1.82, -0.475),
          new THREE.Vector3(-0.96, 1.88, -0.475),
          new THREE.Vector3(0.74, 1.88, -0.475),
          new THREE.Vector3(0.8, 1.82, -0.475),
          new THREE.Vector3(0.8, 1.66, -0.475),
        ],
        false,
        'catmullrom',
        0.05,
      );
      const pipe = add(new THREE.TubeGeometry(pipePath, 200, 0.018, 16), lineMat, 0, 0, 0);
      const pipeCount = pipe.geometry.index.count;
      const feedPath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0.8, 1.19, -0.475),
          new THREE.Vector3(0.8, 1.02, -0.475),
          new THREE.Vector3(0.74, 0.98, -0.475),
          new THREE.Vector3(MOYA_TAP.x + 0.05, 0.98, -0.475),
          new THREE.Vector3(MOYA_TAP.x, 0.95, -0.475),
          new THREE.Vector3(MOYA_TAP.x, TOP, -0.475),
        ],
        false,
        'catmullrom',
        0.05,
      );
      const feed = add(new THREE.TubeGeometry(feedPath, 120, 0.012, 12), lineMat, 0, 0, 0);
      const feedCount = feed.geometry.index.count;

      // phone on the worktop, its screen drawn live
      const phone = new THREE.Group();
      phone.position.set(-0.62, TOP + 0.008, 0.18);
      phone.rotation.y = 0.45;
      scene.add(phone);
      add(new RoundedBoxGeometry(0.2, 0.016, 0.4, 4, 0.006), matteInk, 0, 0, 0, phone);
      const cv = document.createElement('canvas');
      cv.width = 360;
      cv.height = 720;
      const g2 = cv.getContext('2d');
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      textures.push(tex);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.37), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      screen.rotation.x = -Math.PI / 2;
      screen.position.y = 0.009;
      phone.add(screen);

      // a stoneware vase: staging, as in a showroom
      const vase = new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.06, 0),
          new THREE.Vector2(0.075, 0.08),
          new THREE.Vector2(0.05, 0.2),
          new THREE.Vector2(0.03, 0.26),
          new THREE.Vector2(0.034, 0.28),
        ],
        48,
      );
      add(vase, phys({ color: 0xd9d3c7, roughness: 0.85 }), -1.0, TOP, -0.25);

      // ground contact and a warm key light
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.35 })); // taste-skill-ignore: 3D lighting
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
      const sun = new THREE.DirectionalLight(0xfff4e6, 1.9);
      sun.position.set(-2.5, 5, 4);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.radius = 6;
      sun.shadow.bias = -0.0004;
      Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
      scene.add(sun);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.35));

      // ---- the film ----
      const state = { pipe: 1, unit: 1, phone: 1, pour: 1 };
      const camPos = new THREE.Vector3(...OVERVIEW[0]);
      const camLook = new THREE.Vector3(...OVERVIEW[1]);
      const fromPos = new THREE.Vector3();
      const fromLook = new THREE.Vector3();
      const toPos = new THREE.Vector3();
      const toLook = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      const anchors = MARKS.map((m) => new THREE.Vector3(...m.at));
      let narrow = false;
      let orbit = 0;
      let lastPhone = -1;
      let active = -1;
      let playing = false;

      const apply = () => {
        pipe.geometry.setDrawRange(0, Math.floor((pipeCount * clamp01(state.pipe * 1.25)) / 6) * 6);
        feed.geometry.setDrawRange(0, Math.floor((feedCount * clamp01(state.pipe * 1.25 - 0.25)) / 6) * 6);
        led.material.emissiveIntensity = 1.2 * state.unit;
        unitScreen.material.emissiveIntensity = 0.5 * state.unit;
        const litres = FROM_L + (TO_L - FROM_L) * state.phone;
        if (Math.round(litres) !== lastPhone) {
          lastPhone = Math.round(litres);
          drawPhone(g2, cv.width, cv.height, litres, 0.2 + 0.55 * state.phone);
          tex.needsUpdate = true;
        }
        const s = clamp01(state.pour * 1.6);
        const len = (streamTop - streamBottom) * s;
        stream.visible = state.pour > 0 && state.pour < 1;
        stream.scale.y = Math.max(0.001, len);
        stream.position.y = streamTop - len / 2;
        const lvl = 0.008 + 0.1 * clamp01((state.pour - 0.3) / 0.7);
        glassWater.scale.y = lvl;
        glassWater.position.y = glassBase + 0.008 + lvl / 2;
      };

      // labels sit beside their marks, may leave the card but never the screen, and step aside if they meet
      const placeMarks = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        const gap = narrow ? 26 : 44;
        const r = el.getBoundingClientRect();
        const minL = Math.max(-r.left + 12, narrow ? -4 : -40);
        const maxR = Math.min(window.innerWidth - r.left - 12, w + (narrow ? 4 : 40));
        const boxes = [];
        MARKS.forEach((mk, i) => {
          const m = marks.current[mk.id];
          if (!m || !m.dot || !m.label || !m.line) return;
          const p = anchors[i].clone().project(camera);
          const inView = Math.abs(p.x) < 0.98 && Math.abs(p.y) < 0.98;
          const on = inView && (playing ? mk.ch === active && state[['pipe', 'unit', 'phone', 'pour'][mk.ch]] > 0.15 : active < 0 || mk.ch === active);
          [m.dot, m.label, m.line].forEach((n) => {
            n.style.opacity = on ? 1 : 0;
            n.style.display = on ? '' : 'none'; // off-step labels leave the page entirely
          });
          if (!on) return;
          const x = (p.x * 0.5 + 0.5) * w;
          const y = (-p.y * 0.5 + 0.5) * h;
          const lw = m.label.offsetWidth;
          const lh = m.label.offsetHeight;
          let left = Math.max(minL, Math.min(maxR - lw, mk.side < 0 ? x - gap - lw : x + gap));
          let top = Math.max(-12, Math.min(h - lh, y - lh - gap * 0.5));
          for (const b of boxes) {
            if (left < b.l + b.w && left + lw > b.l && top < b.t + b.h + 6 && top + lh + 6 > b.t) top = b.t + b.h + 8;
          }
          top = Math.min(h - lh, top);
          boxes.push({ l: left, t: top, w: lw, h: lh });
          m.dot.style.transform = `translate(${x}px, ${y}px)`;
          m.label.style.transform = `translate(${left}px, ${top}px)`;
          m.line.setAttribute('x1', x);
          m.line.setAttribute('y1', y);
          m.line.setAttribute('x2', Math.max(left + 12, Math.min(left + lw - 12, x)));
          m.line.setAttribute('y2', y < top ? top : top + lh);
        });
      };

      const render = () => {
        const k = narrow ? 1.28 : 1;
        const pos = camPos.clone().sub(camLook).multiplyScalar(k);
        if (orbit) pos.applyAxisAngle(up, orbit);
        camera.position.copy(pos.add(camLook));
        camera.lookAt(camLook);
        renderer.render(scene, camera);
        placeMarks();
      };

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        narrow = w < 520;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let raf = null;
      let t0 = 0;

      const setFinal = () => {
        Object.assign(state, { pipe: 1, unit: 1, phone: 1, pour: 1 });
        camPos.set(...OVERVIEW[0]);
        camLook.set(...OVERVIEW[1]);
        active = -1;
        apply();
        render();
        setChapter(CHAPTERS.length);
        setProgress(1);
      };

      // a tapped chapter: show its finished state without motion
      const showChapter = (i) => {
        cancelAnimationFrame(raf);
        playing = false;
        orbit = 0;
        Object.assign(state, { pipe: 1, unit: i >= 1 ? 1 : 0, phone: i >= 2 ? 1 : 0, pour: i >= 3 ? 1 : 0 });
        camPos.set(...CHAPTERS[i].cam[0]);
        camLook.set(...CHAPTERS[i].cam[1]);
        active = i;
        apply();
        render();
        setChapter(i);
        setProgress((i + 1) / CHAPTERS.length);
      };

      const frame = (now) => {
        const t = Math.max(0, (now - t0) / 1000); // the first frame can be stamped just before t0
        const i = Math.floor(t / STEP);
        if (i >= CHAPTERS.length) {
          // back out to the whole kitchen, then rest
          const e = ease(clamp01((t - CHAPTERS.length * STEP) / 1.6));
          camPos.lerpVectors(fromPos.set(...CHAPTERS[3].cam[0]), toPos.set(...OVERVIEW[0]), e);
          camLook.lerpVectors(fromLook.set(...CHAPTERS[3].cam[1]), toLook.set(...OVERVIEW[1]), e);
          active = -1;
          state.pour = 1;
          apply();
          render();
          if (e < 1) raf = requestAnimationFrame(frame);
          else {
            playing = false;
            render();
            setChapter(CHAPTERS.length);
            setProgress(1);
          }
          return;
        }
        const local = (t - i * STEP) / STEP;
        if (i !== active) {
          active = i;
          setChapter(i);
        }
        setProgress((i + local) / CHAPTERS.length);
        // the camera travels in the first 40% of each chapter, the action plays after it
        const prev = i === 0 ? OVERVIEW : CHAPTERS[i - 1].cam;
        const e = ease(clamp01(local / 0.4));
        camPos.lerpVectors(fromPos.set(...prev[0]), toPos.set(...CHAPTERS[i].cam[0]), e);
        camLook.lerpVectors(fromLook.set(...prev[1]), toLook.set(...CHAPTERS[i].cam[1]), e);
        const a = ease(clamp01((local - 0.25) / 0.7));
        if (i === 0) state.pipe = a;
        if (i === 1) state.unit = a;
        if (i === 2) state.phone = a;
        if (i === 3) state.pour = a;
        apply();
        render();
        raf = requestAnimationFrame(frame);
      };

      const play = () => {
        cancelAnimationFrame(raf);
        orbit = 0;
        Object.assign(state, { pipe: 0, unit: 0, phone: 0, pour: 0 });
        camPos.set(...OVERVIEW[0]);
        camLook.set(...OVERVIEW[1]);
        active = -1;
        apply();
        playing = true;
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
      };

      // after the film, drag to look around the kitchen
      let dragX = null;
      const down = (e) => {
        if (playing) return;
        dragX = e.clientX;
        el.setPointerCapture?.(e.pointerId);
      };
      const move = (e) => {
        if (dragX === null) return;
        orbit = Math.max(-0.7, Math.min(0.5, orbit - (e.clientX - dragX) * 0.005));
        dragX = e.clientX;
        render();
      };
      const release = () => (dragX = null);
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);

      // driven by a page: travel to chapter i and play its action; earlier chapters are already done
      const KEYS = ['pipe', 'unit', 'phone', 'pour'];
      const goTo = (i, instant) => {
        cancelAnimationFrame(raf);
        playing = false;
        orbit = 0;
        active = i;
        KEYS.forEach((key, j) => (state[key] = j < i ? 1 : 0));
        fromPos.copy(camPos);
        fromLook.copy(camLook);
        toPos.set(...CHAPTERS[i].cam[0]);
        toLook.set(...CHAPTERS[i].cam[1]);
        const dur = reduce || instant ? 0 : 2.4;
        const tStart = performance.now();
        const tick = (now) => {
          const p = dur ? clamp01((now - tStart) / 1000 / dur) : 1;
          const e = ease(clamp01(p / 0.45));
          camPos.lerpVectors(fromPos, toPos, e);
          camLook.lerpVectors(fromLook, toLook, e);
          state[KEYS[i]] = dur ? ease(clamp01((p - 0.3) / 0.7)) : 1;
          apply();
          render();
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      api.current = { play, showChapter, goTo };
      resize();
      document.fonts?.ready.then(() => !disposed && render()); // labels are measured after the fonts arrive
      setReady(true);
      if (stageRef.current != null) goTo(stageRef.current, true);
      else if (reduce) setFinal();
      else play();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', release);
        el.removeEventListener('pointercancel', release);
        textures.forEach((t) => t.dispose());
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        api.current = null;
      };
    };

    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // a page moved to another chapter
  useEffect(() => {
    if (ready && stage != null) api.current?.goTo(stage);
  }, [stage, ready]);

  const done = chapter >= CHAPTERS.length || chapter < 0;
  const current = CHAPTERS[Math.max(0, Math.min(chapter, CHAPTERS.length - 1))];

  return (
    <div className={`kitchen${ready ? ' is-ready' : ''}${stage != null ? ' is-staged' : ''}`}>
      <div
        ref={host}
        className="kitchen-canvas"
        role="img"
        aria-label="A short 3D film of a Moya One kitchen with a marble worktop and an undermount sink: the water line rises up the wall, the Moya1™ control unit lights up, the phone recharges litres, and the slim Moya One tap beside the usual mixer fills a glass."
      />
      <svg className="kitchen-leads" aria-hidden="true">
        {MARKS.map((m) => (
          <line key={m.id} ref={(n) => n && (marks.current[m.id] = { ...marks.current[m.id], line: n })} />
        ))}
      </svg>
      {MARKS.map((m) => (
        <span
          key={m.id}
          className="kitchen-dot"
          ref={(n) => n && (marks.current[m.id] = { ...marks.current[m.id], dot: n })}
          aria-hidden="true"
        />
      ))}
      <ul className="kitchen-labels">
        {MARKS.map((m) => (
          <li key={m.id} ref={(n) => n && (marks.current[m.id] = { ...marks.current[m.id], label: n })}>
            <strong>{m.title}</strong>
            <span>{m.text}</span>
          </li>
        ))}
      </ul>

      {stage == null && (
        <div className="story">
          <p className="story-now" aria-live="polite">
            {done ? 'Drag to look around.' : current.title}
          </p>
          <div className="story-controls">
            <ol className="story-bar" aria-label="Chapters">
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <button type="button" onClick={() => api.current?.showChapter(i)} aria-label={c.title}>
                    <span style={{ transform: `scaleX(${clamp01(progress * CHAPTERS.length - i)})` }} />
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="story-replay" onClick={() => api.current?.play()} disabled={!ready}>
              <ArrowCounterClockwise size={18} aria-hidden="true" />
              Replay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
