'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ServicesSection = () => {
    const [isDesktop, setIsDesktop] = useState(false)
    
    useEffect(() => {
      setIsDesktop(window.innerWidth >= 768)
    }, [])

    const services = [
        { 
            title: 'Research & Analysis', 
            desc: 'Transforming complex data into clear, actionable policy recommendations.', 
            num: '01', 
            gradient: 'from-[#755eb1] to-[#6b54a5]' 
        },
        { 
            title: 'Strategy & Advisory', 
            desc: 'Integrating sustainability principles into decision-making and operations.', 
            num: '02', 
            gradient: 'from-[#755eb1] to-[#4f75d]' 
        },
        { 
            title: 'Capacity Building', 
            desc: 'Tailored training programs that strengthen institutional capacity.', 
            num: '03', 
            gradient: 'from-[#5a8a6a] to-[#755eb1]' 
        },
        { 
            title: 'Content Development', 
            desc: 'Designing engaging learning materials that inspire change.', 
            num: '04', 
            gradient: 'from-[#755eb1] to-[#4f75d]' 
        },
        { 
            title: 'Proposal Development', 
            desc: 'Articulating vision and methodology to stakeholders and funders.', 
            num: '05', 
            gradient: 'from-[#4f75d] to-[#755eb1]' 
        },
    ]
  
    return (
      <section id="services" className="px-4 sm:px-6 lg:px-12 py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#c1b4df]/20 via-white to-[#c7d6c1]/20 relative overflow-hidden">
        {/* Optimized background decoration */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c7d6c1]/20 rounded-full blur-[100px]" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div 
            initial={isDesktop ? { opacity: 0, y: 30 } : false}
            whileInView={isDesktop ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#755eb1] leading-tight mb-6 sm:mb-8">
                Our Services
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-4 mb-6 sm:mb-8 leading-tight text-[#4f7f5d]">
                <span>Impact through</span>
                {' '}
                <span className="italic">precision.</span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-[#4f75d] max-w-2xl leading-relaxed">
                We provide research and consulting services that help organizations create measurable impact for <span className="text-[#755eb1] font-semibold">planet</span>, <span className="text-[#755eb1] font-semibold">people</span> and <span className="text-[#755eb1] font-semibold">profit</span>
            </p>
          </motion.div>
  
          {/* Service cards */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={isDesktop ? { opacity: 0, y: 30 } : false}
                whileInView={isDesktop ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: isDesktop ? i * 0.08 : 0, duration: 0.5 }}
                className="group relative"
              >
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 md:group-hover:opacity-5 blur-xl md:transition-opacity rounded-xl sm:rounded-2xl",
                    service.gradient
                  )}
                />
                <div className="relative bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border-2 border-[#c1b4df]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 md:group-hover:border-[#755eb1]/40 md:group-hover:shadow-lg md:transition-all">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 items-baseline w-full md:w-auto">
                      <span className={cn(
                        "text-xs sm:text-sm font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent flex-shrink-0",
                        service.gradient
                      )}>
                        {service.num}
                      </span>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-[#2b2e34] md:group-hover:text-[#755eb1] md:transition-colors">
                        {service.title}
                      </h3>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:max-w-md lg:max-w-lg">
                      <p className="text-[#4f75d] text-xs sm:text-sm md:text-base font-light text-left md:text-right leading-relaxed flex-grow">
                          {service.desc}
                      </p>
                      <ArrowUpRight className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-1 md:group-hover:-translate-y-1 md:transition-all",
                        "text-[#755eb1]"
                      )} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
}