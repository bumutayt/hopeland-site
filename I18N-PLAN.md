# I18N Plan — TR + EN Language Support

**Status:** planned, not yet implemented. Pick this up on the Windows dev machine.

**Goal:** Add Turkish and English language support to the site.

- **First-time visitor:** sees the language matching their browser's `Accept-Language` (Turkish browsers → Turkish; everyone else → English). This is the *default*, NOT silently locking the user in.
- **Header has a TR / EN toggle** — visible at all times, top right. User clicks, page switches language instantly, URL updates, choice persists via cookie.
- **URL reflects the locale** — `/tr/...` and `/en/...`.

So "automatic" only applies to the *first-visit default*. After that, the toggle is what the user uses, every time.

**Estimated effort:** 1–2 hours with Claude Code doing the heavy lifting.

---

## 1. Approach

- **Library:** [`next-intl`](https://next-intl-docs.vercel.app/) — the standard for Next.js App Router i18n. Type-safe, ~6kb runtime, built-in routing helpers.
- **Strategy:** localized routing. Every page lives under `/[locale]/...`. Locale segment is part of the URL.
- **Locales:** `tr`, `en`. Default detection by `Accept-Language` (no fixed default — both are first-class).
- **URL structure:**
  - `/tr` → Turkish home
  - `/en` → English home
  - `/` → middleware redirects to `/tr` or `/en` based on `Accept-Language` (Turkish browsers → `/tr`, others → `/en`)
- **Persistence:** locale cookie set after first visit. User's manual toggle overrides browser default and persists.
- **SEO:** each locale page sets correct `<html lang>`, `<link rel="alternate" hreflang>`, OpenGraph locale.

---

## 2. File Structure (after migration)

```
hopeland-website/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # locale-aware layout (sets <html lang>)
│   │   ├── page.tsx            # composes sections, passes translations
│   │   ├── actions.ts          # MOVE here from app/, use locale-aware subjects/text
│   │   └── globals.css         # MOVE here (or keep at app/, both work)
│   └── layout.tsx              # REMOVE (moved into [locale])
├── messages/
│   ├── tr.json                 # Turkish dictionary
│   └── en.json                 # English dictionary
├── i18n/
│   ├── routing.ts              # locales array, defaultLocale, pathnames
│   └── request.ts              # getRequestConfig (loads messages per request)
├── middleware.ts               # NEW — handles locale detection + routing
├── next.config.ts              # add createNextIntlPlugin wrapper
└── components/                 # all components updated to use useTranslations()
```

---

## 3. Setup Steps

### 3.1 Install

```bash
npm install next-intl
```

### 3.2 Create `i18n/routing.ts`

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "en",          // fallback only; middleware does Accept-Language detection
  localePrefix: "always",       // both locales get a URL prefix (/tr, /en)
});
```

### 3.3 Create `i18n/request.ts`

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "tr" | "en")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 3.4 Create `middleware.ts` (project root)

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(tr|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
```

`next-intl` middleware reads `Accept-Language`, picks a supported locale, sets the `NEXT_LOCALE` cookie, and redirects `/` → `/tr` or `/en` accordingly. After first visit the cookie sticks.

### 3.5 Update `next.config.ts`

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // existing config…
};

export default withNextIntl(nextConfig);
```

### 3.6 Move `app/layout.tsx` → `app/[locale]/layout.tsx`

Set `<html lang={locale}>`, wrap children in `<NextIntlClientProvider>`:

```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "tr" | "en")) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className="…existing classes">
      <body className="…">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Move `app/page.tsx` → `app/[locale]/page.tsx`. No code changes needed there beyond using `useTranslations()` (or `getTranslations()` for server components) inside section components.

### 3.7 Update `app/actions.ts`

The contact server action needs locale-aware email subject/body text. Easiest: accept locale as a hidden form field or read it from cookies. Concrete change:

- Add `<input type="hidden" name="locale" value={locale} />` in `Contact.tsx`
- In `sendContactEmail`, read `formData.get("locale")` and pick subject/error strings from `messages/<locale>.json` (server-side import, not via hook)

---

## 4. Component Refactor Map

Every component below has hard-coded copy that must move to `messages/{tr,en}.json`. Keys grouped by component:

| Component | Translation namespace | Strings to extract |
|---|---|---|
| `Header.tsx` | `header` | "Capabilities", "Work", "Contact" + new `langToggle` button label |
| `Hero.tsx` | `hero` | status pill, h1, subheadline, "Start a project", "See our work" |
| `Work.tsx` | `work` | section label "SELECTED WORK", project descriptions (3) |
| `Capabilities.tsx` | `capabilities` | section label, 3 service cards (title + description) |
| `Approach.tsx` | `approach` | section label, heading, body paragraph, 5 bullets |
| `Stack.tsx` | `stack` | section label, heading, subhead (tech names stay as-is) |
| `Story.tsx` (if used) | `story` | (whatever copy lives there) |
| `Contact.tsx` | `contact` | section label, heading, subhead, field labels, button, success/error messages |
| `Footer.tsx` | `footer` | "© 2026", "Made in Ankara", link labels |
| `app/actions.ts` | `email` | email subject template, success/error messages |

---

## 5. Translation Seed (starter content)

Use these as the initial dictionary; refine wording in Windows once you see them in context. **Keep it tight — same tone as English source: confident, professional, no filler.**

### `messages/en.json`

```json
{
  "header": {
    "capabilities": "Capabilities",
    "work": "Work",
    "contact": "Contact"
  },
  "hero": {
    "statusPill": "AVAILABLE FOR NEW PROJECTS · Q2 2026",
    "headline1": "Software for",
    "headline2": "ambitious teams.",
    "subheadline": "Hopeland Developers is a software studio shipping production-grade systems across construction, healthcare, and AI platforms. Senior engineering, flexible delivery — full-stack or specialized.",
    "ctaPrimary": "Start a project",
    "ctaSecondary": "See our work"
  },
  "capabilities": {
    "label": "What we do",
    "items": {
      "construction": {
        "title": "Construction Tech",
        "description": "Multi-tenant ERPs, field operations platforms, IoT and telemetry integrations for distributed worksites."
      },
      "healthcare": {
        "title": "Healthcare Tech",
        "description": "Care management platforms, compliance-aware systems, distributed clinical and operational workflows."
      },
      "ai": {
        "title": "AI-Driven Platforms",
        "description": "Conversational AI, agent-based systems, and intelligent platforms for enterprise and defense applications."
      }
    }
  },
  "work": {
    "label": "Selected work",
    "items": {
      "carechampion": {
        "client": "Digital O'kapi · United Kingdom",
        "description": "Care home management platform that streamlines resident records, daily care workflows, and staff operations across facilities."
      },
      "santiyeler": {
        "client": "Glkr · Turkey",
        "description": "Multi-tenant construction site ERP managing personnel, vehicles, materials, fuel, equipment, and progress billing across worksites. Built for the operational realities of large-scale construction."
      },
      "tulpoo": {
        "client": "Glkr · Turkey",
        "description": "AI-powered communication platform currently in active development, designed for the defense industry. Public detail intentionally limited."
      }
    },
    "visit": "Visit"
  },
  "approach": {
    "label": "Approach",
    "heading": "Built by senior engineers, accelerated by AI.",
    "body": "Hopeland was founded in March 2023 with one principle: every project ships with the discipline of a senior engineering team and the velocity that AI-augmented workflows make possible. We treat clients as long-form partners — not vendor relationships — and stay close to the systems we build.",
    "bullets": [
      "12+ years of senior engineering experience",
      "AI-augmented development with Claude Code at the core of our workflow",
      "Long-form partnerships with two anchor clients since launch",
      "Production systems for distributed field teams, regulated industries, and mission-critical workflows",
      "Language- and framework-agnostic; we ship what the problem actually needs"
    ]
  },
  "stack": {
    "label": "Stack",
    "heading": "Our core technologies.",
    "subhead": "We work most often with these — but we're language- and framework-agnostic."
  },
  "contact": {
    "label": "Contact",
    "heading": "Have an idea? Let's talk.",
    "subhead": "Tell us about your project — full-stack delivery or just front-end, back-end, or mobile. We'll respond within 1–2 business days.",
    "fields": {
      "name": "Name",
      "email": "Email",
      "company": "Company",
      "message": "Message"
    },
    "send": "Send message",
    "sending": "Sending...",
    "success": {
      "title": "Message received.",
      "body": "Thanks — we'll be in touch shortly."
    },
    "errors": {
      "missingFields": "Please fill in all required fields.",
      "generic": "Something went wrong. Please try again or email us directly."
    },
    "location": "Ankara, Turkey · working globally"
  },
  "footer": {
    "copyright": "Hopeland Developers © 2026",
    "madeIn": "Made in Ankara"
  },
  "email": {
    "subject": "New project inquiry from {name}{companyPart}",
    "companyPart": " ({company})",
    "bodyTemplate": "Name: {name}\nEmail: {email}\nCompany: {company}\n\nMessage:\n{message}"
  }
}
```

### `messages/tr.json`

```json
{
  "header": {
    "capabilities": "Yetkinlikler",
    "work": "Projeler",
    "contact": "İletişim"
  },
  "hero": {
    "statusPill": "YENİ PROJELERE AÇIĞIZ · 2026 2.ÇEYREK",
    "headline1": "İddialı ekipler için",
    "headline2": "yazılım.",
    "subheadline": "Hopeland Developers; inşaat, sağlık ve yapay zekâ platformlarında üretim seviyesinde sistemler kuran bir yazılım stüdyosudur. Kıdemli mühendislik, esnek teslimat — full-stack veya alanında uzmanlaşmış.",
    "ctaPrimary": "Projeye başla",
    "ctaSecondary": "Çalışmalarımızı gör"
  },
  "capabilities": {
    "label": "Ne yapıyoruz",
    "items": {
      "construction": {
        "title": "İnşaat Teknolojileri",
        "description": "Çok kiracılı ERP sistemleri, saha operasyon platformları, dağıtık şantiyeler için IoT ve telemetri entegrasyonları."
      },
      "healthcare": {
        "title": "Sağlık Teknolojileri",
        "description": "Bakım yönetim platformları, mevzuat uyumlu sistemler, dağıtık klinik ve operasyonel iş akışları."
      },
      "ai": {
        "title": "Yapay Zekâ Platformları",
        "description": "Konuşma temelli yapay zekâ, ajan tabanlı sistemler ve kurumsal ile savunma uygulamaları için akıllı platformlar."
      }
    }
  },
  "work": {
    "label": "Seçilmiş projeler",
    "items": {
      "carechampion": {
        "client": "Digital O'kapi · Birleşik Krallık",
        "description": "Bakım evi yönetim platformu; sakin kayıtlarını, günlük bakım iş akışlarını ve tesisler arası personel operasyonlarını tek noktadan yönetir."
      },
      "santiyeler": {
        "client": "Glkr · Türkiye",
        "description": "Personel, araç, malzeme, yakıt, ekipman ve hakediş süreçlerini şantiyeler arası yöneten çok kiracılı inşaat ERP'si. Büyük ölçekli inşaatın operasyonel gerçeklerine göre tasarlandı."
      },
      "tulpoo": {
        "client": "Glkr · Türkiye",
        "description": "Aktif geliştirme aşamasında, savunma sanayisi için tasarlanmış yapay zekâ destekli iletişim platformu. Detay paylaşımı sınırlı tutulmuştur."
      }
    },
    "visit": "Ziyaret et"
  },
  "approach": {
    "label": "Yaklaşım",
    "heading": "Kıdemli mühendislerin ürettiği, yapay zekâyla hızlandırılan yazılım.",
    "body": "Hopeland, Mart 2023'te tek bir ilkeyle kuruldu: her proje, kıdemli bir mühendislik ekibinin disiplini ve yapay zekâ destekli iş akışlarının sağladığı hızla teslim edilir. Müşterileri uzun vadeli partner olarak görüyoruz — tedarikçi ilişkisi değil — ve kurduğumuz sistemlere yakın duruyoruz.",
    "bullets": [
      "12+ yıllık kıdemli mühendislik deneyimi",
      "İş akışının merkezinde Claude Code ile yapay zekâ destekli geliştirme",
      "Kuruluştan beri iki ana müşteriyle uzun soluklu ortaklık",
      "Dağıtık saha ekipleri, düzenlemeli sektörler ve kritik iş akışları için üretim seviyesinde sistemler",
      "Dil ve framework bağımsız; problemin gerçekten ihtiyaç duyduğunu üretiyoruz"
    ]
  },
  "stack": {
    "label": "Teknoloji",
    "heading": "Temel teknolojilerimiz.",
    "subhead": "En sık bunlarla çalışıyoruz — ama dil ve framework bağımsızız."
  },
  "contact": {
    "label": "İletişim",
    "heading": "Bir fikriniz mi var? Konuşalım.",
    "subhead": "Projenizi anlatın — full-stack teslimat veya sadece front-end, back-end ya da mobil. 1–2 iş günü içinde dönüş yaparız.",
    "fields": {
      "name": "İsim",
      "email": "E-posta",
      "company": "Şirket",
      "message": "Mesaj"
    },
    "send": "Mesajı gönder",
    "sending": "Gönderiliyor...",
    "success": {
      "title": "Mesaj alındı.",
      "body": "Teşekkürler — kısa süre içinde dönüş yapacağız."
    },
    "errors": {
      "missingFields": "Lütfen zorunlu alanları doldurun.",
      "generic": "Bir şeyler ters gitti. Tekrar deneyin veya doğrudan e-posta gönderin."
    },
    "location": "Ankara, Türkiye · küresel olarak çalışıyoruz"
  },
  "footer": {
    "copyright": "Hopeland Developers © 2026",
    "madeIn": "Ankara'da yapıldı"
  },
  "email": {
    "subject": "Yeni proje talebi: {name}{companyPart}",
    "companyPart": " ({company})",
    "bodyTemplate": "İsim: {name}\nE-posta: {email}\nŞirket: {company}\n\nMesaj:\n{message}"
  }
}
```

> Türkçe metinleri Windows'ta kontrol et — özellikle hero ve approach'taki ton, marka diline uygun mu? Şu an muhafazakar, profesyonel bir çeviri yaptım. "İddialı ekipler" yerine "tutkulu ekipler", "kararlı ekipler" gibi alternatifler düşünülebilir.

---

## 6. Component Code Pattern

### Server component (default in App Router)

```tsx
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section>
      <p className="status-pill">{t("statusPill")}</p>
      <h1>
        {t("headline1")}
        <br />
        {t("headline2")}
      </h1>
      <p className="subheadline">{t("subheadline")}</p>
      <div>
        <a href="#contact">{t("ctaPrimary")}</a>
        <a href="#work">{t("ctaSecondary")}</a>
      </div>
    </section>
  );
}
```

### Client component (uses `"use client"`)

```tsx
"use client";
import { useTranslations } from "next-intl";

export function Contact() {
  const t = useTranslations("contact");
  // ... use t("heading"), t("fields.name"), etc.
}
```

### Iterating over arrays/objects

For `approach.bullets` (array):
```tsx
const t = useTranslations("approach");
const bullets = t.raw("bullets") as string[];
```

For `capabilities.items` (object with named keys):
```tsx
const items = ["construction", "healthcare", "ai"] as const;
{items.map((key) => (
  <Card
    key={key}
    title={t(`items.${key}.title`)}
    description={t(`items.${key}.description`)}
  />
))}
```

---

## 7. Header Language Toggle

Add to `Header.tsx`:

```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

function LangToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (newLocale: "tr" | "en") => {
    // pathname is "/tr/..." or "/en/..." — replace the locale segment
    const newPath = pathname.replace(/^\/(tr|en)/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-1 text-xs">
      <button
        onClick={() => switchTo("en")}
        className={locale === "en" ? "text-white" : "text-white/40"}
      >
        EN
      </button>
      <span className="text-white/20">/</span>
      <button
        onClick={() => switchTo("tr")}
        className={locale === "tr" ? "text-white" : "text-white/40"}
      >
        TR
      </button>
    </div>
  );
}
```

Place it in the header next to the nav links. Style minimal — small monospace, two-letter codes, current one bright.

---

## 8. Server Action Update (`actions.ts`)

Move to `app/[locale]/actions.ts` (or keep at `app/actions.ts` and pass locale). Read locale, load message file, format strings:

```ts
"use server";
import { resend } from "@/lib/resend";

const messages = {
  tr: () => import("@/messages/tr.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
} as const;

export async function sendContactEmail(prevState, formData) {
  const locale = (formData.get("locale")?.toString() ?? "en") as "tr" | "en";
  const m = (await messages[locale]()).email;
  // ... use m.subject, m.bodyTemplate with replacements
  // For success/error messages, also load contact.success / contact.errors from same file
}
```

Hidden field in `Contact.tsx`:
```tsx
const locale = useLocale();
// inside <form>:
<input type="hidden" name="locale" value={locale} />
```

---

## 9. SEO

In `app/[locale]/layout.tsx`:

```tsx
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://hopeland.com.tr/${locale}`,
      languages: {
        en: "https://hopeland.com.tr/en",
        tr: "https://hopeland.com.tr/tr",
      },
    },
    openGraph: {
      locale: locale === "tr" ? "tr_TR" : "en_US",
      // ...
    },
  };
}
```

Add `meta` namespace to dictionaries:
```json
"meta": {
  "title": "Hopeland Developers — Software studio for ambitious teams",
  "description": "..."
}
```

---

## 10. Verification Checklist

- [ ] `https://hopeland.com.tr/` redirects to `/tr` for Turkish browsers, `/en` for others
- [ ] Header EN/TR toggle switches without page reload jank, URL updates
- [ ] All section copy renders correctly in both locales (no missing keys, no English bleeding into Turkish or vice versa)
- [ ] Contact form submits with locale-correct subject and success message
- [ ] `<html lang="...">` matches the URL locale
- [ ] `View source` shows correct `<link rel="alternate" hreflang>` tags
- [ ] Lighthouse SEO still 95+ on both `/tr` and `/en`
- [ ] No console errors or missing-key warnings (`next-intl` warns loudly when keys are missing)

---

## 11. Common Pitfalls

- **Forgetting to wrap a component in client/server pattern correctly.** If you call `useTranslations` in a server component you'll get an error — use `getTranslations` instead.
- **Middleware matcher excluding routes.** If a route returns 404 after migration, check `middleware.ts` matcher pattern.
- **Locale-aware metadata.** The `generateMetadata` export goes in `app/[locale]/layout.tsx`, not `app/layout.tsx` (which no longer exists in this setup).
- **Email subject hardcoded in `actions.ts`.** Forget to make this locale-aware and Turkish-form submissions get English subject lines.
- **Cookie strategy for the toggle.** `next-intl`'s `localePrefix: "always"` means the toggle just changes the URL — the locale cookie is set automatically by middleware. Don't manually manage the cookie.

---

## 12. After Implementation

- Update `CLAUDE.md`: add `i18n/`, `messages/`, `middleware.ts` to "Key Files"; mention TR/EN support in production infrastructure section.
- Update `README.md` quick-start: mention default route is locale-prefixed.
- Optionally add `docs/i18n-glossary.md` if marketing terminology needs consistent translations across both languages.
