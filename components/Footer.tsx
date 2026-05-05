export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-white/45">
        <p>Hopeland Developers © 2026</p>
        <p className="hidden md:block">Made in Ankara</p>
        {/* Social/profile links — not live yet. Re-enable when LinkedIn
            company page and Clutch profile (subscription pending) are active.
        <ul className="flex items-center gap-6">
          <li>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Hopeland on LinkedIn"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Hopeland on Clutch"
            >
              Clutch
            </a>
          </li>
        </ul>
        */}
        <p className="md:hidden">Made in Ankara</p>
      </div>
    </footer>
  );
}
