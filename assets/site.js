/* Yasaymo Eco Cleaning — shared behavior */
(function () {
  /* Mobile nav */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Dropdowns — hover on desktop (CSS), click on touch/mobile */
  document.querySelectorAll('.dd > button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var dd = b.parentElement;
      var wasOpen = dd.classList.contains('open');
      document.querySelectorAll('.dd').forEach(function (x) { x.classList.remove('open'); });
      if (!wasOpen) dd.classList.add('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dd')) document.querySelectorAll('.dd').forEach(function (x) { x.classList.remove('open'); });
  });

  /* Compact header */
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('compact', window.scrollY > 40);
    }, { passive: true });
  }

  /* Scroll reveal */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }


  /* Validate required fields before any submission. Forms carry novalidate so
     we control the messaging; this replaces the browser's default enforcement. */
  window.validateForm = function (form) {
    var bad = [];
    form.querySelectorAll('[required]').forEach(function (f) {
      var empty = (f.type === 'checkbox') ? !f.checked : !String(f.value || '').trim();
      var badEmail = f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
      if (empty || badEmail) {
        bad.push(f);
        f.setAttribute('aria-invalid', 'true');
        f.style.borderColor = '#8C3B2E';
      } else {
        f.removeAttribute('aria-invalid');
        f.style.borderColor = '';
      }
    });
    if (bad.length) {
      bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      try { bad[0].focus({ preventScroll: true }); } catch (e) {}
    }
    return bad;
  };

  /* Clear the error state as soon as the field is corrected */
  document.addEventListener('input', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
      e.target.removeAttribute('aria-invalid');
      e.target.style.borderColor = '';
    }
  });

  /* Generic AJAX forms (contact, commercial). The booking form handles itself. */
  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    if (form.id === 'bookform') return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type=submit]');
      var bad = window.validateForm(form);
      if (bad.length) {
        status.textContent = bad.length === 1
          ? 'Please complete the highlighted field before sending.'
          : 'Please complete the ' + bad.length + ' highlighted fields before sending.';
        status.className = 'form-status err';
        return;
      }
      btn.disabled = true;
      fetch(form.getAttribute('action'), {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.textContent = 'Thank you. We have received your message and will respond with the next step. Nothing is confirmed until we reply with scope and pricing.';
          status.className = 'form-status ok';
        } else {
          status.textContent = 'Something went wrong sending the form. Please try again.';
          status.className = 'form-status err';
        }
      }).catch(function () {
        status.textContent = 'Something went wrong sending the form. Please check your connection and try again.';
        status.className = 'form-status err';
      }).finally(function () { btn.disabled = false; });
    });
  });

  /* Booking success page */
  var ok = document.getElementById('success-details');
  if (ok) {
    var p = new URLSearchParams(window.location.search);
    var rows = [
      ['Promotion code', p.get('promo')],
      ['Promotion', p.get('promoName')],
      ['Promotion discount', p.get('promoAmount') ? '−$' + p.get('promoAmount') : null],
      ['Requested service', p.get('service')],
      ['Requested date', p.get('date')],
      ['Preferred arrival', p.get('time')],
      ['Estimated total', p.get('total') ? '$' + p.get('total') : null],
      ['Estimated deposit', p.get('deposit') ? '$' + p.get('deposit') : null],
      ['Your email address', p.get('email')]
    ].filter(function (r) { return r[1]; });
    ok.innerHTML = rows.length
      ? '<h4>Your request</h4>' + rows.map(function (r) {
          return '<div class="r-row"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
        }).join('')
      : '<h4>Your request</h4><p style="font-size:.89rem">We have received your request and will be in touch by email.</p>';
  }

  /* Dynamic year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
