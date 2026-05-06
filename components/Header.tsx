"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/i18n/routing";

const navIds = ["capabilities", "work", "contact"] as const;

function Wordmark() {
  const t = useTranslations("header");
  return (
    <a
      href="#top"
      className="inline-flex items-center gap-2.5 text-foreground"
      aria-label={t("homeAriaLabel")}
    >
      <Image
        src="/hlnd-logo.png"
        alt=""
        width={242}
        height={113}
        priority
        className="h-6 w-auto"
      />
      <span className="font-medium tracking-tight text-sm text-white/90">
        {t("wordmark")}
      </span>
    </a>
  );
}

function LangToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    // pathname starts with /<locale>/... — replace the segment
    const newPath = pathname.replace(/^\/(en|tr)(?=\/|$)/, `/${next}`);
    router.push(newPath);
  };

  return (
    <div
      role="group"
      aria-label={t("switchLabel")}
      className="inline-flex items-center gap-1 font-mono text-xs"
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={`px-1 transition-colors ${
          locale === "en" ? "text-white" : "text-white/40 hover:text-white/70"
        }`}
      >
        {t("en")}
      </button>
      <span aria-hidden className="text-white/15">
        /
      </span>
      <button
        type="button"
        onClick={() => switchTo("tr")}
        aria-pressed={locale === "tr"}
        className={`px-1 transition-colors ${
          locale === "tr" ? "text-white" : "text-white/40 hover:text-white/70"
        }`}
      >
        {t("tr")}
      </button>
    </div>
  );
}

export function Header() {
  const t = useTranslations("header");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: pick the most recent nav-linked section whose top has
  // crossed the upper quarter of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const spyLine = window.innerHeight * 0.25;
      let active: string | null = null;
      let bestTop = -Infinity;
      for (const id of navIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= spyLine && top > bestTop) {
          bestTop = top;
          active = id;
        }
      }
      setActiveId(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-background/70 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Wordmark />

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navIds.map((id) => {
                const isActive = activeId === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setActiveId(id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/55 hover:text-white font-normal"
                    }`}
                  >
                    {t(`nav.${id}`)}
                  </a>
                );
              })}
            </nav>
            <LangToggle />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LangToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-white/80 hover:text-white"
              aria-label={t("openMenu")}
              aria-expanded={open}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] md:hidden bg-background flex flex-col transition-all duration-300 ease-out ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-[0.98] pointer-events-none"
        }`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
      >
        <div className="mx-auto w-full max-w-6xl px-6 h-16 flex items-center justify-between">
          <Wordmark />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-white/80 hover:text-white"
            aria-label={t("closeMenu")}
            tabIndex={open ? 0 : -1}
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col items-center justify-center gap-2 -mt-16">
          {navIds.map((id) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => {
                  setActiveId(id);
                  setOpen(false);
                }}
                aria-current={isActive ? "true" : undefined}
                tabIndex={open ? 0 : -1}
                className={`block py-3 px-6 text-lg tracking-tight transition-colors ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-white/75 font-medium hover:text-white"
                }`}
              >
                {t(`nav.${id}`)}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
