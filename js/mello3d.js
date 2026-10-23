// MELLO 3D kit: the jar, the gummy, the studio light. Shared by the live page and the still-life renders.
import * as THREE from '../vendor/three.module.min.js';

export { THREE };

export const FLAVOURS = {
  calm:   { key: 'calm',   name: 'Calm',   actives: 'Ashwagandha + L-Theanine', taste: 'Lavender Honey', jar: '#8f80c4', deep: '#4b3f7d', gummy: '#b7a6ee', label: '#f5f1fa', dose: ['KSM-66® Ashwagandha', '300 mg', 'L-Theanine', '100 mg'] },
  glow:   { key: 'glow',   name: 'Glow',   actives: 'Biotin + Vitamin E + Zinc', taste: 'Peach Bellini', jar: '#ec9a76', deep: '#a5502f', gummy: '#ffb08a', label: '#fdf4ee', dose: ['Biotin', '2,500 mcg', 'Vitamin E', '15 mg'] },
  sleep:  { key: 'sleep',  name: 'Sleep',  actives: 'Melatonin + Chamomile', taste: 'Blackcurrant', jar: '#3d3a78', deep: '#1f1d4a', gummy: '#6a5fc4', label: '#eeedf7', dose: ['Melatonin', '1.5 mg', 'Chamomile', '50 mg'] },
  focus:  { key: 'focus',  name: 'Focus',  actives: "Lion's Mane + B12", taste: 'Yuzu Citrus', jar: '#e2b13a', deep: '#8a6410', gummy: '#ffd25e', label: '#fdf8ea', dose: ["Lion's Mane", '500 mg', 'Vitamin B12', '6 mcg'] },
  immune: { key: 'immune', name: 'Immune', actives: 'Elderberry + Vitamin C', taste: 'Wild Elderberry', jar: '#8a2f4e', deep: '#4f1229', gummy: '#b8456b', label: '#faf0f3', dose: ['Elderberry', '150 mg', 'Vitamin C', '90 mg'] },
  gut:    { key: 'gut',    name: 'Gut',    actives: 'Apple Cider Vinegar + Inulin', taste: 'Green Apple', jar: '#7f9f45', deep: '#45601c', gummy: '#a9cc62', label: '#f4f8ec', dose: ['Apple Cider Vinegar', '500 mg', 'Inulin fibre', '1 g'] },
};

// ---------- studio environment (soft boxes in a pale room) ----------
export function studioEnvironment(renderer, tint = '#f2ece4') {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const scene = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(20, 12, 20),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(0.55), side: THREE.BackSide })
  );
  room.position.y = 4;
  scene.add(room);
  const panel = (w, h, intensity, pos, look, color = '#ffffff') => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(...look); scene.add(m);
  };
  panel(8, 3, 6, [0, 9.5, 0], [0, 0, 0]);            // overhead softbox
  panel(4, 6, 4.2, [-9.5, 3, 3], [0, 1, 0]);         // key strip, left
  panel(3, 6, 2.4, [9.5, 3, -2], [0, 1, 0], '#fff3e6'); // warm fill, right
  panel(10, 1.2, 2.2, [0, 2.5, -9.5], [0, 1, 0]);    // rim behind
  const env = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  return env;
}

// ---------- the jar ----------
function latheProfile() {
  const pts = [];
  const R = 1, H = 1.5;
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(R - 0.1, 0));
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2); pts.push(new THREE.Vector2(R - 0.1 + Math.cos(a) * 0.1, 0.1 + Math.sin(a) * 0.1)); }
  pts.push(new THREE.Vector2(R, H - 0.16));
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * (Math.PI / 2); pts.push(new THREE.Vector2(R - 0.16 + Math.cos(a) * 0.16, H - 0.16 + Math.sin(a) * 0.16)); }
  pts.push(new THREE.Vector2(0.86, H));
  pts.push(new THREE.Vector2(0.86, H + 0.07));
  pts.push(new THREE.Vector2(0, H + 0.07));
  return pts;
}

function lidGeometry() {
  const r = 0.93, h = 0.36, e = 0.05, base = 1.53;
  const pts = [new THREE.Vector2(0.85, base), new THREE.Vector2(r, base), new THREE.Vector2(r, base + h - e)];
  for (let i = 1; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); pts.push(new THREE.Vector2(r - e + Math.cos(a) * e, base + h - e + Math.sin(a) * e)); }
  pts.push(new THREE.Vector2(0, base + h));
  const g = new THREE.LatheGeometry(pts, 360);
  // knurled ribs on the side wall, the way real CRC lids are gripped
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const rr = Math.hypot(x, z);
    if (y > base + 0.03 && y < base + h - e - 0.01 && rr > r - 0.01) {
      const th = Math.atan2(z, x);
      const k = 1 + 0.006 * Math.sign(Math.sin(th * 120));
      p.setX(i, x * k); p.setZ(i, z * k);
    }
  }
  g.computeVertexNormals();
  return g;
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// Label wraps the full jar: directions on the left panel, the face in the middle, supplement facts on the right.
export function labelCanvas(f) {
  const W = 4096, H = 620;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = f.label; x.fillRect(0, 0, W, H);
  // paper grain
  for (let i = 0; i < 14000; i++) { x.fillStyle = `rgba(60,40,30,${Math.random() * 0.035})`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  const ink = '#2a1b2e';
  const cx = W / 2;
  // face
  x.fillStyle = f.deep; x.fillRect(0, 0, W, 16); x.fillRect(0, H - 16, W, 16);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = ink;
  x.font = '600 190px Antonio, "Arial Narrow", sans-serif';
  x.fillText('MELLO', cx - 10, 238);
  const mw = x.measureText('MELLO').width;
  x.font = '600 40px Manrope, sans-serif'; x.fillText('™', cx + mw / 2 + 14, 112);
  x.font = 'italic 112px "Instrument Serif", Georgia, serif'; x.fillStyle = f.deep;
  x.fillText(f.name.toLowerCase(), cx, 360);
  x.fillStyle = ink; x.font = '700 30px Manrope, sans-serif';
  x.letterSpacing = '6px';
  x.fillText(f.actives.toUpperCase(), cx, 425);
  x.font = '500 28px Manrope, sans-serif';
  x.fillText(`${f.taste.toUpperCase()} FLAVOUR`, cx, 470);
  x.strokeStyle = ink; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - 300, 512); x.lineTo(cx + 300, 512); x.stroke();
  x.font = '600 24px Manrope, sans-serif';
  x.fillText('60 VEGAN GUMMIES · DIETARY SUPPLEMENT', cx, 560);
  x.letterSpacing = '0px';
  // flavour dot cluster
  x.fillStyle = f.jar; x.beginPath(); x.arc(cx - 380, 330, 26, 0, 7); x.fill();
  x.beginPath(); x.arc(cx + 380, 330, 26, 0, 7); x.fill();

  // left panel: what it does + directions
  const lx = cx - 1180;
  x.textAlign = 'left'; x.fillStyle = ink;
  x.font = 'italic 64px "Instrument Serif", Georgia, serif';
  x.fillText('Feel good, naturally.', lx, 140);
  x.font = '500 27px Manrope, sans-serif';
  const lines = [`Two ${f.taste.toLowerCase()} gummies a day with`, `${f.actives.toLowerCase()} at clinically`, 'studied doses. Pectin-based, vegan,', 'and 2 g of sugar per serving.'];
  lines.forEach((l, i) => x.fillText(l, lx, 210 + i * 42));
  x.font = '700 22px Manrope, sans-serif'; x.letterSpacing = '4px';
  x.fillText('DIRECTIONS', lx, 420); x.letterSpacing = '0px';
  x.font = '500 24px Manrope, sans-serif';
  x.fillText('Chew 2 gummies daily. Do not exceed.', lx, 460);
  x.fillText('Store cool and dry. Made in a GMP facility.', lx, 496);

  // right panel: supplement facts
  const rx = cx + 640, rw = 560;
  x.strokeStyle = ink; x.lineWidth = 4; x.strokeRect(rx, 70, rw, 470);
  x.font = '800 44px Manrope, sans-serif'; x.fillText('Supplement Facts', rx + 22, 124);
  x.font = '500 22px Manrope, sans-serif';
  x.fillText('Serving size 2 gummies · 30 servings', rx + 22, 160);
  x.fillRect(rx + 12, 176, rw - 24, 12);
  x.font = '700 22px Manrope, sans-serif'; x.fillText('Amount per serving', rx + 22, 214);
  const rows = [['Calories', '15'], ['Total sugars', '2 g'], [f.dose[0], f.dose[1]], [f.dose[2], f.dose[3]]];
  x.font = '500 23px Manrope, sans-serif';
  rows.forEach((r, i) => {
    const y = 258 + i * 52;
    x.fillRect(rx + 12, y - 34, rw - 24, 2);
    x.textAlign = 'left'; x.fillText(r[0], rx + 22, y);
    x.textAlign = 'right'; x.fillText(r[1], rx + rw - 22, y);
  });
  x.textAlign = 'left'; x.font = '500 18px Manrope, sans-serif';
  x.fillText('Other: pectin, cane sugar, natural flavour, fruit concentrate.', rx + 22, 500);
  // barcode
  const bx = cx + 1300;
  for (let i = 0; i < 70; i++) { const w = [2, 3, 5][(i * 7) % 3]; if (i % 4 !== 1) x.fillRect(bx + i * 6, 380, w, 120); }
  x.font = '500 20px Manrope, sans-serif'; x.fillText('8 40112 30' + (f.key.length * 7) + ' 2', bx + 20, 528);
  return c;
}

export function buildJar(f, { anisotropy = 8 } = {}) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: f.jar, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0.2, sheenColor: new THREE.Color(f.label) });
  const body = new THREE.Mesh(new THREE.LatheGeometry(latheProfile(), 160), bodyMat);
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  const tex = new THREE.CanvasTexture(labelCanvas(f));
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = anisotropy;
  const labelMat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.3 });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(1.004, 1.004, 1.0, 160, 1, true, Math.PI, Math.PI * 2), labelMat);
  label.position.y = 0.7; label.castShadow = true;
  g.add(label);
  g.userData.labelTexture = tex;

  const lidMat = new THREE.MeshPhysicalMaterial({ color: '#f4efe6', roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25 });
  const lid = new THREE.Mesh(lidGeometry(), lidMat);
  lid.castShadow = true;
  g.add(lid);
  // embossed ring on the lid top
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.012, 12, 120), lidMat);
  ring.rotation.x = Math.PI / 2; ring.position.y = 1.89; g.add(ring);
  // shrink band between lid and shoulder
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.935, 0.95, 0.08, 120, 1, true), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, roughness: 0.1, clearcoat: 1, side: THREE.DoubleSide }));
  band.position.y = 1.55; g.add(band);

  g.userData.materials = { bodyMat, labelMat, lidMat };
  return g;
}

// ---------- the gummy: a soft square pillow, the brand's shape ----------
let _gummyGeo;
export function gummyGeometry() {
  if (_gummyGeo) return _gummyGeo;
  const g = new THREE.SphereGeometry(1, 72, 54);
  const p = g.attributes.position, v = new THREE.Vector3();
  const P = 3.2;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    const r = Math.pow(Math.pow(Math.abs(v.x), P) + Math.pow(Math.abs(v.y), 2.2) + Math.pow(Math.abs(v.z), P), -1 / P);
    v.multiplyScalar(r);
    v.y *= 0.5;
    // a shallow dimple on top, like a pressed mould
    const d = Math.hypot(v.x, v.z);
    if (v.y > 0) v.y -= 0.06 * Math.exp(-d * d * 6);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  _gummyGeo = g;
  return g;
}

export function gummyMaterial(color, { transmission = true } = {}) {
  return new THREE.MeshPhysicalMaterial({
    color, roughness: 0.22, metalness: 0,
    transmission: transmission ? 0.75 : 0, thickness: 1.4, ior: 1.42,
    attenuationColor: new THREE.Color(color).multiplyScalar(0.55), attenuationDistance: 0.7,
    clearcoat: 1, clearcoatRoughness: 0.12,
    sheen: 0.25, sheenRoughness: 0.6, sheenColor: new THREE.Color('#ffffff'),
  });
}

export function buildGummy(color, opts) {
  const m = new THREE.Mesh(gummyGeometry(), gummyMaterial(color, opts));
  m.castShadow = true;
  return m;
}

// soft radial contact shadow
export function contactShadow(size = 3.2, opacity = 0.45) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, `rgba(30,18,30,${opacity})`); gr.addColorStop(0.45, `rgba(30,18,30,${opacity * 0.45})`); gr.addColorStop(1, 'rgba(30,18,30,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.002;
  return m;
}

export async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load('600 190px Antonio'),
      document.fonts.load('italic 112px "Instrument Serif"'),
      document.fonts.load('700 30px Manrope'),
      document.fonts.load('500 30px Manrope'),
      document.fonts.load('800 30px Manrope'),
    ]);
  } catch (e) { /* fall back to system faces */ }
}

export function makeRenderer(canvas, { alpha = true, shadows = false } = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  if (shadows) { r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; }
  return r;
}
