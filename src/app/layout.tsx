import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DEFAULT_DESCRIPTION, KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";
import { themeInitScript } from "@/components/layout/theme-toggle";
import { Analytics } from "@/components/analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — AI Automation Agency`, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, url: "/", title: `${SITE_NAME} — AI Automation Agency`, description: DEFAULT_DESCRIPTION, locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — AI Automation Agency`, description: DEFAULT_DESCRIPTION },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#070708" }, { media: "(prefers-color-scheme: light)", color: "#f7f6fb" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-base">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
