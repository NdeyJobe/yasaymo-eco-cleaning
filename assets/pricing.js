/* =====================================================================
   YASAYMO ECO CLEANING — RESIDENTIAL PRICING CONFIGURATION
   ---------------------------------------------------------------------
   ALL PRICING AND ALLOWANCES LIVE IN THIS OBJECT.
   To change a price, edit it here only. Nothing below this object
   contains a hard-coded dollar amount.
   ===================================================================== */

const PRICING = {

  // Minimum visit charge. Applied after any recurring discount and
  // before pet adjustment and add-ons.
  minimumCharge: 129,

  services: [
    { id: 'standard', label: 'Standard Cleaning', desc: 'Recommended for regularly maintained homes.' },
    { id: 'deep',     label: 'Deep Cleaning',     desc: 'For homes needing additional detailed attention.' },
    { id: 'movein',   label: 'Move-In Cleaning',  desc: 'Prepare your new home before moving in.' },
    { id: 'moveout',  label: 'Move-Out Cleaning', desc: 'Leave your property ready for its next owner or tenant.' }
  ],

  // Base price grid + room allowances included in each tier
  sizes: [
    { id: 's1', label: 'Up to 1,000 sq ft', includes: { beds: 2, baths: 1 },
      prices: { standard: 139, deep: 249, movein: 269, moveout: 269 } },
    { id: 's2', label: '1,001–1,500 sq ft', includes: { beds: 3, baths: 2 },
      prices: { standard: 169, deep: 299, movein: 329, moveout: 329 } },
    { id: 's3', label: '1,501–2,000 sq ft', includes: { beds: 4, baths: 2 },
      prices: { standard: 199, deep: 359, movein: 389, moveout: 389 } },
    { id: 's4', label: '2,001–2,500 sq ft', includes: { beds: 4, baths: 3 },
      prices: { standard: 239, deep: 419, movein: 449, moveout: 449 } },
    { id: 's5', label: '2,501–3,000 sq ft', includes: { beds: 5, baths: 3 },
      prices: { standard: 279, deep: 479, movein: 519, moveout: 519 } },
    { id: 's6', label: '3,001–3,500 sq ft', includes: { beds: 6, baths: 4 },
      prices: { standard: 329, deep: 549, movein: 589, moveout: 589 } },
    { id: 's7', label: '3,501–4,000 sq ft', includes: { beds: 6, baths: 4 },
      prices: { standard: 379, deep: 619, movein: 659, moveout: 659 } },
    { id: 'custom', label: 'Over 4,000 sq ft', custom: true }
  ],

  // Charges for rooms above the tier allowance.
  // 'standard' applies to Standard Cleaning; 'intensive' to Deep / Move-In / Move-Out.
  extraRooms: {
    standard:  { fullBath: 25, halfBath: 15, bedroom: 15 },
    intensive: { fullBath: 40, halfBath: 25, bedroom: 25 }
  },

  bedrooms:  ['Studio', '1', '2', '3', '4', '5', '6', '7+'],
  fullBaths: ['1', '2', '3', '4', '5', '6+'],
  halfBaths: ['0', '1', '2', '3', '4+'],

  frequency: [
    { id: 'onetime',  label: 'One-Time',        discount: 0.00 },
    { id: 'weekly',   label: 'Weekly',          discount: 0.15 },
    { id: 'biweekly', label: 'Every Two Weeks', discount: 0.10 },
    { id: 'monthly',  label: 'Monthly',         discount: 0.05 }
  ],

  // Condition drives the SERVICE TYPE rather than a percentage surcharge.
  // requires:'deep' -> Standard unavailable, priced as Deep.
  // assess:true     -> no online pricing; walkthrough required.
  condition: [
    { id: 'recent', label: 'Recently Cleaned', note: 'Within the last month' },
    { id: 'normal', label: 'Normal Condition', note: 'Typical everyday upkeep' },
    { id: 'lapsed', label: 'Over Two Months',  note: 'Deep cleaning recommended', requires: 'deep' },
    { id: 'heavy',  label: 'Heavy Build-Up',   note: 'Deep cleaning required',    requires: 'deep' },
    { id: 'soiled', label: 'Extremely Soiled', note: 'Assessment required',       assess: true }
  ],

  pets: [
    { id: 'none',  label: 'No Pets',        add: 0 },
    { id: 'dog',   label: 'One Dog',        add: 0 },
    { id: 'cat',   label: 'One Cat',        add: 0 },
    { id: 'multi', label: 'Multiple Pets',  add: 10 },
    { id: 'shed',  label: 'Heavy Shedding', add: 20 }
  ],

  // per:'fullbath' multiplies by full-bathroom count.
  // qty:true renders a stepper and multiplies by quantity.
  addons: [
    { group: 'Kitchen', items: [
      { id: 'fridge',   label: 'Inside Refrigerator', price: 35 },
      { id: 'oven',     label: 'Inside Oven',         price: 40 },
      { id: 'cabinets', label: 'Inside Cabinets',     price: 45 }
    ]},
    { group: 'Bathrooms', items: [
      { id: 'scum',  label: 'Heavy Soap Scum Removal', price: 25, per: 'fullbath' },
      { id: 'grout', label: 'Grout Detail',            price: 20, per: 'fullbath' }
    ]},
    { group: 'General', items: [
      { id: 'baseboards', label: 'Baseboards',       price: 30 },
      { id: 'windows',    label: 'Interior Windows', price: 8,  qty: true, unit: 'window' },
      { id: 'fans',       label: 'Ceiling Fans',     price: 8,  qty: true, unit: 'fan' },
      { id: 'blinds',     label: 'Blinds',           price: 10, qty: true, unit: 'room' },
      { id: 'laundry',    label: 'Laundry Folding',  price: 25 },
      { id: 'linen',      label: 'Linen Change',     price: 15 },
      { id: 'patio',      label: 'Balcony or Patio', price: 30 },
      { id: 'garage',     label: 'Garage Sweep',     price: 35 }
    ]}
  ],

  estimateUrl: '/contact/'
};

/* =====================================================================
   No pricing below this line.
   ===================================================================== */

(function () {
  var root = document.getElementById('calc');
  if (!root) return;

  var state = {
    service: 'standard', size: 's1',
    bedrooms: '2', fullBaths: '1', halfBaths: '0',
    frequency: 'onetime', condition: 'normal', pets: 'none',
    addons: {},
    promoInput: '',   // what is typed in the box
    promoCode: null,  // the applied, validated code
    promoError: ''    // message shown under the field
  };

  /* Look up a promotion, case-insensitive and whitespace-tolerant */
  function lookupPromo(raw) {
    if (typeof PROMOTIONS === 'undefined') return null;
    var key = String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!key) return null;
    var p = PROMOTIONS[key];
    if (!p || p.active === false) return null;
    return { key: key, def: p };
  }

  /* Is the applied promo valid for the service currently being priced? */
  function promoEligible(p, svcId) {
    if (!p) return false;
    var list = p.def.eligibleServices;
    if (!list || !list.length) return true;
    var norm = function (x) { return String(x).toLowerCase().replace(/[^a-z]/g, ''); };
    for (var i = 0; i < list.length; i++) if (norm(list[i]) === norm(svcId)) return true;
    return false;
  }

  var money  = function (n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var money0 = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var find   = function (arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; };
  var num    = function (v) { return v === 'Studio' ? 0 : parseInt(v, 10) || 0; };
  var intensive = function (svc) { return svc !== 'standard'; };
  var addonById = function (id) {
    for (var g = 0; g < PRICING.addons.length; g++) {
      var it = PRICING.addons[g].items;
      for (var i = 0; i < it.length; i++) if (it[i].id === id) return it[i];
    }
    return null;
  };

  function effectiveService() {
    var c = find(PRICING.condition, state.condition);
    return (c.requires === 'deep' && state.service === 'standard') ? 'deep' : state.service;
  }

  /* ---------- calculation ---------- */
  function calc() {
    var size = find(PRICING.sizes, state.size);
    var cond = find(PRICING.condition, state.condition);
    if (size.custom) return { blocked: 'size' };
    if (cond.assess) return { blocked: 'condition' };

    var svc = effectiveService();
    var base = size.prices[svc];
    var rates = intensive(svc) ? PRICING.extraRooms.intensive : PRICING.extraRooms.standard;

    var beds = num(state.bedrooms), fb = num(state.fullBaths), hb = num(state.halfBaths);
    var xBeds = Math.max(0, beds - size.includes.beds);
    var xFull = Math.max(0, fb - size.includes.baths);
    var roomLines = [], roomTotal = 0;
    if (xFull) { roomTotal += xFull * rates.fullBath; roomLines.push({ label: 'Additional full bathroom × ' + xFull, amount: xFull * rates.fullBath }); }
    if (hb)    { roomTotal += hb * rates.halfBath;    roomLines.push({ label: 'Half bathroom × ' + hb, amount: hb * rates.halfBath }); }
    if (xBeds) { roomTotal += xBeds * rates.bedroom;  roomLines.push({ label: 'Additional bedroom × ' + xBeds, amount: xBeds * rates.bedroom }); }

    var preDiscount = base + roomTotal;

    var petAdj = find(PRICING.pets, state.pets).add;
    var addonTotal = 0, addonLines = [];
    for (var id in state.addons) {
      if (!state.addons[id]) continue;
      var a = addonById(id); if (!a) continue;
      var qty = a.per === 'fullbath' ? fb : (a.qty ? state.addons[id] : 1);
      var amt = a.price * qty;
      addonTotal += amt;
      addonLines.push({ label: a.label + (qty > 1 ? ' × ' + qty : ''), amount: amt });
    }
    var extras = petAdj + addonTotal;

    // ---- promotion: first visit only, never stacked with recurring ----
    var promo = null;
    var pr = lookupPromo(state.promoCode);
    if (pr && promoEligible(pr, svc)) {
      var raw = preDiscount * (pr.def.discount / 100);
      var capped = typeof pr.def.maximumDiscount === 'number'
        ? Math.min(raw, pr.def.maximumDiscount) : raw;
      promo = {
        code: pr.key,
        name: pr.def.name,
        pct: pr.def.discount,
        amount: capped,
        capped: capped < raw,
        max: pr.def.maximumDiscount,
        disclaimer: pr.def.disclaimer || ''
      };
    }

    var afterPromo = preDiscount - (promo ? promo.amount : 0);
    var firstCore = Math.max(afterPromo, PRICING.minimumCharge);

    var freq = find(PRICING.frequency, state.frequency);
    var discount = preDiscount * freq.discount;
    var afterDiscount = preDiscount - discount;
    var recurCore = Math.max(afterDiscount, PRICING.minimumCharge);

    return {
      svc: svc, upgraded: svc !== state.service,
      base: base, roomLines: roomLines,
      discount: discount, discountPct: freq.discount,
      recurring: freq.discount > 0, freqLabel: freq.label,
      promo: promo,
      minAppliedFirst: firstCore > afterPromo,
      minAppliedRecur: recurCore > afterDiscount,
      minimum: PRICING.minimumCharge,
      petAdj: petAdj, addonLines: addonLines,
      firstTotal: firstCore + extras,
      recurTotal: recurCore + extras
    };
  }

  /* ---------- builders ---------- */
  function optionCards(name, list, sel, opts) {
    opts = opts || {};
    var html = '<div class="' + (opts.cls || 'opt-row') + '">';
    list.forEach(function (o) {
      var off = opts.disabled && opts.disabled(o);
      var on = o.id === sel && !off;
      html += '<label class="opt' + (on ? ' on' : '') + (off ? ' off' : '') + '">' +
        '<input type="radio" name="' + name + '" value="' + o.id + '"' + (on ? ' checked' : '') + (off ? ' disabled' : '') + '>' +
        '<span class="opt-label">' + o.label + '</span>' +
        (o.desc ? '<span class="opt-desc">' + o.desc + '</span>' : '') +
        (o.note ? '<span class="opt-note">' + o.note + '</span>' : '') +
        (opts.showFrom ? '<span class="opt-from">Starting from <strong>' + money0(PRICING.sizes[0].prices[o.id]) + '</strong></span>' : '') +
        (off ? '<span class="opt-badge">Deep clean required</span>' : '') +
        (typeof o.discount === 'number' && o.discount > 0 ? '<span class="opt-badge">Save ' + Math.round(o.discount * 100) + '%</span>' : '') +
        (typeof o.add === 'number' && o.add > 0 ? '<span class="opt-badge">+' + money0(o.add) + '</span>' : '') +
        '</label>';
    });
    return html + '</div>';
  }

  function selectEl(id, list, sel) {
    var html = '<select id="' + id + '" class="calc-select">';
    list.forEach(function (o) {
      var v = typeof o === 'string' ? o : o.id;
      var l = typeof o === 'string' ? o : o.label;
      html += '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + l + '</option>';
    });
    return html + '</select>';
  }

  function allowanceNote() {
    var s = find(PRICING.sizes, state.size);
    if (s.custom) return '';
    var r = intensive(effectiveService()) ? PRICING.extraRooms.intensive : PRICING.extraRooms.standard;
    return '<p class="calc-hint">This size includes up to <strong>' + s.includes.beds + ' bedrooms</strong> and <strong>' +
      s.includes.baths + ' full ' + (s.includes.baths === 1 ? 'bathroom' : 'bathrooms') + '</strong>. Beyond that: ' +
      money0(r.fullBath) + ' per additional full bathroom, ' + money0(r.halfBath) + ' per half bathroom, ' +
      money0(r.bedroom) + ' per additional bedroom.</p>';
  }

  function addonsHtml() {
    var html = '';
    PRICING.addons.forEach(function (g) {
      html += '<div class="addon-group"><h4>' + g.group + '</h4><div class="addon-list">';
      g.items.forEach(function (a) {
        var on = !!state.addons[a.id];
        var price = money0(a.price) + (a.per === 'fullbath' ? ' <span class="per">per full bathroom</span>' : a.qty ? ' <span class="per">per ' + a.unit + '</span>' : '');
        html += '<div class="addon' + (on ? ' on' : '') + '">' +
          '<label class="addon-main"><input type="checkbox" data-addon="' + a.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="addon-label">' + a.label + '</span><span class="addon-price">' + price + '</span></label>' +
          (a.qty ? '<div class="qty' + (on ? '' : ' hide') + '">' +
            '<button type="button" class="qty-btn" data-qty="' + a.id + '" data-dir="-1" aria-label="Decrease ' + a.label + '">−</button>' +
            '<span class="qty-n" id="qty-' + a.id + '">' + (state.addons[a.id] || 1) + '</span>' +
            '<button type="button" class="qty-btn" data-qty="' + a.id + '" data-dir="1" aria-label="Increase ' + a.label + '">+</button>' +
            '<span class="qty-unit">' + a.unit + 's</span></div>' : '') + '</div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function promoHtml() {
    var pr = lookupPromo(state.promoCode);
    var applied = !!pr;
    var eligible = applied && promoEligible(pr, effectiveService());
    var html = '<div class="promo">';
    html += '<div class="promo-row">' +
      '<input type="text" id="promo-input" class="calc-select promo-input" placeholder="Enter code" ' +
        'value="' + String(state.promoInput || '').replace(/"/g, '&quot;') + '" autocomplete="off" ' +
        'aria-label="Promotional code" spellcheck="false">' +
      '<button type="button" class="btn promo-btn" id="promo-apply">Apply</button>' +
      (applied ? '<button type="button" class="promo-remove" id="promo-remove">Remove</button>' : '') +
      '</div>';
    if (applied && eligible) {
      html += '<div class="promo-ok"><strong>' + pr.def.shortName + ' Offer Applied</strong>' +
        '<span>' + pr.def.appliedMessage + '</span></div>';
    } else if (applied && !eligible) {
      html += '<div class="promo-err">This code does not apply to the selected service.</div>';
    } else if (state.promoError) {
      html += '<div class="promo-err">' + state.promoError + '</div>';
    }
    return html + '</div>';
  }

  /* ---------- render ---------- */
  function render() {
    var cond = find(PRICING.condition, state.condition);
    var lock = cond.requires === 'deep';

    root.innerHTML =
      '<div class="calc-layout"><div class="calc-steps">' +
        step(1, 'Select your service',
          (lock ? '<div class="notice mb"><strong>Deep cleaning required.</strong> Homes that have not been professionally cleaned recently need the additional time and detail of a deep clean before recurring standard service begins. If you believe standard cleaning is sufficient, <a href="' + PRICING.estimateUrl + '">request a review</a>.</div>' : '') +
          optionCards('service', PRICING.services, effectiveService(), {
            cls: 'opt-grid-2', showFrom: true,
            disabled: function (o) { return lock && o.id === 'standard'; }
          })) +
        step(2, 'Home size', selectEl('sel-size', PRICING.sizes, state.size) + allowanceNote()) +
        '<div class="calc-row3">' +
          step(3, 'Bedrooms', selectEl('sel-beds', PRICING.bedrooms, state.bedrooms)) +
          step(4, 'Full bathrooms', selectEl('sel-fbaths', PRICING.fullBaths, state.fullBaths)) +
          step(5, 'Half bathrooms', selectEl('sel-hbaths', PRICING.halfBaths, state.halfBaths)) +
        '</div>' +
        step(6, 'Cleaning frequency',
          optionCards('frequency', PRICING.frequency, state.frequency, { cls: 'opt-grid-4' }) +
          '<div class="notice mt-2"><strong>Your first visit is priced as a one-time or initial cleaning.</strong> Recurring savings begin with the second completed visit and depend on maintaining the agreed schedule.</div>') +
        step(7, 'Home condition', optionCards('condition', PRICING.condition, state.condition, { cls: 'opt-grid-3' })) +
        step(8, 'Pets', optionCards('pets', PRICING.pets, state.pets, { cls: 'opt-grid-3' })) +
        step(9, 'Add-on services', addonsHtml()) +
        step(10, 'Promotional code', promoHtml()) +
      '</div><aside class="calc-summary-wrap"><div class="calc-summary" id="summary"></div></aside></div>' +
      '<div class="calc-bar" id="calcbar"></div>';

    bind(); update();
  }

  function step(n, title, body) {
    return '<section class="calc-step"><div class="calc-step-head">' +
      '<span class="calc-step-num">Step ' + n + '</span><h3>' + title + '</h3></div>' + body + '</section>';
  }

  /* ---------- summary ---------- */
  function summaryHtml(r) {
    if (r.blocked) {
      var m = r.blocked === 'size'
        ? { h: 'This home requires a customized estimate.', p: 'Homes over 4,000 sq ft are quoted individually so the scope and time are right for the property.' }
        : { h: 'This property requires an in-person assessment.', p: 'Extremely soiled properties are quoted after a walkthrough so we can confirm scope, time, and suitability.' };
      return '<div class="sum-block"><h3 class="sum-title">Custom estimate needed</h3>' +
        '<p class="sum-msg"><strong>' + m.h + '</strong></p><p class="sum-msg">' + m.p + '</p>' +
        '<a class="btn sum-cta" href="' + PRICING.estimateUrl + '">Request an Estimate</a></div>';
    }

    var size = find(PRICING.sizes, state.size);
    var svc  = find(PRICING.services, r.svc);
    var cond = find(PRICING.condition, state.condition);
    var pet  = find(PRICING.pets, state.pets);

    var rows = '';
    if (r.promo) rows += sumRow('Promotion code', r.promo.code);
    rows += sumRow('Service', svc.label + (r.upgraded ? ' <em>(required)</em>' : ''));
    rows += sumRow('Home size', size.label);
    rows += sumRow('Bedrooms', state.bedrooms);
    rows += sumRow('Bathrooms', state.fullBaths + ' full' + (num(state.halfBaths) ? ', ' + state.halfBaths + ' half' : ''));
    rows += sumRow('Frequency', r.freqLabel);
    rows += sumRow('Condition', cond.label);
    rows += sumRow('Pets', pet.label);

    var lines = lineRow('Base price', money(r.base));
    r.roomLines.forEach(function (l) { lines += lineRow(l.label, '+' + money(l.amount)); });
    if (r.promo) lines += lineRow('Promotion — first visit' + (r.promo.capped ? ' (max ' + money0(r.promo.max) + ')' : ''), '−' + money(r.promo.amount), 'save');
    if (r.recurring) lines += lineRow('Recurring savings (' + Math.round(r.discountPct * 100) + '%) — from 2nd visit', '−' + money(r.discount), 'save');
    if (r.minAppliedFirst || r.minAppliedRecur) lines += lineRow('Minimum visit charge applied', money(r.minimum));
    if (r.petAdj > 0) lines += lineRow('Pet adjustment', '+' + money(r.petAdj));
    if (r.addonLines.length) {
      lines += '<div class="sum-addons"><span class="sum-addons-h">Add-ons</span>';
      r.addonLines.forEach(function (l) { lines += '<div class="sum-line sub"><span>' + l.label + '</span><span>+' + money(l.amount) + '</span></div>'; });
      lines += '</div>';
    }

    var total = r.recurring
      ? '<div class="sum-total"><span>Estimated first visit</span><strong aria-live="polite">' + money(r.firstTotal) + '</strong></div>' +
        '<div class="sum-then"><span>Then ' + money(r.recurTotal) + ' per visit</span><small>' + r.freqLabel.toLowerCase() + ', from your second visit</small></div>'
      : '<div class="sum-total"><span>Estimated total</span><strong aria-live="polite">' + money(r.firstTotal) + '</strong></div>';

    return '<div class="sum-block"><h3 class="sum-title">Residential Cleaning Estimate</h3>' +
      '<div class="sum-rows">' + rows + '</div><div class="sum-lines">' + lines + '</div>' + total +
      '<div class="sum-deposit">Estimated deposit today: <strong>' + money(r.firstTotal * 0.5) + '</strong> (50% of the first visit, due after we send your invoice).</div>' +
      '<p class="sum-note">Pricing shown is an estimate. Final pricing is confirmed after reviewing your request.' +
        (r.promo && r.promo.disclaimer ? ' ' + r.promo.disclaimer : '') + '</p>' +
      '<button type="button" class="btn sum-cta" id="cta">' +
        (bookingOpen ? 'Go to Booking' : 'Continue to Booking') + '</button></div>';
  }
  function sumRow(k, v) { return '<div class="sum-row"><span>' + k + '</span><span>' + v + '</span></div>'; }
  function lineRow(k, v, cls) { return '<div class="sum-line ' + (cls || '') + '"><span>' + k + '</span><span>' + v + '</span></div>'; }

  function update() {
    var r = calc();
    document.getElementById('summary').innerHTML = summaryHtml(r);
    var bar = document.getElementById('calcbar');
    if (r.blocked) {
      bar.innerHTML = '<div class="bar-in"><span class="bar-msg">Custom estimate needed</span>' +
        '<a class="btn" href="' + PRICING.estimateUrl + '">Request an Estimate</a></div>';
    } else {
      bar.innerHTML = '<div class="bar-in"><span class="bar-total"><small>' +
        (r.recurring ? 'First visit' : 'Estimated total') + '</small><strong>' + money(r.firstTotal) + '</strong>' +
        (r.recurring ? '<em>then ' + money(r.recurTotal) + '/visit</em>' : '') +
        '</span><button type="button" class="btn" id="cta-bar">' +
        (bookingOpen ? 'Go to Booking' : 'Continue to Booking') + '</button></div>';
    }
    var go = function () { submit(r); };
    var a = document.getElementById('cta');     if (a) a.onclick = go;
    var b = document.getElementById('cta-bar'); if (b) b.onclick = go;

    pushQuote(r);   // keeps the booking review in sync after it is opened
  }

  var bookingOpen = false;

  /* Build the quote object handed to the booking module */
  function buildQuote(r) {
    var size = find(PRICING.sizes, state.size);
    var svc  = find(PRICING.services, r.svc);
    var cond = find(PRICING.condition, state.condition);
    var pet  = find(PRICING.pets, state.pets);
    return {
      service: svc.label,
      size: size.label,
      bedrooms: state.bedrooms,
      fullBaths: state.fullBaths,
      halfBaths: state.halfBaths,
      frequency: r.freqLabel,
      condition: cond.label,
      pets: pet.label,
      addons: r.addonLines.map(function (l) { return l.label; }).join(', ') || 'None',
      firstTotal: r.firstTotal,
      recurTotal: r.recurring ? r.recurTotal : null,
      promoCode: r.promo ? r.promo.code : null,
      promoName: r.promo ? r.promo.name : null,
      promoAmount: r.promo ? r.promo.amount : 0,
      deposit: r.firstTotal * (window.SITE ? SITE.booking.depositPercent : 0.5)
    };
  }

  /* Keep the booking panel in sync with the calculator once it is open */
  function pushQuote(r) {
    if (!bookingOpen) return;
    if (r.blocked) {
      window.YASAYMO_QUOTE = null;
      document.dispatchEvent(new CustomEvent('quote:invalid'));
      var bl = document.getElementById('booking');
      if (bl) bl.classList.add('locked');
      return;
    }
    var bl2 = document.getElementById('booking');
    if (bl2) bl2.classList.remove('locked');
    window.YASAYMO_QUOTE = buildQuote(r);
    document.dispatchEvent(new CustomEvent('quote:ready', { detail: window.YASAYMO_QUOTE }));
  }

  function submit(r) {
    if (r.blocked) {
      var el = document.getElementById('custom-request');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    bookingOpen = true;
    window.YASAYMO_QUOTE = buildQuote(r);
    document.dispatchEvent(new CustomEvent('quote:ready', { detail: window.YASAYMO_QUOTE }));
    var b = document.getElementById('booking');
    if (b) { b.classList.remove('locked'); b.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  /* ---------- events ---------- */
  function bind() {
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type === 'radio' && t.name) {
        if (t.name === 'service')   { state.service = t.value; render(); return; }
        if (t.name === 'condition') { state.condition = t.value; render(); return; }
        if (t.name === 'frequency') { state.frequency = t.value; syncOn('frequency'); update(); return; }
        if (t.name === 'pets')      { state.pets = t.value; syncOn('pets'); update(); return; }
      }
      if (t.id === 'sel-size')   { state.size = t.value; render(); return; }
      if (t.id === 'sel-beds')   { state.bedrooms = t.value; update(); return; }
      if (t.id === 'sel-fbaths') { state.fullBaths = t.value; update(); return; }
      if (t.id === 'sel-hbaths') { state.halfBaths = t.value; update(); return; }
      if (t.dataset && t.dataset.addon) {
        var id = t.dataset.addon, a = addonById(id);
        if (t.checked) state.addons[id] = a && a.qty ? (state.addons[id] || 1) : 1;
        else delete state.addons[id];
        var wrap = t.closest('.addon');
        wrap.classList.toggle('on', t.checked);
        var q = wrap.querySelector('.qty');
        if (q) q.classList.toggle('hide', !t.checked);
        update();
      }
    });

    // promo: keep typed value in state so re-renders don't lose it
    root.addEventListener('input', function (e) {
      if (e.target.id === 'promo-input') { state.promoInput = e.target.value; state.promoError = ''; }
    });
    // Enter key applies the code
    root.addEventListener('keydown', function (e) {
      if (e.target.id === 'promo-input' && e.key === 'Enter') { e.preventDefault(); applyPromo(); }
    });

    root.addEventListener('click', function (e) {
      if (e.target.closest('#promo-apply'))  { applyPromo();  return; }
      if (e.target.closest('#promo-remove')) { removePromo(); return; }
      var b = e.target.closest('[data-qty]');
      if (!b) return;
      var id = b.dataset.qty;
      var next = Math.max(1, Math.min(99, (state.addons[id] || 1) + parseInt(b.dataset.dir, 10)));
      state.addons[id] = next;
      document.getElementById('qty-' + id).textContent = next;
      update();
    });
  }

  function applyPromo() {
    var box = document.getElementById('promo-input');
    var typed = box ? box.value : state.promoInput;
    state.promoInput = typed;
    var pr = lookupPromo(typed);
    if (!pr) {
      state.promoCode = null;
      state.promoError = String(typed || '').trim()
        ? 'That code is not valid or has expired.'
        : 'Please enter a promotional code.';
    } else {
      state.promoCode = pr.key;
      state.promoInput = pr.key;
      state.promoError = '';
    }
    render();
  }

  function removePromo() {
    state.promoCode = null;
    state.promoInput = '';
    state.promoError = '';
    render();
  }

  function syncOn(name) {
    root.querySelectorAll('input[name="' + name + '"]').forEach(function (i) {
      i.closest('.opt').classList.toggle('on', i.checked);
    });
  }

  render();
})();
