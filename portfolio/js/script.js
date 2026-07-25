// Scroll progress bar
  const progressBar = document.getElementById('progress-bar');
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    header.classList.toggle('scrolled', scrollTop > 30);
    backToTop.classList.toggle('show', scrollTop > 600);
  });

  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
    io.observe(el);
  });

  // Count-up stats
  const statEls = document.querySelectorAll('.stat-card .num');
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const tick = () => {
          cur += step;
          if (cur >= target) { el.textContent = target; return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        statIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statIO.observe(el));

  // Mobile menu (simple toggle -> smooth scroll then close is native since no menu overlay built; hamburger scrolls to nav)
  document.getElementById('hamburger').addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    const isOpen = links.style.display === 'flex';
    if (isOpen) {
      links.style.display = 'none';
    } else {
      links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:64px;right:16px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 24px;gap:14px;z-index:998;';
    }
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) document.querySelector('.nav-links').style.display = 'none';
    });
  });

  // Resume buttons -> placeholder alert (no resume.pdf attached yet)
  ['resume-btn','resume-btn-2','resume-btn-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Add your resume.pdf to the project and link it here to enable downloads.');
    });
  });
