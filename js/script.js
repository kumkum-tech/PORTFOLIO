/* ========================================
   KUMKUM PORTFOLIO – script.js (fixed)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll-progress bar ---------- */
  const progressBar = document.getElementById('progress-bar');
  const header      = document.getElementById('site-header');
  const backToTop   = document.getElementById('back-to-top');

  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    header.classList.toggle('scrolled', scrollTop > 30);
    backToTop.classList.toggle('show', scrollTop > 600);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();   // run once immediately

  backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- Reveal-on-scroll ---------- */
  // Group .reveal elements by their parent section so delays
  // are per-section (0ms, 80ms, 160ms, …) instead of a
  // meaningless global modulo.
  const revealEls = document.querySelectorAll('.reveal');

  // Build a map:  section -> ordered list of child .reveal nodes
  const sectionMap = new Map();
  revealEls.forEach(el => {
    const sec = el.closest('section, header, footer') || document.body;
    if (!sectionMap.has(sec)) sectionMap.set(sec, []);
    sectionMap.get(sec).push(el);
  });
  sectionMap.forEach(children => {
    children.forEach((el, i) => {
      el.style.transitionDelay = i * 80 + 'ms';
    });
  });

  const revealIO = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealIO.observe(el));

  // Fallback: if any .reveal is already in the viewport when the
  // page first loads (e.g. hero), force-trigger it after a tiny
  // repaint so the CSS transition actually plays.
  requestAnimationFrame(() => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      ) {
        el.classList.add('visible');
        revealIO.unobserve(el);
      }
    });
  });

  /* ---------- Counter animation ---------- */
  const statEls = document.querySelectorAll('.stat-card .num');
  const counterIO = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;

        const duration = 1200;           // ms
        const startTime = performance.now();

        const tick = now => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out-cubic for a satisfying deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  statEls.forEach(el => counterIO.observe(el));

  /* ---------- Active nav-link highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 160;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle(
        'active',
        a.getAttribute('href') === '#' + current
      );
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksUl = document.querySelector('.nav-links');
  let mobileOverlay = null;

  const closeMobileMenu = () => {
    navLinksUl.classList.remove('mobile-open');
    hamburger.querySelector('i').className = 'fa-solid fa-bars';
    if (mobileOverlay) {
      mobileOverlay.classList.remove('show');
      setTimeout(() => mobileOverlay.remove(), 300);
      mobileOverlay = null;
    }
    document.body.style.overflow = '';
  };

  const openMobileMenu = () => {
    navLinksUl.classList.add('mobile-open');
    hamburger.querySelector('i').className = 'fa-solid fa-xmark';

    // create translucent overlay behind menu
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
    requestAnimationFrame(() => mobileOverlay.classList.add('show'));

    mobileOverlay.addEventListener('click', closeMobileMenu);
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksUl.classList.contains('mobile-open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close menu when a nav link is clicked (mobile)
  navLinksUl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinksUl.classList.contains('mobile-open')) closeMobileMenu();
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinksUl.classList.contains('mobile-open')) {
      closeMobileMenu();
    }
  });

  /* ---------- Smooth-scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;           // skip placeholder hrefs
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Resume buttons ---------- */
  ['resume-btn', 'resume-btn-2', 'resume-btn-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => {
      e.preventDefault();
      alert('Add your resume.pdf to the project and link it here to enable downloads.');
    });
  });

  /* ---------- Tilt effect on glass cards ---------- */
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;  // ±4°
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Magnetic cursor glow (desktop only) ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

});
