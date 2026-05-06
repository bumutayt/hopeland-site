import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl middleware reads Accept-Language on first visit, picks the best
// supported locale, sets the NEXT_LOCALE cookie, and redirects "/" to the
// locale-prefixed URL. The header toggle just navigates to the other prefix —
// the cookie updates automatically on each navigation.
export default createMiddleware(routing);

export const config = {
  // Match the root and all paths except Next.js internals and files with a
  // dot (assets). Locale-prefixed paths are handled by the middleware.
  matcher: ["/", "/(en|tr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
