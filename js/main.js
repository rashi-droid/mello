// MELLO page behaviour: scroll, reveals, shop, basket, carousel, footer pour.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => innerWidth <= 1024;
  const money = n => '$' + n.toFixed(2);
  const STATE = (window.MELLO_STATE = window.MELLO_STATE || { ing: { p: 0, chapter: 0 }, cta: 0 });

  const PRODUCTS = {
    calm:   { name: 'Calm',   taste: 'Lavender Honey',  actives: 'Ashwagandha + L-Theanine', color: '#8f80c4', tag: 'Best seller' },
    glow:   { name: 'Glow',   taste: 'Peach Bellini',   actives: 'Biotin + Vitamin E + Zinc', color: '#ec9a76', tag: 'Skin, hair, nails' },
    sleep:  { name: 'Sleep',  taste: 'Blackcurrant',    actives: 'Melatonin + Chamomile', color: '#3d3a78', tag: 'Low-dose melatonin' },
    focus:  { name: 'Focus',  taste: 'Yuzu Citrus',     actives: "Lion's Mane + B12", color: '#e2b13a', tag: 'Caffeine-free' },
    immune: { name: 'Immune', taste: 'Wild Elderberry', actives: 'Elderberry + Vitamin C', color: '#8a2f4e', tag: 'Year-round support' },
    gut:    { name: 'Gut',    taste: 'Green Apple',     actives: 'Apple Cider Vinegar + Inulin', color: '#7f9f45', tag: 'Prebiotic fibre' },
  };
  const PACKS = [
    { id: 'one', label: '1 jar', note: '30 days', price: 34 },
    { id: 'three', label: '3 jars', note: 'Save 15%', price: 86.7 },
    { id: 'sub', label: 'Subscribe', note: 'Every 30 days, 20% off', price: 27.2 },
  ];
  window.MELLO_PRODUCTS = PRODUCTS;

  // ---------- build product cards ----------
  const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>';
  const CARD_INFO = {
    calm:  { no: '01', perks: ['Less stress', 'Steady mood', 'Non-drowsy'], rating: '4.9', reviews: '2,140' },
    glow:  { no: '02', perks: ['Hair', 'Skin', 'Nails'], rating: '4.8', reviews: '1,312' },
    sleep: { no: '03', perks: ['Fall asleep', 'Stay asleep', 'No grogginess'], rating: '4.9', reviews: '1,876' },
    focus:  { no: '04', perks: ['Clear head', 'No jitters', 'Afternoon lift'], rating: '4.8', reviews: '964' },
    immune: { no: '05', perks: ['Daily defence', 'Vitamin C', 'Zinc boost'], rating: '4.8', reviews: '1,058' },
    gut:    { no: '06', perks: ['Less bloat', 'Prebiotic fibre', 'Gentle digestion'], rating: '4.7', reviews: '812' },
  };
  const star = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z"/></svg>';
  const arrow = '<svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  const cardHTML = k => {
    const p = PRODUCTS[k], c = CARD_INFO[k];
    return `<article class="card" style="--fl:${p.color}" data-k="${k}">
      <div class="card-media">
        <span class="fill"></span>
        <span class="card-tag">${p.tag}</span>
        <span class="card-no">${c.no}</span>
        <img class="gm" src="img/gummy-${k}.webp" alt=""><img class="gm" src="img/gummy-${k}.webp" alt=""><img class="gm" src="img/gummy-${k}.webp" alt=""><img class="gm" src="img/gummy-${k}.webp" alt="">
        <img class="jar" src="img/jar-${k}.webp" alt="MELLO ${p.name} jar, ${p.taste} flavour" loading="lazy">
        <span class="card-count">60 gummies · 30 days</span>
      </div>
      <div class="card-body">
        <div class="card-row">
          <div class="card-title">${arrow}<p class="card-name"><span>${p.name}</span><span>${p.taste}</span></p></div>
          <p class="card-price"><small>from</small>$27</p>
        </div>
        <p class="card-meta">${p.actives} · ${p.taste}</p>
        <ul class="card-perks">${c.perks.map(x => `<li>${x}</li>`).join('')}</ul>
        <div class="card-row card-bottom">
          <p class="card-rating"><span class="stars">${star.repeat(5)}</span><b>${c.rating}</b> · ${c.reviews} reviews</p>
          <div class="add">
            <span class="added">Added to basket</span>
            <div class="packs" role="menu"><p>Pick a size</p>${PACKS.map(pk => `<button role="menuitem" data-pack="${pk.id}"><span><b>${pk.label}</b><small>${pk.note}</small></span><em>${money(pk.price)}</em></button>`).join('')}</div>
            <button class="add-btn" aria-label="Add ${p.name} to basket" aria-expanded="false"><span>Add to basket</span>${plus}</button>
          </div>
        </div>
      </div>
    </article>`;
  };
  $('#cards').innerHTML = ['calm', 'glow', 'sleep'].map(cardHTML).join('');
  $('#cards2').innerHTML = ['focus', 'immune', 'gut'].map(cardHTML).join('');

  // ---------- reviews ----------
  const REVIEWS = [
    ['Calmer by Thursday.', 'I started Calm during a launch week and noticed I stopped snapping at Slack notifications. Two gummies with breakfast and that is it.', 'Noor A.', '@noor.builds', 'calm', '3 months'],
    ['My 3pm slump is gone.', 'I used to reach for a second coffee every afternoon. Now it is one Focus gummy after lunch and I make it to six without the crash.', 'Devon K.', '@devonships', 'focus', '2 months'],
    ['Finally sleeping through.', 'Low enough melatonin that I do not wake up foggy. I am asleep before the second podcast episode ends.', 'Mira S.', '@mira.reads', 'sleep', '5 months'],
    ['They taste like dessert.', 'Peach Bellini is genuinely the best part of my skincare routine. I have to hide the jar from my roommate.', 'Tess O.', '@the.slowmorning', 'glow', '6 weeks'],
    ['The only habit I kept.', 'Every other supplement ended up in a drawer. This one lives next to the coffee machine, so I never forget it.', 'Jules R.', '@jules.trains', 'calm', '8 months'],
    ['Nails grew back strong.', 'After two months of Glow my nails stopped peeling. My hairdresser asked what I had changed.', 'Aya M.', '@aya.skin', 'glow', '4 months'],
    ['Replaced my second coffee.', 'Clear head for code reviews and no jitters. I like that it has no caffeine, so it does not mess with my sleep.', 'Sam P.', '@sam.codes', 'focus', '3 months'],
    ['No groggy mornings.', 'Shift work wrecked my sleep. Sleep gummies helped me reset without the heavy feeling the next day.', 'Leo T.', '@leo.night.shift', 'sleep', '7 months'],
  ];
  const revHTML = REVIEWS.map(([q, body, name, h, k, time], i) => {
    const p = PRODUCTS[k];
    return `<article class="rev v${i % 4}" style="--fl:${p.color}">
      <div class="rev-head"><span class="stars" aria-label="5 out of 5">${star.repeat(5)}</span><span class="rev-chip"><img src="img/gummy-${k}.webp" alt="">${p.name}</span></div>
      <i class="q">${window.MELLO_DOODLES.quote()}</i>
      <h3>${q}</h3>
      <p class="rev-body">${body}</p>
      <footer class="rev-foot"><span class="av">${name.split(' ').map(x => x[0]).join('')}</span><span><b>${name}</b><small>${h}</small></span><em><svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1l2.4 2 3.1-.3.8 3 2.6 1.8-1.2 2.9 1.2 2.9-2.6 1.8-.8 3-3.1-.3L10 19l-2.4-2-3.1.3-.8-3-2.6-1.8L2.3 9.6 1.1 6.7l2.6-1.8.8-3 3.1.3z"/><path d="M6.5 10.2l2.3 2.3 4.7-4.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Verified · ${time}</em></footer>
    </article>`;
  }).join('');
  $('#track').innerHTML = revHTML + revHTML + revHTML;

  // scalloped edges: a row of circles that overlaps the section seam
  $$('.scallop').forEach(sc => { sc.innerHTML = '<i></i>'.repeat(7); });

  // ---------- split text ----------
  const wrapWords = (el, cls = 'w') => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="m"><span class="${cls}">${w}</span></span>`).join(' ');
  };
  $$('.split-words, .split-words-dark').forEach(el => wrapWords(el));
  $$('.split-chars').forEach(el => {
    const t = el.textContent;
    el.setAttribute('aria-label', t);
    el.innerHTML = t.split(' ').map(word => `<span style="display:inline-block;white-space:nowrap" aria-hidden="true">${[...word].map(c => `<span class="m"><span class="c">${c}</span></span>`).join('')}</span>`).join(' ');
  });
  $$('.split-lines .line').forEach(l => { l.innerHTML = `<span class="m" style="display:block"><span style="display:block">${l.innerHTML}</span></span>`; });
  $$('.ing-name').forEach(h => {
    const n = h.dataset.name;
    h.setAttribute('aria-label', n);
    h.innerHTML = [...n].map((c, i) => c === ' ' ? ' ' : `<span class="ch" style="--i:${i}" aria-hidden="true"><span>${c}</span></span>`).join('');
  });

  // ---------- smooth scroll + GSAP ----------
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;
  let lenis = null;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.MELLO_LENIS = lenis;
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
  const scrollToEl = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    e.preventDefault(); closeMenu(); scrollToEl(id);
  }));

  // proof numbers roll like an odometer: each digit is a strip of 0-9 (plus a lap) that slides to its target
  $$('.tstat span[data-to]').forEach(n => {
    n.classList.add('odo'); n.setAttribute('aria-label', n.dataset.to);
    n.innerHTML = [...n.dataset.to].map(() => `<span aria-hidden="true">${Array.from({ length: 20 }, (_, i) => `<span>${i % 10}</span>`).join('')}</span>`).join('');
  });
  function spinOdos() {
    $$('.odo').forEach((n, k) => [...n.dataset.to].forEach((d, i) => { const col = n.children[i]; col.style.transitionDelay = (k * .12 + i * .1) + 's'; col.style.transform = `translateY(-${(+d + 10) * 1.12}em)`; }));
  }

  // ---------- reveals ----------
  if (hasGsap && !reduce) {
    // hero sequence on load
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('.hero-h .m > span', { yPercent: 130, duration: 1.3, ease: 'expo.out', stagger: 0.12 })
      .from('.hero-eyebrow', { y: 20, opacity: 0, duration: .9, ease: 'expo.out' }, '-=1.1')
      .from('.hero-list li', { y: 24, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08 }, '-=.9')
      .from('.seal', { scale: 0, rotate: -40, duration: 1.1, ease: 'back.out(1.6)' }, '-=.9')
      .from('.hero-bloom', { scale: .6, rotate: -30, opacity: 0, duration: 1.6, ease: 'expo.out' }, '-=1.2')
      .from('.hero-sub .w', { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .012 }, '-=1.3')
      .from('.hero-ctas > *, .scroll-cue', { y: 20, opacity: 0, duration: .8, ease: 'expo.out', stagger: .08 }, '-=.8');

    const reveal = (targets, trigger, vars = {}) => gsap.from(targets, Object.assign({ yPercent: 130, duration: 1.1, ease: 'expo.out', stagger: 0.025, scrollTrigger: { trigger, start: 'top 85%', once: true } }, vars));
    $$('.split-chars').forEach(el => { if (!el.closest('.hero')) reveal($$('.c', el), el, { stagger: 0.03 }); });
    $$('.split-words, .split-words-dark').forEach(el => { if (!el.closest('.hero')) reveal($$('.w', el), el, { stagger: 0.012, duration: .9 }); });
    $$('.breather [data-speed]').forEach(el => gsap.fromTo(el, { y: () => -(+el.dataset.speed) * innerWidth / 1440 }, { y: () => (+el.dataset.speed) * innerWidth / 1440, ease: 'none', scrollTrigger: { trigger: '.breather', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }));
    $$('.rt-el').forEach(el => gsap.fromTo(el, { y: () => -(+el.dataset.rs) * innerWidth / 1440 }, { y: () => (+el.dataset.rs) * innerWidth / 1440, ease: 'none', scrollTrigger: { trigger: '.ritual', start: 'top bottom', end: 'top -40%', scrub: true, invalidateOnRefresh: true } }));
    gsap.from('.rt-g, .rt-tag', { scale: 0, duration: 1.1, ease: 'back.out(1.7)', stagger: .06, scrollTrigger: { trigger: '.ritual', start: 'top 60%', once: true } });
    gsap.from('.br-g', { scale: 0, rotate: -60, duration: 1.2, ease: 'back.out(1.6)', stagger: .07, scrollTrigger: { trigger: '.breather', start: 'top 70%', once: true } });
    gsap.from('.br-note', { opacity: 0, y: 20, duration: 1, delay: .5, ease: 'expo.out', scrollTrigger: { trigger: '.breather', start: 'top 55%', once: true } });
    gsap.from('.breather .serif', { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.breather', start: 'top 60%', once: true } });
    gsap.from('.trust-main .label-card, .trust-main .coa', { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.trust-main', start: 'top 85%', once: true } });
    // proof numbers count up once
    ScrollTrigger.create({ trigger: '#trustStats', start: 'top 85%', once: true, onEnter: () => { $('#trustStats').classList.add('go'); spinOdos(); } });
    gsap.from('.tstat', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '#trustStats', start: 'top 85%', once: true } });
    // root-to-jar path draws as you scroll, lighting each step
    const pathSteps = $$('.trust-path li');
    gsap.fromTo('.path-line i', { scaleX: () => isMobile() ? 1 : 0, scaleY: () => isMobile() ? 0 : 1 }, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#trustPath', start: 'top 85%', end: 'bottom 60%', scrub: true, invalidateOnRefresh: true, onUpdate: st => pathSteps.forEach((li, i) => li.classList.toggle('on', st.progress >= i / pathSteps.length + .02)) } });
    gsap.from('.trust-path li', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '#trustPath', start: 'top 88%', once: true } });
    $$('.cards').forEach(g => gsap.from($$('.card', g), { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));
    gsap.from('.stop', { y: 30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.day-track', start: 'top 85%', once: true } });
    gsap.from('.cta-card', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.cta', start: 'top 75%', once: true } });

    // stat discs rise one by one while the stats panel is pinned
    const discs = $$('.stat');
    const stl = gsap.timeline({ scrollTrigger: { trigger: '#science', start: () => isMobile() ? 'top -20%' : 'top -10%', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } });
    discs.forEach((d, i) => stl.fromTo(d, { y: '75vh', rotate: i % 2 ? 14 : -14 }, { y: 0, rotate: i % 2 ? -4 : 4, ease: 'power2.out', duration: 1 }, i * 0.55));
    stl.to({}, { duration: .6 });

    // parallax drift for decorative pieces
    $$('.float, .rev-bloom, .ritual-sprig').forEach((el, i) => gsap.to(el, { yPercent: i % 2 ? -40 : 30, rotate: i % 2 ? 25 : -20, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    $$('.frame').forEach(f => gsap.fromTo(f, { y: () => +f.dataset.speed * -1.2 + 'vw' }, { y: () => +f.dataset.speed * 1.6 + 'vw', ease: 'none', scrollTrigger: { trigger: '.ritual-body', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }));
    gsap.fromTo('.day-line', { scaleX: 0, scaleY: 0 }, { scaleX: () => isMobile() ? 1 : 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.day-track', start: 'top 80%', end: 'bottom 55%', scrub: true } });
    gsap.from('.col-h .doodle', { rotate: -180, scale: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.col-h', start: 'top 85%', once: true } });
  } else {
    $('#trustStats').classList.add('go'); spinOdos();
    $$('.trust-path li').forEach(li => li.classList.add('on'));
    $$('.path-line i').forEach(l => { l.style.transform = 'none'; });
    discsStatic();
  }
  // day timeline: sun crosses the sky with scroll, art draws in, clocks open their popups on tap
  (function () {
    const track = $('#dayTrack'), sun = $('.day-sun', track);
    const place = p => { sun.style.left = (4 + p * 92) + '%'; sun.style.top = (82 - Math.sin(Math.PI * Math.min(1, p * 1.05)) * 62) + '%'; sun.classList.toggle('moon', p > .8); };
    place(0);
    if (hasGsap && !reduce) ScrollTrigger.create({ trigger: track, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: st => place(st.progress), onEnter: () => track.classList.add('drawn') });
    else { track.classList.add('drawn'); place(.5); }
    track.addEventListener('click', e => {
      const add = e.target.closest('.pop-add');
      if (add) { addToCart(add.dataset.k, 'one'); openCart(); return; }
      const stop = e.target.closest('.stop'); if (!stop || !e.target.closest('.clock, time')) return;
      $$('.stop.open', track).forEach(o => o !== stop && o.classList.remove('open'));
      stop.classList.toggle('open');
    });
  })();
  function discsStatic() { $$('.stat').forEach(d => { d.style.transform = 'none'; }); $$('.day-line').forEach(l => l.style.transform = 'none'); }

  // ---------- ingredients chapters ----------
  const chapters = $$('.ing-chapter');
  const idxBtns = $$('#ingIndex button');
  let curCh = 0;
  const setChapter = (n) => {
    if (n === curCh) return;
    chapters.forEach((c, i) => { c.classList.toggle('on', i === n); c.classList.toggle('out', i !== n && i < n); if (i > n) c.classList.remove('out'); });
    idxBtns.forEach((b, i) => b.classList.toggle('on', i === n));
    $$('.ing-back .ing-art').forEach((a, i) => a.classList.toggle('on', i === n));
    $('#ingNum').textContent = '0' + (n + 1);
    curCh = n;
  };
  const ingSec = $('#ingredients');
  const ingUpdate = () => {
    const r = ingSec.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    const ch = Math.min(2, Math.floor(p * 3 * 0.9999));
    setChapter(ch);
    const local = Math.min(1, Math.max(0, (p * 3 - ch) / 0.6));
    const c = chapters[ch];
    const num = $('.num', c), bar = $('.bar i', c);
    num.textContent = Math.round(+num.dataset.to * local).toLocaleString('en-US');
    bar.style.transform = `scaleX(${local})`;
    STATE.ing = { p, chapter: ch, local };
  };
  idxBtns.forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    const top = ingSec.getBoundingClientRect().top + scrollY + (ingSec.offsetHeight - innerHeight) * ((i + 0.35) / 3);
    if (lenis) lenis.scrollTo(top, { duration: 1.4 }); else scrollTo({ top, behavior: 'smooth' });
  }));
  // nav flips to light ink when it sits over a dark band
  const darkBands = $$('.dark');
  const navTone = () => { const y = 40; const over = darkBands.some(d => { const r = d.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }) || scrollY + innerHeight > document.documentElement.scrollHeight - innerHeight * 0.75; document.body.classList.toggle('nav-dark', over); };
  // nav tucks away while reading down, returns (with a frosted bar) on any scroll up
  let lastY = scrollY;
  const navShow = () => {
    const y = scrollY, d = y - lastY; if (Math.abs(d) < 4) return;
    const b = document.body.classList;
    b.toggle('nav-hide', d > 0 && y > innerHeight * 0.6 && !b.contains('menu-open'));
    b.toggle('nav-solid', y > innerHeight * 0.6);
    lastY = y;
  };
  const onScroll = () => { ingUpdate(); footerVis(); navTone(); navShow(); };
  if (lenis) lenis.on('scroll', onScroll);
  addEventListener('scroll', onScroll, { passive: true });
  ingUpdate(); navTone();

  // ---------- slot word ----------
  const slot = $$('#slot > span');
  let si = 0;
  setInterval(() => {
    if (document.hidden) return;
    const cur = slot[si], nxt = slot[(si + 1) % slot.length];
    cur.classList.remove('on'); cur.classList.add('gone');
    nxt.classList.remove('gone'); nxt.style.transition = 'none'; nxt.style.transform = 'translateY(110%)';
    void nxt.offsetWidth; nxt.style.transition = ''; nxt.style.transform = ''; nxt.classList.add('on');
    si = (si + 1) % slot.length;
  }, 1900);

  // ---------- menu ----------
  const menuBtn = $('#menuBtn');
  function closeMenu() { document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); $('#menu').setAttribute('aria-hidden', 'true'); lenis && lenis.start(); }
  menuBtn.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    if (!open) return closeMenu();
    closeCart();
    document.body.classList.add('menu-open'); menuBtn.setAttribute('aria-expanded', 'true'); $('#menu').setAttribute('aria-hidden', 'false'); lenis && lenis.stop();
    $$('#menu nav a > span').forEach((s, i) => s.style.transitionDelay = (0.25 + i * 0.06) + 's');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeCart(); closePacks(); } });
  $('#copyMail').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText($('#mail').textContent); b.textContent = 'Copied'; }
    catch { const rg = document.createRange(); rg.selectNodeContents($('#mail')); const s = getSelection(); s.removeAllRanges(); s.addRange(rg); b.textContent = 'Selected'; }
    setTimeout(() => b.textContent = 'Copy', 1600);
  });

  // ---------- basket ----------
  const cart = [];
  const IMG = k => `img/jar-${k === 'box' ? 'calm' : k}.webp`;
  function addToCart(k, packId) {
    const pk = PACKS.find(p => p.id === packId) || PACKS[0];
    const id = k + ':' + pk.id;
    const line = cart.find(l => l.id === id);
    if (line) line.qty++;
    else cart.push({ id, k, name: k === 'box' ? 'Ritual box' : PRODUCTS[k].name, note: k === 'box' ? 'Calm, Focus, Sleep · monthly' : `${pk.label} · ${PRODUCTS[k].taste}`, price: k === 'box' ? 81 : pk.price, qty: 1 });
    renderCart();
    const c = $('#cartCount'); c.classList.remove('on'); void c.offsetWidth; c.classList.add('on');
    if (hasGsap && !reduce) gsap.fromTo('#cartBtn', { scale: 1.25 }, { scale: 1, duration: .6, ease: 'elastic.out(1, .4)' });
  }
  function renderCart() {
    const n = cart.reduce((a, l) => a + l.qty, 0);
    const sub = cart.reduce((a, l) => a + l.qty * l.price, 0);
    const ship = sub === 0 || sub >= 60 ? 0 : 5.95;
    $('#cartCount').textContent = n; $('#cartCount').classList.toggle('on', n > 0);
    $('#cartSub').textContent = n ? `${n} item${n > 1 ? 's' : ''} ready to go` : 'Nothing in here yet';
    $('#subtotal').textContent = money(sub); $('#shipping').textContent = ship ? money(ship) : 'Free'; $('#total').textContent = money(sub + ship);
    $('#shipMsg').textContent = sub >= 60 ? 'You have free shipping' : `${money(60 - sub)} away from free shipping`;
    $('#shipBar').style.transform = `scaleX(${Math.min(1, sub / 60)})`;
    $('#checkout').disabled = !n;
    $('#lines').innerHTML = n ? cart.map(l => `<div class="line-item"><img src="${IMG(l.k)}" alt=""><div><b>${l.name}</b><small>${l.note}</small><span class="qty"><button data-q="-1" data-id="${l.id}" aria-label="Remove one">−</button>${l.qty}<button data-q="1" data-id="${l.id}" aria-label="Add one">+</button></span></div><em>${money(l.qty * l.price)}</em></div>`).join('')
      : `<div class="empty"><i class="doodle" data-d="gummy"></i><p>Your basket is empty.</p><a href="#collection" data-close>Find your ritual</a></div>`;
    window.paintDoodles && window.paintDoodles($('#lines'));
  }
  $('#lines').addEventListener('click', e => {
    const b = e.target.closest('button[data-q]');
    if (b) { const l = cart.find(x => x.id === b.dataset.id); l.qty += +b.dataset.q; if (l.qty <= 0) cart.splice(cart.indexOf(l), 1); renderCart(); }
    const a = e.target.closest('[data-close]');
    if (a) { e.preventDefault(); closeCart(); scrollToEl('#collection'); }
  });
  function openCart() { closeMenu(); document.body.classList.add('cart-open'); $('#drawer').setAttribute('aria-hidden', 'false'); lenis && lenis.stop(); }
  function closeCart() { document.body.classList.remove('cart-open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#till').classList.remove('on'); if (!document.body.classList.contains('menu-open')) lenis && lenis.start(); }
  $('#cartBtn').addEventListener('click', () => document.body.classList.contains('cart-open') ? closeCart() : openCart());
  $('#cartClose').addEventListener('click', closeCart);
  $('#scrim').addEventListener('click', closeCart);
  $('#checkout').addEventListener('click', () => $('#till').classList.add('on'));
  $('#tillBack').addEventListener('click', () => $('#till').classList.remove('on'));
  renderCart();

  // pack pickers
  function closePacks(except) { $$('.add.open').forEach(a => { if (a !== except) { a.classList.remove('open'); $('.add-btn', a).setAttribute('aria-expanded', 'false'); } }); }
  $$('.cards').forEach(g => g.addEventListener('click', e => {
    const card = e.target.closest('.card'); if (!card) return;
    const add = $('.add', card);
    if (e.target.closest('.add-btn')) { const open = !add.classList.contains('open'); closePacks(add); add.classList.toggle('open', open); e.target.closest('.add-btn').setAttribute('aria-expanded', open); return; }
    const pk = e.target.closest('[data-pack]');
    if (pk) {
      addToCart(card.dataset.k, pk.dataset.pack); add.classList.remove('open');
      const f = $('.added', add); f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 1400); return;
    }
    if (matchMedia('(hover: none)').matches) { $$('.card.touch').forEach(c => c !== card && c.classList.remove('touch')); card.classList.toggle('touch'); }
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.add')) closePacks(); });
  $('#boxAdd').addEventListener('click', () => { addToCart('box', 'one'); openCart(); });

  // ---------- batch checker ----------
  const LOTS = {
    'ML-2609-CALM': { p: 'Calm', date: 'Sep 2026', active: ['Withanolides (KSM-66®)', '5.2% · spec ≥ 5%'] },
    'ML-2608-SLEEP': { p: 'Sleep', date: 'Aug 2026', active: ['Melatonin per serving', '1.52 mg · spec 1.35–1.65'] },
    'ML-2609-FOCUS': { p: 'Focus', date: 'Sep 2026', active: ["Beta-glucans (Lion's mane)", '31.4% · spec ≥ 30%'] },
  };
  const coa = (lot) => {
    const L = LOTS[lot];
    if (!L) return `<p class="err">We couldn't find lot ${lot.replace(/[<>&"]/g, '')}. Check the code on the base of the jar, for example ML-2609-CALM.</p>`;
    return `<table><tr><td>${L.p} · tested ${L.date}</td><td class="pass">Passed</td></tr>
      <tr><td>${L.active[0]}</td><td>${L.active[1]}</td></tr>
      <tr><td>Lead</td><td>&lt; 0.05 µg/serving</td></tr><tr><td>Arsenic · Cadmium · Mercury</td><td>Not detected</td></tr>
      <tr><td>E. coli · Salmonella</td><td>Not detected</td></tr><tr><td>Yeast &amp; mould</td><td>&lt; 10 CFU/g</td></tr></table>`;
  };
  $('#coaOut').innerHTML = coa('ML-2609-CALM');
  $('#batchForm').addEventListener('submit', e => {
    e.preventDefault();
    const lot = $('#batch').value.trim().toUpperCase(), ok = !!LOTS[lot], st = $('#coaStamp');
    $('#coaOut').innerHTML = coa(lot);
    st.textContent = ok ? 'Passed' : 'Not found'; st.classList.toggle('fail', !ok);
    st.classList.remove('hit'); void st.offsetWidth; st.classList.add('hit');
  });

  // ---------- round buttons: fill grows from the cursor ----------
  $$('.round').forEach(b => b.addEventListener('pointerenter', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', (e.clientX - r.left) + 'px'); b.style.setProperty('--y', (e.clientY - r.top) + 'px'); }));

  // ---------- reviews: infinite drag track ----------
  (function () {
    const wrap = $('#trackWrap'), track = $('#track');
    let x = 0, v = 0, drag = false, lastX = 0, setW = 0, target = null;
    const measure = () => { setW = track.scrollWidth / 3; };
    measure(); addEventListener('resize', measure);
    x = -setW;
    wrap.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; v = 0; target = null; wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - lastX; lastX = e.clientX; x += dx; v = dx; });
    const up = () => { drag = false; };
    wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
    const step = () => (track.children[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0)) * 2;
    $('#revNext').addEventListener('click', () => { target = x - step(); });
    $('#revPrev').addEventListener('click', () => { target = x + step(); });
    const tick = () => {
      if (!drag) {
        if (target !== null) { x += (target - x) * 0.12; if (Math.abs(target - x) < .5) target = null; }
        else { v *= 0.94; x += v; if (Math.abs(v) < 0.2 && !reduce) x -= 0.35; }
      }
      if (x < -setW * 2) { x += setW; if (target !== null) target += setW; }
      if (x > 0) { x -= setW; if (target !== null) target -= setW; }
      track.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(tick);
    };
    tick();
  })();

  // ---------- CTA carousel (3D lives in stage.js) ----------
  const CTA = ['calm', 'focus', 'sleep'];
  const setCta = (i) => {
    i = (i + CTA.length) % CTA.length; STATE.cta = i;
    const p = PRODUCTS[CTA[i]];
    $('#ctaShow').style.setProperty('--fl', p.color);
    $('#ctaName').textContent = p.name; $('#ctaTaste').textContent = `${p.taste} · ${p.actives}`;
    $('#ctaFb').src = `img/jar-${CTA[i]}.webp`;
    $$('#ctaDots i').forEach((d, j) => d.classList.toggle('on', j === i));
    dispatchEvent(new CustomEvent('mello:cta', { detail: { key: CTA[i], i } }));
  };
  $('#ctaNext').addEventListener('click', () => setCta(STATE.cta + 1));
  $('#ctaPrev').addEventListener('click', () => setCta(STATE.cta - 1));

  // ---------- newsletter ----------
  $('#news').addEventListener('submit', e => { e.preventDefault(); $('#newsOk').textContent = 'You are on the list. Your code is MELLO15.'; e.target.reset(); });

  // ---------- footer: curtain + gummy pour ----------
  const foot = $('#foot');
  function footerVis() { const near = scrollY + innerHeight > document.documentElement.scrollHeight - innerHeight * 1.6; foot.classList.toggle('show', near); if (near) pour.start(); }
  const pour = (function () {
    const cv = $('#pour'), ctx = cv.getContext('2d');
    const GOAL = 100, finale = $('#finale');
    const keys = Object.keys(PRODUCTS);
    const sprites = keys.map(k => { const im = new Image(); im.src = `img/gummy-${k}.webp`; return im; });
    let W = 0, H = 0, dpr = 1, items = [], running = false, count = 0, seeded = false, flood = null, hold = null;
    const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    addEventListener('resize', resize);
    const R = () => Math.max(18, Math.min(W, 1600) * 0.026);
    const setCount = () => { $('#pourCount').textContent = Math.min(count, GOAL); $('#pourBar').style.transform = `scaleX(${Math.min(1, count / GOAL)})`; };
    const spawn = (x, y, n = 6) => {
      if (flood) return;
      for (let i = 0; i < n; i++) {
        if (items.length > 140) items.shift();
        const r = R() * (0.85 + Math.random() * 0.3);
        items.push({ x: x + (Math.random() - .5) * 60, y: y - Math.random() * 40, vx: (Math.random() - .5) * 6, vy: -Math.random() * 4, r, a: Math.random() * 6.28, va: (Math.random() - .5) * .2, s: (Math.random() * sprites.length) | 0 });
      }
      count += n; setCount();
      if (count >= GOAL) startFlood();
    };
    // the hundredth gummy tips it over: the jar empties onto the screen, then the finale fades up
    function startFlood() {
      stopHold();
      flood = { t: 0, n: 0 };
      foot.classList.add('flooding'); document.body.classList.add('nav-hide');
      items.forEach(p => { p.rest = p.y; });
      setTimeout(() => { finale.classList.add('on'); finale.setAttribute('aria-hidden', 'false'); setTimeout(() => $('#pourAgain').focus({ preventScroll: true }), 900); }, 2600);
    }
    function floodStep() {
      flood.t++;
      const big = R() * 2.1, per = Math.ceil(W / (big * 1.5));
      if (flood.t < 120 && flood.t % 3 === 0) {
        for (let i = 0; i < per; i++) {
          // each wave rests a little higher than the last, so the level climbs to the top
          const lvl = H + big - (flood.n / per) * big * 0.62;
          items.push({ x: (i + Math.random()) * (W / per), y: -big * (1 + Math.random() * 2), vx: 0, vy: 2 + Math.random() * 4, r: big * (0.85 + Math.random() * 0.35), a: Math.random() * 6.28, va: (Math.random() - .5) * .3, s: (Math.random() * sprites.length) | 0, rest: lvl - big + (Math.random() - .5) * big * .8 });
        }
        flood.n += per;
      }
      for (const p of items) {
        if (p.y < p.rest) { p.vy += 0.9; p.y += p.vy; p.a += p.va; if (p.y >= p.rest) { p.y = p.rest; p.vy = 0; } }
      }
    }
    function reset() {
      finale.classList.remove('on'); finale.setAttribute('aria-hidden', 'true');
      foot.classList.remove('flooding');
      items = []; flood = null; count = 0; setCount();
    }
    $('#pourAgain').addEventListener('click', reset);
    $('#finale .finale-link').addEventListener('click', () => setTimeout(reset, 1200));
    const at = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    function stopHold() { clearInterval(hold); hold = null; }
    cv.addEventListener('pointerdown', e => {
      const [x, y] = at(e); spawn(x, y, 6);
      stopHold(); let pt = [x, y];
      const move = ev => { pt = at(ev); };
      cv.addEventListener('pointermove', move);
      const end = () => { stopHold(); cv.removeEventListener('pointermove', move); };
      // keep pouring while held, but a scroll gesture on touch cancels it
      hold = setInterval(() => spawn(pt[0], pt[1], 2), 90);
      addEventListener('pointerup', end, { once: true }); addEventListener('pointercancel', end, { once: true });
    });
    const step = () => {
      if (!running) return;
      if (flood) floodStep();
      else {
        const floor = H - (isMobile() ? H * 0.02 : 4);
        for (const p of items) {
          p.vy += 0.45; p.vx *= 0.995; p.x += p.vx; p.y += p.vy; p.a += p.va;
          if (p.y + p.r > floor) { p.y = floor - p.r; p.vy *= -0.32; p.vx *= 0.82; p.va = p.vx / p.r; }
          if (p.x - p.r < 0) { p.x = p.r; p.vx *= -0.5; }
          if (p.x + p.r > W) { p.x = W - p.r; p.vx *= -0.5; }
        }
        for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r;
          if (d > 0 && d < m) { const o = (m - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o; const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const imp = rv * 0.6; a.vx += nx * imp; a.vy += ny * imp; b.vx -= nx * imp; b.vy -= ny * imp; } }
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      for (const p of items) { const im = sprites[p.s]; if (!im.complete) continue; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); const s = p.r * 2.5; ctx.drawImage(im, -s / 2, -s / 2, s, s); ctx.restore(); }
      requestAnimationFrame(step);
    };
    return {
      start() {
        if (running) return; running = true; resize();
        if (!seeded) { seeded = true; let k = 0; const drip = setInterval(() => { spawn(W * (0.2 + Math.random() * 0.6), -40, 3); if (++k > 5) clearInterval(drip); }, 260); }
        step();
        const stopCheck = setInterval(() => { if (!foot.classList.contains('show')) { running = false; clearInterval(stopCheck); } }, 1000);
      },
    };
  })();
  footerVis();

  addEventListener('load', () => hasGsap && ScrollTrigger.refresh());
})();
