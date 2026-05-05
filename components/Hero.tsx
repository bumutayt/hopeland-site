import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate overflow-hidden pt-40 pb-32 md:pt-56 md:pb-40"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs tracking-wider text-white/70 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Available for new projects · Q2 2026
          </div>

          <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.02] text-balance">
            Software for{" "}
            <span className="text-white/60">ambitious teams.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-white/60">
            Hopeland Developers is a software studio shipping
            production-grade systems across construction, healthcare, and
            AI platforms. Senior engineering, flexible delivery —
            full-stack or specialized.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Start a project
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white hover:border-white/30 transition-colors"
            >
              See our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
