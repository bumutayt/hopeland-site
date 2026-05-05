"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Mail, MapPin } from "lucide-react";

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
import {
  sendContactEmail,
  type ContactFormState,
} from "@/app/actions";
import { ScrollReveal } from "./ScrollReveal";

const initialState: ContactFormState = { status: "idle" };

export function Contact() {
  const [state, formAction, isPending] = useActionState(
    sendContactEmail,
    initialState,
  );

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <ScrollReveal className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
              Contact
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
              Have an idea? Let&apos;s talk.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              Tell us about your project — full-stack delivery or just
              front-end, back-end, or mobile. We&apos;ll respond within 1–2
              business days.
            </p>

            <ul className="mt-10 space-y-4 text-sm text-white/70">
              <li>
                <a
                  href="mailto:info@hopeland.com.tr"
                  className="inline-flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Mail size={16} strokeWidth={1.75} className="text-white/50" />
                  info@hopeland.com.tr
                </a>
              </li>
              {/* LinkedIn page not active yet — re-enable when ready:
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 hover:text-white transition-colors"
                >
                  <LinkedInGlyph className="text-white/50" />
                  LinkedIn
                </a>
              </li>
              */}
              <li className="inline-flex items-center gap-3 text-white/55">
                <MapPin size={16} strokeWidth={1.75} className="text-white/50" />
                Ankara, Turkey · working globally
              </li>
            </ul>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={80}>
            {state.status === "success" ? (
              <div className="rounded-2xl border border-border bg-surface/40 p-10 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40 text-emerald-300">
                  <Check size={22} strokeWidth={2.5} />
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight">
                  Message received.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {state.message}
                </p>
              </div>
            ) : (
              <form
                action={formAction}
                className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Name"
                    name="name"
                    required
                    defaultValue={state.values?.name}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    defaultValue={state.values?.email}
                  />
                </div>
                <div className="mt-4">
                  <Field
                    label="Company"
                    name="company"
                    defaultValue={state.values?.company}
                  />
                </div>
                <div className="mt-4">
                  <Field
                    label="Message"
                    name="message"
                    required
                    multiline
                    defaultValue={state.values?.message}
                  />
                </div>

                {state.status === "error" && state.message && (
                  <p
                    role="alert"
                    className="mt-4 text-sm text-rose-300/90"
                  >
                    {state.message}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Sending..." : "Send message"}
                    {!isPending && (
                      <ArrowRight size={16} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
};

function Field({
  label,
  name,
  type = "text",
  required = false,
  multiline = false,
  defaultValue,
}: FieldProps) {
  const baseClasses =
    "w-full bg-transparent border border-border focus:border-white/40 focus:outline-none rounded-lg px-4 py-3 text-foreground placeholder:text-white/30 transition-colors";

  return (
    <label className="block">
      <span className="block text-xs font-medium tracking-wider uppercase text-white/45 mb-2">
        {label}
        {required && <span className="text-white/30"> *</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          defaultValue={defaultValue}
          className={`${baseClasses} resize-y min-h-[8rem]`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={defaultValue}
          autoComplete={
            name === "email"
              ? "email"
              : name === "name"
                ? "name"
                : name === "company"
                  ? "organization"
                  : "off"
          }
          className={baseClasses}
        />
      )}
    </label>
  );
}
