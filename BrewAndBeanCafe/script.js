document.addEventListener('DOMContentLoaded', () => {

  // AOS
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Counter animation ----
  const counters = document.querySelectorAll('.stat-num');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) counterObserver.observe(statsSection);

  // ---- Testimonial carousel ----
  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoplayTimer;

  const goToSlide = (index) => {
    currentSlide = index;
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${cardWidth * index}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      resetAutoplay();
    });
  });

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % cards.length);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  };

  if (cards.length > 1) {
    resetAutoplay();
  }

  // ---- Contact form ----
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');

  // Name validation - only letters and spaces allowed
  function validateName(value) {
    var cleaned = value.replace(/[^a-zA-Z\s]/g, '');
    if (cleaned !== value) {
      nameInput.value = cleaned;
    }
    if (cleaned.trim().length === 0 && value.length > 0) {
      nameError.textContent = 'Name cannot contain numbers';
      nameInput.classList.add('error');
      return false;
    } else {
      nameError.textContent = '';
      nameInput.classList.remove('error');
      return true;
    }
  }

  // Phone validation - only numbers, exactly 10 digits
  function validatePhone(value) {
    var cleaned = value.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    if (cleaned !== value.replace(/[^0-9]/g, '')) {
      phoneInput.value = cleaned;
    }
    if (cleaned.length > 0 && cleaned.length < 10) {
      phoneError.textContent = 'Phone number must be exactly 10 digits (' + cleaned.length + '/10)';
      phoneInput.classList.add('error');
      return false;
    } else if (cleaned.length === 10) {
      phoneError.textContent = '';
      phoneInput.classList.remove('error');
      return true;
    } else {
      phoneError.textContent = '';
      phoneInput.classList.remove('error');
      return false;
    }
  }

  // Real-time validation on input
  nameInput.addEventListener('input', function() {
    validateName(this.value);
  });

  phoneInput.addEventListener('input', function() {
    validatePhone(this.value);
  });

  // Also validate on keypress to prevent invalid characters
  nameInput.addEventListener('keypress', function(e) {
    var char = String.fromCharCode(e.which);
    if (/[0-9]/.test(char)) {
      e.preventDefault();
      nameError.textContent = 'Numbers are not allowed in name';
      nameInput.classList.add('error');
    }
  });

  phoneInput.addEventListener('keypress', function(e) {
    var char = String.fromCharCode(e.which);
    // Block letters
    if (/[a-zA-Z]/.test(char)) {
      e.preventDefault();
      phoneError.textContent = 'Letters are not allowed in phone number';
      phoneInput.classList.add('error');
      return;
    }
    // Block if already 10 digits
    var currentDigits = this.value.replace(/[^0-9]/g, '');
    if (currentDigits.length >= 10) {
      e.preventDefault();
      phoneError.textContent = 'Phone number cannot exceed 10 digits';
      phoneInput.classList.add('error');
    }
  });

  // Clear error on focus
  nameInput.addEventListener('focus', function() {
    nameError.textContent = '';
    nameInput.classList.remove('error');
  });

  phoneInput.addEventListener('focus', function() {
    phoneError.textContent = '';
    phoneInput.classList.remove('error');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      var isNameValid = validateName(nameInput.value);
      var isPhoneValid = validatePhone(phoneInput.value);

      // Additional checks
      if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please enter a valid name';
        nameInput.classList.add('error');
        isNameValid = false;
      }

      if (phoneInput.value.replace(/[^0-9]/g, '').length !== 10) {
        phoneError.textContent = 'Phone number must be exactly 10 digits';
        phoneInput.classList.add('error');
        isPhoneValid = false;
      }

      if (!isNameValid || !isPhoneValid) {
        return;
      }

      const btn = form.querySelector('button');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#4a9e6f';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }

  // ---- Smooth scroll offset for fixed nav ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
