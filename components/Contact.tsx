"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Mail, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  sendContactEmail,
  type ContactFormState,
} from "@/app/actions";
import { ScrollReveal } from "./ScrollReveal";

const initialState: ContactFormState = { status: "idle" };

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
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
              {t("label")}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
              {t("heading")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              {t("subhead")}
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
              <li className="inline-flex items-center gap-3 text-white/55">
                <MapPin size={16} strokeWidth={1.75} className="text-white/50" />
                {t("location")}
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
                  {t("success.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {state.message ?? t("success.body")}
                </p>
              </div>
            ) : (
              <form
                action={formAction}
                className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8"
                noValidate
              >
                <input type="hidden" name="locale" value={locale} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label={t("fields.name")}
                    name="name"
                    required
                    defaultValue={state.values?.name}
                  />
                  <Field
                    label={t("fields.email")}
                    name="email"
                    type="email"
                    required
                    defaultValue={state.values?.email}
                  />
                </div>
                <div className="mt-4">
                  <Field
                    label={t("fields.company")}
                    name="company"
                    defaultValue={state.values?.company}
                  />
                </div>
                <div className="mt-4">
                  <Field
                    label={t("fields.message")}
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
                    {isPending ? t("sending") : t("send")}
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
