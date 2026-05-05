import {
  LayoutDashboard,
  Plug,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const capabilities: Capability[] = [
  {
    icon: LayoutDashboard,
    title: "ERP & operations platforms",
    description:
      "Multi-tenant ERPs with role-based dashboards. We sit with every team — owners, managers, the people doing the work — and build the modules the business actually runs on.",
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "E-invoice, payments, IoT telemetry, third-party APIs. We wire your platform into the systems it needs to talk to — internal or external.",
  },
  {
    icon: Globe,
    title: "Marketing & product sites",
    description:
      "Fast, accessible brand and product sites with the same engineering bar — pixel-disciplined, SEO-ready, on-brand.",
  },
  {
    icon: Sparkles,
    title: "AI-driven platforms",
    description:
      "Learning AI infrastructure, conversational systems, intelligent workflows — when AI is the right tool for the problem.",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
            Capabilities
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-medium tracking-tight text-balance max-w-3xl">
            From discovery to delivery.
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/65">
            Bring us a problem. We listen first — to every team that touches
            it — then design, build, and ship the system that fits. Advice,
            development, delivery — under one roof.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 80}>
              <article className="group h-full rounded-2xl border border-border bg-surface/40 p-7 hover:border-white/20 hover:bg-surface/70 transition-colors duration-300">
                <cap.icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-white/85"
                />
                <h3 className="mt-6 text-base font-medium tracking-tight">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {cap.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
