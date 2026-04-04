/**
 * hero-three.js
 * Three.js particle-network background for the hero section.
 * Particles drift slowly; nearby ones are connected by faint lines.
 * Scene rotates softly with mouse movement.
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.160.0';

const canvas = document.getElementById('hero-canvas');
if (!canvas) return; // only runs on homepage

// ── Renderer ───────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setClearColor(0x000000, 0);

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// ── Camera ─────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 50);
camera.position.z = 5;

// ── Scene ──────────────────────────────────────────────────
const scene = new THREE.Scene();

// ── Particles ──────────────────────────────────────────────
const COUNT = 90;
const posArr = new Float32Array(COUNT * 3);
const vel    = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  posArr[i * 3]     = (Math.random() - 0.5) * 16;
  posArr[i * 3 + 1] = (Math.random() - 0.5) * 9;
  posArr[i * 3 + 2] = (Math.random() - 0.5) * 4;

  vel[i * 3]     = (Math.random() - 0.5) * 0.0025;
  vel[i * 3 + 1] = (Math.random() - 0.5) * 0.0025;
  vel[i * 3 + 2] = 0;
}

const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

const pMat = new THREE.PointsMaterial({
  size: 0.045,
  color: 0x22c55e,
  transparent: true,
  opacity: 0.65,
  sizeAttenuation: true,
});

scene.add(new THREE.Points(pGeo, pMat));

// ── Connection lines ───────────────────────────────────────
const CONNECT_DIST = 2.8;
// Pre-allocate worst-case: COUNT*(COUNT-1)/2 line segments
const lineArr = new Float32Array(COUNT * COUNT * 3);
const lGeo = new THREE.BufferGeometry();
lGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3));

const lMat = new THREE.LineBasicMaterial({
  color: 0x22c55e,
  transparent: true,
  opacity: 0.10,
});

const lineSegments = new THREE.LineSegments(lGeo, lMat);
scene.add(lineSegments);

// ── Mouse parallax ─────────────────────────────────────────
let mx = 0, my = 0, cx = 0, cy = 0;
window.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth  - 0.5) * 1.0;
  my = (e.clientY / window.innerHeight - 0.5) * 0.5;
});

// ── Animation ──────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  // Drift particles + wrap edges
  for (let i = 0; i < COUNT; i++) {
    posArr[i * 3]     += vel[i * 3];
    posArr[i * 3 + 1] += vel[i * 3 + 1];

    if (posArr[i * 3]     >  8) posArr[i * 3]     = -8;
    if (posArr[i * 3]     < -8) posArr[i * 3]     =  8;
    if (posArr[i * 3 + 1] >  4.5) posArr[i * 3 + 1] = -4.5;
    if (posArr[i * 3 + 1] < -4.5) posArr[i * 3 + 1] =  4.5;
  }
  pGeo.attributes.position.needsUpdate = true;

  // Rebuild lines
  let idx = 0;
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      const dx = posArr[i * 3]     - posArr[j * 3];
      const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
      const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < CONNECT_DIST * CONNECT_DIST) {
        lineArr[idx++] = posArr[i * 3];
        lineArr[idx++] = posArr[i * 3 + 1];
        lineArr[idx++] = posArr[i * 3 + 2];
        lineArr[idx++] = posArr[j * 3];
        lineArr[idx++] = posArr[j * 3 + 1];
        lineArr[idx++] = posArr[j * 3 + 2];
      }
    }
  }
  lGeo.setDrawRange(0, idx / 3);
  lGeo.attributes.position.needsUpdate = true;

  // Smooth mouse follow → scene tilt
  cx += (mx - cx) * 0.035;
  cy += (my - cy) * 0.035;
  scene.rotation.y = cx * 0.18;
  scene.rotation.x = -cy * 0.12;

  renderer.render(scene, camera);
}

// ── Kick off ───────────────────────────────────────────────
resize();
animate();

window.addEventListener('resize', resize);

// ── React to theme changes ─────────────────────────────────
document.addEventListener('themechange', (e) => {
  const amber = e.detail.theme === 'amber';
  const col = amber ? 0xd97706 : 0x22c55e;
  pMat.color.setHex(col);
  lMat.color.setHex(col);
});
