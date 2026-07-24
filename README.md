# White Glove Professional Cleaning — Website

Static multi-page website for White Glove Professional Cleaning (Tucson, AZ).
Built for GitHub Pages with a custom domain — same workflow as jobebiolab.com.

## Structure
- `index.html` — Home
- `/residential-cleaning/` — Residential (recurring, deep, one-time + checklists)
- `/move-in-move-out-cleaning/` — Move cleaning
- `/request-estimate/` — Estimate form (primary conversion page)
- `/faqs/` — FAQ accordion
- `/contact/` — Contact form
- `/privacy/`, `/terms/` — Legal pages
- `/assets/styles.css`, `/assets/site.js` — shared styles & behavior

Design tokens: ivory #FAF7F1 ground, charcoal #26231F type, bronze #A17C46 accent,
sand #E9E2D4 borders. Type: Marcellus (display) + Mulish (body), via Google Fonts.

## Deploy (GitHub Pages)
1. Create repo `white-glove-professional-cleaning` under your GitHub account.
2. Push all files to `main`.
3. Settings → Pages → Deploy from branch → `main` / root.
4. Add custom domain when purchased; site uses root-relative links (`/assets/...`),
   which require a custom domain or user/organization root site — they will NOT
   work at `username.github.io/repo-name/` subpaths.

## Connect the forms (required before launch)
1. Create a NEW Formspree form (do not reuse the Jobe Biolab endpoint) pointed
   at the business email.
2. Replace `YOUR_FORM_ID` in `request-estimate/index.html` and
   `contact/index.html` with the real endpoint.
3. Submit a test on both forms. Until replaced, the form shows a "not connected"
   message instead of silently failing.

## LAUNCH CHECKLIST — the go-live gate
Do not remove the password/development state until every item is resolved:
- [ ] Business phone number + email added to Contact page notice
- [ ] Final domain purchased; canonical URLs updated in every page `<head>`
      (currently set to whitegloveprofessionalcleaning.com — verify availability)
- [ ] Formspree endpoints connected and tested
- [ ] Insurance bound (GL + bond; workers' comp per classification decision)
      — only then may the site add the words "insured" or "bonded"
- [ ] Worker classification decision documented (lawyer)
- [ ] Cancellation & payment policies finalized (update FAQs + Terms)
- [ ] Privacy/Terms "Last updated" dates set; policies reviewed
- [ ] Service areas confirmed as actually serviceable
- [ ] Logo files added if replacing the text treatment
- [ ] Founder section content (optional) — About page not yet built; add later
- [ ] Google Business Profile created AFTER launch details are final

## Deliberately NOT included at v1 (add when operational)
- Commercial / Medical-office / Vacation-rental pages (drafted in the original
  brief; publish only when insurance, training, and capacity exist)
- Pricing page (no prices until finalized — never invent "starting at" prices)
- Reviews section (only real, permissioned reviews)
- Careers page
- Photo upload on forms (omitted until secure handling is established)

## Compliance rules baked into the copy (do not undo)
- No claims of licensed / bonded / insured / certified / background-checked
- No testimonials, ratings, customer counts, or years-of-experience claims
- No pricing, no artificial urgency, no satisfaction-guarantee language
- Exclusions notice on service pages; PHI/sensitive-info warnings on both forms
- Hazard conditions on the estimate form trigger an assessment-required notice
