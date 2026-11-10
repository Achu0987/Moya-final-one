// Canvas-drawn finishes shared by the 3D scenes: marble worktop, walnut veneer, large-format stone tiles.
// No image files: each texture is painted in code (CLAUDE.md: no raster product images).

export function marbleTexture(THREE) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#f2f1ec';
  g.fillRect(0, 0, 1024, 512);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 26; i++) {
    g.strokeStyle = `rgba(110, 112, 118, ${0.05 + rnd() * 0.14})`;
    g.lineWidth = 0.6 + rnd() * 2.2;
    g.beginPath();
    let x = rnd() * 1024;
    let y = rnd() * 512;
    g.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      x += 60 + rnd() * 140;
      y += (rnd() - 0.5) * 120;
      g.quadraticCurveTo(x - 50, y + (rnd() - 0.5) * 80, x, y);
    }
    g.stroke();
  }
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
  g.fillStyle = '#e7e5df';
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#d6d3cc';
  for (let i = 0; i <= 2; i++) {
    g.fillRect(0, i * 256 - 1, 512, 2);
    g.fillRect(i * 256 - 1, 0, 2, 512);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
