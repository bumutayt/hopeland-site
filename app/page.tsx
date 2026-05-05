import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Capabilities } from "@/components/Capabilities";
import { Work } from "@/components/Work";
import { Approach } from "@/components/Approach";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Page() {
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
