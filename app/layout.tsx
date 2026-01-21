import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    canonical: "/",
  },

  openGraph: {
    title: "The Capital P Lab",
    description: "Turning evidence into impact for people, planet, and prosperity",
    url: "https://www.capitalp.org",
    siteName: "The Capital P Lab",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
