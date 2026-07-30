/* ===========================
   BWM – script.js  (v2)
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Sticky header shadow ----- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ----- Mobile hamburger ----- */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', function () {
    const open = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  /* ----- Active nav on scroll ----- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollPos = window.scrollY + header.offsetHeight + 40;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ----- Smooth scroll offset ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });


  /* ----- Scroll reveal – removed to avoid interaction issues ----- */


  /* ----- Weaving style tabs ----- */
  const weaveCards = document.querySelectorAll('.weave-card');
  const weaveImg   = document.getElementById('weave-img');
  const altMap     = { plain: 'Plain Weave Wire Mesh', twill: 'Twill Weave Wire Mesh', dutch: 'Dutch Weave Wire Mesh' };

  weaveCards.forEach(function (card) {
    card.addEventListener('click', function () {
      weaveCards.forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
      weaveImg.style.opacity = '0';
      setTimeout(function () {
        weaveImg.src = card.getAttribute('data-img');
        weaveImg.alt = altMap[card.getAttribute('data-weave')] || '';
        weaveImg.style.opacity = '1';
      }, 200);
    });
  });

  if (weaveImg) { weaveImg.style.transition = 'opacity 0.22s ease'; }


  /* ----- FAQ Accordion ----- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all items
      document.querySelectorAll('.accordion-trigger').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      });

      // If it wasn't open, open it now
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });


  /* ----- Contact form (Formspree AJAX) ----- */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          status.style.color = '#2a7a2a';
          status.textContent = '\u2713 Message sent! We\u2019ll be in touch shortly.';
          form.reset();

          // Google Ads: fire form submission conversion
          // TODO: Replace AW-XXXXXXXXXX/YYYYYYY with Ahmedabad Google Ads conversion ID
          if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
              'send_to': 'AW-XXXXXXXXXX/YYYYYYY',
              'value': 1.0,
              'currency': 'INR',
              'event_callback': function () {}
            });
          }

        } else {
          return res.json().then(function (json) {
            throw new Error(json.errors ? json.errors.map(function (e) { return e.message; }).join(', ') : 'Failed');
          });
        }
      })
      .catch(function () {
        status.style.color = '#c0392b';
        status.textContent = 'Something went wrong. Please call us directly.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message \u2192';
      });
    });
  }

  /* ----- Google Ads: Phone number click tracking ----- */
  // TODO: Replace AW-XXXXXXXXXX/YYYYYYY with Ahmedabad Google Ads conversion ID
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXXX/YYYYYYY',
          'value': 1.0,
          'currency': 'INR'
        });
      }
    });
  });


  /* ----- Back to top ----- */
  const btt = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
