# Hopeland Website

Single-page marketing site for **Hopeland Developers** — a software studio shipping production-grade systems across construction, healthcare, and AI platforms. Senior engineering, flexible delivery — full-stack or specialized (front-end, back-end, mobile). Live at [hopeland.com.tr](https://hopeland.com.tr).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Geist, Lucide React, and Resend.

---

## Local development

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable          | Required | Notes                                                                                  |
| ----------------- | -------- | -------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`  | yes      | Used by the contact form server action. Get one at [resend.com](https://resend.com).   |

The contact form will fail silently in dev without a key — the rest of the site renders fine.

---

## Project structure

```
app/
  layout.tsx        # Root layout, Geist font, metadata
  page.tsx          # Section composition
  globals.css       # Tailwind v4 + theme tokens + base styles
  actions.ts        # sendContactEmail server action (Resend)
components/
  Header.tsx        # Sticky nav, mobile fullscreen menu
  Hero.tsx
  Services.tsx
  Work.tsx
  Approach.tsx
  Stack.tsx
  Contact.tsx       # useActionState-bound form
  Footer.tsx
  ScrollReveal.tsx  # IntersectionObserver fade-up wrapper
lib/
  resend.ts         # Resend client (server-only)
```

All site copy lives in component JSX — there is no CMS.

---

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)      |
| `npm run build` | Production build                      |
| `npm run start` | Run the production build              |
| `npm run lint`  | ESLint                                |

---

## Deployment

Deploy to Vercel and connect `hopeland.com.tr`. The full step-by-step guide (GitHub push → Vercel project → Resend setup → DNS at Metunic → SSL → optional Resend domain verification) is in **[`hopeland-deploy-guide.md`](../hopeland-deploy-guide.md)** at the repository root.

Outline:

1. Push the repo to GitHub.
2. Import into Vercel — framework auto-detected as Next.js.
3. Set `RESEND_API_KEY` in Vercel env vars (Production + Preview + Development).
4. Add `hopeland.com.tr` and `www.hopeland.com.tr` in Vercel → Domains.
5. Add the Vercel A record + CNAME at the registrar (Metunic) — keep the existing MX/SPF/DKIM/DMARC for mail.
6. Wait for DNS to propagate. SSL is automatic.
7. (Optional) Verify the domain in Resend so emails go from `contact@hopeland.com.tr`; then update the `from` field in `app/actions.ts`.

---

## Notes & known placeholders

- **LinkedIn / Clutch URLs** in `Footer.tsx` and `Contact.tsx` are `#` placeholders — fill in once the company pages exist.
- **Logo, favicon, OG image** are not yet committed. Drop a `public/logo.svg`, `app/icon.png`, and `app/opengraph-image.png` when ready.
- **Work card visuals** are CSS gradient placeholders. Replace with real screenshots in `public/work/` and update `components/Work.tsx`.
- The form's `from` address is `onboarding@resend.dev` until the domain is verified in Resend (see deploy guide step 8).
