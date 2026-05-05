# Hopeland Website — Project Brief

A single-page marketing website for Hopeland, a software development studio. Modern, dark-themed, professional. To be deployed to Vercel and connected to **hopeland.com.tr**.

This document is the source of truth. Build the site exactly as specified below.

---

## 1. Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (or v3 if v4 setup gets fiddly — both are fine)
- **React 19**
- **Geist** font family (`geist/font/sans` and `geist/font/mono`) — Vercel's font, fits the studio vibe perfectly
- **Resend** SDK (`resend`) for the contact form
- **Lucide React** (`lucide-react`) for icons

Avoid: heavy UI libraries (no Material UI, no Chakra), CMS systems, databases. All content lives in JSX.

---

## 2. Design Direction

**Aesthetic references:** linear.app, vercel.com, raycast.com, reflect.app — dark, monochromatic, generous whitespace, fast, "modern dev studio" vibe.

### Color palette

```
Background:   #0a0a0a   (near black, slight warmth)
Surface:      #111113   (cards, elevated surfaces)
Border:       #1f1f23   (subtle dividers)
Foreground:   #fafafa   (primary text)
Muted:        #71717a   (secondary text, captions)
Subtle:       #a1a1aa   (tertiary text)
Accent:       #fafafa   (white — keep it monochromatic; avoid colored accents)
```

Use opacity variations of white (`text-white/60`, `text-white/40`) for hierarchy rather than introducing new colors.

### Typography

- **Body:** Geist Sans, weight 400, line-height 1.6
- **Headings:** Geist Sans, weight 500-600, tight tracking on large sizes (`tracking-tight` on h1/h2)
- **Hero h1:** very large (`text-6xl md:text-7xl lg:text-8xl`), weight 500, balanced line-breaks
- **Generous letter-spacing on small caps labels** (section headers like "WORK", "SERVICES")

### Layout

- Max content width: `max-w-6xl` (around 1152px)
- Vertical rhythm: large section padding (`py-32` desktop, `py-20` mobile)
- Mobile-first responsive
- Subtle grain/noise texture on hero background (optional, via CSS or SVG) — adds analog warmth to dark theme
- Sticky header with backdrop blur on scroll

### Animations

- Subtle fade-up on scroll (intersection observer or `framer-motion` if installed)
- Smooth scroll for anchor links
- Subtle hover states on cards (border lightening, slight scale)
- Avoid flashy animations — this is B2B portfolio, not creative agency

---

## 3. Site Sections (single page, scroll-based)

### 3.1 Header (sticky)

- Left: **Hopeland** wordmark (text-based logo, weight 600)
- Right: links — Work, Services, Contact
- Smooth-scrolls to sections on click
- Mobile: hamburger → fullscreen overlay menu
- Background: transparent at top, `backdrop-blur` + subtle border-bottom on scroll

### 3.2 Hero

- **Headline (h1):**
  > "Software for ambitious teams."

- **Subheadline:**
  > "Hopeland is a software studio building production-grade systems for construction, healthcare, and AI-driven platforms. Senior engineering, AI-augmented delivery."

- **Primary CTA:** "Start a project" → scrolls to contact section
- **Secondary CTA:** "See our work" → scrolls to work section
- Optional: small "Available for new projects · Q2 2026" status pill above the headline (with green dot)

### 3.3 Services

Section label: **WHAT WE DO**

Three cards (or three-column grid on desktop, stacked on mobile):

1. **Construction Tech**
   Multi-tenant ERPs, field operations platforms, IoT and telemetry integrations for distributed worksites.

2. **Healthcare Tech**
   Care management platforms, compliance-aware systems, distributed clinical and operational workflows.

3. **AI-Driven Platforms**
   Conversational AI, agent-based systems, and intelligent platforms for enterprise and defense applications.

Each card: icon (from Lucide — e.g., `HardHat`, `HeartPulse`, `Sparkles`), title, 2-line description. Subtle border, hover state.

### 3.4 Selected Work

Section label: **SELECTED WORK**

Three project cards (vertical stack on mobile, two-column or full-width on desktop):

#### CareChampion
- **Client:** Digital O'kapi (United Kingdom)
- **Description:** Care home management platform that streamlines resident records, daily care workflows, and staff operations across facilities.
- **Tech:** Web platform, healthcare workflows
- **Link:** carechampion.app

#### Şantiyeler
- **Client:** Glkr (Turkey)
- **Description:** Multi-tenant construction site ERP managing personnel, vehicles, materials, fuel, equipment, and progress billing across worksites. Built for the operational realities of large-scale construction.
- **Tech:** .NET, Angular, Flutter, MSSQL
- **Link:** santiyeler.com.tr

#### Tulpoo
- **Client:** Glkr (Turkey)
- **Description:** AI-powered communication platform currently in active development, designed for the defense industry. Public detail intentionally limited.
- **Tech:** AI / LLM, real-time messaging
- **Link:** tulpoo.com

Each card: placeholder gradient image area (real screenshots will be added later — use a tasteful gradient div for now), client name (small caps muted), title, description, tech tags, "Visit →" link with external arrow.

### 3.5 Approach / Why Hopeland

Section label: **APPROACH**

Heading: "Built by senior engineers, accelerated by AI."

Body paragraph:
> "Hopeland was founded in March 2023 with one principle: every project ships with the discipline of a senior engineering team and the velocity that AI-augmented workflows make possible. We treat clients as long-form partners — not vendor relationships — and stay close to the systems we build."

Bullets (with subtle check or arrow icons):
- 12+ years of senior engineering experience
- AI-augmented development with Claude Code at the core of our workflow
- Long-form partnerships with two anchor clients since launch
- Production systems for distributed field teams, regulated industries, and mission-critical workflows
- Language- and framework-agnostic; we ship what the problem actually needs

### 3.6 Stack

Section label: **STACK**

Heading: "Our core technologies."

Subhead: "We work most often with these — but we're language- and framework-agnostic."

A horizontal row of tech logos/names (Lucide icons + text, or just text with monospace font):
- .NET
- Angular
- Flutter
- MSSQL
- TypeScript
- Node.js
- React
- PostgreSQL

Optionally use the `geist/font/mono` font for the stack names to add a "code" feel.

### 3.7 Contact

Section label: **CONTACT**

Heading: "Have an idea? Let's talk."

Subhead: "Tell us about your project. We'll respond within 1-2 business days."

**Form fields:**
- Name (required, `input`)
- Email (required, `input` type=email)
- Company (optional, `input`)
- Message (required, `textarea`, min 4 rows)
- Submit button: "Send message" (primary, white-on-dark)

**Submission:**
- Use a Next.js Server Action (`app/actions.ts` or co-located in the contact component file with `"use server"` directive)
- Action calls Resend SDK to send email to `info@hopeland.com.tr`
- On success: replace form with a success message ("Thanks — we'll be in touch shortly.")
- On error: show error inline, keep form data intact

**Below the form:**
- Direct contact: `info@hopeland.com.tr` (mailto: link)
- LinkedIn: placeholder URL (user will fill in)
- Location: "Ankara, Turkey · working globally"

### 3.8 Footer

- Left: "Hopeland © 2026"
- Center: "Made in Ankara"
- Right: links — LinkedIn (placeholder), Clutch (placeholder, leave URL empty for now)
- Subtle, small text, muted color

---

## 4. File Structure

```
hopeland-website/
├── app/
│   ├── layout.tsx              # root layout, font setup, metadata
│   ├── page.tsx                # main page composing all sections
│   ├── globals.css             # tailwind + custom CSS vars
│   └── actions.ts              # server action for contact form
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Work.tsx
│   ├── Approach.tsx
│   ├── Stack.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/
│   └── resend.ts               # Resend client instance
├── public/
│   └── (logo, favicon, og-image — placeholders for now)
├── .env.local                  # RESEND_API_KEY=...
├── .env.example                # documents required env vars
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md                   # local dev + deploy notes
```

---

## 5. Contact Form Implementation

### Server Action (`app/actions.ts`)

```typescript
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function sendContactEmail(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const company = formData.get("company")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  try {
    await resend.emails.send({
      // For now, use Resend's onboarding sender. Once the domain is verified
      // in Resend, switch to: "Hopeland <contact@hopeland.com.tr>"
      from: "Hopeland Contact <onboarding@resend.dev>",
      to: ["info@hopeland.com.tr"],
      replyTo: email,
      subject: `New project inquiry from ${name}${company ? ` (${company})` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\n\nMessage:\n${message}`,
    });

    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  } catch (err) {
    console.error("Resend send failed:", err);
    return { status: "error", message: "Something went wrong. Please try again or email us directly." };
  }
}
```

### Form Component

Use `useActionState` (React 19) to bind the form to the server action and render success/error states.

---

## 6. Implementation Steps (suggested order)

1. **Initialize project:**
   ```bash
   npx create-next-app@latest hopeland-website --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"
   cd hopeland-website
   ```
2. **Install dependencies:**
   ```bash
   npm install resend lucide-react geist
   ```
3. **Set up `app/layout.tsx`** with Geist font, dark background, base metadata (title: "Hopeland — Software studio for ambitious teams", description matching hero subheadline).
4. **Build components in order:** Header → Hero → Services → Work → Approach → Stack → Contact → Footer.
5. **Wire up the contact form** with server action + Resend.
6. **Add `.env.example`:** `RESEND_API_KEY=`
7. **Test locally:** `npm run dev` — walk through every section, test the form (it'll fail without API key, that's fine for first pass).
8. **README:** quick start (`npm install`, `.env.local` setup, `npm run dev`), deploy notes pointing to `hopeland-deploy-guide.md`.

---

## 7. Quality Bar

- Lighthouse Performance: 95+
- Accessibility: 95+ (proper alt text, semantic HTML, keyboard navigation, sufficient contrast)
- Mobile: pixel-perfect on iPhone-class viewports (375-430px wide)
- No console errors or warnings in production build (`npm run build`)
- Production build size: keep first-load JS under 150KB if possible

---

## 8. What NOT to do

- No analytics or tracking scripts (will be added later if needed)
- No CMS, no markdown files for content — content lives in component JSX
- No blog section, no team page, no pricing page — single page only
- No animation libraries beyond what's strictly needed
- Don't invent additional sections, services, or projects — only what's listed here
- Don't add filler lorem ipsum — every word should be intentional copy

---

## 9. Notes for the Engineer (Claude Code)

- I (the user) have 12+ years of dev experience and use AI-augmented workflows daily. Write idiomatic, clean Next.js 15 — no unnecessary cleverness, no over-abstraction.
- Comments in code: only where they actually clarify something non-obvious. Don't comment self-explanatory code.
- If something in this brief is genuinely ambiguous, make a reasonable choice and note it in the README. Don't ask before starting — this brief is the contract.
- The deploy is covered in a separate document (`hopeland-deploy-guide.md`). Don't worry about deployment in code; just make sure the project deploys cleanly on Vercel out of the box.
