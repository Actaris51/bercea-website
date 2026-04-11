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

// Simple contact form handler (mailto fallback)
(function () {
  const form = document.querySelector('form[data-contact]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = encodeURIComponent(form.querySelector('[name=name]').value || '');
    const email = encodeURIComponent(form.querySelector('[name=email]').value || '');
    const message = encodeURIComponent(form.querySelector('[name=message]').value || '');
    const subject = encodeURIComponent('Contact Bercea — ' + (name || 'Message'));
    const body = `${decodeURIComponent(message)}%0D%0A%0D%0A--%0D%0A${decodeURIComponent(name)}%0D%0A${decodeURIComponent(email)}`;
    window.location.href = `mailto:contact@bercea.fr?subject=${subject}&body=${body}`;
  });
})();
