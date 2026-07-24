// White Glove — shared behavior
(function () {
  // Mobile nav
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Compact header on scroll
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('compact', window.scrollY > 40);
    }, { passive: true });
  }

  // Scroll reveal (respects reduced motion)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Hazard-condition warning on estimate form
  var hazardInputs = document.querySelectorAll('[data-hazard]');
  var warning = document.querySelector('.hazard-warning');
  if (hazardInputs.length && warning) {
    var update = function () {
      var any = Array.prototype.some.call(hazardInputs, function (i) { return i.checked; });
      warning.classList.toggle('show', any);
    };
    hazardInputs.forEach(function (i) { i.addEventListener('change', update); });
  }

  // AJAX form submit (Formspree)
  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type=submit]');
      var endpoint = form.getAttribute('action');
      if (endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        status.textContent = 'Form is not connected yet. Set the Formspree endpoint in this page (see README).';
        status.className = 'form-status err';
        return;
      }
      btn.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.textContent = 'Thank you. We have received your request and will contact you regarding the next step. Your appointment is not confirmed until the service scope, price, date, and access arrangements have been accepted.';
          status.className = 'form-status ok';
        } else {
          status.textContent = 'Something went wrong sending the form. Please try again, or contact us by email.';
          status.className = 'form-status err';
        }
      }).catch(function () {
        status.textContent = 'Something went wrong sending the form. Please check your connection and try again.';
        status.className = 'form-status err';
      }).finally(function () { btn.disabled = false; });
    });
  });
})();
