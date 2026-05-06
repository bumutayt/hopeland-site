"use server";

import { resend } from "@/lib/resend";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  values?: {
    name: string;
    email: string;
    company: string;
    message: string;
  };
};

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const rawLocale = formData.get("locale")?.toString();
  const locale: Locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const company = formData.get("company")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  const values = { name, email, company, message };
  const tEmail = await getTranslations({ locale, namespace: "email" });
  const tErrors = await getTranslations({
    locale,
    namespace: "contact.errors",
  });
  const tSuccess = await getTranslations({
    locale,
    namespace: "contact.success",
  });

  if (!name || !email || !message) {
    return {
      status: "error",
      message: tErrors("missingFields"),
      values,
    };
  }

  try {
    // Modern Resend SDK returns { data, error } instead of throwing on
    // API errors — must inspect `error` to know if the send actually
    // succeeded.
    const subject = company
      ? tEmail("subjectWithCompany", { name, company })
      : tEmail("subject", { name });

    const text = tEmail("bodyTemplate", {
      name,
      email,
      company: company || tEmail("companyFallback"),
      message,
    });

    const { data, error } = await resend.emails.send({
      // Domain hopeland.com.tr is verified in Resend (eu-west-1).
      // DKIM (resend._domainkey), SPF (send.*), and bounce MX (send.*) are
      // configured at Metunic — see DEPLOY.md for DNS setup.
      from: "Hopeland Contact <contact@hopeland.com.tr>",
      to: ["info@hopeland.com.tr"],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return {
        status: "error",
        message: error.message ?? tErrors("rejected"),
        values,
      };
    }

    console.log("Resend send ok:", data?.id);
    return {
      status: "success",
      message: tSuccess("body"),
    };
  } catch (err) {
    console.error("Resend send threw:", err);
    return {
      status: "error",
      message: tErrors("generic"),
      values,
    };
  }
}
