import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

const projectKeys = ["carechampion", "santiyeler", "tulpoo"] as const;

type ProjectMeta = {
  title: string;
  tech: string[];
  href: string;
  linkLabel: string;
  image: string;
  imagePosition?: string;
};

const projectMeta: Record<(typeof projectKeys)[number], ProjectMeta> = {
  carechampion: {
    title: "CareChampion",
    tech: ["Angular", ".NET Core", "SQL Server"],
    href: "https://carechampion.app",
    linkLabel: "carechampion.app",
    image: "/work/carechampion.jpg",
    imagePosition: "object-right-top",
  },
  santiyeler: {
    title: "Şantiyeler",
    tech: [".NET Core", "Angular", "Flutter", "SQL Server"],
    href: "https://santiyeler.com.tr",
    linkLabel: "santiyeler.com.tr",
    image: "/work/santiyeler.jpg",
    imagePosition: "object-center",
  },
  tulpoo: {
    title: "Tulpoo",
    tech: ["Next.js", "Supabase", "AI / LLM"],
    href: "https://tulpoo.com",
    linkLabel: "tulpoo.com",
    image: "/work/tulpoo.jpg",
    imagePosition: "object-center",
  },
};

export function Work() {
  const t = useTranslations("work");

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
            {t("label")}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-balance max-w-2xl">
            {t("heading")}
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectKeys.map((key, i) => {
            const meta = projectMeta[key];
            return (
              <ScrollReveal key={key} delay={i * 80}>
                <a
                  href={meta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 overflow-hidden hover:border-white/20 transition-colors duration-300"
                >
                  <div className="relative w-full aspect-[3/2] border-b border-border bg-surface overflow-hidden">
                    <Image
                      src={meta.image}
                      alt={t(`items.${key}.imageAlt`)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                      className={`object-cover ${meta.imagePosition ?? "object-center"} transition-transform duration-500 group-hover:scale-[1.02]`}
                      priority={i === 0}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                      {t(`items.${key}.client`)} ·{" "}
                      {t(`items.${key}.country`)}
                    </p>
                    <h3 className="mt-3 text-xl font-medium tracking-tight">
                      {meta.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      {t(`items.${key}.description`)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {meta.tech.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-mono tracking-tight text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm text-white/85 group-hover:text-white transition-colors">
                      {meta.linkLabel}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
