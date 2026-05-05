"use server";

import { resend } from "@/lib/resend";

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
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const company = formData.get("company")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  const values = { name, email, company, message };

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please fill in all required fields.",
      values,
    };
  }

  try {
    // Modern Resend SDK returns { data, error } instead of throwing on
    // API errors — must inspect `error` to know if the send actually
    // succeeded.
    const { data, error } = await resend.emails.send({
      // Domain hopeland.com.tr is verified in Resend (eu-west-1).
      // DKIM (resend._domainkey), SPF (send.*), and bounce MX (send.*) are
      // configured at Metunic — see hopeland-deploy-guide.md for DNS setup.
      from: "Hopeland Contact <contact@hopeland.com.tr>",
      to: ["info@hopeland.com.tr"],
      replyTo: email,
      subject: `New project inquiry from ${name}${company ? ` (${company})` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return {
        status: "error",
        message: error.message ?? "Email service rejected the request.",
        values,
      };
    }

    console.log("Resend send ok:", data?.id);
    return {
      status: "success",
      message: "Thanks — we'll be in touch shortly.",
    };
  } catch (err) {
    console.error("Resend send threw:", err);
    return {
      status: "error",
      message:
        "Something went wrong. Please try again or email us directly.",
      values,
    };
  }
}
