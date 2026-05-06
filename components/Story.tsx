import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

const statKeys = ["products", "integrations", "marketing"] as const;
const statValues: Record<(typeof statKeys)[number], string> = {
  products: "3",
  integrations: "7+",
  marketing: "3",
};

export function Story() {
  const t = useTranslations("story");

  return (
    <section id="story" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
              {t("label")}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
              {t("heading")}
            </h2>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={80}>
            <p className="text-base md:text-lg leading-relaxed text-white/75">
              {t("body")}
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-border pt-8">
              {statKeys.map((key) => (
                <div key={key}>
                  <dt className="text-2xl md:text-3xl font-medium tracking-tight">
                    {statValues[key]}
                  </dt>
                  <dd className="mt-2 text-xs sm:text-sm leading-relaxed text-white/55">
                    {t(`stats.${key}`)}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
