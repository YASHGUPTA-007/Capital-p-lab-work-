import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  },
};

// Organization schema for Google
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Capital P Lab",
  alternateName: "Capital P Lab",
  url: "https://www.capitalp.org",
  logo: "https://www.capitalp.org/logo.png", // Update with your actual logo path
  description: "We help turn evidence into impact for people, the planet, and profit. Research and consulting services for sustainable development.",
  sameAs: [
    // Add your social media profiles here if you have them
    // "https://www.linkedin.com/company/capitalp",
    // "https://twitter.com/capitalp",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}