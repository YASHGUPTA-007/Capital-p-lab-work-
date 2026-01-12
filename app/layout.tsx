import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import the component (adjust path based on where you saved it)
import WhatsAppFloat from "./WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'The Capital P Lab - Planet. People. Profit.',
  description: 'We help turn evidence into impact for people, the planet, and prosperity. Research and consulting services for sustainable development.',
  keywords: 'sustainability, ESG, SDG, research, consulting, environmental policy, social impact',
  authors: [{ name: 'The Capital P Lab' }],
  openGraph: {
    title: 'The Capital P Lab',
    description: 'Turning evidence into impact for people, planet, and prosperity',
    type: 'website',
  },
}

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
        
        {/* 2. Add the component here, usually at the bottom */}
        <WhatsAppFloat />
        
      </body>
    </html>
  );
}