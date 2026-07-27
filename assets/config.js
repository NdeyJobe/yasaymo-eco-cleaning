/* =====================================================================
   YASAYMO ECO CLEANING — SITE CONFIGURATION
   ---------------------------------------------------------------------
   Every brand, contact, booking and deposit value lives here.
   Change it once; the whole site follows.
   ===================================================================== */

const SITE = {

  /* ---- Brand ---- */
  brandName: 'Yasaymo Eco Cleaning',
  brandMark: 'YASAYMO',
  brandSub:  'Eco Cleaning',
  tagline:   'Professional Cleaning. Thoughtful Product Choices.',
  supportingLine: 'Reliable residential and commercial cleaning using carefully selected eco-conscious products.',

  /* ---- Domain (update after the new domain is connected) ---- */
  domain: 'https://yasaymo.com',

  /* ---- Contact ---- */
  city: 'Tucson, Arizona',
  serviceAreas: ['Tucson', 'Oro Valley', 'Catalina Foothills', 'Marana',
                 'Central Tucson', 'East Tucson', 'Rita Ranch', 'Vail'],

  /* ---- Formspree ---- */
  formspree: {
    booking:    'https://formspree.io/f/mqergeya',
    commercial: 'https://formspree.io/f/mqergeya',
    contact:    'https://formspree.io/f/mqergeya'
  },
  subjects: {
    booking:    'New Yasaymo Eco Cleaning Booking Request',
    commercial: 'New Yasaymo Eco Cleaning Commercial Inquiry',
    contact:    'New Yasaymo Eco Cleaning Message'
  },

  /* ---- Booking rules ---- */
  booking: {
    timezone: 'America/Phoenix',
    minNoticeHours: 48,
    maxAdvanceDays: 90,
    timeSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'],
    // Dates already taken or unavailable. Format: 'YYYY-MM-DD'.
    // Add a date here after you accept a booking for it.
    blockedDates: [],
    // Weekdays closed (0 = Sunday … 6 = Saturday)
    closedWeekdays: [],
    depositPercent: 0.50,
    depositDueHours: 24,
    successUrl: '/booking-success/'
  }
};

/* =====================================================================
   PROMOTIONS
   ---------------------------------------------------------------------
   Codes are matched case-insensitively and trimmed of whitespace.
   discount        percentage off the cleaning (base + extra-room charges)
   maximumDiscount hard cap in dollars
   firstVisitOnly  applies to the first visit only; never stacks with the
                   recurring discount, which begins at the second visit
   eligibleServices service ids from PRICING.services
   active          set false to switch the code off site-wide
   ===================================================================== */

const PROMOTIONS = {
  UARIZONA10: {
    name: 'University of Arizona Employee Offer',
    shortName: 'University of Arizona Employees',
    discount: 10,
    maximumDiscount: 50,
    firstVisitOnly: true,
    eligibleServices: ['standard', 'deep', 'movein', 'moveout'],
    appliedMessage: '10% off your first residential cleaning has been applied.',
    disclaimer: 'This promotion is intended for current University of Arizona employees and may be modified or discontinued at any time.',
    active: true
  }
};
