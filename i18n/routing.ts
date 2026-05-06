import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  // Fallback only — middleware uses the visitor's Accept-Language header to
  // pick a real default. After first visit, the cookie persists their choice.
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
