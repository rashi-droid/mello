// The sticky 3D stage (hero -> science -> ingredients) and the CTA jar carousel.
import { THREE, FLAVOURS, buildJar, buildGummy, studioEnvironment, contactShadow, fontsReady, makeRenderer } from './mello3d.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STATE = (window.MELLO_STATE = window.MELLO_STATE || { ing: { p: 0, chapter: 0 }, cta: 0 });
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
const DPR = () => Math.min(window.devicePixelRatio || 1, 1.75);

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
if (!webglOK()) { document.documentElement.classList.add('no-webgl'); throw new Error('no webgl'); }

await fontsReady();

/* =========================== hero stage =========================== */
const canvas = document.getElementById('stageCanvas');
const renderer = makeRenderer(canvas);
renderer.setPixelRatio(DPR());
const scene = new THREE.Scene();
scene.environment = studioEnvironment(renderer);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 10);
const key = new THREE.DirectionalLight('#ffffff', 1.1); key.position.set(-4, 6, 6); scene.add(key);
const rim = new THREE.DirectionalLight('#ffd9c4', 0.8); rim.position.set(5, 2, -4); scene.add(rim);

// jar on a pivot at its visual centre
const pivot = new THREE.Group(); scene.add(pivot);
const jar = buildJar(FLAVOURS.calm, { anisotropy: renderer.capabilities.getMaxAnisotropy() });
jar.position.y = -0.95; pivot.add(jar);
const shadow = contactShadow(3.6, 0.42); shadow.position.y = -0.95; pivot.add(shadow);

// small gummies that float around the jar, one per flavour family
const GCOL = [FLAVOURS.calm.gummy, FLAVOURS.glow.gummy, FLAVOURS.focus.gummy, FLAVOURS.sleep.gummy, FLAVOURS.calm.gummy, FLAVOURS.glow.gummy, FLAVOURS.gut.gummy, FLAVOURS.immune.gummy, FLAVOURS.focus.gummy];
const HOMES = [[-1.8, 0.7, 0.4], [1.7, 1.0, 0.2], [1.85, -0.5, 0.5], [-1.9, -0.6, 0.3], [-1.1, -1.6, 0.6], [-0.2, -1.75, 0.6], [0.3, 1.65, -0.5], [-0.7, 1.55, 0.5], [2.3, 0.35, -0.6]];
const floaters = GCOL.map((c, i) => {
  const g = buildGummy(c); const s = 0.17 + (i % 3) * 0.035;
  g.userData = { home: new THREE.Vector3(...HOMES[i]), s, ph: i * 1.7, spin: new THREE.Vector3((i % 2 ? 1 : -1) * 0.3, 0.4 + i * 0.05, 0.2) };
  g.rotation.set(i, i * 2, i * .5); g.scale.setScalar(s);
  scene.add(g); return g;
});

// the oversized ingredient gummy
const hero = buildGummy(FLAVOURS.calm.gummy); scene.add(hero);
hero.visible = false;
const CH_COL = [FLAVOURS.calm.gummy, FLAVOURS.focus.gummy, FLAVOURS.sleep.gummy].map(c => new THREE.Color(c));
const heroMat = hero.material;

// layout --------------------------------------------------------------
let W = 1, H = 1, hh = 1, hw = 1, mobile = false;
const sec = {};
function measure() {
  W = canvas.clientWidth; H = canvas.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; hw = hh * camera.aspect;
  mobile = innerWidth <= 1024;
  const top = id => { const el = document.getElementById(id); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight }; };
  sec.hero = top('hero'); sec.sci = top('science'); sec.ing = top('ingredients'); sec.stage = top('stage');
  buildKeys();
}
// jar size from a target share of viewport height, capped by width
const jarS = (hf, wf) => Math.min(hf * 2 * hh / 1.9, wf * hw);
let KEYS = [], GKEYS = [];
function buildKeys() {
  const vh = innerHeight;
  const sciStart = sec.sci.top, sciEnd = sec.sci.top + sec.sci.h - vh;
  const ingStart = sec.ing.top, ingEnd = sec.ing.top + sec.ing.h - vh;
  if (!mobile) {
    KEYS = [
      { y: 0,                          x: 0.37, yy: -0.08, s: jarS(0.54, 0.185), ry: -0.5,  rz: 0.07, spread: 0.95, sh: 1 },
      { y: sciStart - vh * 0.05,       x: 0.08, yy: -0.5,  s: jarS(0.36, 0.2), ry: -1.42, rz: -0.03, spread: 1.1, sh: 1 },
      { y: sciStart + vh * 0.6,        x: 0.0,  yy: -0.1,  s: jarS(0.5, 0.2),  ry: -1.42 - 0.3, rz: 0, spread: 1.45, sh: 1 },
      { y: sciEnd,                     x: 0.0,  yy: 0.02,  s: jarS(0.44, 0.2), ry: -2.6, rz: 0.04, spread: 1.7, sh: 0.6 },
      { y: ingStart + vh * 0.05,       x: -0.05, yy: 1.9,  s: jarS(0.3, 0.2),  ry: -4.8, rz: 0.3, spread: 2.2, sh: 0 },
    ];
    GKEYS = [
      { y: sciEnd - vh * 0.1, x: 0.42, yy: -1.9, s: 0.0, o: 0 },
      { y: ingStart + vh * 0.15, x: 0.42, yy: -0.05, s: Math.min(hh * 0.38, hw * 0.2), o: 1 },
      { y: ingEnd - vh * 0.1, x: 0.42, yy: -0.05, s: Math.min(hh * 0.38, hw * 0.2), o: 1 },
      { y: ingEnd + vh * 0.6, x: 0.42, yy: 2.0, s: Math.min(hh * 0.3, hw * 0.2), o: 1 },
    ];
  } else {
    KEYS = [
      { y: 0,                    x: 0, yy: -0.07, s: jarS(0.27, 0.36), ry: -0.45, rz: 0.05, spread: 0.8, sh: 1 },
      { y: sciStart - vh * 0.2,  x: 0, yy: -0.42, s: jarS(0.22, 0.32), ry: -1.42, rz: -0.03, spread: 0.8, sh: 1 },
      { y: sciStart + vh * 0.5,  x: 0, yy: 0.0,   s: jarS(0.26, 0.36), ry: -1.7, rz: 0, spread: 0.85, sh: 1 },
      { y: sciEnd,               x: 0, yy: 0.05,  s: jarS(0.24, 0.34), ry: -2.6, rz: 0.04, spread: 0.95, sh: 0.6 },
      { y: ingStart + vh * 0.05, x: 0, yy: 1.9,   s: jarS(0.2, 0.3),   ry: -4.8, rz: 0.3, spread: 1.4, sh: 0 },
    ];
    const gs = Math.min(hh * 0.26, hw * 0.42);
    GKEYS = [
      { y: sciEnd - vh * 0.1, x: 0, yy: -1.9, s: 0, o: 0 },
      { y: ingStart + vh * 0.15, x: 0, yy: -0.22, s: gs, o: 1 },
      { y: ingEnd - vh * 0.1, x: 0, yy: -0.22, s: gs, o: 1 },
      { y: ingEnd + vh * 0.6, x: 0, yy: 2.0, s: gs * 0.8, o: 1 },
    ];
  }
}
function sample(keys, y) {
  if (y <= keys[0].y) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (y <= b.y) { const t = ease(clamp((y - a.y) / (b.y - a.y))); const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], t); return o; }
  }
  return keys[keys.length - 1];
}

// pointer parallax
const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => { ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });

const clock = new THREE.Clock();
let smoothY = scrollY;
let gummyColor = CH_COL[0].clone();
function frame() {
  requestAnimationFrame(frame);
  const y = scrollY;
  if (y > sec.stage.top + sec.stage.h + 50) return; // stage scrolled away
  const t = clock.elapsedTime;
  const dt = Math.min(0.1, clock.getDelta());
  smoothY += (y - smoothY) * (reduce ? 1 : 1 - Math.exp(-dt * 11));
  ptr.sx += (ptr.x - ptr.sx) * 0.05; ptr.sy += (ptr.y - ptr.sy) * 0.05;

  const k = sample(KEYS, smoothY);
  const idle = reduce ? 0 : 1;
  pivot.position.set(k.x * hw, k.yy * hh + Math.sin(t * 0.9) * 0.05 * idle, 0);
  pivot.scale.setScalar(k.s);
  pivot.rotation.set(0.12 + ptr.sy * 0.08 * idle, k.ry + Math.sin(t * 0.5) * 0.12 * idle + ptr.sx * 0.25 * idle, k.rz);
  shadow.material.opacity = k.sh;

  floaters.forEach((g, i) => {
    const u = g.userData;
    // offsets in jar units; never closer than 1.4 jar half-widths so gummies orbit, never sink into the jar
    let ox = u.home.x * k.spread, oy = u.home.y * Math.min(k.spread, 1.8);
    const m = Math.max(Math.abs(ox) / 1.0, Math.abs(oy) / 1.05);
    if (m < 1.4) { ox *= 1.4 / m; oy *= 1.4 / m; }
    g.position.set(
      pivot.position.x + ox * k.s + Math.sin(t * 0.7 + u.ph) * 0.05 * idle,
      pivot.position.y + oy * k.s + Math.cos(t * 0.9 + u.ph) * 0.06 * idle,
      u.home.z * k.s * 0.5
    );
    g.rotation.x += 0.003 * u.spin.x * idle; g.rotation.y += 0.004 * u.spin.y * idle;
    g.scale.setScalar(u.s * k.s * (mobile ? 0.95 : 1));
    g.visible = k.spread < 2.1;
  });

  const gk = sample(GKEYS, smoothY);
  hero.visible = gk.s > 0.01;
  if (hero.visible) {
    hero.position.set(gk.x * hw, gk.yy * hh + Math.sin(t * 0.8) * 0.06 * idle, 0);
    hero.scale.setScalar(gk.s);
    hero.rotation.set(0.8 + Math.sin(t * 0.4) * 0.15 * idle + ptr.sy * 0.15, t * 0.25 * idle + (smoothY - sec.ing.top) * 0.0012 + ptr.sx * 0.3, 0.2 + Math.cos(t * 0.3) * 0.08 * idle);
    gummyColor.lerp(CH_COL[STATE.ing.chapter] || CH_COL[0], 1 - Math.exp(-dt * 4));
    heroMat.color.copy(gummyColor);
    heroMat.attenuationColor.copy(gummyColor).multiplyScalar(0.55);
  }
  renderer.render(scene, camera);
}
measure();
addEventListener('resize', () => { renderer.setPixelRatio(DPR()); measure(); });
addEventListener('load', measure);
setTimeout(measure, 1200);
frame();

/* =========================== CTA carousel =========================== */
const cc = document.getElementById('ctaCanvas');
const cr = makeRenderer(cc);
cr.setPixelRatio(DPR());
const cs = new THREE.Scene();
cs.environment = studioEnvironment(cr, '#f6efe6');
const ccam = new THREE.PerspectiveCamera(28, 1, 0.1, 100); ccam.position.set(0, 0.6, 9.5); ccam.lookAt(0, 0, 0);
const ckey = new THREE.DirectionalLight('#fff', 1.1); ckey.position.set(-3, 5, 6); cs.add(ckey);
const KEYS_CTA = ['calm', 'focus', 'sleep'];
const jars = KEYS_CTA.map(k => {
  const p = new THREE.Group(); const j = buildJar(FLAVOURS[k]); j.position.y = -0.95; p.add(j);
  const sh = contactShadow(3.4, 0.35); sh.position.y = -0.95; p.add(sh);
  p.visible = false; cs.add(p); return p;
});
let cur = 0, from = -1, swapT = 1, dir = 1;
let rotY = -0.4, vel = 0, dragging = false, lastX = 0, visibleCTA = false;
jars[0].visible = true;
cc.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; cc.setPointerCapture(e.pointerId); cc.style.cursor = 'grabbing'; });
cc.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.01; rotY += vel; });
const end = () => { dragging = false; cc.style.cursor = ''; };
cc.addEventListener('pointerup', end); cc.addEventListener('pointercancel', end);
addEventListener('mello:cta', e => { const n = e.detail.i; if (n === cur) return; dir = ((n - cur + 3) % 3) === 1 ? 1 : -1; from = cur; cur = n; swapT = 0; jars[cur].visible = true; });
new IntersectionObserver(es => { visibleCTA = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(cc);
function sizeCTA() { const w = cc.clientWidth, h = cc.clientHeight; if (!w || !h) return; cr.setSize(w, h, false); ccam.aspect = w / h; ccam.updateProjectionMatrix(); }
sizeCTA(); addEventListener('resize', sizeCTA);
const cclock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop);
  if (!visibleCTA) return;
  const t = cclock.getElapsedTime();
  if (!dragging) { vel *= 0.94; rotY += vel + (reduce ? 0 : 0.003); }
  const fit = Math.min(1.3, ccam.aspect * 1.5);
  if (swapT < 1) swapT = Math.min(1, swapT + 0.025);
  const e = 1 - Math.pow(1 - swapT, 3);
  jars.forEach((j, i) => {
    if (i === cur) { j.position.x = (1 - e) * 4 * dir; j.rotation.y = rotY - (1 - e) * 2 * dir; j.scale.setScalar(fit * (0.85 + 0.15 * e)); j.position.y = Math.sin(t) * 0.05; }
    else if (i === from && swapT < 1) { j.position.x = -e * 4 * dir; j.rotation.y = rotY + e * 2 * dir; j.scale.setScalar(fit * (1 - 0.15 * e)); }
    else j.visible = false;
  });
  if (swapT >= 1 && from >= 0) { jars[from].visible = false; from = -1; }
  cr.render(cs, ccam);
})();
