// ---- page switching ----
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link, .logo');
  function showPage(name, anchor){
    pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
    navLinks.forEach(l => {
      if(l.classList.contains('nav-link')){
        l.classList.toggle('active', l.dataset.page === name && !l.dataset.anchor);
      }
    });
    window.scrollTo({top:0, behavior:'instant'});
    if(anchor){
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }, 50);
    }
  }
  navLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      showPage(this.dataset.page, this.dataset.anchor);
      const nav = document.getElementById('siteNav');
      const toggle = document.getElementById('navToggle');
      nav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // ---- mobile nav toggle ----
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  toggle.addEventListener('click', function(){
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // ---- terminal typing effect ----
  const lines = [
    { html: '<span class="prompt">$</span> whoami', pause: 500 },
    { html: '<span class="term-out">→ </span><span class="term-name">Ashfaq Ahmed M</span>', pause: 550 },
    { html: '<span class="prompt">$</span> cat role.txt', pause: 500 },
    { html: '<span class="term-out">→ CSE student · Software Dev · Network Security · UI/UX</span>', pause: 550 },
    { html: '<span class="prompt">$</span> echo $STATUS', pause: 450 },
    { html: '<span class="term-out">→ building, breaking, and designing things — on repeat.</span>', pause: 0 },
  ];
  const el = document.getElementById('termBody');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function typeLine(html, cb){
    const div = document.createElement('div');
    div.className = 'term-line';
    el.appendChild(div);
    if (reduceMotion){ div.innerHTML = html; cb(); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const full = tmp.textContent;
    let i = 0;
    const speed = 18;
    function step(){
      div.textContent = full.slice(0, i);
      i++;
      if (i <= full.length){ setTimeout(step, speed); }
      else { div.innerHTML = html; cb(); }
    }
    step();
  }
  function run(idx){
    if (idx >= lines.length){
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      el.appendChild(cursor);
      return;
    }
    typeLine(lines[idx].html, () => { setTimeout(() => run(idx + 1), lines[idx].pause); });
  }
  run(0);

  // ---- gallery lightbox ----
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  grid.querySelectorAll('figure').forEach(fig => {
    fig.addEventListener('click', () => {
      lightboxImg.src = fig.dataset.full;
      lightboxImg.alt = fig.querySelector('img').alt;
      lightbox.classList.add('open');
    });
  });
  function closeLightbox(){ lightbox.classList.remove('open'); lightboxImg.src=''; }
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });

  // ---- scroll reveal (fires elements in as they enter view; works across page switches too) ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function observeReveals(root){
    root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
  observeReveals(document);

  // re-check reveals whenever a page becomes active (elements above the fold need to fire immediately)
  const pageObserver = new MutationObserver(() => {
    document.querySelectorAll('.page.active .reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
  });
  pages.forEach(p => pageObserver.observe(p, { attributes:true, attributeFilter:['class'] }));

  // ---- hero: cursor-reactive glow ----
  const heroEl = document.querySelector('.hero');
  if (heroEl && !reduceMotion){
    heroEl.addEventListener('pointermove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      heroEl.style.setProperty('--mx', mx + '%');
      heroEl.style.setProperty('--my', my + '%');
    });
  }