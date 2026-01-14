'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export const TestimonialSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#f4f7f5] relative overflow-hidden">
      
      {/* --- OPTIMIZED BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c1b4df]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c7d6c1]/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#755eb1] leading-tight mb-4 sm:mb-6">
            Client Voices
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2b2e34] font-medium">
            Impact in <span className="italic text-[#2b2e34]">their words.</span>
          </h3>
        </motion.div>

        {/* --- MAIN CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Decorative Quote - Hidden on mobile */}
          <div className="absolute -top-8 sm:-top-10 -left-3 sm:-left-8 opacity-8 hidden sm:block">
            <Quote size={80} className="fill-[#755eb1]/10 text-[#755eb1]/10 sm:w-[100px] sm:h-[100px]" strokeWidth={0} />
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-xl shadow-[#755eb1]/5 border border-[#c1b4df]/20 relative overflow-hidden">
            
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c7d6c1] via-[#755eb1] to-[#c7d6c1]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              
              {/* Quote Text - Changed "Planet People Profit" to "The Capital P Lab" */}
              <blockquote className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
                <p className="text-lg sm:text-xl md:text-2xl font-serif text-[#2b2e34] leading-relaxed font-normal">
                  "The Capital P Lab stands out for the <span className="px-1.5 sm:px-2 bg-[#c7d6c1]/30 rounded-lg decoration-clone">clarity and integrity</span> with which it approaches sustainability and public policy."
                </p>
                
                <p className="text-base sm:text-lg md:text-xl text-[#4f75d] leading-relaxed font-light">
                  "The founders bring complementary strengths that make the organisation both thoughtful and effective—combining strong analytical depth with an ability to work across sectors and stakeholders. What I find especially compelling is the team's ability to <span className="text-[#755eb1] font-semibold border-b-2 border-[#755eb1]/30">move from insight to action</span>."
                </p>

                <p className="text-base sm:text-lg text-[#4f75d]/90 leading-relaxed font-light hidden lg:block">
                   "Whether engaging with institutions, designing research-driven interventions, or supporting capacity-building efforts, The Capital P Lab consistently delivers work that is practical, credible, and impact-oriented."
                </p>
              </blockquote>

              {/* Author Section */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#2b2e34]/5 w-full flex flex-col items-center">
                
                {/* All text below name changed to black */}
                <div className="text-center">
                  <h4 className="text-[#2b2e34] font-bold text-sm sm:text-base tracking-wide uppercase">
                    Ar. Aditi Chellapilla Kumar
                  </h4>
                  <p className="text-[#2b2e34] text-xs sm:text-sm font-medium mt-1">
                    Accessibility and Inclusive Urban Development Professional
                  </p>
                  <p className="text-[#2b2e34] text-[10px] sm:text-xs mt-2 max-w-md mx-auto font-light">
                    Contributor to policy advocacy, built-environment accessibility, and disability inclusion initiatives
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