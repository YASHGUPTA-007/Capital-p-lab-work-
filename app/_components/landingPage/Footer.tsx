// app/_components/landingPage/Footer.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Globe } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      // Navigate to home page with hash, then scroll after page loads
      window.location.href = `/#${id}`;
      return;
    }
    
    // On homepage - scroll immediately
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80; // Adjust based on your navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-[#1a1c20] via-[#2b2e34] to-[#1a1c20] pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-[#755eb1] rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-[#4f7f5d] rounded-full blur-[100px] sm:blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-20">
          {/* LEFT SECTION */}
          <div className="space-y-5 sm:space-y-6 text-center md:text-left">
            {/* Logo and Title */}
            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white p-2 shadow-xl flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="The Capital P Lab Logo"
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                  priority={false}
                />
              </div>

              <div className="text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white leading-tight">
                  The Capital P Lab
                </h2>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-white/70 uppercase tracking-widest mt-0.5">
                  Planet · People · Profit
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-white/90 text-sm sm:text-base font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Turning evidence into impact for people, planet, and prosperity.
            </p>

            {/* Email Contact */}
            <a
              href="mailto:contact@capitalp.org"
              className="group inline-flex items-center gap-2 text-base sm:text-lg md:text-2xl font-serif text-white hover:text-[#c1b4df] transition-colors duration-300"
            >
              <span className="border-b-2 border-[#755eb1] pb-0.5 sm:pb-1 group-hover:border-[#c1b4df] transition-colors duration-300">
                contact@capitalp.org
              </span>
              <ArrowUpRight size={16} className="sm:hidden" />
              <ArrowUpRight size={18} className="hidden sm:block" />
            </a>

            {/* Location */}
            <p className="text-white/90 flex items-center gap-2 text-sm sm:text-base justify-center md:justify-start">
              <Globe size={14} className="sm:hidden text-[#c1b4df] flex-shrink-0" />
              <Globe size={16} className="hidden sm:block text-[#c1b4df] flex-shrink-0" />
              <span>Based in India · USA</span>
            </p>
          </div>

          {/* RIGHT NAVIGATION SECTION */}
          <div className="space-y-8 sm:space-y-10">
            <nav className="grid grid-cols-2 gap-8 sm:gap-10 text-center md:text-left">
              {/* Company Column */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/60 mb-3 sm:mb-4 md:mb-5">
                  Company
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90 font-medium">
                  <li>
                    <Link 
                      href="/blogs" 
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block"
                    >
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection("team")}
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block cursor-pointer"
                    >
                      Team
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection("about")}
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block cursor-pointer"
                    >
                      About
                    </button>
                  </li>
                </ul>
              </div>

              {/* Focus Column */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/60 mb-3 sm:mb-4 md:mb-5">
                  Focus
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90 font-medium">
                  <li>
                    <button 
                      onClick={() => scrollToSection("focus")}
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block cursor-pointer"
                    >
                      Inclusion
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection("focus")}
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block cursor-pointer"
                    >
                      Climate Emotion
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection("focus")}
                      className="hover:text-[#c1b4df] transition-colors duration-300 inline-block cursor-pointer"
                    >
                      ESG
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* COPYRIGHT — FULL WIDTH ABOVE DIVIDER */}
        <div className="mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-5 text-center md:text-left text-[10px] sm:text-[11px] md:text-xs text-white/70 uppercase tracking-widest font-semibold">
          © 2026 · Planet · People · Profit
        </div>

        {/* DIVIDER LINE */}
        <div className="border-b border-white/10" />
      </div>
    </footer>
  );
};