"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#capabilities", label: "Capabilities", id: "capabilities" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#contact", label: "Contact", id: "contact" },
] as const;

function Wordmark() {
  return (
    <a
      href="#top"
      className="inline-flex items-center gap-2.5 text-foreground"
      aria-label="Hopeland Developers — home"
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
        Hopeland Devs
      </span>
    </a>
  );
}

export function Header() {
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
      for (const { id } of navLinks) {
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

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveId(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/55 hover:text-white font-normal"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-white/80 hover:text-white"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
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
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col items-center justify-center gap-2 -mt-16">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveId(link.id);
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
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
