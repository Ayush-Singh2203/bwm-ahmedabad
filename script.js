/* ===========================
   BWM – script.js  (v3)
   =========================== */

/* ─────────────────────────────────────────────
   GOOGLE ADS CONVERSION IDs
   TODO: Replace every placeholder below with
   the real Ahmedabad Google Ads conversion IDs.
   ─────────────────────────────────────────────
   AW-XXXXXXXXXX          → Google Ads account tag ID
   CONV_FORM              → Contact-form submission conversion label
   CONV_BROCHURE          → Brochure gate form submission conversion label
   CONV_PHONE             → Phone number click conversion label
   CONV_EMAIL             → Email click conversion label
   ───────────────────────────────────────────── */
var ADS_ID        = 'AW-18337045769';
var CONV_FORM     = 'AW-18337045769/FORM_LABEL';
var CONV_BROCHURE = 'AW-18337045769/BROCHURE_LABEL';
var CONV_PHONE    = 'AW-18337045769/PHONE_LABEL';
var CONV_EMAIL    = 'AW-18337045769/EMAIL_LABEL';

/* Helper: fire a Google Ads goal conversion */
function fireConversion(sendTo, value) {
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      send_to: sendTo,
      value: value || 1.0,
      currency: 'INR'
    });
  }
}


document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     1. STICKY HEADER SHADOW
     ════════════════════════════════════════════ */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ════════════════════════════════════════════
     2. MOBILE HAMBURGER
     ════════════════════════════════════════════ */
  var hamburger = document.getElementById('hamburger');
  var mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
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


  /* ════════════════════════════════════════════
     3. ACTIVE NAV ON SCROLL
     ════════════════════════════════════════════ */
  var sections = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollPos = window.scrollY + header.offsetHeight + 40;
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


  /* ════════════════════════════════════════════
     4. SMOOTH SCROLL WITH HEADER OFFSET
     ════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        /* Close exit popup if user clicks a CTA inside it */
        closeModal(exitPopup);
      }
    });
  });


  /* ════════════════════════════════════════════
     5. WEAVING STYLE TABS
     ════════════════════════════════════════════ */
  var weaveCards = document.querySelectorAll('.weave-card');
  var weaveImg   = document.getElementById('weave-img');
  var altMap     = { plain: 'Plain Weave Wire Mesh', twill: 'Twill Weave Wire Mesh', dutch: 'Dutch Weave Wire Mesh' };

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


  /* ════════════════════════════════════════════
     6. FAQ ACCORDION
     ════════════════════════════════════════════ */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-trigger').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });


  /* ════════════════════════════════════════════
     7. CONTACT FORM (Formspree AJAX)
        Fires Google Ads form-submission conversion
     ════════════════════════════════════════════ */
  var contactForm   = document.getElementById('contact-form');
  var contactStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          contactStatus.style.color = '#2a7a2a';
          contactStatus.textContent = '\u2713 Message sent! We\u2019ll be in touch shortly.';
          contactForm.reset();
          fireConversion(CONV_FORM, 1.0);
        } else {
          return res.json().then(function (json) {
            throw new Error(json.errors ? json.errors.map(function (er) { return er.message; }).join(', ') : 'Failed');
          });
        }
      })
      .catch(function () {
        contactStatus.style.color = '#c0392b';
        contactStatus.textContent = 'Something went wrong. Please call us directly.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message \u2192';
      });
    });
  }


  /* ════════════════════════════════════════════
     8. PHONE, EMAIL & WHATSAPP CLICK TRACKING
        Fires GA4 event + Google Ads conversion
        for every click on phone, email, whatsapp
     ════════════════════════════════════════════ */

  /* Phone clicks – all instances (hero card, contact section, footer) */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      /* GA4 event */
      if (typeof gtag === 'function') {
        gtag('event', 'phone_click', {
          event_category: 'Contact',
          event_label: link.href
        });
      }
      /* Google Ads conversion */
      fireConversion(CONV_PHONE, 1.0);
    });
  });

  /* Email clicks – all instances */
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      /* GA4 event */
      if (typeof gtag === 'function') {
        gtag('event', 'email_click', {
          event_category: 'Contact',
          event_label: link.href
        });
      }
      /* Google Ads conversion */
      fireConversion(CONV_EMAIL, 1.0);
    });
  });

  /* WhatsApp float button */
  var whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      /* GA4 event */
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'Contact',
          event_label: 'WhatsApp Float Button'
        });
      }
      /* Google Ads conversion – reuses phone conversion label */
      fireConversion(CONV_PHONE, 1.0);
    });
  }


  /* ════════════════════════════════════════════
     9. BACK TO TOP
     ════════════════════════════════════════════ */
  var btt = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ════════════════════════════════════════════
     MODAL HELPERS
     ════════════════════════════════════════════ */
  function openModal(overlay) {
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    /* Force reflow so CSS transition plays */
    void overlay.offsetWidth;
    overlay.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('modal-visible');
    document.body.style.overflow = '';
    /* Re-apply hidden after transition ends */
    overlay.addEventListener('transitionend', function handler() {
      if (!overlay.classList.contains('modal-visible')) {
        overlay.setAttribute('hidden', '');
      }
      overlay.removeEventListener('transitionend', handler);
    });
  }

  /* Close modal on overlay-background click */
  function bindOverlayClose(overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeModal(overlay); }
    });
  }

  /* Close modal on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      [brochureModal, brochureThankyou, exitPopup].forEach(function (m) {
        if (m && m.classList.contains('modal-visible')) { closeModal(m); }
      });
    }
  });


  /* ════════════════════════════════════════════
     10. BROCHURE GATE POPUP
         – All .js-brochure-trigger buttons open it
         – On submit → Formspree, then show thank-you
         – Fires Google Ads brochure conversion
     ════════════════════════════════════════════ */
  var brochureModal   = document.getElementById('brochure-modal');
  var brochureThankyou = document.getElementById('brochure-thankyou');
  var brochureForm    = document.getElementById('brochure-form');
  var brochureStatus  = document.getElementById('brochure-status');
  var brochureClose   = document.getElementById('brochure-close');
  var thankyouClose   = document.getElementById('thankyou-close');

  /* All trigger buttons */
  document.querySelectorAll('.js-brochure-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* If exit popup is open, close it first */
      closeModal(exitPopup);
      openModal(brochureModal);
      /* Focus first input for accessibility */
      setTimeout(function () {
        var firstInput = brochureModal.querySelector('input');
        if (firstInput) { firstInput.focus(); }
      }, 320);
    });
  });

  if (brochureClose) {
    brochureClose.addEventListener('click', function () { closeModal(brochureModal); });
  }
  if (thankyouClose) {
    thankyouClose.addEventListener('click', function () { closeModal(brochureThankyou); });
  }

  bindOverlayClose(brochureModal);
  bindOverlayClose(brochureThankyou);

  /* Brochure form submit → Formspree */
  if (brochureForm) {
    brochureForm.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Basic validation */
      var emailVal = document.getElementById('br-email').value.trim();
      var nameVal  = document.getElementById('br-name').value.trim();
      var phoneVal = document.getElementById('br-phone').value.trim();

      if (!nameVal || !emailVal || !phoneVal) {
        brochureStatus.style.color = '#c0392b';
        brochureStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      var submitBtn = document.getElementById('brochure-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';
      brochureStatus.textContent = '';

      /* Build form payload – include a subject line so the email is clear */
      var payload = new FormData(brochureForm);
      payload.append('_subject', 'BWM Brochure Request – ' + nameVal);
      payload.append('brochure_requested', 'Yes – BWM Industrial Catalogue');

      /*
        POST to the same Formspree endpoint as the contact form.
        Alternatively create a dedicated Formspree endpoint for brochure
        requests and replace the URL below.
      */
      fetch('https://formspree.io/f/xykrqzqn', {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          /* Fire Google Ads brochure conversion */
          fireConversion(CONV_BROCHURE, 1.0);

          /* Send brochure email via EmailJS */
          var brochureUrl = 'https://ahm.bwm.co.in/images/BWM_CatalogV2.36cm.pdf';
          emailjs.send('service_wuhsqm7', 'template_euu9otk', {
            to_name:  nameVal,
            to_email: emailVal,
            phone:    phoneVal,
            brochure_url: brochureUrl
          }).catch(function () {
            /* Silent fail – PDF still opens even if email fails */
          });

          /* Open the PDF directly in a new tab */
          window.open('images/BWM_CatalogV2.36cm.pdf', '_blank');

          /* Close the form popup, open the thank-you popup */
          closeModal(brochureModal);
          setTimeout(function () { openModal(brochureThankyou); }, 350);
          brochureForm.reset();
        } else {
          return res.json().then(function (json) {
            throw new Error(json.errors ? json.errors.map(function (er) { return er.message; }).join(', ') : 'Server error');
          });
        }
      })
      .catch(function () {
        brochureStatus.style.color = '#c0392b';
        brochureStatus.textContent = 'Something went wrong. Please call us or try again.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Me the Brochure \u2192';
      });
    });
  }


  /* ════════════════════════════════════════════
     11. EXIT INTENT + INACTIVITY POPUP
         Rules:
         – Show at most ONCE per page session
         – Exit intent: mouse leaves through the top of the viewport
         – Inactivity: no mouse/touch/key activity for 50 seconds
     ════════════════════════════════════════════ */
  var exitPopup     = document.getElementById('exit-popup');
  var exitClose     = document.getElementById('exit-close');
  var exitDismiss   = document.getElementById('exit-dismiss');
  var exitContactBtn = document.getElementById('exit-contact-btn');

  var exitShown = false;   /* guard – only fire once */

  function showExitPopup() {
    if (exitShown) return;
    /* Don't interrupt if another modal is already open */
    if (brochureModal && brochureModal.classList.contains('modal-visible')) return;
    if (brochureThankyou && brochureThankyou.classList.contains('modal-visible')) return;
    exitShown = true;
    clearInactivityTimer();
    openModal(exitPopup);
  }

  function hideExitPopup() {
    closeModal(exitPopup);
  }

  if (exitClose)   { exitClose.addEventListener('click', hideExitPopup); }
  if (exitDismiss) { exitDismiss.addEventListener('click', hideExitPopup); }
  if (exitContactBtn) {
    exitContactBtn.addEventListener('click', function () {
      hideExitPopup();
      /* smooth scroll handled by the delegated anchor listener above */
    });
  }
  bindOverlayClose(exitPopup);

  /* ── Exit Intent: detect rapid upward mouse-leave near viewport top ── */
  document.addEventListener('mouseleave', function (e) {
    /* Only trigger when cursor exits through the top (clientY near 0) */
    if (e.clientY <= 6) {
      showExitPopup();
    }
  });

  /* ── Inactivity timer: 50 seconds ── */
  var INACTIVITY_MS = 50 * 1000;
  var inactivityTimer = null;

  function resetInactivityTimer() {
    clearInactivityTimer();
    if (!exitShown) {
      inactivityTimer = setTimeout(showExitPopup, INACTIVITY_MS);
    }
  }

  function clearInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  /* Activity events that reset the idle counter */
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (evt) {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  /* Kick off the timer on page load */
  resetInactivityTimer();

}); /* end DOMContentLoaded */
