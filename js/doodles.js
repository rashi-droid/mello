// Line-art doodles, drawn from a few primitives so every botanical shares one hand.
(function () {
  const S = (body, vb = '0 0 100 100', sw = 1.6) => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const r = (n) => Math.round(n * 100) / 100;
  // seeded random so drawings are identical on every load
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const leafPath = (len, wid) => `M0 0 C ${r(wid)} ${r(-len * .3)}, ${r(wid)} ${r(-len * .75)}, 0 ${r(-len)} C ${r(-wid)} ${r(-len * .75)}, ${r(-wid)} ${r(-len * .3)}, 0 0 Z M0 0 L0 ${r(-len * .92)}`;
  const leaf = (x, y, rot, len = 18, wid = 7, veins = true) => {
    let v = '';
    if (veins) for (let i = 1; i <= 3; i++) { const t = -len * (.22 * i + .05); v += `M0 ${r(t)} L${r(wid * .55)} ${r(t - len * .14)} M0 ${r(t)} L${r(-wid * .55)} ${r(t - len * .14)} `; }
    return `<path transform="translate(${r(x)} ${r(y)}) rotate(${r(rot)})" d="${leafPath(len, wid)} ${v}"/>`;
  };
  const flower = (cx, cy, R, petals = 16, rot = 0) => {
    let s = '';
    for (let i = 0; i < petals; i++) { const a = rot + (360 / petals) * i; s += `<ellipse transform="translate(${r(cx)} ${r(cy)}) rotate(${r(a)}) translate(0 ${r(-R * .62)})" rx="${r(R * .17)}" ry="${r(R * .42)}"/>`; }
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * .26)}"/>`;
    for (let i = 0; i < 7; i++) { const a = rnd() * 6.28, d = rnd() * R * .16; s += `<circle cx="${r(cx + Math.cos(a) * d)}" cy="${r(cy + Math.sin(a) * d)}" r=".5"/>`; }
    return s;
  };

  const D = {
    leaf: () => S(`<path d="M50 6 C 80 30, 82 70, 50 94 C 18 70, 20 30, 50 6 Z"/><path d="M50 10 L50 96"/>${[24, 38, 52, 66].map(y => `<path d="M50 ${y} L66 ${y - 10} M50 ${y} L34 ${y - 10}"/>`).join('')}`),
    sprig: () => {
      let s = '<path d="M30 96 C 40 70, 46 46, 70 8"/>';
      const pts = [[33, 86, -50], [36, 78, 45], [39, 66, -55], [44, 56, 40], [49, 44, -50], [55, 34, 38], [61, 24, -45], [70, 8, 20]];
      pts.forEach(([x, y, a], i) => { s += leaf(x, y, a, 16 - i * .6, 6, false); });
      return S(s);
    },
    chamomile: () => S(flower(50, 50, 42, 18, 4)),
    chamomileStem: () => {
      let s = '<path d="M50 98 C 48 76, 44 62, 30 40"/><path d="M50 98 C 54 74, 60 58, 72 46"/><path d="M50 98 C 50 84, 52 70, 50 58"/>';
      s += flower(30, 32, 16, 15, 10) + flower(73, 38, 13, 14, 0) + flower(50, 48, 10, 13, 20);
      s += '<path d="M47 88 C 40 84, 36 78, 34 72 M47 88 C 42 86, 38 86, 33 86 M53 82 C 60 80, 64 74, 66 68 M53 82 C 58 82, 62 84, 67 86"/>';
      return S(s);
    },
    ashwagandha: () => {
      let s = '<path d="M50 70 C 50 50, 48 30, 52 6"/><path d="M50 52 C 40 44, 32 38, 22 36"/><path d="M50 40 C 60 32, 68 28, 80 26"/>';
      s += leaf(22, 36, -70, 20, 8) + leaf(80, 26, 70, 20, 8) + leaf(52, 6, 8, 18, 7) + leaf(50, 30, -40, 15, 6) + leaf(51, 22, 45, 14, 6);
      // papery lantern calyx with the berry inside
      const lantern = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 0 C 9 4, 11 16, 0 24 C -11 16, -9 4, 0 0 Z"/><path d="M0 0 C 3 8, 3 16, 0 24 M0 0 C -3 8, -3 16, 0 24"/><circle cx="0" cy="14" r="4"/></g>`;
      s += `<path d="M50 58 L40 62 M50 58 L60 63 M50 46 L58 50"/>` + lantern(38, 62, .55) + lantern(61, 63, .5) + lantern(59, 50, .42);
      // root below
      s += '<path d="M50 70 C 49 78, 51 86, 48 98 M50 74 C 44 80, 38 84, 30 96 M50 76 C 56 82, 62 86, 70 97 M48 86 C 44 90, 42 94, 41 98 M57 86 C 60 90, 61 94, 60 98"/>';
      s += '<path d="M10 70 L90 70" stroke-dasharray="1.5 4"/>';
      return S(s);
    },
    lionsmane: () => {
      let s = '<path d="M20 44 C 18 22, 40 10, 52 12 C 70 12, 84 24, 80 44"/>';
      for (let i = 0; i < 26; i++) {
        const x = 22 + i * 2.25 + (rnd() - .5) * 1.5; const top = 40 - Math.sin((i / 25) * Math.PI) * 14 + rnd() * 4; const len = 30 + Math.sin((i / 25) * Math.PI) * 26 + rnd() * 8;
        s += `<path d="M${r(x)} ${r(top)} C ${r(x + 2)} ${r(top + len * .35)}, ${r(x - 2)} ${r(top + len * .7)}, ${r(x + (rnd() - .5) * 2)} ${r(top + len)}"/>`;
      }
      s += '<path d="M44 14 C 46 8, 52 6, 56 9"/><path d="M14 98 L86 98" stroke-dasharray="1.5 4"/>';
      return S(s);
    },
    lionsmaneSmall: () => {
      let s = '<path d="M22 40 C 20 20, 40 12, 50 12 C 66 12, 80 22, 78 40"/>';
      for (let i = 0; i < 14; i++) { const x = 24 + i * 4; const top = 36 - Math.sin((i / 13) * Math.PI) * 10; const len = 26 + Math.sin((i / 13) * Math.PI) * 20; s += `<path d="M${x} ${r(top)} C ${x + 2} ${r(top + len * .4)}, ${x - 2} ${r(top + len * .7)}, ${x} ${r(top + len)}"/>`; }
      return S(s);
    },
    gummy: () => S('<path d="M22 30 C 22 18, 30 14, 50 14 C 70 14, 80 18, 80 32 L 80 66 C 80 80, 70 86, 50 86 C 30 86, 20 80, 20 66 Z"/><ellipse cx="50" cy="50" rx="14" ry="12"/><path d="M30 26 C 36 22, 44 21, 50 21"/>'),
    wave: () => { let d = 'M0 20'; for (let i = 0; i < 10; i++) d += ` q 5 ${i % 2 ? 14 : -14} 10 0`; return S(`<path d="${d}"/>`, '0 0 100 40', 2.4); },
    arrow: () => S('<path d="M14 18 C 40 10, 74 26, 72 60 C 71 72, 66 80, 58 86"/><path d="M48 76 L58 87 L70 80"/>', '0 0 100 100', 2),
    seal: () => {
      const txt = 'THIRD-PARTY TESTED · EVERY SINGLE BATCH · ';
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><path id="sealp" d="M50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0"/></defs><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="1"/><text font-family="Manrope, sans-serif" font-weight="800" font-size="7.6" letter-spacing="1.2" fill="currentColor"><textPath href="#sealp">${txt}</textPath></text></svg>`;
    },
    flask: () => S('<path d="M38 10 L62 10 M42 10 L42 40 L20 84 C 18 90, 22 94, 28 94 L72 94 C 78 94, 82 90, 80 84 L58 40 L58 10"/><path d="M28 70 L72 70"/><circle cx="44" cy="80" r="3"/><circle cx="56" cy="84" r="2"/>'),
    cube: () => S('<path d="M50 12 L84 30 L84 70 L50 88 L16 70 L16 30 Z M16 30 L50 48 L84 30 M50 48 L50 88"/>'),
    shield: () => S('<path d="M50 8 L84 20 L84 48 C 84 70, 68 86, 50 94 C 32 86, 16 70, 16 48 L16 20 Z"/><path d="M34 50 L46 62 L68 38"/>'),
    quote: () => '<svg viewBox="0 0 48 40" fill="currentColor" aria-hidden="true"><path d="M0 40V24C0 10 6 2 18 0l2 6C13 8 10 13 10 20h9v20H0Zm27 0V24c0-14 6-22 18-24l2 6c-7 2-10 7-10 14h9v20H27Z"/></svg>',
  };
  window.MELLO_DOODLES = D;
  const paint = (root = document) => root.querySelectorAll('.doodle[data-d]').forEach(el => { if (!el.dataset.done && D[el.dataset.d]) { el.innerHTML = D[el.dataset.d](); el.dataset.done = 1; } });
  window.paintDoodles = paint;
  paint();
})();
