'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const TeamSection = () => {
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
    : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  const cardVariants = isMobile
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }

  return (
    <section id="team" className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Optimized background decoration */}
      <div className="absolute top-1/2 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#c1b4df]/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          variants={headerVariants}
          className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight">
            Meet our Team
          </h2>
        </motion.div>
        
        <div className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
          {/* Arti Mishra Saran */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            transition={{ duration: isMobile ? 0.4 : 0.6 }}
            variants={cardVariants}
            className="flex flex-col sm:flex-row gap-5 sm:gap-6 md:gap-8 lg:gap-12 items-start"
          >
            {/* Passport Photo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#c1b4df] shadow-lg group hover:border-[#755eb1] transition-all duration-300">
                <Image 
                  src="/ArtiMishraSaran.png" 
                  alt="Arti Mishra Saran - Founder" 
                  fill
                  className={isMobile 
                    ? "object-cover object-center" 
                    : "object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  }
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                  priority
                  quality={isMobile ? 75 : 85}
                />
                {!isMobile && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#755eb1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#755eb1] mb-1.5 sm:mb-2">
                  Arti Mishra Saran
                </h3>
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#c1b4df]/30 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#755eb1]">
                  Founder
                </span>
              </div>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#4f75d] leading-relaxed">
                Arti Mishra Saran is a research and consulting professional with over 15 years of experience in renewable energy, sustainability, and the development sector. She has led cross-functional teams, managed multi-sector portfolios, and delivered research and advisory services for government, private, and development organizations. Her expertise spans applied research, project management, data analysis, financial modeling, and translating complex policy and technical insights into actionable strategies. She holds a Master's in Business Management from Duke University, a Diploma in Business Sustainability, and is a Certified Project Management Professional. Beyond her professional work, Arti is committed to knowledge sharing and mentorship. She volunteers as a mentor for young students, supporting the next generation of researchers. She is driven by a people-, planet-, and profit-centered approach.
              </p>
            </div>
          </motion.div>

          {/* Dr. V Neha */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            transition={{ duration: isMobile ? 0.4 : 0.6 }}
            variants={cardVariants}
            className="flex flex-col sm:flex-row gap-5 sm:gap-6 md:gap-8 lg:gap-12 items-start"
          >
            {/* Passport Photo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#c7d6c1] shadow-lg group hover:border-[#4f7f5d] transition-all duration-300">
                <Image 
                  src="/Dr. V Neha.png" 
                  alt="Dr. V Neha - Co-Founder" 
                  fill
                  className={isMobile 
                    ? "object-cover object-center" 
                    : "object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  }
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                  priority
                  quality={isMobile ? 75 : 85}
                />
                {!isMobile && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4f7f5d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#4f7f5d] mb-1.5 sm:mb-2">
                  Dr. V Neha
                </h3>
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#c7d6c1]/50 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#4f7f5d]">
                  Co-Founder
                </span>
              </div>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#4f75d] leading-relaxed">
                Dr. V Neha is a researcher, environmental educator, and learning designer who brings together sustainability, environmental policy, and community-centred practice. With nearly a decade of experience, she has designed interdisciplinary learning programmes and contributed to applied research on water security. She holds a PhD in Environmental Policy from the University of Hyderabad and has an interdisciplinary grounding in social sciences. Guided by an inclusive, human-centred approach, she enjoys working at the meeting point of policy and practice. Outside her core work, she finds joy in teaching French and mentoring young learners to apply STEM thinking to real-world issues.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}