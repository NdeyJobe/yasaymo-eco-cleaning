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

  /* Generic AJAX forms (contact, commercial). The booking form handles itself. */
  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    if (form.id === 'bookform') return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type=submit]');
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
      ['Requested service', p.get('service')],
      ['Requested date', p.get('date')],
      ['Preferred arrival', p.get('time')],
      ['Estimated total', p.get('total') ? '$' + p.get('total') : null],
      ['Estimated deposit', p.get('deposit') ? '$' + p.get('deposit') : null],
      ['Confirmation sent to', p.get('email')]
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
