import { ScrollReveal } from "./ScrollReveal";

const stats = [
  { value: "3", label: "Flagship products" },
  { value: "7+", label: "Supporting integrations" },
  { value: "3", label: "Marketing sites" },
];

export function Story() {
  return (
    <section id="story" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
              Story
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
              Since March 2023, turning client visions into shipped products.
            </h2>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={80}>
            <p className="text-base md:text-lg leading-relaxed text-white/75">
              Hopeland Developers is anchored on 12+ years of hands-on
              engineering experience. We listen first, design the engagement
              around the problem, and bring in trusted partners when a project
              needs a larger team. Whether you need a full-stack delivery — or
              just front-end, back-end, or mobile — we ship production-grade
              work, traditional or AI-driven, with the same craft.
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-border pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl md:text-3xl font-medium tracking-tight">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-xs sm:text-sm leading-relaxed text-white/55">
                    {stat.label}
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
