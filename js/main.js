/* ============================================================
   PHARMAS SAĞLIK - main.js
   ============================================================ */

// AOS init
AOS.init({ once: true, offset: 60, easing: 'ease-out-cubic' });

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('show', window.scrollY > 400);
});

// ---- Hamburger / Mobile Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ---- Back to Top ----
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Product image switcher ----
function changeImg(el, src) {
  document.getElementById('mainProductImg').src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ---- Particles ----
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 6 + 3;
    const delay = Math.random() * 12;
    const duration = Math.random() * 14 + 10;
    const left = Math.random() * 100;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-delay:${delay}s;
      animation-duration:${duration}s;
    `;
    container.appendChild(p);
  }
})();

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Contact Form — Web3Forms ----
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...';
  formNote.textContent = '';

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (json.success) {
      formNote.textContent = '✓ Mesajınız alındı! En kısa sürede size dönüş yapacağız.';
      formNote.style.color = '#3DAA70';
      contactForm.reset();
    } else {
      throw new Error(json.message || 'Bir hata oluştu.');
    }
  } catch (err) {
    formNote.textContent = '✗ Mesaj gönderilemedi. Lütfen tekrar deneyin veya WhatsApp\'tan ulaşın.';
    formNote.style.color = '#e84d4d';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Mesaj Gönder';
  }
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    if (window.scrollY >= top) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = '#3DAA70';
    }
  });
}, { passive: true });

// ---- Counter animation for hero stats ----
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const els = entry.target.querySelectorAll('.stat-num');
      els.forEach(el => {
        const text = el.textContent;
        if (text.includes('%')) {
          const num = parseInt(text);
          animateCounter(el, num, '%');
        }
      });
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) countersObserver.observe(heroStats);

// ---- Photo Gallery Slider ----
(function initSlider() {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const total = slides.length;
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Görsel ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.getElementById('sliderPrev').addEventListener('click', () => { prev(); resetAutoplay(); });
  document.getElementById('sliderNext').addEventListener('click', () => { next(); resetAutoplay(); });

  function startAutoplay() { autoplayTimer = setInterval(next, 4500); }
  function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }

  const sliderEl = track.closest('.gallery-slider');
  sliderEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  sliderEl.addEventListener('mouseleave', startAutoplay);

  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
  });

  startAutoplay();
})();
