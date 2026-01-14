"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { CustomCursor, NoiseOverlay } from "./_components/BackgroundElements";
import { Navbar } from "./_components/landingPage/Navbar";
import { Hero } from "./_components/landingPage/Hero";
import { AboutSection } from "./_components/landingPage/About";
import { TestimonialSection } from "./_components/landingPage/Testimonials";
import { FocusSection } from "./_components/landingPage/FocusAreas";
import { ServicesSection } from "./_components/landingPage/Services";
import { TeamSection } from "./_components/landingPage/Team";
import { InsightsSection } from "./_components/landingPage/Insights";
import { ContactForm } from "./_components/landingPage/ContactForm";
import { Footer } from "./_components/landingPage/Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import VisitTracker from "./_components/VisitTracker";

export default function TheCapitalPLab() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

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

        <TestimonialSection />
        <TeamSection />

        <InsightsSection />
        <ContactForm />
      </main>

      <Footer />
      <WhatsAppFloat />
      <VisitTracker/>
      
    </div>
  );
}
