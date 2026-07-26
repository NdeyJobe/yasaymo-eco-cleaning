/* =====================================================================
   YASAYMO ECO CLEANING — BOOKING
   All rules come from SITE.booking in config.js.
   ===================================================================== */
(function () {
  var host = document.getElementById('booking');
  if (!host || typeof SITE === 'undefined') return;

  var B = SITE.booking;
  var quote = null;
  var sel = { date: null, time: null };

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  var money = function (n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var iso = function (d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  /* "Now" in the business timezone, as a plain local Date we can compare by day */
  function nowInTz() {
    var s = new Date().toLocaleString('en-US', { timeZone: B.timezone });
    return new Date(s);
  }

  var now = nowInTz();
  var earliest = new Date(now.getTime() + B.minNoticeHours * 3600 * 1000);
  var latest = new Date(now.getTime() + B.maxAdvanceDays * 24 * 3600 * 1000);
  var view = new Date(earliest.getFullYear(), earliest.getMonth(), 1);

  function dayState(d) {
    var day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var minDay = new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate());
    var maxDay = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate());
    if (day < minDay || day > maxDay) return 'off';
    if (B.blockedDates.indexOf(iso(day)) > -1) return 'off';
    if (B.closedWeekdays.indexOf(day.getDay()) > -1) return 'off';
    return 'ok';
  }

  function render() {
    host.innerHTML =
      '<div class="section-head"><p class="eyebrow">Booking</p><h2>Choose your date and time.</h2>' +
      '<p>Select an available date, tell us how to reach you, and send your request. Dates that are unavailable appear greyed out.</p></div>' +

      '<div class="grid cols-2" style="align-items:start">' +
        '<div><h3 style="margin-bottom:14px">Select a date</h3><div id="cal"></div>' +
          '<h3 style="margin:26px 0 10px">Preferred arrival time</h3><div class="slots" id="slots"></div>' +
          '<p class="calc-hint">Arrival times are approximate. We confirm a window when your booking is accepted.</p></div>' +

        '<div><h3 style="margin-bottom:14px">Your details</h3>' +
          '<form data-ajax id="bookform" action="' + SITE.formspree.booking + '" method="POST" novalidate>' +
            '<input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<input type="hidden" name="_subject" id="bk-subject" value="' + SITE.subjects.booking + '">' +
            '<input type="hidden" name="quote_summary" id="bk-summary">' +
            '<input type="hidden" name="promotion_code" id="bk-promo-code">' +
            '<input type="hidden" name="promotion_name" id="bk-promo-name">' +
            '<input type="hidden" name="promotion_discount" id="bk-promo-amount">' +
            '<fieldset><legend>Contact</legend>' +
              '<div class="field-row">' +
                '<div><label for="bk-name">Full name</label><input type="text" id="bk-name" name="name" required autocomplete="name"></div>' +
                '<div><label for="bk-email">Email</label><input type="email" id="bk-email" name="email" required autocomplete="email"></div>' +
              '</div>' +
              '<div class="field-row">' +
                '<div><label for="bk-phone">Phone</label><input type="tel" id="bk-phone" name="phone" autocomplete="tel"></div>' +
                '<div><label for="bk-contact">Preferred contact</label><select id="bk-contact" name="preferred_contact"><option>Email</option><option>Phone</option><option>Text</option></select></div>' +
              '</div>' +
              '<label for="bk-address">Service address</label><input type="text" id="bk-address" name="service_address" required>' +
              '<label for="bk-zip">ZIP code</label><input type="text" id="bk-zip" name="zip" inputmode="numeric" required>' +
            '</fieldset>' +
            '<fieldset><legend>Property notes</legend>' +
              '<label for="bk-access">Parking or access notes <span class="opt">(do not include door or alarm codes)</span></label>' +
              '<input type="text" id="bk-access" name="access_notes">' +
              '<label for="bk-prefs">Product preferences, fragrance concerns, pets, or delicate surfaces</label>' +
              '<textarea id="bk-prefs" name="preferences"></textarea>' +
              '<p class="calc-hint">Requests are reviewed based on product availability, surface requirements, and the cleaning task.</p>' +
            '</fieldset>' +
            '<div class="review" id="review"></div>' +
            '<div class="consent mt-2">' +
              '<label><input type="checkbox" name="consent" required> I understand this is a request, not a confirmed appointment. My booking is confirmed only after I accept the final invoice and pay the required deposit.</label>' +
            '</div>' +
            '<button class="btn mt-3" type="submit" id="bk-submit" disabled>Submit Booking Request</button>' +
            '<p class="form-status" role="status" aria-live="polite"></p>' +
          '</form>' +
        '</div>' +
      '</div>';

    drawCal();
    drawSlots();
    drawReview();
    bind();
  }

  function drawCal() {
    var y = view.getFullYear(), m = view.getMonth();
    var first = new Date(y, m, 1);
    var days = new Date(y, m + 1, 0).getDate();
    var prevOk = new Date(y, m, 1) > new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    var nextOk = new Date(y, m, 1) < new Date(latest.getFullYear(), latest.getMonth(), 1);

    var html = '<div class="cal"><div class="cal-head">' +
      '<button type="button" class="cal-nav" id="cal-prev" aria-label="Previous month"' + (prevOk ? '' : ' disabled') + '>‹</button>' +
      '<strong>' + MONTHS[m] + ' ' + y + '</strong>' +
      '<button type="button" class="cal-nav" id="cal-next" aria-label="Next month"' + (nextOk ? '' : ' disabled') + '>›</button>' +
      '</div><div class="cal-grid">';
    DOW.forEach(function (d) { html += '<div class="cal-dow">' + d + '</div>'; });
    for (var i = 0; i < first.getDay(); i++) html += '<div class="cal-day empty"></div>';
    for (var d = 1; d <= days; d++) {
      var date = new Date(y, m, d);
      var st = dayState(date);
      var key = iso(date);
      html += '<button type="button" class="cal-day' + (sel.date === key ? ' sel' : '') + '" data-date="' + key + '"' +
        (st === 'off' ? ' disabled' : '') + '>' + d + '</button>';
    }
    html += '</div></div>';
    document.getElementById('cal').innerHTML = html;
  }

  function drawSlots() {
    document.getElementById('slots').innerHTML = B.timeSlots.map(function (t) {
      return '<button type="button" class="slot' + (sel.time === t ? ' on' : '') + '" data-slot="' + t + '">' + t + '</button>';
    }).join('');
  }

  function prettyDate(key) {
    if (!key) return '—';
    var p = key.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return DOW[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function drawReview() {
    var r = document.getElementById('review');
    if (!r) return;
    if (!quote) {
      r.innerHTML = '<h4>Review</h4><p style="font-size:.89rem">Build your estimate above, then choose a date to complete your request. ' +
        'Homes over 4,000 sq ft and properties needing an assessment are quoted after a walkthrough — ' +
        '<a href="/contact/">contact us</a> and we will arrange one.</p>';
      var btn0 = document.getElementById('bk-submit');
      if (btn0) btn0.disabled = true;
      return;
    }

    var rows =
      (quote.promoCode ? row('Promotion code', quote.promoCode) : '') +
      (quote.promoName ? row('Promotion', quote.promoName) : '') +
      row('Service', quote.service) +
      row('Home size', quote.size) +
      row('Bedrooms / bathrooms', quote.bedrooms + ' bd, ' + quote.fullBaths + ' full' + (+quote.halfBaths ? ', ' + quote.halfBaths + ' half' : '')) +
      row('Frequency', quote.frequency) +
      row('Condition', quote.condition) +
      row('Pets', quote.pets) +
      row('Add-ons', quote.addons) +
      row('Requested date', prettyDate(sel.date)) +
      row('Preferred arrival', sel.time || '—');

    var totals = (quote.promoAmount ? '<div class="r-row"><span>Promotion discount</span><span>−' + money(quote.promoAmount) + '</span></div>' : '') +
      '<div class="r-row r-total"><span>Estimated first visit</span><span>' + money(quote.firstTotal) + '</span></div>' +
      (quote.recurTotal ? '<div class="r-row"><span>Then per visit</span><span>' + money(quote.recurTotal) + '</span></div>' : '') +
      '<div class="r-row"><span>Estimated deposit (50%)</span><span>' + money(quote.deposit) + '</span></div>';

    r.innerHTML = '<h4>Review your request</h4>' + rows + totals +
      '<p class="calc-hint">Pricing shown is an estimate. Final pricing is confirmed after review. Your appointment is confirmed only after the invoice is accepted and the deposit is received.</p>';

    var s = document.getElementById('bk-summary');
    if (s) s.value = [
      'YASAYMO ECO CLEANING — BOOKING REQUEST',
      'Service: ' + quote.service,
      'Home size: ' + quote.size,
      'Bedrooms: ' + quote.bedrooms + '  Full baths: ' + quote.fullBaths + '  Half baths: ' + quote.halfBaths,
      'Frequency: ' + quote.frequency,
      'Condition: ' + quote.condition,
      'Pets: ' + quote.pets,
      'Add-ons: ' + quote.addons,
      quote.promoCode ? 'Promotion code: ' + quote.promoCode : 'Promotion code: none',
      quote.promoName ? 'Promotion: ' + quote.promoName + ' (−' + money(quote.promoAmount) + ')' : '',
      'Requested date: ' + prettyDate(sel.date),
      'Preferred arrival: ' + (sel.time || '—'),
      'Estimated first visit: ' + money(quote.firstTotal),
      quote.recurTotal ? 'Then per visit: ' + money(quote.recurTotal) : 'One-time service',
      'Estimated deposit (50%): ' + money(quote.deposit)
    ].filter(function (x) { return x; }).join('\n');

    var subj = document.getElementById('bk-subject');
    if (subj) subj.value = SITE.subjects.booking + ' — ' + prettyDate(sel.date) +
      (quote.promoCode ? ' — ' + quote.promoCode : '');

    var pc = document.getElementById('bk-promo-code');
    var pn = document.getElementById('bk-promo-name');
    var pa = document.getElementById('bk-promo-amount');
    if (pc) pc.value = quote.promoCode || '';
    if (pn) pn.value = quote.promoName || '';
    if (pa) pa.value = quote.promoAmount ? quote.promoAmount.toFixed(2) : '';

    checkReady();
  }
  function row(k, v) { return '<div class="r-row"><span>' + k + '</span><span>' + v + '</span></div>'; }

  function checkReady() {
    var btn = document.getElementById('bk-submit');
    if (btn) btn.disabled = !(quote && sel.date && sel.time);
  }

  function bind() {
    host.addEventListener('click', function (e) {
      var p = e.target.closest('#cal-prev'), n = e.target.closest('#cal-next');
      if (p) { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); drawCal(); return; }
      if (n) { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); drawCal(); return; }
      var d = e.target.closest('.cal-day[data-date]');
      if (d && !d.disabled) { sel.date = d.dataset.date; drawCal(); drawReview(); return; }
      var s = e.target.closest('.slot');
      if (s) { sel.time = s.dataset.slot; drawSlots(); drawReview(); }
    });

    var form = document.getElementById('bookform');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = document.getElementById('bk-submit');
      if (!quote || !sel.date || !sel.time) {
        status.textContent = 'Please build an estimate and choose a date and arrival time first.';
        status.className = 'form-status err'; return;
      }
      btn.disabled = true;
      fetch(form.getAttribute('action'), {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('bad');
        var q = new URLSearchParams({
          service: quote.service, date: prettyDate(sel.date), time: sel.time,
          total: quote.firstTotal.toFixed(2), deposit: quote.deposit.toFixed(2),
          email: document.getElementById('bk-email').value,
          promo: quote.promoCode || '', promoName: quote.promoName || '',
          promoAmount: quote.promoAmount ? quote.promoAmount.toFixed(2) : ''
        });
        window.location.href = B.successUrl + '?' + q.toString();
      }).catch(function () {
        status.textContent = 'Something went wrong sending your request. Please try again, or contact us and we will book it manually.';
        status.className = 'form-status err';
        btn.disabled = false;
      });
    });
  }

  document.addEventListener('quote:ready', function (e) { quote = e.detail; drawReview(); });

  document.addEventListener('quote:invalid', function () {
    quote = null;
    drawReview();
  });

  render();
})();
