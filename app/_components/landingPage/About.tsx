'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Target, TrendingUp } from 'lucide-react'

// Simplified Typewriter
const TypewriterLabel = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span className="inline-flex items-center">
      {displayText}
      <span className="ml-1 w-1 h-3 bg-[#755eb1] animate-pulse" />
    </span>
  )
}

export const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-12 bg-white rounded-t-[3rem] -mt-10 z-20 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      {/* Static Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c1b4df]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c7d6c1]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#755eb1]/20 bg-[#755eb1]/5">
            <span className="w-2 h-2 rounded-full bg-[#755eb1] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#755eb1]">Who We Are</span>
          </span>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 sm:mb-28 items-center">
          
          {/* LEFT: IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-[#755eb1]/10">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop" 
                alt="Our Team at Work" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#755eb1]/70 to-[#4f75d]/30 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Removed quotation marks and full stop */}
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
                 <p className="font-serif italic text-lg sm:text-2xl md:text-3xl leading-tight opacity-90">
                   Bridging the gap between research and reality
                 </p>
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl sm:rounded-[2.5rem] border-2 border-[#c1b4df] translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 -z-10" />
          </motion.div>
          
          {/* RIGHT: CONTENT */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Reduced size by 1 point: text-xl -> text-[19px], text-2xl -> text-[23px], text-3xl -> text-[29px] */}
            {/* Changed sustainable development, responsible investment, inclusive growth to bold green #4f7f5d */}
            <p className="text-[19px] sm:text-[23px] md:text-[29px] font-light font-sans text-[#2b2e34] leading-relaxed">
              We provide research and consulting services that support <span className="text-[#4f7f5d] font-bold">sustainable development</span>, <span className="text-[#4f7f5d] font-bold">responsible investment</span>, and <span className="text-[#4f7f5d] font-bold">inclusive growth</span>.
            </p>
            
            {/* Added "and climate resilience" */}
            <p className="text-base sm:text-lg font-sans text-[#2b2e34]/70 leading-relaxed border-l-2 border-[#c7d6c1] pl-4 sm:pl-6">
               The impact we seek goes beyond reports. We aim to strengthen institutions and translate evidence into actions that enhance social equity, economic value and climate resilience.
            </p>
            
            {/* PILLARS GRID - Changed all boxes to light purple #d4cbea */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8">
              {[
                { title: "SDG Aligned", sub: "Research Frameworks", color: "#2b2e34", icon: Target },
                { title: "Evidence Driven", sub: "Strategic Solutions", color: "#4f7f5d", icon: CheckCircle2 },
                { title: "Impact Focused", sub: "Measurable Outcomes", color: "#755eb1", icon: TrendingUp }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border hover:border-current transition-colors duration-300 bg-[#d4cbea]/30"
                  style={{ borderColor: `${item.color}30` }}
                >
                  <item.icon size={20} color={item.color} className="mb-2 sm:mb-3 opacity-80" />
                  <h4 className="font-bold text-base sm:text-lg leading-tight mb-1 font-sans" style={{ color: item.color }}>{item.title}</h4>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: item.color }}>{item.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- OUR STORY SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative p-6 sm:p-12 md:p-16 rounded-2xl sm:rounded-[3rem] overflow-hidden"
        >
          {/* Static Background */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0" />
          <div className="absolute -top-20 -right-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#c1b4df]/30 rounded-full blur-[120px] mix-blend-multiply z-0" />
          <div className="absolute -bottom-20 -left-20 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#c7d6c1]/20 rounded-full blur-[100px] mix-blend-multiply z-0" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay" />
          <div className="absolute inset-0 rounded-2xl sm:rounded-[3rem] border border-[#755eb1]/10 z-10" />

          <div className="max-w-5xl mx-auto relative z-20">
            <div className="flex flex-col md:flex-row gap-10 sm:gap-16 items-start">
               
               {/* LEFT: HEADER */}
               <div className="md:w-1/3 flex-shrink-0">
                  <div className="mb-4 sm:mb-6 flex items-center gap-3">
                     <div className="w-6 sm:w-8 h-[1px] bg-[#755eb1]" />
                     <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#755eb1]">
                       <TypewriterLabel text="OUR STORY" />
                     </span>
                  </div>

                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-[#2b2e34] leading-[0.95]">
                    From <span className="block text-[#2b2e34] italic">Resilience</span> to <span className="block text-[#2b2e34] italic">Purpose.</span>
                  </h3>
               </div>

               {/* RIGHT: STORY */}
               <div className="md:w-2/3 space-y-6 sm:space-y-8 font-sans text-[#2b2e34] text-base sm:text-lg leading-relaxed">
                  
                  <p className="first-letter:text-5xl first-letter:sm:text-6xl first-letter:md:text-7xl first-letter:float-left first-letter:mr-3 first-letter:sm:mr-4 first-letter:leading-none first-letter:text-[#755eb1] first-letter:font-serif first-letter:font-bold first-letter:drop-shadow-sm">
                    Our story began in the period following COVID-19, a time when many professionals were navigating uncertainty. As two mothers balancing careers and caregiving, we found ourselves seeking meaningful ways to stay engaged.
                  </p>
                  
                  <p>
                    We first connected through conducting STEAM workshops for students. What started as a shared effort quickly became a space for deeper collaboration. We discovered a common passion for research and using evidence to create positive change.
                  </p>
                  
                  <p>
                    We recognized a gap between research and real-world application in the sustainability sector. This led us to establish our firm—grounded in professional expertise and lived experience.
                  </p>
                  
                  {/* Pull Quote - Changed border to green and text to black */}
                  <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#755eb1]/5 to-[#4f7f5d]/5 border-2 border-[#4f7f5d] relative">
                    <div className="absolute -top-3 sm:-top-4 -left-1 sm:-left-2 bg-white px-2 text-[#4f7f5d]">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="sm:w-[30px] sm:h-[30px]">
                         <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                       </svg>
                    </div>
                    
                    <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#2b2e34] italic leading-relaxed">
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