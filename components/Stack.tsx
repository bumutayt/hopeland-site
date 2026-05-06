import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

const stack = [
  ".NET Core",
  "Angular",
  "Flutter",
  "SQL Server",
  "TypeScript",
  "Node.js",
  "React",
  "Next.js",
  "Supabase",
  "PostgreSQL",
];

export function Stack() {
  const t = useTranslations("stack");

  return (
    <section id="stack" className="py-24 md:py-32 border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
            {t("label")}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-balance max-w-2xl">
            {t("heading")}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55">
            {t("subhead")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <ul className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm md:text-base text-white/55">
            {stack.map((name, i) => (
              <li key={name} className="flex items-center gap-x-6">
                <span className="hover:text-white transition-colors">
                  {name}
                </span>
                {i < stack.length - 1 && (
                  <span aria-hidden className="text-white/15">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
