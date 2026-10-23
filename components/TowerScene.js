'use client';

import { useEffect, useRef, useState } from 'react';
import { buildPlantRoom } from '@/lib/three/plantRoom';

// A real-time 3D residential tower, built in code (no downloaded model, no photo of a real project:
// deployments stay unnamed until the client confirms them, CLAUDE.md non-negotiable 4).
// The front is cut open like an architect's model, and so is the ground, showing the basement plant room.
// The film opens on the plant room, then follows the orange line up the tower as each floor's kitchen lights.
// The plant room shows machinery but no part names or labels that explain the technology (non-negotiable 7).
const C = {
  base: 0xfafaf7,
  ink: 0x111827,
  orange: 0xf97316,
  yellow: 0xffd60a,
  grey: 0xf3f4f6,
  water: 0xbfe3f0,
};

const FLOORS = 12;
const FLOOR_H = 0.3;
const PODIUM = 0.36;
const W = 2.0;
const D = 1.3;
const BASE_Y = -0.62; // basement floor
const RISE = 2.8; // seconds for the line to climb (DESIGN.md: under 3s per step)
const HOLD = 1.6; // seconds on the plant room before the climb
const CONSTRUCT = 3; // seconds for the tower to build itself in construct mode (DESIGN.md: under 3s per step)

const MARKS = [
  { id: 'plant', at: [-0.78, -0.12, -0.23], from: 0, side: 1, title: 'The plant room', text: 'In the basement, where the line starts' },
  { id: 'riser', at: [0.1, 1.3, 0.1], from: 0.25, side: -1, title: 'One line, up through the tower', text: 'Laid while the tower is built' },
  { id: 'branch', at: [0.45, 2.48, 0.1], from: 0.55, side: 1, title: 'A branch to every floor', text: 'No retrofit later' },
  { id: 'kitchen', at: [0.78, 3.97, 0.1], from: 0.97, side: 1, title: 'Every kitchen, connected', text: 'Drinking water on tap' },
];

// Without `stage` it plays once when scrolled into view (home builders section).
// With `stage` (0 plant room, 1 the climb) a page drives it.
// mode="construct" (builders page): the tower builds itself floor by floor and the line rises with it.
export default function TowerScene({ stage, mode = 'film' }) {
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const construct = mode === 'construct';
  const host = useRef(null);
  const marks = useRef({});
  const api = useRef(null);
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(FLOORS);

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
        console.error('3D tower failed to load', err);
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
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true; // taste-skill-ignore: 3D lighting, not a CSS shadow
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 80);

      const add = (geo, mat, x, y, z, casts = true) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.castShadow = casts;
        m.receiveShadow = true;
        scene.add(m);
        return m;
      };
      const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.6, ...o });

      const concrete = phys({ color: C.base, roughness: 0.75 });
      const glass = phys({ color: 0x6f8494, metalness: 0.55, roughness: 0.06, transparent: true, opacity: 0.6, envMapIntensity: 1.8, clearcoat: 1, depthWrite: false });
      const railGlass = phys({ color: 0xa9bcc8, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false });
      const steel = phys({ color: 0xc4cad1, metalness: 1, roughness: 0.3 });
      const orange = phys({ color: C.orange, roughness: 0.35, clearcoat: 0.6, emissive: C.orange, emissiveIntensity: 0.6 });
      const earth = phys({ color: 0x2b2f36, roughness: 0.95 });

      // ---- ground, cut open at the front so the basement shows ----
      const gw = 6;
      const gd = 4.4;
      const cutZ = D / 2 + 0.25; // the section line
      add(new THREE.BoxGeometry(gw, 0.05, cutZ + gd / 2), phys({ color: 0x9aa1a9, roughness: 0.85 }), 0, -0.025, (cutZ - gd / 2) / 2, false);
      // earth in section below the ground line, either side of the plant room
      const roomW = W + 0.6;
      const side = (gw - roomW) / 2;
      add(new THREE.BoxGeometry(side, -BASE_Y, 0.04), earth, -roomW / 2 - side / 2, BASE_Y / 2, cutZ, false);
      add(new THREE.BoxGeometry(side, -BASE_Y, 0.04), earth, roomW / 2 + side / 2, BASE_Y / 2, cutZ, false);
      add(new THREE.BoxGeometry(gw, 0.12, 0.04), earth, 0, BASE_Y - 0.06, cutZ, false);

      // ---- the plant room: realistic machinery and piping (lib/three/plantRoom.js) ----
      const plant = buildPlantRoom(THREE, {
        scene,
        RoundedBoxGeometry,
        floorY: BASE_Y,
        x0: -roomW / 2,
        x1: roomW / 2,
        z0: -D / 2,
        z1: cutZ,
        riser: { x: 0.1, z: 0.1 },
      });

      // ---- the building ----
      add(new RoundedBoxGeometry(W + 0.3, PODIUM, D + 0.3, 3, 0.03), concrete, 0, PODIUM / 2, 0);
      // glazed lobby and entrance canopy on the podium front
      add(new THREE.BoxGeometry(0.8, 0.22, 0.02), glass, -0.4, 0.13, D / 2 + 0.16, false);
      add(new THREE.BoxGeometry(1.0, 0.025, 0.3), concrete, -0.4, 0.27, D / 2 + 0.28);

      const floors = [];
      const counterMat = phys({ color: C.grey, roughness: 0.5 });
      const floorMeshes = [];
      for (let i = 0; i < FLOORS; i++) {
        const firstMesh = scene.children.length;
        const y = PODIUM + i * FLOOR_H;
        const gh = FLOOR_H - 0.05;
        // slab with a deeper balcony edge on the front
        add(new RoundedBoxGeometry(W + 0.12, 0.05, D + 0.34, 2, 0.015), concrete, 0, y + FLOOR_H - 0.025, 0.09);
        // glazing on back and sides; the front is cut open
        add(new THREE.BoxGeometry(W - 0.04, gh, 0.02), glass, 0, y + gh / 2, -D / 2 + 0.02, false);
        add(new THREE.BoxGeometry(0.02, gh, D - 0.04), glass, -W / 2 + 0.02, y + gh / 2, 0, false);
        add(new THREE.BoxGeometry(0.02, gh, D - 0.04), glass, W / 2 - 0.02, y + gh / 2, 0, false);
        // window mullions on the right face
        for (let k = 1; k < 5; k++) add(new THREE.BoxGeometry(0.018, gh, 0.018), concrete, W / 2 - 0.01, y + gh / 2, -D / 2 + (k * D) / 5, false);
        // glass balcony rail with a steel handrail along the front edge
        add(new THREE.BoxGeometry(W + 0.08, 0.1, 0.012), railGlass, 0, y + FLOOR_H + 0.05, D / 2 + 0.25, false);
        add(new THREE.BoxGeometry(W + 0.08, 0.008, 0.016), steel, 0, y + FLOOR_H + 0.1, D / 2 + 0.25, false);
        // a kitchen counter in each flat
        add(new RoundedBoxGeometry(0.34, 0.09, 0.2, 2, 0.01), counterMat, 0.78, y + 0.045, 0.1);
        floors.push(y);
        const meshes = scene.children.slice(firstMesh);
        meshes.forEach((m) => (m.userData.y0 = m.position.y));
        floorMeshes.push(meshes);
      }
      const columns = [];
      [-1, 1].forEach((sx) =>
        [-1, 1].forEach((sz) =>
          columns.push(add(new THREE.BoxGeometry(0.08, FLOORS * FLOOR_H, 0.08), concrete, sx * (W / 2 - 0.01), PODIUM + (FLOORS * FLOOR_H) / 2, sz * (D / 2 - 0.01))),
        ),
      );
      // roof, parapet and rooftop plant enclosure
      const roofY = PODIUM + FLOORS * FLOOR_H;
      const roof = [
        add(new RoundedBoxGeometry(W + 0.2, 0.08, D + 0.4, 2, 0.02), concrete, 0, roofY + 0.04, 0.09),
        add(new THREE.BoxGeometry(W + 0.2, 0.08, 0.03), concrete, 0, roofY + 0.12, D / 2 + 0.27),
        add(new RoundedBoxGeometry(0.6, 0.22, 0.42, 2, 0.02), concrete, 0.4, roofY + 0.19, -0.2),
      ];

      // ---- the line: one riser from the plant room, a branch and a lit kitchen on every floor ----
      const riserBottom = plant.riserY;
      const riserTop = roofY - 0.05;
      const riserLen = riserTop - riserBottom;
      const riser = add(new THREE.CylinderGeometry(0.04, 0.04, 1, 20), orange, 0.1, 0, 0.1);
      const ledMat = new THREE.MeshStandardMaterial({ color: C.yellow, emissive: C.yellow, emissiveIntensity: 2.2 });
      const branches = floors.map((fy) => ({
        y: fy + 0.08,
        branch: add(new THREE.BoxGeometry(1, 0.02, 0.02), orange, 0.1, fy + 0.08, 0.1),
        led: add(new THREE.SphereGeometry(0.04, 16, 16), ledMat, 0.78, fy + 0.11, 0.1),
      }));

      // ground contact and light
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.25 })); // taste-skill-ignore: 3D lighting
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.002;
      shadow.receiveShadow = true;
      scene.add(shadow);
      const sun = new THREE.DirectionalLight(0xfff4e6, 2);
      sun.position.set(-3, 7, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.radius = 5;
      sun.shadow.bias = -0.0004;
      Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 5, bottom: -2 });
      scene.add(sun);

      // ---- the film ----
      let rise = 1;
      let lastCount = -1;
      const setRise = (r) => {
        rise = r;
        const topY = riserBottom + riserLen * r;
        riser.scale.y = Math.max(0.001, riserLen * r);
        riser.position.y = riserBottom + (riserLen * r) / 2;
        let count = 0;
        branches.forEach(({ y, branch, led }) => {
          const on = Math.max(0, Math.min(1, (topY - y) / 0.12));
          branch.scale.x = Math.max(0.001, 0.68 * on);
          branch.position.x = 0.1 + (0.68 * on) / 2;
          led.visible = on >= 1;
          if (on >= 1) count++;
        });
        if (count !== lastCount) {
          lastCount = count;
          setConnected(count);
        }
      };

      const setBuild = (b) => {
        floorMeshes.forEach((meshes, i) => {
          const f = Math.max(0, Math.min(1, b * FLOORS - i));
          const drop = (1 - (1 - Math.pow(1 - f, 3))) * 0.35;
          meshes.forEach((m) => {
            m.visible = f > 0.02;
            m.position.y = m.userData.y0 + drop;
          });
        });
        const h = FLOORS * FLOOR_H * Math.max(0.001, b);
        columns.forEach((c) => {
          c.scale.y = Math.max(0.001, b);
          c.position.y = PODIUM + h / 2;
        });
        roof.forEach((m) => (m.visible = b > 0.995));
      };

      const anchors = MARKS.map((m) => new THREE.Vector3(...m.at));
      let narrow = false;
      // each label appears when the film reaches its part, beside its mark, never off screen
      const placeMarks = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        const r = el.getBoundingClientRect();
        const gap = narrow ? 24 : 44;
        const minL = Math.max(-r.left + 12, narrow ? -4 : -40);
        const maxR = Math.min(window.innerWidth - r.left - 12, w + (narrow ? 4 : 40));
        MARKS.forEach((mk, i) => {
          const m = marks.current[mk.id];
          if (!m || !m.dot || !m.label || !m.line) return;
          const p = anchors[i].clone().project(camera);
          const inView = Math.abs(p.x) < 0.98 && Math.abs(p.y) < 0.98;
          const on = inView && (mk.id === 'plant' || (rise > 0 && rise >= mk.from));
          [m.dot, m.label, m.line].forEach((n) => {
            n.style.opacity = on ? 1 : 0;
            n.style.display = on ? '' : 'none'; // off-step labels leave the page entirely
          });
          const x = (p.x * 0.5 + 0.5) * w;
          const y = (-p.y * 0.5 + 0.5) * h;
          const lw = m.label.offsetWidth;
          const lh = m.label.offsetHeight;
          const left = Math.max(minL, Math.min(maxR - lw, mk.side < 0 ? x - gap - lw : x + gap));
          const top = Math.max(-8, Math.min(h - lh, y - lh / 2));
          m.dot.style.transform = `translate(${x}px, ${y}px)`;
          m.label.style.transform = `translate(${left}px, ${top}px)`;
          m.line.setAttribute('x1', x);
          m.line.setAttribute('y1', y);
          m.line.setAttribute('x2', mk.side < 0 ? left + lw : left);
          m.line.setAttribute('y2', top + lh / 2);
        });
      };

      // camera: close on the plant room, or the wide 3/4 view of the whole tower
      const WIDE = { look: new THREE.Vector3(0, 1.75, 0), dist: 10.2, h: 3.0 };
      const CLOSE = { look: new THREE.Vector3(-0.1, BASE_Y + 0.2, -0.05), dist: 3.1, h: 0.28 };
      const look = new THREE.Vector3().copy(WIDE.look);
      let dist = WIDE.dist;
      let camH = WIDE.h;
      let yaw = 0.55;
      let camC = 1;
      const frameAt = (c) => {
        camC = c;
        look.lerpVectors(CLOSE.look, WIDE.look, c);
        dist = CLOSE.dist + (WIDE.dist - CLOSE.dist) * c;
        camH = CLOSE.h + (WIDE.h - CLOSE.h) * c;
      };
      const render = () => {
        const k = narrow ? 1.15 : 1;
        camera.position.set(look.x + Math.sin(yaw) * dist * k, look.y + camH, look.z + Math.cos(yaw) * dist * k);
        camera.lookAt(look);
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
      const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      let raf = null;
      const play = () => {
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.max(0, (now - t0) / 1000);
          if (t < HOLD) {
            // on the machinery, turning slowly
            frameAt(0);
            yaw = 0.35 + 0.2 * (t / HOLD);
            setRise(0);
          } else {
            const p = Math.min(1, (t - HOLD) / RISE);
            setRise(ease(p));
            frameAt(ease(Math.min(1, p * 1.15)));
            yaw = 0.55;
          }
          render();
          if (t < HOLD + RISE) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      // construct mode: the tower rises, the line follows just below its newest floor
      const build = () => {
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, Math.max(0, (now - t0) / 1000 / CONSTRUCT));
          const e = ease(p);
          setBuild(e);
          const top = PODIUM + FLOORS * FLOOR_H * e - 0.12;
          setRise(p < 1 ? Math.max(0, Math.min(1, (top - riserBottom) / riserLen)) : 1);
          frameAt(1);
          yaw = 0.3 + 0.28 * e;
          render();
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };

      if (reduce) {
        setRise(1);
        frameAt(1);
      } else if (construct) {
        setBuild(0);
        setRise(0);
        frameAt(1);
        yaw = 0.3;
      } else {
        setRise(0);
        frameAt(0);
        yaw = 0.35;
      }
      // driven by a page: 0 holds on the plant room, 1 climbs the tower as the line rises
      const goTo = (s, instant) => {
        cancelAnimationFrame(raf);
        const fromC = camC;
        const fromRise = rise;
        const to = s ? 1 : 0;
        const dur = reduce || instant ? 0 : s ? RISE : 1.6;
        const tStart = performance.now();
        const tick = (now) => {
          const p = dur ? Math.min(1, (now - tStart) / 1000 / dur) : 1;
          const c = fromC + (to - fromC) * ease(Math.min(1, p * 1.15));
          frameAt(c);
          setRise(fromRise + (to - fromRise) * ease(p));
          yaw = 0.35 + 0.2 * c;
          render();
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      api.current = { goTo };

      resize();
      document.fonts?.ready.then(() => !disposed && render()); // labels are measured after the fonts arrive
      setReady(true);

      let io;
      if (stageRef.current != null) {
        goTo(stageRef.current, true);
      } else {
        io = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            if (!reduce) (construct ? build : play)();
          },
          { threshold: 0.5 },
        );
        io.observe(el);
      }

      // drag to turn the tower
      let dragX = null;
      const down = (e) => {
        dragX = e.clientX;
        el.setPointerCapture?.(e.pointerId);
      };
      const move = (e) => {
        if (dragX === null) return;
        yaw -= (e.clientX - dragX) * 0.006;
        dragX = e.clientX;
        render();
      };
      const up = () => (dragX = null);
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io?.disconnect();
        ro.disconnect();
        api.current = null;
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [construct]);

  // a page moved to another stage
  useEffect(() => {
    if (ready && stage != null) api.current?.goTo(stage);
  }, [stage, ready]);

  return (
    <div className={`tower3d ${ready ? 'is-ready' : ''}`}>
      <div
        ref={host}
        className="tower3d-canvas"
        role="img"
        aria-label="A 3D residential tower, cut open at the front and below ground. The basement plant room holds tanks, pumps and a control cabinet. An orange water line rises from it through every floor, and each flat's kitchen lights up as the line reaches it."
      />
      <div className="tower3d-count" data-ui aria-hidden="true">
        <span>Floors connected</span>
        <strong>
          {connected}
          <small> / {FLOORS}</small>
        </strong>
        <em className="sample">Illustrative</em>
      </div>
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
      <ul className="kitchen-labels tower3d-labels">
        {MARKS.map((m) => (
          <li key={m.id} ref={(n) => n && (marks.current[m.id] = { ...marks.current[m.id], label: n })}>
            <strong>{m.title}</strong>
            <span>{m.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
