import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digrosys.com"),
  title: {
    default: "Digrosys — Commercial Production & Performance Marketing",
    template: "%s · Digrosys",
  },
  description:
    "Digrosys builds growth systems for ambitious brands — commercial production, performance marketing, and brand strategy under one roof.",
  keywords: [
    "commercial production",
    "performance marketing",
    "brand strategy",
    "Digrosys",
    "creative agency India",
    "ROAS",
    "D2C marketing",
  ],
  authors: [{ name: "Digrosys" }],
  creator: "Digrosys",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digrosys.com",
    siteName: "Digrosys",
    title: "Digrosys — We Build Growth Systems",
    description:
      "Commercial production and performance marketing for brands that scale.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Digrosys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digrosys — We Build Growth Systems",
    description:
      "Commercial production and performance marketing for brands that scale.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-ink">
      <head>
        {/* General Sans via Fontshare — premium heading face */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-ink text-cream`}
        style={
          {
            "--font-general-sans": '"General Sans"',
          } as React.CSSProperties
        }
      >
        <Providers>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
