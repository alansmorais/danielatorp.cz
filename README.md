# Daniela Torp – Intimita v souvislostech

Modern React + TypeScript application rewritten from the original static/Dynamic site, preserving all original branding, styling, content, 6 pillars of intimacy, workshops catalog, personal consultation offerings, blog, interactive dialogs, and anti-spam contact form.

## Tech Stack
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Standard CSS Design System with exact typography, color scheme, responsive grid, and animations
- **Features**:
  - **Domů**: Hero with dynamic event dates loaded from Google Apps Script endpoint with fallbacks, 6 pillars preview grid, "Kdo je Daniela" story, featured workshops, and contact form.
  - **6 Pilířů Intimity**: Comprehensive dedicated guide to all 6 pillars of intimacy with somatic descriptions and direct consultation booking.
  - **Workshopy**: Full catalog of all 9 specialized workshops with detailed curricula, seasonal retreats (Imbolc, Beltane, Lughnasad, Samhain), dates, pricing, and guidelines.
  - **Osobní konzultace**: 1-on-1 and couples session details, somatic bodywork, teaching packages, and online consultations.
  - **Blog**: Articles ("Můj příběh", "Projekt: Dítě") with reading modal.
  - **Storno podmínky & GDPR**: Integrated interactive modals with full policy text.
  - **Spam-Protected Contact Form**: Mathematical captcha verification (1+1=2), honeypot filter, and submission handling.

## Development & Build
- `npm run dev`: Starts the Vite development server on `http://0.0.0.0:3000`
- `npm run build`: Type-checks and builds the production bundle in `dist/`
