import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hopeland Developers — Software studio for ambitious teams",
  description:
    "Hopeland Developers is a software studio shipping production-grade systems across construction, healthcare, and AI platforms. Senior engineering, flexible delivery — full-stack or specialized.",
  metadataBase: new URL("https://hopeland.com.tr"),
  openGraph: {
    title: "Hopeland Developers — Software studio for ambitious teams",
    description:
      "Senior engineering, flexible delivery. Full-stack or specialized — front-end, back-end, mobile.",
    url: "https://hopeland.com.tr",
    siteName: "Hopeland Developers",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hopeland Developers — Software studio for ambitious teams",
    description:
      "Senior engineering, flexible delivery. Full-stack or specialized — front-end, back-end, mobile.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
