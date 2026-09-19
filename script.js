/**
 * 228burger228 — Interactive Studio Functionality
 * Modals (Portfolio & Official Letter), Mobile Drawer, Scroll Progress,
 * Quick Copy, Inquiry Presets, Back-to-top, Stats Counter
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Header Shadow
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (scrollTop > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Modal Windows (Portfolio & Recommendation Letter)
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = modal.querySelector('.modal__close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  modalTriggers.forEach(trigger => {
    // Click handler
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      openModal(`modal-${modalType}`);
    });

    // Keyboard accessibility (Enter / Space)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalType = trigger.getAttribute('data-modal');
        openModal(`modal-${modalType}`);
      }
    });
  });

  // Close handlers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId) || btn.closest('.modal');
      closeModal(modal);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // 3. Mobile Menu Drawer
  const mobileBurger = document.getElementById('mobile-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (mobileBurger && mobileMenu) {
    mobileBurger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      mobileBurger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileBurger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Quick Copy Telegram Handle
  const copyBtn = document.getElementById('copy-tg-btn');
  const copyText = document.getElementById('copy-text');

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', async () => {
      const handle = '@aimovl';
      try {
        await navigator.clipboard.writeText(handle);
        copyBtn.classList.add('copied');
        copyText.textContent = 'Скопировано в буфер! ✓';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyText.textContent = 'Скопировать @aimovl';
        }, 2200);
      } catch (err) {
        prompt('Скопируйте никнейм в Telegram:', handle);
      }
    });
  }

  // 5. Preset Inquiry Tags in CTA
  const presetTags = document.querySelectorAll('.preset-tag');
  const mainCtaBtn = document.getElementById('main-cta-btn');

  presetTags.forEach(tag => {
    tag.addEventListener('click', () => {
      presetTags.forEach(t => t.classList.remove('selected'));
      tag.classList.add('selected');

      const msg = tag.getAttribute('data-msg');
      if (mainCtaBtn && msg) {
        const encoded = encodeURIComponent(msg);
        mainCtaBtn.setAttribute('href', `https://t.me/aimovl?text=${encoded}`);
        mainCtaBtn.querySelector('span').textContent = `Обсудить задачу: ${tag.textContent.trim()}`;
      }
    });
  });

  // 6. Smooth Scroll & Active Nav Spy
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active');
      }
    });
  }, { passive: true });

  // 7. Interactive Stats Count-up on Viewport
  const statNumbers = document.querySelectorAll('.stat-pill__num[data-count]');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          let currentVal = 0;
          const duration = 1200;
          const stepTime = Math.max(Math.floor(duration / target), 30);

          const timer = setInterval(() => {
            currentVal += 1;
            if (target >= 90) {
              currentVal = Math.min(target, currentVal + 4);
            }
            numEl.textContent = `${currentVal}+`;

            if (currentVal >= target) {
              clearInterval(timer);
              numEl.textContent = `${target}+`;
              if (target === 10) numEl.textContent = '10k+';
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }
});
