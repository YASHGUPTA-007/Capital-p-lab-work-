"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

// Critical components - loaded immediately
import { Navbar } from "./_components/landingPage/Navbar";
import { Hero } from "./_components/landingPage/Hero";

// Background elements with lower priority
const CustomCursor = dynamic(
  () => import("./_components/BackgroundElements").then(mod => ({ default: mod.CustomCursor })),
  { ssr: false }
);

const NoiseOverlay = dynamic(
  () => import("./_components/BackgroundElements").then(mod => ({ default: mod.NoiseOverlay })),
  { ssr: false }
);

// Non-critical sections - aggressively lazy loaded
const AboutSection = dynamic(
  () => import("./_components/landingPage/About").then(mod => ({ default: mod.AboutSection })),
  { 
    loading: () => <div className="min-h-screen" />,
    ssr: true 
  }
);

const FocusSection = dynamic(
  () => import("./_components/landingPage/FocusAreas").then(mod => ({ default: mod.FocusSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
);

const ServicesSection = dynamic(
  () => import("./_components/landingPage/Services").then(mod => ({ default: mod.ServicesSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
);

const InsightsSection = dynamic(
  () => import("./_components/landingPage/Insights").then(mod => ({ default: mod.InsightsSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
);

const TestimonialSection = dynamic(
  () => import("./_components/landingPage/Testimonials").then(mod => ({ default: mod.TestimonialSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
);

const TeamSection = dynamic(
  () => import("./_components/landingPage/Team").then(mod => ({ default: mod.TeamSection })),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
);

const ContactForm = dynamic(
  () => import("./_components/landingPage/ContactForm").then(mod => ({ default: mod.ContactForm })),
  { ssr: false }
);

const Footer = dynamic(
  () => import("./_components/landingPage/Footer").then(mod => ({ default: mod.Footer })),
  { ssr: false }
);

const WhatsAppFloat = dynamic(() => import("./WhatsAppFloat"), { ssr: false });
const VisitTracker = dynamic(() => import("./_components/VisitTracker"), { ssr: false });

export default function TheCapitalPLab() {
  useEffect(() => {
    // Force body scroll on mount
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'visible';
  }, []);

  return (
    <>
      {/* Preconnect to external domains */}
      <Script
        id="resource-hints"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const preconnects = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
              preconnects.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = url;
                if (url.includes('gstatic')) link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
              });
            })();
          `
        }}
      />

      <div className="bg-white min-h-screen text-zinc-900 selection:bg-[#c7d6c1] selection:text-[#4f75d] font-sans">
        <CustomCursor />
        <NoiseOverlay />
        <Navbar />

        <main>
          <Hero />
          <AboutSection />
          <FocusSection />
          <ServicesSection />
          <InsightsSection />
          <TestimonialSection />
          <TeamSection />
          <ContactForm />
        </main>

        <Footer />
        <WhatsAppFloat />
        <VisitTracker />
      </div>
    </>
  );
}