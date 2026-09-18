// Portfolio Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Portfolio cards modal triggers
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const modals = document.querySelectorAll('.modal');

  // Open modal on card click
  portfolioCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      openModal(`modal-${modalId}`);
    });
  });

  // Close modal function
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // Close button handlers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const modalId = this.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Close on overlay click
  modals.forEach(modal => {
    const overlay = modal.querySelector('.modal__overlay');
    if (overlay) {
      overlay.addEventListener('click', function() {
        closeModal(modal.id);
      });
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal.id);
        }
      });
    }
  });

  // Smooth scroll for anchor links
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

  // Active nav link on scroll
  const navLinks = document.querySelectorAll('.nav__link');
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('nav__link--active');
      }
    });
  }, { passive: true });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and sections
  document.querySelectorAll('.info-card, .team-card, .trust-card, .section-intro').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});

// Add animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
