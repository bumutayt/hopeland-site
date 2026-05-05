# Hopeland Site — AI Context

This file is auto-loaded by Claude Code (and other AI tools that respect `CLAUDE.md`) when you work in this repo. Keep it concise; deep context lives in the docs at the bottom.

@AGENTS.md

---

## About Hopeland

Hopeland is a software studio building production-grade systems for **construction, healthcare, and AI-driven platforms**. Senior engineering, AI-augmented delivery.

> "Hopeland was founded in March 2023 with one principle: every project ships with the discipline of a senior engineering team and the velocity that AI-augmented workflows make possible. We treat clients as long-form partners — not vendor relationships — and stay close to the systems we build."

- 12+ years of senior engineering experience
- AI-augmented development with Claude Code at the core of the workflow
- Long-form partnerships with two anchor clients since launch
- Production systems for distributed field teams, regulated industries, and mission-critical workflows
- Language- and framework-agnostic; we ship what the problem actually needs

Based in Ankara, Turkey · working globally.

---

## Services

1. **Construction Tech** — Multi-tenant ERPs, field operations platforms, IoT and telemetry integrations for distributed worksites.
2. **Healthcare Tech** — Care management platforms, compliance-aware systems, distributed clinical and operational workflows.
3. **AI-Driven Platforms** — Conversational AI, agent-based systems, and intelligent platforms for enterprise and defense applications.

---

## Selected Work

| Project | Client | What it is |
|---|---|---|
| **CareChampion** ([carechampion.app](https://carechampion.app)) | Digital O'kapi (UK) | Care home management platform that streamlines resident records, daily care workflows, and staff operations across facilities. |
| **Şantiyeler** ([santiyeler.com.tr](https://santiyeler.com.tr)) | Glkr (TR) | Multi-tenant construction site ERP managing personnel, vehicles, materials, fuel, equipment, and progress billing across worksites. Built for the operational realities of large-scale construction. Stack: .NET, Angular, Flutter, MSSQL. |
| **Tulpoo** ([tulpoo.com](https://tulpoo.com)) | Glkr (TR) | AI-powered communication platform currently in active development, designed for the defense industry. Public detail intentionally limited. Stack: AI / LLM, real-time messaging. |

---

## Tech Stack

### This site (hopeland-site)
- **Next.js 16** (App Router, server actions) — ⚠️ see `AGENTS.md`, breaking changes from older Next.js
- **React 19** (uses `useActionState`)
- **TypeScript**
- **Tailwind CSS v4**
- **Resend** (mail SDK)
- **Lucide React** (icons)
- **Geist** font

### Studio's working stack (broader than this site)
.NET · Angular · Flutter · MSSQL · TypeScript · Node.js · React · Next.js · Supabase · PostgreSQL

(Language- and framework-agnostic — these are just the most frequent.)

---

## Production Infrastructure

| Component | Service | Detail |
|---|---|---|
| Source | GitHub | `bumutayt/hopeland-site` (private) |
| Hosting | Vercel | project: `hopeland-site` (Hobby tier) |
| Domain | Metunic | `hopeland.com.tr` (apex → www redirect) |
| SSL | Let's Encrypt via Vercel | auto-renewing |
| Mail | Resend | `eu-west-1` (Ireland), domain verified |
| From | `contact@hopeland.com.tr` | (configured in `app/actions.ts`) |
| To | `info@hopeland.com.tr` | (contact form recipient) |

**Deploy flow:** `git push origin main` → GitHub webhook → Vercel build + deploy → live in ~1-2 min.

**Required env vars:**
- `RESEND_API_KEY` — set in `.env.local` (local) and Vercel Environment Variables (production/preview/development).

---

## Code Conventions

- Idiomatic, clean Next.js 16 — no unnecessary cleverness, no over-abstraction.
- Comments **only** where they actually clarify something non-obvious. Don't comment self-explanatory code.
- Server-only secrets (Resend client) live in `lib/` with `"server-only"` import.
- Form submissions use Next.js server actions (`app/actions.ts`), not API routes.
- Content is in component JSX — no CMS, no markdown for site copy.
- Tailwind v4: opacity utilities (`text-white/60`) for hierarchy; avoid introducing new colors.

---

## Key Files

| Path | Purpose |
|---|---|
| `app/page.tsx` | Composes all sections |
| `app/layout.tsx` | Root layout, fonts, metadata |
| `app/actions.ts` | Server action — Resend send |
| `app/globals.css` | Tailwind + CSS vars |
| `components/Contact.tsx` | Contact form (uses `useActionState`) |
| `components/{Hero,Work,Capabilities,Approach,Stack,Footer,Header,Story,ScrollReveal}.tsx` | Section components |
| `lib/resend.ts` | Resend client (`server-only`, reads `RESEND_API_KEY`) |
| `.env.example` | Template (commit-safe) |
| `.env.local` | Real secret (gitignored) |

---

## Related Docs (in this repo)

- **`BRIEF.md`** — Original full project brief: design system, copy, sections, quality bar, what NOT to do. The source of truth for any visual/content decision.
- **`DEPLOY.md`** — Deployment guide: GitHub → Vercel → Metunic DNS → SSL. Step-by-step for first-time deploy.
- **`WINDOWS-SETUP.md`** — Windows dev environment migration guide: how to clone and run this project on a fresh Windows PC.
- **`I18N-PLAN.md`** — TR + EN language support plan (NOT yet implemented). Read this before adding i18n.
- **`AGENTS.md`** — Reminder that Next.js 16 has breaking changes; check `node_modules/next/dist/docs/` before writing Next.js code.

---

## Pending Work / Roadmap

- [ ] **TR + EN language support** (high priority). Browser-language detection for the first-visit default, but with a visible TR / EN toggle in the header that the user can switch any time. Full plan + translation seeds + code patterns are in `I18N-PLAN.md`. When picking this up, read that file first; everything is ready to execute.
- [ ] Replace project card placeholders in `components/Work.tsx` with real screenshots (target: `public/work/*.png`)
- [ ] LinkedIn URL — placeholder right now in `components/Contact.tsx` (commented out) and `components/Footer.tsx`. Fill in once the company page is live.
- [ ] Logo SVG (currently using `public/hlnd-logo.png` — vectorize it)
- [ ] Favicon & OpenGraph image (`app/icon.png`, `app/opengraph-image.png` — 1200×630 for OG)

---

## Things NOT to do (from BRIEF.md, summarized)

- No analytics or tracking scripts (will be added later if needed)
- No CMS — all site copy lives in JSX
- No blog, team, or pricing page — single page only
- No filler lorem ipsum
- Don't invent additional services or projects beyond what's listed in BRIEF.md
- No heavy UI libraries (Material UI, Chakra) or animation libraries beyond what's strictly needed
