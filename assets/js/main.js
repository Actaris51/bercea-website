// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }
})();

// Fade-in on scroll
(function () {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('fade-in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.feature-card, .ebook-card, .showcase, .stat, .science-block').forEach((el) => io.observe(el));
})();

// Background video: wide screens only, and not when the visitor asked for
// reduced motion. CSS hides it on phones, but with the autoplay attribute it
// was downloaded there anyway.
(function () {
  const videos = document.querySelectorAll('video[data-autoplay]');
  if (!videos.length || !window.matchMedia) return;
  const wide = window.matchMedia('(min-width: 821px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    videos.forEach((v) => {
      if (wide.matches && !calm.matches) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  };
  update();
  if (wide.addEventListener) wide.addEventListener('change', update);
})();

// Simple contact form handler (mailto fallback)
(function () {
  const form = document.querySelector('form[data-contact]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = encodeURIComponent(form.querySelector('[name=name]').value || '');
    const email = encodeURIComponent(form.querySelector('[name=email]').value || '');
    const message = encodeURIComponent(form.querySelector('[name=message]').value || '');
    const subject = encodeURIComponent('Contact Bercea : ' + (name || 'Message'));
    const body = `${decodeURIComponent(message)}%0D%0A%0D%0A--%0D%0A${decodeURIComponent(name)}%0D%0A${decodeURIComponent(email)}`;
    window.location.href = `mailto:contact@bercea.fr?subject=${subject}&body=${body}`;
  });
})();
