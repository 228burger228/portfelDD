/**
 * 228burger228 — Interactive Studio Functionality
 * Optimized Scroll Pipeline (rAF + Cached Layout Metrics)
 * Accessible Modals (Focus Trap, Esc, Return Focus)
 * Smooth Stats Counter, Mobile Drawer, Quick Copy & Presets
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. CACHED LAYOUT METRICS & SMOOTH SCROLL PIPELINE ─────────────────────
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  let sectionBounds = [];
  function updateSectionBounds() {
    sectionBounds = sections.map(sec => ({
      id: sec.getAttribute('id'),
      top: sec.offsetTop,
      bottom: sec.offsetTop + sec.offsetHeight
    }));
  }
  updateSectionBounds();
  window.addEventListener('resize', updateSectionBounds, { passive: true });

  let ticking = false;
  let lastScrollY = window.scrollY;

  function onScrollFrame() {
    const scrollTop = lastScrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Progress Bar
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Header Shadow
    if (header) {
      if (scrollTop > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to Top Button
    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active Nav Spy
    const scrollPos = scrollTop + 180;
    let currentId = '';
    for (let i = 0; i < sectionBounds.length; i++) {
      const sb = sectionBounds[i];
      if (scrollPos >= sb.top && scrollPos < sb.bottom) {
        currentId = sb.id;
        break;
      }
    }

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('nav__link--active');
        } else {
          link.classList.remove('nav__link--active');
        }
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── 2. MODAL WINDOWS (PORTFOLIO & RECOMMENDATION LETTER) ──────────────────
  const modalTriggers = document.querySelectorAll('[data-modal]');
  let lastFocusedElement = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent body scroll and preserve scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      openModal(`modal-${modalType}`);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalType = trigger.getAttribute('data-modal');
        openModal(`modal-${modalType}`);
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId) || btn.closest('.modal');
      closeModal(modal);
    });
  });

  // Close on Escape & Trap Focus
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
        document.body.style.paddingRight = '';
      }
    }

    if (e.key === 'Tab') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // ─── 3. MOBILE MENU DRAWER ────────────────────────────────────────────────
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

  // ─── 4. QUICK COPY TELEGRAM HANDLE ─────────────────────────────────────────
  const copyBtn = document.getElementById('copy-tg-btn');
  const copyText = document.getElementById('copy-text');

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', async () => {
      const handle = '@aimovl';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(handle);
        } else {
          const ta = document.createElement('textarea');
          ta.value = handle;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        copyBtn.classList.add('copied');
        copyText.textContent = 'Скопировано в буфер! ✓';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyText.textContent = 'Скопировать @aimovl';
        }, 2200);
      } catch (err) {
        copyText.textContent = '@aimovl (выделите и скопируйте)';
      }
    });
  }

  // ─── 5. PRESET INQUIRY TAGS IN CTA ─────────────────────────────────────────
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
        const span = mainCtaBtn.querySelector('span');
        if (span) {
          span.textContent = `Обсудить: ${tag.textContent.replace(/^[^\w\sа-яА-ЯёЁ]+/, '').trim()}`;
        }
      }
    });
  });

  // ─── 6. INTERACTIVE STATS COUNT-UP WITH SMOOTH EASING ──────────────────────
  const statNumbers = document.querySelectorAll('.stat-pill__num[data-count]');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          const isAudience = target === 10;
          const duration = 1200;
          const startTime = performance.now();

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeOut);

            if (isAudience) {
              numEl.textContent = `${current}k+`;
            } else {
              numEl.textContent = `${current}+`;
            }

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              numEl.textContent = isAudience ? `${target}k+` : `${target}+`;
            }
          }

          window.requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // ─── 7. INTERACTIVE QUOTE CALCULATOR (CODECRAFTERS REACTIVE PROXY MODEL) ───
  const calcContainer = document.getElementById('calculator');
  if (calcContainer) {
    const serviceTypes = {
      landing: {
        title: 'Лендинг / Промо-сайт',
        basePrice: 45000,
        baseDays: 6,
        daysText: '5–7 рабочих дней',
        desc: 'Продуктовый лендинг с конверсионной структурой, микроанимациями и Lighthouse 98+.'
      },
      webapp: {
        title: 'Веб-сервис / MVP под ключ',
        basePrice: 120000,
        baseDays: 16,
        daysText: '14–20 рабочих дней',
        desc: 'Полноценный веб-сервис: фронтенд, API, базы данных, личные кабинеты.'
      },
      bot: {
        title: 'Telegram AI-бот & Парсер',
        basePrice: 50000,
        baseDays: 7,
        daysText: '5–8 рабочих дней',
        desc: 'Автономный бот 24/7, парсинг данных, Gemini/LLM-интеграция, лидогенерация.'
      },
      design: {
        title: 'UI/UX Дизайн-система',
        basePrice: 40000,
        baseDays: 6,
        daysText: '5–7 рабочих дней',
        desc: 'Исследование CJM, интерактивные прототипы в Figma, UI-kit и компоненты.'
      }
    };

    const addonOptions = {
      cms: { title: 'Панель управления (CMS)', price: 15000, days: 2 },
      auth: { title: 'Личный кабинет & Авторизация', price: 25000, days: 3 },
      payment: { title: 'Платежный шлюз / Оплата', price: 20000, days: 2 },
      ai: { title: 'AI-ассистент / RAG-вектор', price: 35000, days: 4 },
      scraping: { title: 'Парсер бирж и данных 24/7', price: 20000, days: 2 },
      seo: { title: 'SEO, Schema.org & llms.txt', price: 15000, days: 1 }
    };

    function createReactiveStore(initialState, onUpdate) {
      const handler = {
        set(target, prop, value) {
          target[prop] = value;
          onUpdate(target);
          return true;
        }
      };
      return new Proxy(initialState, handler);
    }

    const state = createReactiveStore({
      type: 'landing',
      addons: new Set(['seo']),
      urgency: 'standard'
    }, renderCalculator);

    const typeCards = calcContainer.querySelectorAll('.calc-type-card');
    const addonChips = calcContainer.querySelectorAll('.calc-addon-chip');
    const urgencyBtns = calcContainer.querySelectorAll('.calc-urgency-btn');

    const priceEl = document.getElementById('calc-total-price');
    const daysEl = document.getElementById('calc-total-days');
    const addonsListEl = document.getElementById('calc-addons-list');
    const tgLinkEl = document.getElementById('calc-tg-link');
    const copyCalcBtn = document.getElementById('calc-copy-btn');

    function calculateTotal(currentState) {
      const base = serviceTypes[currentState.type] || serviceTypes.landing;
      let sum = base.basePrice;
      let days = base.baseDays;

      currentState.addons.forEach(key => {
        if (addonOptions[key]) {
          sum += addonOptions[key].price;
          days += addonOptions[key].days;
        }
      });

      if (currentState.urgency === 'urgent') {
        sum = Math.round((sum * 1.25) / 1000) * 1000;
        days = Math.max(3, Math.round(days * 0.7));
      }

      return {
        sum,
        formattedSum: sum.toLocaleString('ru-RU') + ' ₽',
        daysText: Math.max(2, days - 1) + '–' + (days + 1) + ' раб. дней',
        serviceName: base.title
      };
    }

    function renderCalculator(currentState) {
      const result = calculateTotal(currentState);

      if (priceEl) priceEl.textContent = result.formattedSum;
      if (daysEl) daysEl.textContent = result.daysText;

      typeCards.forEach(card => {
        const typeKey = card.getAttribute('data-type');
        card.classList.toggle('active', typeKey === currentState.type);
      });

      addonChips.forEach(chip => {
        const addonKey = chip.getAttribute('data-addon');
        chip.classList.toggle('active', currentState.addons.has(addonKey));
      });

      urgencyBtns.forEach(btn => {
        const urgKey = btn.getAttribute('data-urgency');
        btn.classList.toggle('active', urgKey === currentState.urgency);
      });

      if (addonsListEl) {
        addonsListEl.innerHTML = '';
        currentState.addons.forEach(key => {
          if (addonOptions[key]) {
            const tag = document.createElement('span');
            tag.className = 'calc-hud__addon-tag';
            tag.textContent = '+ ' + addonOptions[key].title;
            addonsListEl.appendChild(tag);
          }
        });
        if (currentState.addons.size === 0) {
          addonsListEl.innerHTML = '<span style="font-size:12px;color:var(--muted);">Базовая спецификация (без доп. опций)</span>';
        }
      }

      const selectedAddonsTitles = Array.from(currentState.addons)
        .map(k => addonOptions[k] ? addonOptions[k].title : '')
        .filter(Boolean);

      const tgMessage = 'Здравствуйте! Рассчитал предварительную смету на portfelDD:\n' +
        '— Проект: ' + result.serviceName + '\n' +
        '— Модули: ' + (selectedAddonsTitles.length ? selectedAddonsTitles.join(', ') : 'Базовая спецификация') + '\n' +
        '— Срочность: ' + (currentState.urgency === 'urgent' ? 'Экспресс запуск (-30% времени)' : 'Стандартный спринт') + '\n' +
        '— Оценка сметы: ~' + result.formattedSum + '\n' +
        '— Срок: ~' + result.daysText + '\n' +
        'Хочу обсудить детали и запустить проект.';

      if (tgLinkEl) {
        tgLinkEl.setAttribute('href', 'https://t.me/aimovl?text=' + encodeURIComponent(tgMessage));
      }

      if (copyCalcBtn) {
        copyCalcBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(tgMessage);
            const orig = copyCalcBtn.innerHTML;
            copyCalcBtn.innerHTML = '<span>✓</span> Смета скопирована!';
            setTimeout(() => { copyCalcBtn.innerHTML = orig; }, 2200);
          } catch(e) {
            prompt('Скопируйте текст сметы:', tgMessage);
          }
        };
      }
    }

    typeCards.forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        if (type && serviceTypes[type]) {
          state.type = type;
        }
      });
    });

    addonChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const addon = chip.getAttribute('data-addon');
        if (addon && addonOptions[addon]) {
          const newAddons = new Set(state.addons);
          if (newAddons.has(addon)) {
            newAddons.delete(addon);
          } else {
            newAddons.add(addon);
          }
          state.addons = newAddons;
        }
      });
    });

    urgencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const urg = btn.getAttribute('data-urgency');
        if (urg) {
          state.urgency = urg;
        }
      });
    });

    renderCalculator(state);
  }

});
