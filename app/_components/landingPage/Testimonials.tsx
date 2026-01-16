'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export const TestimonialSection = () => {
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

  const headerVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  const cardVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-[#f4f7f5] relative overflow-hidden">
      
      {/* Optimized Background - Simplified for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#c1b4df]/15 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#c7d6c1]/15 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="hidden sm:block absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Changed max-w to match other sections */}
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header - Now Left Aligned with proper container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          variants={headerVariants}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight mb-3 sm:mb-4">
            Client Voices
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[#4f7f5d] leading-tight">
            Impact in their words
          </p>
        </motion.div>

        {/* Main Card - wrapped in max-w container */}
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            transition={{ duration: isMobile ? 0.4 : 0.6 }}
            variants={cardVariants}
            className="relative"
          >
            {/* Decorative Quote - Hidden on mobile */}
            <div className="absolute -top-6 sm:-top-8 md:-top-10 -left-2 sm:-left-3 md:-left-8 opacity-8 hidden sm:block pointer-events-none">
              <Quote 
                size={isMobile ? 60 : 80} 
                className="fill-[#755eb1]/10 text-[#755eb1]/10 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px]" 
                strokeWidth={0} 
              />
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] p-5 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-[#755eb1]/5 border border-[#c1b4df]/20 relative overflow-hidden">
              
              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c7d6c1] via-[#755eb1] to-[#c7d6c1]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Quote Text */}
                <blockquote className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif text-[#2b2e34] leading-relaxed font-normal">
                    "The Capital P Lab stands out for the <span className="px-1 sm:px-1.5 md:px-2 bg-[#c7d6c1]/30 rounded-lg decoration-clone">clarity and integrity</span> with which it approaches sustainability and public policy."
                  </p>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#4f75d] leading-relaxed font-light">
                    "The founders bring complementary strengths that make the organisation both thoughtful and effective—combining strong analytical depth with an ability to work across sectors and stakeholders. What I find especially compelling is the team's ability to <span className="text-[#755eb1] font-semibold border-b-2 border-[#755eb1]/30">move from insight to action</span>."
                  </p>

                  <p className="text-sm sm:text-base md:text-lg text-[#4f75d]/90 leading-relaxed font-light hidden lg:block">
                     "Whether engaging with institutions, designing research-driven interventions, or supporting capacity-building efforts, The Capital P Lab consistently delivers work that is practical, credible, and impact-oriented."
                  </p>
                </blockquote>

                {/* Author Section */}
                <div className="mt-6 sm:mt-8 md:mt-10 pt-5 sm:pt-6 md:pt-8 border-t border-[#2b2e34]/5 w-full flex flex-col items-center">
                  <div className="text-center">
                    <h4 className="text-[#2b2e34] font-bold text-xs sm:text-sm md:text-base tracking-wide uppercase">
                      Ar. Aditi Chellapilla Kumar
                    </h4>
                    <p className="text-[#2b2e34] text-[11px] sm:text-xs md:text-sm font-medium mt-1">
                      Accessibility and Inclusive Urban Development Professional
                    </p>
                    <p className="text-[#2b2e34] text-[9px] sm:text-[10px] md:text-xs mt-1.5 sm:mt-2 max-w-md mx-auto font-light">
                      Contributor to policy advocacy, built-environment accessibility, and disability inclusion initiatives
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}