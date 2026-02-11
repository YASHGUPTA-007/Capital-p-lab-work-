import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.capitalp.org"),

  title: "The Capital P Lab - Planet. People. Profit.",
  description:
    "We help turn evidence into impact for people, the planet, and profit. Research and consulting services for sustainable development.",

  keywords:
    "sustainability, ESG, SDG, research, consulting, environmental policy, social impact",

  authors: [{ name: "The Capital P Lab" }],

  alternates: {
    canonical: "https://www.capitalp.org",
  },

  openGraph: {
    title: "The Capital P Lab",
    description: "Turning evidence into impact for people, planet, and prosperity",
    url: "https://www.capitalp.org",
    siteName: "The Capital P Lab",
    type: "website",
    images: [
      {
        url: "https://www.capitalp.org/logo.png",
        width: 1200,
        height: 630,
        alt: "The Capital P Lab",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The Capital P Lab",
    description: "Turning evidence into impact for people, planet, and prosperity",
    images: ["https://www.capitalp.org/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Organization schema (JSON-LD)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Capital P Lab",
  alternateName: "Capital P Lab",
  url: "https://www.capitalp.org",
  logo: "https://www.capitalp.org/logo.png",
  description:
    "We help turn evidence into impact for people, the planet, and profit. Research and consulting services for sustainable development.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* DNS Prefetch & Preconnect for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PWQPCDVJ');
            `,
          }}
        />
      </head>

      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PWQPCDVJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}