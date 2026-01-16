"use client";

import React, { useEffect, useRef } from "react";
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
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if we're on client side and desktop
    if (typeof window === 'undefined') return;
    
    const isDesktop = window.innerWidth >= 768;
    
    if (!isDesktop) {
      return;
    }

    // Initialize Lenis for smooth scrolling on desktop
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Optimized RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Handle window resize
    const handleResize = () => {
      const nowDesktop = window.innerWidth >= 768;
      if (!nowDesktop && lenisRef.current) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        lenisRef.current.destroy();
        lenisRef.current = null;
      } else if (nowDesktop && !lenisRef.current) {
        const newLenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });
        lenisRef.current = newLenis;
        
        function newRaf(time: number) {
          newLenis.raf(time);
          rafRef.current = requestAnimationFrame(newRaf);
        }
        rafRef.current = requestAnimationFrame(newRaf);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
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