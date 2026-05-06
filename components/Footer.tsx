import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-white/45">
        <p>{t("copyright")}</p>
        <p className="hidden md:block">{t("madeIn")}</p>
        {/* Social/profile links — not live yet. Re-enable when LinkedIn
            company page and Clutch profile (subscription pending) are active. */}
        <p className="md:hidden">{t("madeIn")}</p>
      </div>
    </footer>
  );
}
