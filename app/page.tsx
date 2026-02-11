"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";



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

// For named exports, we need to import the whole module then destructure
// Or better yet, just import it normally since we need it on first render anyway
import { TeamSection } from "./_components/landingPage/Team";

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

    // Handle hash navigation after page load (for cross-page navigation)
    const handleHashScroll = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Wait for dynamic components to load, then scroll
        const attemptScroll = (attempts = 0) => {
          const element = document.getElementById(hash);
          
          if (element) {
            const navbarHeight = 100;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else if (attempts < 20) {
            // Retry after 100ms if element not found (dynamic components still loading)
            setTimeout(() => attemptScroll(attempts + 1), 100);
          }
        };

        // Small initial delay to let components start mounting
        setTimeout(() => attemptScroll(), 300);
      }
    };

    // Run on mount
    handleHashScroll();

    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
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