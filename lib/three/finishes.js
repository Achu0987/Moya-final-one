// Canvas-drawn finishes shared by the 3D scenes: marble worktop, walnut veneer, large-format stone tiles.
// No image files: each texture is painted in code (CLAUDE.md: no raster product images).

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

export function woodTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#4a3326';
  g.fillRect(0, 0, 512, 512);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    g.strokeStyle = `rgba(${rnd() > 0.5 ? '30,18,12' : '110,78,58'}, ${0.12 + rnd() * 0.2})`;
    g.lineWidth = 0.5 + rnd() * 2;
    const x = rnd() * 512;
    g.beginPath();
    g.moveTo(x, 0);
    g.bezierCurveTo(x + (rnd() - 0.5) * 30, 170, x + (rnd() - 0.5) * 30, 340, x + (rnd() - 0.5) * 20, 512);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

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
