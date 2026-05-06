import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

export function Approach() {
  const t = useTranslations("approach");
  const bullets = t.raw("bullets") as string[];

  return (
    <section id="approach" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              {t("label")}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
              {t("heading")}
            </h2>
          </ScrollReveal>

          <div className="lg:col-span-7">
            <ScrollReveal delay={80}>
              <p className="text-base md:text-lg leading-relaxed text-white/70">
                {t("body")}
              </p>
            </ScrollReveal>

            <ul className="mt-10 space-y-4">
              {bullets.map((b, i) => (
                <ScrollReveal key={b} as="li" delay={120 + i * 60}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80">
                      <Check size={12} strokeWidth={2.25} />
                    </span>
                    <span className="text-sm md:text-base leading-relaxed text-white/75">
                      {b}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
