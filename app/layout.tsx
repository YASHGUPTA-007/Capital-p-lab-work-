import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
        <ConditionalWhatsApp />
      </body>
    </html>
  );
}

// Client component to check pathname
function ConditionalWhatsApp() {
  'use client';
  
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <WhatsAppFloat />;
}