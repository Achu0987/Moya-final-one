// Finishes for the homepage kitchen only (client change list, Nov 7: marble worktop and warm light).
// Kept apart from lib/three/finishes.js so the How it works film keeps its own finishes.
export { woodTexture } from './finishes';

// A warm white marble with clear veining (client review, Nov 7: the worktop read as plain white): a soft cloud
// of warm grey, a few bold grey-gold veins with fine branches, and a scatter of hairline veins.
export function marbleTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 2048;
  cv.height = 1024;
  const g = cv.getContext('2d');
  g.fillStyle = '#ebe3d6';
  g.fillRect(0, 0, 2048, 1024);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // soft clouding
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(${rnd() > 0.5 ? '196,186,172' : '230,224,214'}, ${0.08 + rnd() * 0.12})`;
    g.beginPath();
    g.ellipse(rnd() * 2048, rnd() * 1024, 80 + rnd() * 260, 30 + rnd() * 120, rnd() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  const vein = (width, alpha, colour, steps, spread) => {
    g.strokeStyle = `rgba(${colour}, ${alpha})`;
    g.lineWidth = width;
    g.lineCap = 'round';
    g.beginPath();
    let x = -100 + rnd() * 300;
    let y = rnd() * 1024;
    g.moveTo(x, y);
    for (let k = 0; k < steps; k++) {
      const nx = x + 120 + rnd() * 220;
      const ny = y + (rnd() - 0.45) * spread;
      g.quadraticCurveTo(x + (nx - x) / 2 + (rnd() - 0.5) * 90, y + (rnd() - 0.5) * spread, nx, ny);
      x = nx;
      y = ny;
    }
    g.stroke();
  };
  // bold veins with a lighter halo, then their fine branches, then hairlines
  for (let i = 0; i < 5; i++) {
    const s = seed;
    vein(9, 0.08, '150,138,120', 12, 180);
    seed = s;
    vein(3.4 + rnd() * 2, 0.62, '98,88,76', 12, 180);
  }
  for (let i = 0; i < 18; i++) vein(1.2 + rnd() * 1.4, 0.3 + rnd() * 0.22, '112,102,90', 5, 140);
  for (let i = 0; i < 40; i++) vein(0.5, 0.1 + rnd() * 0.12, '140,132,120', 4, 100);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// warm stone tiles for the splashback
export function tileTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#e2d3be';
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#c9b597';
  for (let i = 0; i <= 2; i++) {
    g.fillRect(0, i * 256 - 1, 512, 2);
    g.fillRect(i * 256 - 1, 0, 2, 512);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// A warm grey microcement / concrete wall, as in the tap reference photo: broad soft clouding, fine grain and a
// few faint trowel marks. Real-world finish, painted in code.
export function concreteTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 1024;
  const g = cv.getContext('2d');
  g.fillStyle = '#a9a5a0';
  g.fillRect(0, 0, 1024, 1024);
  let seed = 23;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 160; i++) {
    const light = rnd() > 0.5;
    g.fillStyle = `rgba(${light ? '196,191,184' : '128,124,119'}, ${0.05 + rnd() * 0.08})`;
    g.beginPath();
    g.ellipse(rnd() * 1024, rnd() * 1024, 40 + rnd() * 200, 20 + rnd() * 120, rnd() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  // trowel marks: long, faint, slightly curved strokes
  for (let i = 0; i < 26; i++) {
    g.strokeStyle = `rgba(${rnd() > 0.5 ? '210,205,198' : '120,116,111'}, ${0.04 + rnd() * 0.05})`;
    g.lineWidth = 6 + rnd() * 18;
    g.beginPath();
    const x = rnd() * 1024;
    const y = rnd() * 1024;
    g.moveTo(x, y);
    g.quadraticCurveTo(x + 120 + rnd() * 160, y + (rnd() - 0.5) * 60, x + 260 + rnd() * 200, y + (rnd() - 0.5) * 40);
    g.stroke();
  }
  // fine grain
  const img = g.getImageData(0, 0, 1024, 1024);
  for (let p = 0; p < img.data.length; p += 4) {
    const n = (rnd() - 0.5) * 14;
    img.data[p] += n;
    img.data[p + 1] += n;
    img.data[p + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Brushed stainless grain: fine parallel streaks, used as a roughness map so the steel reads as brushed, not
// polished or plastic. Linear data (no colour space).
export function brushedTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = 'rgb(118,118,118)';
  g.fillRect(0, 0, 512, 512);
  let seed = 41;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) {
    const v = 70 + Math.floor(rnd() * 110);
    g.fillStyle = `rgba(${v},${v},${v},${0.18 + rnd() * 0.3})`;
    g.fillRect(rnd() * 512, rnd() * 512, 40 + rnd() * 220, 1);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
