'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react/dist/ssr';
import { SAMPLE_BALANCE_L, SAMPLE_PACKS_L } from '@/lib/content';
import { brushedTexture, concreteTexture, marbleTexture, woodTexture } from '@/lib/three/kitchenFinishes';

// A real-time 3D MoyaOne kitchen, built in code (no downloaded model, no raster images), staged like a
// showroom in warm light: veined marble worktop, walnut cabinets, a steel sink with its rim, and one tap.
// One tap. Filtered water. Zero hassle. (client clarification, Nov 10): the kitchen shows only the MoyaOne tap,
// brushed stainless steel, modelled on the reference Khan shared (slim gooseneck, cylindrical base, small side
// lever). No filters, machines or units in the flat: all of that sits in the building's basement. Its own line
// is a silver pipe with blue water in it that comes up the wall, across near the top and down into the tap.
// It plays like a short film on a loop (the line fills, the phone recharges, the tap pours), and the visitor can
// pause it and drag to look around. Nothing shows how the water is treated (CLAUDE.md non-negotiable 2).
// UI colours are DESIGN.md tokens; 3D materials are real-world finishes.
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
// the one tap: centred behind the sink, its gooseneck reaching over the basin
const MOYA_TAP = { x: SINK.x, z: -0.3 };
const NECK = { riser: TOP + 0.36, r: 0.085, drop: 0.06 }; // straight riser top, arc radius, outlet drop

// Camera framing per chapter: [position, look-at]. `key` is the part of the film the chapter plays.
const OVERVIEW = [[1.75, 2.2, 4.5], [0, 1.05, 0]];
const CHAPTERS = [
  { id: 'line', key: 'pipe', title: 'Its own water line', cam: [[-1.95, 1.75, 2.45], [-0.75, 1.38, -0.45]] },
  { id: 'phone', key: 'phone', title: 'MoyaOne app', cam: [[-0.42, 1.62, 1.12], [-0.62, TOP, 0.18]] },
  { id: 'tap', key: 'pour', title: 'One tap', cam: [[0.6, 1.48, 1.0], [MOYA_TAP.x, 1.1, -0.18]] },
  // the pour keeps running while the loft and the storage under the worktop turn translucent: nothing is stored
  // there for water (client change list: "100% space is free")
  { id: 'space', key: 'space', title: '100% space is free', cam: [[0.55, 1.32, 4.6], [0.05, 1.22, -0.25]] },
];
const KEYS = CHAPTERS.map((c) => c.key);

// Labels, each tied to a chapter: shown while that chapter plays, all of them at the end.
const MARKS = [
  { id: 'line', ch: 0, at: [-1.02, 1.5, -0.455], side: -1, title: 'Its own water line', text: 'Laid while the tower is built' },
  { id: 'phone', ch: 1, at: [-0.62, TOP + 0.03, 0.18], side: -1, title: 'MoyaOne app', text: 'Recharge litres, like a mobile plan' },
  { id: 'tap', ch: 2, at: [MOYA_TAP.x + 0.02, TOP + 0.07, MOYA_TAP.z], side: 1, title: 'MoyaOne tap', text: 'Drinking water only' },
];

function drawPhone(g, w, h, litres, fill) {
  g.fillStyle = '#FFFFFF';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#0B1626';
  g.font = '700 30px sans-serif';
  g.textAlign = 'left';
  g.fillText('MoyaOne', 30, 70);
  // "Sample data" label removed: client change list (Nov 7), item 1. Overrides CLAUDE.md non-negotiable 5 on the
  // agency's instruction; Rayansh to confirm.
  g.fillStyle = '#EEF2F7';
  g.beginPath();
  g.roundRect(24, 150, w - 48, 230, 28);
  g.fill();
  g.fillStyle = '#4B5768';
  g.font = '500 22px sans-serif';
  g.fillText('Available balance', 48, 200);
  g.fillStyle = '#0B1626';
  g.font = '700 84px sans-serif';
  const num = String(Math.round(litres));
  g.fillText(num, 44, 296);
  const numW = g.measureText(num).width;
  g.font = '600 26px sans-serif';
  g.fillStyle = '#4B5768';
  g.fillText('litres', 56 + numW, 296);
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.roundRect(48, 326, w - 96, 18, 9);
  g.fill();
  g.fillStyle = '#C1E2F8';
  g.beginPath();
  g.roundRect(48, 326, Math.max(18, (w - 96) * fill), 18, 9);
  g.fill();
  g.fillStyle = '#2F9FE7';
  g.beginPath();
  g.roundRect(24, 600, w - 48, 72, 36);
  g.fill();
  g.fillStyle = '#0B1626';
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
  const spaceNote = useRef(null); // "100% space is free", shown while the cupboards are see-through
  const api = useRef(null);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(-1); // -1: not started; CHAPTERS.length: finished
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false); // reduced motion: the finished kitchen, no film to pause

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
      // soft contact shadows (ambient occlusion) are what make a render read like a photograph; optional, so the
      // scene still renders if they fail to load
      let post = null;
      try {
        const [{ EffectComposer }, { RenderPass }, { GTAOPass }, { OutputPass }] = await Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/GTAOPass.js'),
          import('three/examples/jsm/postprocessing/OutputPass.js'),
        ]);
        post = { EffectComposer, RenderPass, GTAOPass, OutputPass };
      } catch {}
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // no WebGL: the captions still tell the story
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // photographic tone mapping (AgX) so whites, steel and stone read like a camera, not a CAD render
      renderer.toneMapping = THREE.AgXToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true; // taste-skill-ignore: 3D lighting, not a CSS shadow
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.8;
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
      const concrete = concreteTexture(THREE);
      concrete.repeat.set(2, 1);
      const grain = brushedTexture(THREE);
      grain.repeat.set(3, 3);
      textures.push(marble, wood, concrete, grain);
      const stone = phys({ map: marble, roughness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.12 });
      const walnut = phys({ map: wood, roughness: 0.6 });
      const chrome = phys({ color: 0xe8ebef, metalness: 1, roughness: 0.08 });
      // brushed stainless: a fine grain in the roughness and an anisotropic sheen, as real brushed steel has
      const brushedSteel = (o) => phys({ metalness: 1, roughnessMap: grain, anisotropy: 0.75, ...o });
      const brushed = brushedSteel({ color: 0xc9ced4, roughness: 0.42 });
      const matteInk = phys({ color: C.ink, roughness: 0.42, metalness: 0.2, clearcoat: 0.4 });
      // the tap's finish: bright satin brushed stainless, as in the reference photo
      const tapSteel = brushedSteel({ color: 0xeceef0, roughness: 0.4, envMapIntensity: 1.6 });
      const steel = brushedSteel({ color: 0xd9dce0, roughness: 0.36 });

      // walnut cabinets: carcass, three doors with fine gaps, slim steel pulls, recessed plinth
      add(new THREE.BoxGeometry(2.4, 0.08, 0.84), phys({ color: 0x1a1a1a, roughness: 0.9 }), 0, 0.04, -0.03);
      // the doors and the loft fronts fade to see-through in the last chapter, so they get their own materials
      const fadeMats = [];
      const fading = (m) => (fadeMats.push(m), m);
      const doorWood = fading(phys({ map: wood, roughness: 0.6 }));
      const pullSteel = fading(phys({ color: 0xc9ced4, metalness: 1, roughness: 0.32 }));
      const inside = phys({ color: 0xf1ece4, roughness: 0.85 }); // the empty insides: pale, so "empty" reads at once
      // the carcass is hollow behind the doors: a back, a floor, one shelf and a top below the sink basin
      add(new THREE.BoxGeometry(2.36, 0.56, 0.02), inside, 0, 0.36, -0.41);
      add(new THREE.BoxGeometry(2.36, 0.02, 0.84), inside, 0, 0.09, 0.01);
      add(new THREE.BoxGeometry(2.36, 0.02, 0.8), inside, 0, 0.38, -0.01);
      add(new THREE.BoxGeometry(2.36, 0.02, 0.84), inside, 0, 0.635, 0.01);
      [-0.4, 0.4].forEach((x) => add(new THREE.BoxGeometry(0.02, 0.56, 0.84), inside, x, 0.36, 0.01));
      [-1.19, 1.19].forEach((x) => add(new THREE.BoxGeometry(0.02, 0.78, 0.86), walnut, x, 0.47, 0));
      add(new THREE.BoxGeometry(2.36, 0.22, 0.02), walnut, 0, 0.75, -0.42);
      [-0.8, 0, 0.8].forEach((x) => {
        add(new RoundedBoxGeometry(0.78, 0.74, 0.03, 2, 0.006), doorWood, x, 0.47, 0.445);
        add(new RoundedBoxGeometry(0.42, 0.016, 0.022, 2, 0.006), pullSteel, x, 0.8, 0.47);
      });

      // the loft: wall cupboards above the water line, hollow behind three walnut doors
      const LOFT = { y0: 1.98, h: 0.5, z0: -0.5, d: 0.34 };
      const ly = LOFT.y0 + LOFT.h / 2;
      const lz = LOFT.z0 + LOFT.d / 2;
      add(new THREE.BoxGeometry(2.36, LOFT.h, 0.02), inside, 0, ly, LOFT.z0 + 0.01);
      add(new THREE.BoxGeometry(2.36, 0.02, LOFT.d), walnut, 0, LOFT.y0 + 0.01, lz);
      add(new THREE.BoxGeometry(2.36, 0.02, LOFT.d), walnut, 0, LOFT.y0 + LOFT.h - 0.01, lz);
      add(new THREE.BoxGeometry(2.32, 0.02, LOFT.d - 0.04), inside, 0, ly, lz - 0.01);
      [-1.17, 1.17].forEach((x) => add(new THREE.BoxGeometry(0.02, LOFT.h, LOFT.d), walnut, x, ly, lz));
      [-0.39, 0.39].forEach((x) => add(new THREE.BoxGeometry(0.02, LOFT.h - 0.04, LOFT.d - 0.03), inside, x, ly, lz - 0.01));
      [-0.78, 0, 0.78].forEach((x) => {
        add(new RoundedBoxGeometry(0.77, LOFT.h - 0.02, 0.025, 2, 0.006), doorWood, x, ly, LOFT.z0 + LOFT.d + 0.012);
        add(new RoundedBoxGeometry(0.3, 0.014, 0.02, 2, 0.006), pullSteel, x, LOFT.y0 + 0.05, LOFT.z0 + LOFT.d + 0.03);
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
      add(new THREE.TorusGeometry(0.036, 0.004, 10, 40), steel, SINK.x - 0.12, sinkY + 0.011, SINK.z).rotation.x = Math.PI / 2;
      // a slim polished rim round the cut-out, so it reads as a proper sink
      const R = 0.022;
      add(new THREE.BoxGeometry(SINK.w + 2 * R, 0.006, R), steel, SINK.x, TOP + 0.003, sz0 - R / 2);
      add(new THREE.BoxGeometry(SINK.w + 2 * R, 0.006, R), steel, SINK.x, TOP + 0.003, sz1 + R / 2);
      add(new THREE.BoxGeometry(R, 0.006, SINK.d), steel, sx0 - R / 2, TOP + 0.003, SINK.z);
      add(new THREE.BoxGeometry(R, 0.006, SINK.d), steel, sx1 + R / 2, TOP + 0.003, SINK.z);

      // a concrete splashback behind the sink, as in the reference photo, lit warm by the room
      add(new THREE.BoxGeometry(2.52, 1.36, 0.04), phys({ map: concrete, color: 0xe7d7c4, roughness: 0.9 }), 0, 1.6, -0.52);

      // the one tap, after the reference Khan shared: a round deck flange, a cylindrical base with a small side
      // lever, then one slim tube that rises straight and bends over in a tall, even arc to a fine outlet
      const tx = MOYA_TAP.x;
      const tz = MOYA_TAP.z;
      add(new THREE.CylinderGeometry(0.03, 0.031, 0.008, 48), tapSteel, tx, TOP + 0.004, tz);
      add(new THREE.CylinderGeometry(0.0205, 0.0215, 0.1, 48), tapSteel, tx, TOP + 0.058, tz);
      add(new THREE.CylinderGeometry(0.0205, 0.0205, 0.004, 48), chrome, tx, TOP + 0.109, tz); // fine polished seam
      // the side lever: a short round hub out of the base, a thin handle off its end
      const hub = add(new THREE.CylinderGeometry(0.0135, 0.0135, 0.034, 40), tapSteel, tx + 0.036, TOP + 0.056, tz);
      hub.rotation.z = Math.PI / 2;
      const handle = add(new THREE.CylinderGeometry(0.0042, 0.0046, 0.062, 24), tapSteel, tx + 0.047, TOP + 0.056, tz + 0.03);
      handle.rotation.x = Math.PI / 2;
      add(new THREE.SphereGeometry(0.0046, 16, 16), tapSteel, tx + 0.047, TOP + 0.056, tz + 0.061);
      // the gooseneck: straight riser, half-circle arc towards the sink, a short drop to the outlet
      const neckPts = [new THREE.Vector3(tx, TOP + 0.11, tz), new THREE.Vector3(tx, NECK.riser - 0.04, tz)];
      for (let k = 0; k <= 16; k++) {
        const a = Math.PI - (Math.PI * k) / 16;
        neckPts.push(new THREE.Vector3(tx, NECK.riser + NECK.r * Math.sin(a), tz + NECK.r + NECK.r * Math.cos(a)));
      }
      neckPts.push(new THREE.Vector3(tx, NECK.riser - NECK.drop, tz + 2 * NECK.r));
      const moyaSpout = new THREE.CatmullRomCurve3(neckPts, false, 'centripetal');
      add(new THREE.TubeGeometry(moyaSpout, 220, 0.0078, 24), tapSteel, 0, 0, 0);
      const spoutEnd = moyaSpout.getPoint(1);
      add(new THREE.CylinderGeometry(0.0068, 0.0078, 0.012, 24), chrome, spoutEnd.x, spoutEnd.y - 0.004, spoutEnd.z); // outlet tip
      const GLASS = { x: spoutEnd.x, z: spoutEnd.z }; // the glass stands right under the outlet

      // water from the MoyaOne tap into a glass standing in the sink
      // clear water and real glass: light passes through and bends, as in a photograph
      const waterMat = phys({ color: 0xe9f6fc, roughness: 0.02, transmission: 1, thickness: 0.01, ior: 1.33, transparent: true, opacity: 0.95 });
      const stream = add(new THREE.CylinderGeometry(0.007, 0.009, 1, 16), waterMat, spoutEnd.x, 1, spoutEnd.z);
      const glassMat = phys({ color: 0xffffff, roughness: 0.02, transmission: 1, thickness: 0.004, ior: 1.5, clearcoat: 1, side: THREE.DoubleSide });
      const glassBase = sinkY + 0.006;
      add(new THREE.CylinderGeometry(0.048, 0.042, 0.14, 40, 1, true), glassMat, GLASS.x, glassBase + 0.07, GLASS.z);
      add(new THREE.CylinderGeometry(0.042, 0.042, 0.008, 40), glassMat, GLASS.x, glassBase + 0.004, GLASS.z);
      const glassWater = add(new THREE.CylinderGeometry(0.043, 0.039, 1, 40), phys({ color: 0xdcf0f8, roughness: 0.04, transmission: 0.92, thickness: 0.08, ior: 1.33 }), GLASS.x, glassBase, GLASS.z);
      const streamTop = spoutEnd.y - 0.01;
      const streamBottom = glassBase + 0.02;

      // its own water line, as in the original concept: up the wall, across near the top, and down behind the
      // tap into its base. A silver pipe tinted clear enough to show the blue water inside it
      // (client: orange read as a third brand colour).
      const lineMat = phys({ color: 0xd3d7dc, metalness: 0.85, roughness: 0.2, clearcoat: 0.6, transparent: true, opacity: 0.5, depthWrite: false });
      const flowCanvas = document.createElement('canvas');
      flowCanvas.width = 256;
      flowCanvas.height = 8;
      const fg = flowCanvas.getContext('2d');
      fg.fillStyle = '#3f9fd6';
      fg.fillRect(0, 0, 256, 8);
      fg.fillStyle = '#bfe3f0';
      [0, 96, 168].forEach((x, i) => fg.fillRect(x, 0, 28 + i * 10, 8));
      const flowTex = new THREE.CanvasTexture(flowCanvas);
      flowTex.colorSpace = THREE.SRGBColorSpace;
      flowTex.wrapS = flowTex.wrapT = THREE.RepeatWrapping;
      flowTex.repeat.set(22, 1);
      textures.push(flowTex);
      const flowMat = new THREE.MeshStandardMaterial({ map: flowTex, emissive: 0x3f9fd6, emissiveMap: flowTex, emissiveIntensity: 0.45, roughness: 0.2 });
      const pipePath = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-1.02, TOP, -0.475),
          new THREE.Vector3(-1.02, 1.82, -0.475),
          new THREE.Vector3(-0.96, 1.88, -0.475),
          new THREE.Vector3(MOYA_TAP.x - 0.06, 1.88, -0.475),
          new THREE.Vector3(MOYA_TAP.x, 1.82, -0.475),
          new THREE.Vector3(MOYA_TAP.x, TOP + 0.05, -0.475),
          new THREE.Vector3(MOYA_TAP.x, TOP + 0.02, -0.445),
          new THREE.Vector3(MOYA_TAP.x, TOP + 0.02, -0.33),
        ],
        false,
        'catmullrom',
        0.05,
      );
      const pipe = add(new THREE.TubeGeometry(pipePath, 260, 0.016, 16), lineMat, 0, 0, 0);
      const pipeCount = pipe.geometry.index.count;
      const pipeWater = add(new THREE.TubeGeometry(pipePath, 260, 0.01, 12), flowMat, 0, 0, 0);
      const pipeWaterCount = pipeWater.geometry.index.count;
      pipe.renderOrder = 2;

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

      // the room around it: a warm plaster wall and an oak floor, so the kitchen sits in a home, not a void
      add(new THREE.BoxGeometry(9, 4.2, 0.04), phys({ map: concrete, color: 0xe7d7c4, roughness: 0.9 }), 0, 2.1, -0.56);
      const oak = woodTexture(THREE);
      oak.wrapS = oak.wrapT = THREE.RepeatWrapping;
      oak.repeat.set(6, 6);
      textures.push(oak);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), phys({ map: oak, color: 0xc89b74, roughness: 0.55, clearcoat: 0.2 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, 3.9);
      floor.receiveShadow = true;
      scene.add(floor);

      // warm light: a low golden key from the window side, a pendant glow over the worktop, warm fill
      const sun = new THREE.DirectionalLight(0xffcd94, 2.1);
      sun.position.set(-2.5, 5, 4);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.radius = 6;
      sun.shadow.bias = -0.0004;
      Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
      scene.add(sun);
      const pendant = new THREE.PointLight(0xffb978, 2.2, 4.5, 1.6);
      pendant.position.set(0.15, 2.25, 0.55);
      scene.add(pendant);
      scene.add(new THREE.HemisphereLight(0xffeedb, 0x4a3524, 0.4));

      // ---- the film ----
      const state = { pipe: 1, phone: 1, pour: 1, space: 0 };
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

      let faded = false;
      const apply = () => {
        // the cupboards turn see-through while "100% space is free" shows
        const sp = state.space || 0;
        const see = sp > 0.002;
        fadeMats.forEach((m) => {
          m.opacity = 1 - 0.82 * sp;
          if (m.transparent !== see) {
            m.transparent = see;
            m.depthWrite = !see;
            m.needsUpdate = true;
          }
        });
        if (see !== faded || see) {
          faded = see;
          if (spaceNote.current) spaceNote.current.style.opacity = String(clamp01((sp - 0.15) / 0.45));
        }
        const run = clamp01(state.pipe * 1.25);
        pipe.geometry.setDrawRange(0, Math.floor((pipeCount * run) / 6) * 6);
        pipeWater.geometry.setDrawRange(0, Math.floor((pipeWaterCount * run) / 6) * 6);
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
          const on = inView && (playing ? mk.ch === active && state[KEYS[mk.ch]] > 0.15 : active < 0 || mk.ch === active);
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

      // one pipeline everywhere so the look matches; phones switch off the contact shadows to stay smooth
      let composer = null;
      let gtao = null;
      const setupPost = (w, h) => {
        if (!post || composer) return;
        try {
          composer = new post.EffectComposer(renderer);
          composer.setPixelRatio(renderer.getPixelRatio());
          composer.addPass(new post.RenderPass(scene, camera));
          gtao = new post.GTAOPass(scene, camera, w, h);
          gtao.blendIntensity = 0.85;
          gtao.updateGtaoMaterial({ radius: 0.18, distanceExponent: 1.2, thickness: 1, scale: 1 });
          composer.addPass(gtao);
          composer.addPass(new post.OutputPass());
        } catch {
          composer = null;
        }
      };

      const render = () => {
        const k = narrow ? 1.28 : 1;
        const pos = camPos.clone().sub(camLook).multiplyScalar(k);
        if (orbit) pos.applyAxisAngle(up, orbit);
        camera.position.copy(pos.add(camLook));
        camera.lookAt(camLook);
        if (composer) composer.render();
        else renderer.render(scene, camera);
        placeMarks();
      };

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        narrow = w < 520;
        renderer.setSize(w, h, false);
        setupPost(w, h);
        composer?.setSize(w, h);
        if (gtao) gtao.enabled = !narrow;
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
        setStill(true);
        Object.assign(state, { pipe: 1, phone: 1, pour: 1, space: 0 });
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
        running = false;
        afterChapter = true;
        userPaused = true;
        setPaused(true);
        playing = false;
        orbit = 0;
        KEYS.forEach((key, j) => (state[key] = j <= i ? 1 : 0));
        camPos.set(...CHAPTERS[i].cam[0]);
        camLook.set(...CHAPTERS[i].cam[1]);
        active = i;
        apply();
        render();
        setChapter(i);
        setProgress((i + 1) / CHAPTERS.length);
      };

      // The film loops like a video: four chapters, a pull back to the whole kitchen, a short rest, then again.
      // The water in the pipe keeps running throughout. Pause stops it; it also rests while off screen.
      const HOLD = 2.6; // seconds the finished kitchen rests before the film starts again
      const END = CHAPTERS.length * STEP + 1.6; // end of the pull back to the whole kitchen
      let running = false;
      let shown = -2; // the chapter last handed to the captions and progress bar
      let lastNow = 0;
      let pausedAt = 0;
      let afterChapter = false; // a tapped chapter interrupted the loop: resuming starts it from the top

      const restart = (now) => {
        orbit = 0;
        Object.assign(state, { pipe: 0, phone: 0, pour: 0, space: 0 });
        camPos.set(...OVERVIEW[0]);
        camLook.set(...OVERVIEW[1]);
        active = -1;
        t0 = now;
      };

      const frame = (now) => {
        if (!running) return;
        const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0;
        lastNow = now;
        flowTex.offset.x -= dt * 0.35; // the water runs along the pipe
        let t = Math.max(0, (now - t0) / 1000); // the first frame can be stamped just before t0
        if (t >= END + HOLD) {
          restart(now);
          t = 0;
        }
        playing = t < END;
        const i = Math.floor(t / STEP);
        if (i >= CHAPTERS.length) {
          // pull back to the whole kitchen, then rest on it
          const e = ease(clamp01((t - CHAPTERS.length * STEP) / 1.6));
          camPos.lerpVectors(fromPos.set(...CHAPTERS[CHAPTERS.length - 1].cam[0]), toPos.set(...OVERVIEW[0]), e);
          camLook.lerpVectors(fromLook.set(...CHAPTERS[CHAPTERS.length - 1].cam[1]), toLook.set(...OVERVIEW[1]), e);
          Object.assign(state, { pipe: 1, phone: 1, pour: 1, space: 0 });
          active = -1; // every label shows while the kitchen rests
          if (shown !== CHAPTERS.length) {
            shown = CHAPTERS.length;
            setChapter(CHAPTERS.length);
          }
          setProgress(1);
        } else {
          const local = (t - i * STEP) / STEP;
          active = i;
          if (shown !== i) {
            shown = i;
            setChapter(i);
          }
          setProgress((i + local) / CHAPTERS.length);
          // the camera travels in the first 40% of each chapter, the action plays after it;
          // the pour starts earlier and runs longer (client review)
          const prev = i === 0 ? OVERVIEW : CHAPTERS[i - 1].cam;
          const e = ease(clamp01(local / 0.4));
          camPos.lerpVectors(fromPos.set(...prev[0]), toPos.set(...CHAPTERS[i].cam[0]), e);
          camLook.lerpVectors(fromLook.set(...prev[1]), toLook.set(...CHAPTERS[i].cam[1]), e);
          const key = CHAPTERS[i].key;
          if (key === 'pour') {
            // the pour starts early and runs on into the next chapter, so the glass fills over two chapters
            state.pour = 0.55 * clamp01((local - 0.12) / 0.88);
          } else if (key === 'space') {
            state.pour = 0.55 + 0.44 * clamp01(local / 0.96);
            state.space = ease(clamp01(local / 0.2)) * (1 - ease(clamp01((local - 0.84) / 0.16)));
          } else {
            state[key] = ease(clamp01((local - 0.25) / 0.7));
          }
        }
        apply();
        render();
        raf = requestAnimationFrame(frame);
      };

      const start = (fromTop) => {
        cancelAnimationFrame(raf);
        if (fromTop) restart(performance.now());
        else t0 += performance.now() - pausedAt;
        afterChapter = false;
        running = true;
        lastNow = 0;
        setPaused(false);
        raf = requestAnimationFrame(frame);
      };
      const play = () => start(true);
      const resume = () => {
        if (running) return;
        start(afterChapter);
      };
      const pause = () => {
        if (!running) return;
        running = false;
        pausedAt = performance.now();
        cancelAnimationFrame(raf);
        playing = false;
        render();
        setPaused(true);
      };

      // the film rests while the hero is off screen, and carries on when it is back, unless the visitor paused it
      let userPaused = false;
      const io = new IntersectionObserver(([en]) => {
        if (stageRef.current != null || reduce || userPaused) return;
        if (en.isIntersecting) resume();
        else if (running) {
          pause();
          setPaused(false);
        }
      });
      io.observe(el);

      // drag to look around the kitchen, at any point in the film
      let dragX = null;
      const down = (e) => {
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
      const goTo = (i, instant) => {
        cancelAnimationFrame(raf);
        running = false;
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

      api.current = {
        play,
        showChapter,
        goTo,
        pause: () => {
          userPaused = true;
          pause();
        },
        resume: () => {
          userPaused = false;
          resume();
        },
      };
      resize();
      document.fonts?.ready.then(() => !disposed && render()); // labels are measured after the fonts arrive
      setReady(true);
      if (stageRef.current != null) goTo(stageRef.current, true);
      else if (reduce) setFinal();
      else play();

      cleanup = () => {
        cancelAnimationFrame(raf);
        running = false;
        ro.disconnect();
        io.disconnect();
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', release);
        el.removeEventListener('pointercancel', release);
        textures.forEach((t) => t.dispose());
        composer?.dispose();
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
        aria-label="A short 3D film of a MoyaOne kitchen with a marble worktop and an undermount sink: one slim silver water line fills along the back of the worktop, the phone recharges litres, and the single brushed steel MoyaOne tap fills a glass; then the loft and the cupboards under the worktop turn see-through, empty: 100% space is free."
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
      <p ref={spaceNote} className="kitchen-space" aria-hidden="true">
        100% space is free
      </p>
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
            {!still && (
            <button
              type="button"
              className="story-replay"
              onClick={() => (paused ? api.current?.resume() : api.current?.pause())}
              disabled={!ready || chapter === -1}
              aria-pressed={paused}
            >
              {paused ? <Play weight="bold" size={18} aria-hidden="true" /> : <Pause weight="bold" size={18} aria-hidden="true" />}
              {paused ? 'Play' : 'Pause'}
            </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
