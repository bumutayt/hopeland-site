import {
  LayoutDashboard,
  Plug,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

const itemKeys = ["erp", "integrations", "marketing", "ai"] as const;
const icons: Record<(typeof itemKeys)[number], LucideIcon> = {
  erp: LayoutDashboard,
  integrations: Plug,
  marketing: Globe,
  ai: Sparkles,
};

export function Capabilities() {
  const t = useTranslations("capabilities");

  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
            {t("label")}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-balance max-w-3xl">
            {t("heading")}
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/65">
            {t("intro")}
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {itemKeys.map((key, i) => {
            const Icon = icons[key];
            return (
              <ScrollReveal key={key} delay={i * 80}>
                <article className="group h-full rounded-2xl border border-border bg-surface/40 p-7 hover:border-white/20 hover:bg-surface/70 transition-colors duration-300">
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-white/85"
                  />
                  <h3 className="mt-6 text-base font-medium tracking-tight">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {t(`items.${key}.description`)}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
