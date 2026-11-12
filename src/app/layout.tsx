import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Anton, Archivo_Black, Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE, pageUrl } from "@/lib/site";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono", display: "swap" });

const title = "GIGWIRE — the gig board for bars, restaurants & the musicians who fill them";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: "%s · GIGWIRE",
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
  authors: [{ name: SITE.author, url: "https://github.com/Abhinav-Prabhakar" }],
  creator: SITE.author,
  publisher: SITE.name,
  category: "music",
  classification: "Live music booking, gig board, musicians",
  keywords: [
    "live music gigs",
    "bar gigs",
    "restaurant live music",
    "band booking",
    "musician jobs",
    "gig board",
    "find a gig",
    "book a band",
    "session musicians",
    "cover band",
    "jazz gigs",
    "paid gigs for musicians",
  ],
  alternates: {
    canonical: pageUrl("/"),
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    url: pageUrl("/"),
    title,
    description: SITE.description,
    images: [
      {
        url: pageUrl("/og.png"),
        width: 1200,
        height: 630,
        alt: "GIGWIRE — somebody's bar needs a band tonight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
    images: [pageUrl("/og.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: `${SITE.basePath}/favicon.ico`, sizes: "any" },
      { url: `${SITE.basePath}/icon.svg`, type: "image/svg+xml" },
      { url: `${SITE.basePath}/icon-32.png`, type: "image/png", sizes: "32x32" },
      { url: `${SITE.basePath}/icon-192.png`, type: "image/png", sizes: "192x192" },
      { url: `${SITE.basePath}/icon-512.png`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `${SITE.basePath}/favicon.ico`,
    apple: [{ url: `${SITE.basePath}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  manifest: `${SITE.basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1e4cd" },
    { media: "(prefers-color-scheme: dark)", color: "#171310" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  alternateName: "Gigwire gig board",
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Person",
    name: SITE.author,
    url: "https://github.com/Abhinav-Prabhakar",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${pageUrl("/gigs")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${instrument.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="paper-grain min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-[3px] focus:border-ink focus:bg-marigold focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.16] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </body>
    </html>
  );
}
