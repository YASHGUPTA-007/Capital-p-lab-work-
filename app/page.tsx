"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";

// Critical components - loaded immediately
import { Navbar } from "./_components/landingPage/Navbar";
import { Hero } from "./_components/landingPage/Hero";
import { CustomCursor, NoiseOverlay } from "./_components/BackgroundElements";

// Non-critical components - lazy loaded with optimizations
const AboutSection = dynamic(
  () => import("./_components/landingPage/About").then(mod => ({ default: mod.AboutSection })),
  { 
    loading: () => <div className="h-screen" />,
    ssr: true 
  }
);

const TestimonialSection = dynamic(
  () => import("./_components/landingPage/Testimonials").then(mod => ({ default: mod.TestimonialSection })),
  { ssr: true }
);

const FocusSection = dynamic(
  () => import("./_components/landingPage/FocusAreas").then(mod => ({ default: mod.FocusSection })),
  { ssr: true }
);

const ServicesSection = dynamic(
  () => import("./_components/landingPage/Services").then(mod => ({ default: mod.ServicesSection })),
  { ssr: true }
);

const TeamSection = dynamic(
  () => import("./_components/landingPage/Team").then(mod => ({ default: mod.TeamSection })),
  { ssr: true }
);

const InsightsSection = dynamic(
  () => import("./_components/landingPage/Insights").then(mod => ({ default: mod.InsightsSection })),
  { ssr: true }
);

const ContactForm = dynamic(
  () => import("./_components/landingPage/ContactForm").then(mod => ({ default: mod.ContactForm })),
  { ssr: false }
);

const Footer = dynamic(
  () => import("./_components/landingPage/Footer").then(mod => ({ default: mod.Footer })),
  { ssr: true }
);

const WhatsAppFloat = dynamic(() => import("./WhatsAppFloat"), { ssr: false });
const VisitTracker = dynamic(() => import("./_components/VisitTracker"), { ssr: false });

export default function TheCapitalPLab() {




  return (
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
  );
}