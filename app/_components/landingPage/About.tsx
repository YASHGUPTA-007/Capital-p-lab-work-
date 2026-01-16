'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Target, TrendingUp } from 'lucide-react'

export const AboutSection = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Simple fade variants - no movement on mobile
  const fadeVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  return (
    <section 
      id="about" 
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-white rounded-t-[2rem] sm:rounded-t-[3rem] -mt-8 sm:-mt-10 z-20 shadow-[0_-15px_30px_-10px_rgba(0,0,0,0.08)] sm:shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      {/* Simplified Background - Static on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c1b4df]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c7d6c1]/15 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Badge */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          variants={fadeVariants}
          className="mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight mb-3 sm:mb-4">
            Who We Are
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[#4f7f5d] leading-tight">
            Bridging the gap between research and reality
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 mb-12 sm:mb-16 md:mb-20 lg:mb-28 items-center">
          
          {/* Left: Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.2 : 0.3 }}
            transition={{ duration: isMobile ? 0.3 : 0.6 }}
            variants={fadeVariants}
            className="relative"
          >
            <div className="relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-xl sm:shadow-2xl shadow-[#755eb1]/10">
              <img 
                src="/Bridging the gap between research and reality.avif" 
                alt="Our Team at Work" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Simplified overlay on mobile */}
              <div className={isMobile 
                ? "absolute inset-0 bg-[#755eb1]/40" 
                : "absolute inset-0 bg-gradient-to-tr from-[#755eb1]/70 to-[#4f75d]/30 mix-blend-multiply"
              } />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Remove border decoration on mobile */}
            {!isMobile && (
              <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] border-2 border-[#c1b4df] translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 -z-10" />
            )}
          </motion.div>
          
          {/* Right: Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.2 : 0.3 }}
            transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : 0.2 }}
            variants={fadeVariants}
            className="space-y-5 sm:space-y-6 md:space-y-8"
          >
           <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[26px] font-light font-sans text-[#2b2e34] leading-relaxed">
  We provide research and consulting services that support{" "}
  <span className="text-[#4f7f5d] font-bold">sustainable development</span>,{" "}
  <span className="text-[#4f7f5d] font-bold">responsible investment</span>, and{" "}
  <span className="text-[#4f7f5d] font-bold">inclusive growth</span>.
</p>

            
            <p className="text-sm sm:text-base md:text-lg font-sans text-[#2b2e34]/70 leading-relaxed border-l-2 border-[#c7d6c1] pl-4 sm:pl-5 md:pl-6">
               The impact we seek goes beyond reports. We aim to strengthen institutions and translate evidence into actions that enhance social equity, economic value and climate resilience.
            </p>
            
            {/* Pillars Grid - Simplified on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8">
              {[
                { title: "SDG Aligned", sub: "Research Frameworks", color: "#2b2e34", icon: Target },
                { title: "Evidence Driven", sub: "Strategic Solutions", color: "#4f7f5d", icon: CheckCircle2 },
                { title: "Impact Focused", sub: "Measurable Outcomes", color: "#755eb1", icon: TrendingUp }
              ].map((item, i) => (
                <div 
                  key={i}
                  className={`p-3.5 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border bg-[#d4cbea]/70 ${!isMobile && 'md:hover:border-current md:transition-colors md:duration-300'}`}
                  style={{ borderColor: `${item.color}30` }}
                >
                  <item.icon size={isMobile ? 18 : 20} color={item.color} className="mb-2 sm:mb-2.5 md:mb-3 opacity-80" />
                  <h4 className="font-bold text-sm sm:text-base md:text-lg leading-tight mb-1 font-sans" style={{ color: item.color }}>{item.title}</h4>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: item.color }}>{item.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Our Story Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
          variants={fadeVariants}
        >
          {/* Header - Reduced bottom margin */}
          <div className="mb-2 sm:mb-5 md:mb-2 lg:mb-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight">
              Our Story
            </h3>
          </div>

          {/* Story Content Box */}
          <div className="relative p-5 sm:p-8 md:p-12 lg:p-16 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden">
            {/* Simplified Background on Mobile */}
            {isMobile ? (
              <>
                <div className="absolute inset-0 bg-[#f8f6fb] z-0" />
                <div className="absolute inset-0 rounded-xl border border-[#755eb1]/20 z-10" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0" />
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#c1b4df]/30 rounded-full blur-[120px] mix-blend-multiply z-0" />
                <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#c7d6c1]/20 rounded-full blur-[100px] mix-blend-multiply z-0" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay" />
                <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] border border-[#755eb1]/10 z-10" />
              </>
            )}

            <div className="relative z-20">
              {/* Story Content - Left Aligned */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 font-sans text-[#2b2e34] text-sm sm:text-base md:text-lg leading-relaxed">
                    
                <p className="first-letter:text-4xl first-letter:sm:text-5xl first-letter:md:text-6xl first-letter:lg:text-5xl first-letter:float-left first-letter:mr-2 first-letter:sm:mr-3 first-letter:md:mr-4 first-letter:leading-none first-letter:text-[#755eb1] first-letter:font-serif first-letter:font-bold">
                  Our story began in the period following COVID-19, a time when many professionals were navigating uncertainty. As two mothers balancing careers and caregiving, we found ourselves seeking meaningful ways to stay engaged.
                </p>
                
                <p>
                  We first connected through conducting STEAM workshops for students. What started as a shared effort quickly became a space for deeper collaboration. We discovered a common passion for research and using evidence to create positive change.
                </p>
                
                <p>
                  We recognized a gap between research and real-world application in the sustainability sector. This led us to establish our firm—grounded in professional expertise and lived experience.
                </p>
                
                {/* Pull Quote */}
                <div className={`mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-[#4f7f5d] relative ${
                  isMobile ? 'bg-[#f0f8f4]' : 'bg-gradient-to-r from-[#755eb1]/5 to-[#4f7f5d]/5'
                }`}>
                  <p className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl text-[#2b2e34] italic leading-relaxed">
                    Our journey reflects <span className="text-[#2b2e34] font-semibold">resilience</span>, curiosity, and collaboration. What began as a response to disruption has grown into a <span className="text-[#2b2e34] font-semibold">purpose-driven</span> venture aimed at turning knowledge into action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default AboutSection