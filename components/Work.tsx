import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

type Project = {
  client: string;
  country: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

const projects: Project[] = [
  {
    client: "Digital O'kapi",
    country: "United Kingdom",
    title: "CareChampion",
    description:
      "Mobile-friendly care home management web platform that streamlines resident records, daily care workflows, and staff operations across facilities.",
    tech: ["Angular", ".NET Core", "SQL Server"],
    href: "https://carechampion.app",
    linkLabel: "carechampion.app",
    image: "/work/carechampion.jpg",
    imageAlt: "CareChampion product preview",
    imagePosition: "object-right-top",
  },
  {
    client: "Glkr",
    country: "Turkey",
    title: "Şantiyeler",
    description:
      "Multi-tenant construction site ERP — web plus dedicated mobile apps with role-based dashboards — managing personnel, vehicles, materials, fuel, equipment, and progress billing across worksites.",
    tech: [".NET Core", "Angular", "Flutter", "SQL Server"],
    href: "https://santiyeler.com.tr",
    linkLabel: "santiyeler.com.tr",
    image: "/work/santiyeler.jpg",
    imageAlt: "Şantiyeler product preview",
    imagePosition: "object-center",
  },
  {
    client: "Glkr",
    country: "Turkey",
    title: "Tulpoo",
    description:
      "Communication platform — web and mobile — built on a learning AI infrastructure for the defense industry, with role-specific dashboards. Public detail intentionally limited.",
    tech: ["Next.js", "Supabase", "AI / LLM"],
    href: "https://tulpoo.com",
    linkLabel: "tulpoo.com",
    image: "/work/tulpoo.jpg",
    imageAlt: "Tulpoo product preview",
    imagePosition: "object-center",
  },
];

export function Work() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
            Selected work
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-balance max-w-2xl">
            Production systems, shipped.
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 80}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 overflow-hidden hover:border-white/20 transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/2] border-b border-border bg-surface overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                    className={`object-cover ${project.imagePosition ?? "object-center"} transition-transform duration-500 group-hover:scale-[1.02]`}
                    priority={i === 0}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                    {project.client} · {project.country}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-mono tracking-tight text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm text-white/85 group-hover:text-white transition-colors">
                    {project.linkLabel}
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
