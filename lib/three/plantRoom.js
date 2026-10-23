// The basement plant room, shared by the 3D scenes. Realistic machinery and real piping, approved by Vinayak:
// storage tanks, two pump sets, valves with handwheels, a delivery header and the riser it feeds.
// Nothing is labelled and no part is named (CLAUDE.md non-negotiable 7: no part names, schematics or sensor labels).
//
// buildPlantRoom(THREE, opts) adds the room to `scene` and returns where the riser leaves it.
//   opts: { scene, RoundedBoxGeometry, floorY, x0, x1, z0, z1, riser: { x, z } }

const C = {
  ink: 0x111827,
  orange: 0xf97316,
  yellow: 0xffd60a,
  base: 0xfafaf7,
  water: 0xbfe3f0,
};

export function buildPlantRoom(THREE, { scene, RoundedBoxGeometry, floorY: F, x0, x1, z0, z1, riser }) {
  const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.6, ...o });
  const add = (geo, mat, x, y, z, casts = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = casts;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };

  // finishes
  const epoxy = phys({ color: 0x9ea6af, roughness: 0.35, clearcoat: 0.5 });
  const wall = phys({ color: 0xdfe2e6, roughness: 0.9 });
  const steel = phys({ color: 0xc9cfd6, metalness: 1, roughness: 0.28 });
  const darkSteel = phys({ color: 0x3b424c, metalness: 0.8, roughness: 0.4 });
  const pumpBlue = phys({ color: 0x2f5d7c, metalness: 0.45, roughness: 0.38 });
  const ink = phys({ color: C.ink, roughness: 0.45, metalness: 0.3 });
  const line = phys({ color: C.orange, roughness: 0.35, clearcoat: 0.6, emissive: C.orange, emissiveIntensity: 0.5 });
  const handwheel = phys({ color: 0xb4232a, roughness: 0.45, metalness: 0.2 });
  const glass = phys({ color: C.water, roughness: 0.05, transparent: true, opacity: 0.55 });

  const W = x1 - x0;
  const D = z1 - z0;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const H = -F; // floor to ground level

  // ---- shell: floor, back and side walls, floor drain, ceiling light strips ----
  add(new THREE.BoxGeometry(W, 0.04, D), epoxy, cx, F - 0.02, cz, false);
  add(new THREE.BoxGeometry(W, H, 0.04), wall, cx, F + H / 2, z0, false);
  add(new THREE.BoxGeometry(0.04, H, D), wall, x0, F + H / 2, cz, false);
  add(new THREE.BoxGeometry(0.04, H, D), wall, x1, F + H / 2, cz, false);
  add(new THREE.BoxGeometry(0.16, 0.004, 0.16), darkSteel, cx + 0.55, F + 0.002, z1 - 0.25, false);
  [-0.6, 0.6].forEach((dx) => {
    add(new THREE.BoxGeometry(0.5, 0.012, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.4 }), cx + dx, -0.03, cz - 0.1, false);
  });

  // ---- helpers: straight runs of pipe with a flange at each end, valves and gauges ----
  const pipe = (pts, r, mat) => {
    const path = new THREE.CurvePath();
    for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
    add(new THREE.TubeGeometry(path, 24 * (pts.length - 1), r, 14), mat, 0, 0, 0);
    // elbows: a small sphere softens each bend
    pts.slice(1, -1).forEach((p) => add(new THREE.SphereGeometry(r * 1.02, 14, 14), mat, ...p));
  };
  const flange = (x, y, z, axis, r) => {
    const f = add(new THREE.CylinderGeometry(r * 1.7, r * 1.7, r * 0.6, 20), steel, x, y, z);
    if (axis === 'x') f.rotation.z = Math.PI / 2;
    if (axis === 'z') f.rotation.x = Math.PI / 2;
  };
  const gateValve = (x, y, z, axis, r) => {
    // body, bonnet, stem and a spoked handwheel on top
    const body = add(new THREE.CylinderGeometry(r * 1.9, r * 1.9, r * 2.6, 20), darkSteel, x, y, z);
    if (axis === 'x') body.rotation.z = Math.PI / 2;
    if (axis === 'z') body.rotation.x = Math.PI / 2;
    add(new THREE.BoxGeometry(r * 2.2, r * 2.4, r * 2.2), darkSteel, x, y + r * 2.2, z);
    add(new THREE.CylinderGeometry(r * 0.35, r * 0.35, r * 3, 10), steel, x, y + r * 4.4, z);
    const wheel = add(new THREE.TorusGeometry(r * 2.1, r * 0.32, 8, 28), handwheel, x, y + r * 5.9, z);
    wheel.rotation.x = Math.PI / 2;
    for (let k = 0; k < 3; k++) {
      const spoke = add(new THREE.BoxGeometry(r * 4.1, r * 0.3, r * 0.3), handwheel, x, y + r * 5.9, z);
      spoke.rotation.y = (k * Math.PI) / 3;
    }
  };
  const leverValve = (x, y, z, r) => {
    add(new THREE.CylinderGeometry(r * 1.8, r * 1.8, r * 0.9, 20), darkSteel, x, y, z).rotation.z = Math.PI / 2;
    add(new THREE.BoxGeometry(r * 0.6, r * 1.6, r * 0.6), darkSteel, x, y + r * 1.6, z);
    add(new THREE.BoxGeometry(r * 0.5, r * 0.4, r * 4.5), handwheel, x, y + r * 2.5, z + r * 1.8);
  };
  const gauge = (x, y, z, r) => {
    add(new THREE.CylinderGeometry(r * 0.3, r * 0.3, r * 2.2, 10), steel, x, y + r * 1.1, z);
    const face = add(new THREE.CylinderGeometry(r * 1.4, r * 1.4, r * 0.5, 24), steel, x, y + r * 2.8, z);
    face.rotation.x = Math.PI / 2;
    add(new THREE.CircleGeometry(r * 1.2, 24), new THREE.MeshBasicMaterial({ color: C.base }), x, y + r * 2.8, z + r * 0.26, false);
    const needle = add(new THREE.BoxGeometry(r * 1.0, r * 0.12, r * 0.05), ink, x + r * 0.3, y + r * 2.9, z + r * 0.29, false);
    needle.rotation.z = 0.7;
  };
  const support = (x, z, top, r) => {
    add(new THREE.BoxGeometry(0.025, top - F, 0.025), darkSteel, x, F + (top - F) / 2, z);
    add(new THREE.BoxGeometry(0.07, 0.012, 0.05), darkSteel, x, top - r - 0.006, z);
  };

  // ---- storage tanks on plinths, with a sight glass and a hatch on top ----
  const tankZ = z0 + 0.42;
  const tanks = [x0 + 0.32, x0 + 0.72];
  const tankR = 0.15;
  const tankH = 0.42;
  tanks.forEach((tx) => {
    add(new THREE.BoxGeometry(0.34, 0.04, 0.34), darkSteel, tx, F + 0.02, tankZ);
    add(new THREE.CylinderGeometry(tankR, tankR, tankH, 48), steel, tx, F + 0.04 + tankH / 2, tankZ);
    const dome = add(new THREE.SphereGeometry(tankR, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2), steel, tx, F + 0.04 + tankH, tankZ);
    dome.scale.y = 0.4;
    add(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 24), darkSteel, tx, F + 0.04 + tankH + 0.06, tankZ);
    [0.1, 0.3].forEach((h) => (add(new THREE.TorusGeometry(tankR + 0.002, 0.006, 8, 48), darkSteel, tx, F + 0.04 + h, tankZ).rotation.x = Math.PI / 2));
    // sight glass with its water level
    add(new THREE.CylinderGeometry(0.008, 0.008, tankH * 0.8, 10), glass, tx + tankR + 0.02, F + 0.04 + tankH / 2, tankZ);
    add(new THREE.CylinderGeometry(0.009, 0.009, tankH * 0.55, 10), phys({ color: 0x5aa9c9, roughness: 0.2 }), tx + tankR + 0.02, F + 0.04 + tankH * 0.32, tankZ);
  });

  // ---- suction side: each tank's outlet down to a header that feeds the pumps ----
  const pr = 0.016; // pipe radius
  const sY = F + 0.09;
  const sZ = tankZ + 0.3;
  tanks.forEach((tx) => {
    pipe([[tx, F + 0.08, tankZ + tankR], [tx, F + 0.08, sZ], [tx, sY, sZ]], pr, steel);
    flange(tx, F + 0.08, tankZ + tankR + 0.02, 'z', pr);
  });
  const pumpXs = [cx - 0.05, cx + 0.35];
  pipe([[tanks[0], sY, sZ], [pumpXs[1] - 0.12, sY, sZ]], pr * 1.2, steel);
  leverValve((tanks[1] + pumpXs[0]) / 2 - 0.1, sY, sZ, pr);
  support(tanks[1] + 0.15, sZ, sY, pr);

  // ---- two pump sets: base frame, finned motor, coupling guard, pump casing, discharge with a gate valve ----
  const dY = F + 0.36; // delivery header height
  const dZ = z0 + 0.22; // header runs along the back wall
  pumpXs.forEach((px) => {
    add(new THREE.BoxGeometry(0.34, 0.03, 0.16), darkSteel, px, F + 0.015, sZ);
    const motor = add(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 28), pumpBlue, px - 0.09, F + 0.085, sZ);
    motor.rotation.z = Math.PI / 2;
    for (let k = 0; k < 7; k++) (add(new THREE.TorusGeometry(0.051, 0.0035, 6, 28), pumpBlue, px - 0.16 + k * 0.022, F + 0.085, sZ).rotation.y = Math.PI / 2);
    add(new THREE.BoxGeometry(0.04, 0.05, 0.06), phys({ color: C.yellow, roughness: 0.5 }), px + 0.01, F + 0.085, sZ);
    const casing = add(new THREE.CylinderGeometry(0.055, 0.055, 0.07, 28), pumpBlue, px + 0.08, F + 0.085, sZ);
    casing.rotation.z = Math.PI / 2;
    // inlet from the suction header, outlet up to the valve and on to the delivery header
    pipe([[px + 0.12, sY, sZ], [px + 0.12, F + 0.085, sZ]], pr, steel);
    pipe([[px + 0.08, F + 0.14, sZ], [px + 0.08, dY - 0.1, sZ], [px + 0.08, dY - 0.1, dZ + 0.08], [px + 0.08, dY, dZ + 0.08], [px + 0.08, dY, dZ]], pr, steel);
    flange(px + 0.08, F + 0.15, sZ, 'y', pr);
    gateValve(px + 0.08, F + 0.22, sZ, 'y', pr);
    // a cable from the tray down to each motor
    pipe([[px - 0.12, -0.08, z0 + 0.06], [px - 0.12, F + 0.2, z0 + 0.06], [px - 0.12, F + 0.2, sZ], [px - 0.12, F + 0.13, sZ]], 0.006, ink);
  });

  // ---- delivery header in the line's orange, with gauges, feeding the riser ----
  // the header spans both pump outlets; the riser branches off it with its own valve
  const hx0 = Math.min(pumpXs[0] + 0.08, riser.x) - 0.08;
  const hx1 = Math.max(pumpXs[1] + 0.08, riser.x) + 0.08;
  pipe([[hx0, dY, dZ], [hx1, dY, dZ]], pr * 1.4, line);
  flange(hx0, dY, dZ, 'x', pr * 1.4);
  flange(hx1, dY, dZ, 'x', pr * 1.4);
  gauge((pumpXs[0] + riser.x) / 2 + 0.04, dY + pr, dZ, pr);
  gauge(hx1 - 0.04, dY + pr, dZ, pr);
  pipe([[riser.x, dY, dZ], [riser.x, dY, riser.z]], pr * 1.4, line);
  gateValve(riser.x, dY, (dZ + riser.z) / 2, 'z', pr * 1.2);
  [hx0 + 0.04, hx1 - 0.12].forEach((x) => support(x, dZ, dY, pr * 1.4));

  // ---- control cabinet with a door seam, handle, lit screen and status lights; cable tray above ----
  const kx = x1 - 0.32;
  const kz = z0 + 0.12;
  add(new RoundedBoxGeometry(0.36, 0.52, 0.16, 3, 0.012), ink, kx, F + 0.26, kz);
  add(new THREE.BoxGeometry(0.004, 0.46, 0.002), darkSteel, kx + 0.02, F + 0.26, kz + 0.081, false);
  add(new THREE.BoxGeometry(0.012, 0.06, 0.016), steel, kx + 0.06, F + 0.28, kz + 0.086);
  const screen = add(new THREE.PlaneGeometry(0.12, 0.07), new THREE.MeshBasicMaterial({ color: C.water, toneMapped: false }), kx - 0.07, F + 0.38, kz + 0.082, false);
  screen.receiveShadow = false;
  [kx - 0.11, kx - 0.07, kx - 0.03].forEach((x, i) => {
    const c = i === 2 ? C.orange : C.yellow;
    add(new THREE.SphereGeometry(0.01, 12, 12), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.6 }), x, F + 0.28, kz + 0.082, false);
  });
  add(new THREE.BoxGeometry(W - 0.2, 0.025, 0.08), darkSteel, cx, -0.08, z0 + 0.06);
  pipe([[kx, -0.08, z0 + 0.06], [kx, F + 0.52, kz]], 0.008, ink);

  // light for the room
  const lamp = new THREE.PointLight(0xffffff, 1.5, 3.5);
  lamp.position.set(cx, F + H * 0.8, z1 - 0.1);
  scene.add(lamp);

  return { riserY: dY, riserX: riser.x, riserZ: riser.z };
}
