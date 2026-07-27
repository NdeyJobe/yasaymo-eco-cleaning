# Yasaymo Eco Cleaning — Website

Static site (HTML/CSS/JS) for GitHub Pages. No build step.
**Professional Cleaning. Thoughtful Product Choices.** — Tucson, Arizona.

## Structure
```
index.html                       Home
/residential-cleaning/           Standard residential
/deep-cleaning/                  Deep cleaning
/move-in-move-out-cleaning/      Move cleaning
/vacation-rental-cleaning/       Vacation rental turnovers
/pricing/                        Pricing calculator + booking  ← primary conversion page
/commercial-cleaning/            Commercial
/medical-office-cleaning/        Medical & professional offices
/commercial-estimate/            Commercial estimate form
/about/  /faqs/  /contact/       Company
/booking-success/                Post-booking confirmation
/privacy/  /terms/               Legal
/assets/config.js                Brand, contact, Formspree, booking + deposit rules
/assets/pricing.js               ALL residential pricing (single PRICING object)
/assets/booking.js               Calendar, time slots, review, submit
/assets/site.js                  Nav, dropdowns, reveal, generic forms, success page
/assets/styles.css               Design tokens + all styles
sitemap.xml  robots.txt  CNAME
```

## Where to change things
| Change | File |
|---|---|
| Any price, discount, minimum, room allowance, add-on | `assets/pricing.js` → `PRICING` |
| Brand name, tagline, domain, Formspree IDs, email subjects | `assets/config.js` → `SITE` |
| Booking rules: notice, advance window, time slots, deposit % | `assets/config.js` → `SITE.booking` |
| **Block a date you've already booked** | `assets/config.js` → `SITE.booking.blockedDates` e.g. `['2026-08-14']` |
| Colours / type | `assets/styles.css` → `:root` |

## Booking — important limitation
This is a static site with no database, so it **cannot know which dates are already taken**.
The calendar enforces: 48-hour minimum notice, 90-day maximum advance, America/Phoenix time,
and any dates listed in `blockedDates`. **After you accept a booking, add that date to
`blockedDates` and commit.** Until then the date stays selectable. Because bookings are
requests pending deposit, a duplicate request is resolvable when you review it.

## Domain change (pending)
Canonical URLs, `og:url`, `sitemap.xml`, `robots.txt` and `CNAME` currently point to
`yasaymo.com`. When the new domain is connected:
1. Update `SITE.domain` in `assets/config.js`
2. Find-and-replace the old domain across the repo (it appears in each page `<head>`, sitemap, robots, CNAME)
3. Point DNS at GitHub Pages, set the custom domain in Settings → Pages, re-tick Enforce HTTPS
4. On the old domain, replace its DNS records with a single 301 URL Redirect to the new one

## Brand assets
`favicon.svg` (primary), `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
`apple-touch-icon.png` (180px), `og-image.png` (1200x630 social share card).
All generated from the Marcellus wordmark in brand colours — regenerate if the logo changes.

## Before public launch
- [ ] Business email/phone published on Contact (currently form-only)
- [ ] Formspree recipient switched to a dedicated Yasaymo inbox (set in the Formspree dashboard, not in this repo)
- [ ] Privacy / Terms "Last updated" dates set and reviewed
- [ ] Insurance bound before the first job (site makes no insured/bonded claim — do not add one until true)
- [ ] Worker classification decision documented
- [ ] Google Business Profile created under the final name and verified
- [ ] Real photography replacing the current text-only layout

## Claims discipline (do not undo)
No "organic / plant-based / natural / non-toxic / chemical-free / fragrance-free / hypoallergenic /
biodegradable / certified green / hospital-grade" absolutes. No testimonials, ratings, or
guarantees. No published commercial pricing. Residential prices are labelled estimates
everywhere. Booking language stays "request" until the deposit is paid.
