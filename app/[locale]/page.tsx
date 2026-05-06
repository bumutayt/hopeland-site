import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Capabilities } from "@/components/Capabilities";
import { Work } from "@/components/Work";
import { Approach } from "@/components/Approach";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Story />
        <Capabilities />
        <Work />
        <Approach />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
