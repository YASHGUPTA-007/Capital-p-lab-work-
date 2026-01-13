'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ServicesSection = () => {
    const services = [
        { 
            title: 'Research & Analysis', 
            desc: 'Transforming complex data into clear, actionable policy recommendations.', 
            num: '01', 
            gradient: 'from-[#755eb1] to-[#6b54a5]' 
        },
        { 
            title: 'Monitoring & Evaluation', 
            desc: 'Robust frameworks to track performance and demonstrate measurable outcomes.', 
            num: '02', 
            gradient: 'from-[#4f75d] to-[#5a8a6a]' 
        },
        { 
            title: 'Strategy & Advisory', 
            desc: 'Integrating sustainability principles into decision-making and operations.', 
            num: '03', 
            gradient: 'from-[#755eb1] to-[#4f75d]' 
        },
        { 
            title: 'Capacity Building', 
            desc: 'Tailored training programs that strengthen institutional capacity.', 
            num: '04', 
            gradient: 'from-[#5a8a6a] to-[#755eb1]' 
        },
        { 
            title: 'Content Development', 
            desc: 'Designing engaging learning materials that inspire change.', 
            num: '05', 
            gradient: 'from-[#755eb1] to-[#4f75d]' 
        },
        { 
            title: 'Proposal Development', 
            desc: 'Articulating vision and methodology to stakeholders and funders.', 
            num: '06', 
            gradient: 'from-[#4f75d] to-[#755eb1]' 
        },
    ]
  
    return (
      <section id="services" className="px-4 sm:px-6 lg:px-12 py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#c1b4df]/20 via-white to-[#c7d6c1]/20 relative overflow-hidden">
        {/* Optimized background decoration */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c7d6c1]/20 rounded-full blur-[100px]" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#c1b4df] to-[#c7d6c1] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#755eb1] mb-6 sm:mb-8">
                Our Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mt-4 mb-6 sm:mb-8 leading-tight">
                <span className="text-[#755eb1]">Impact through</span>
                <br/>
                <span className="italic text-[#4f75d]">precision.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#4f75d] max-w-2xl leading-relaxed">
                We provide research and consulting services that help organizations create measurable impact for <span className="text-[#4f75d] font-semibold">people</span>, <span className="text-[#755eb1] font-semibold">planet</span>, and prosperity.
            </p>
          </motion.div>
  
          <div className="flex flex-col gap-4 sm:gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative"
              >
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 blur-xl transition-opacity rounded-xl sm:rounded-2xl",
                    service.gradient
                  )}
                />
                <div className="relative bg-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm border-2 border-[#c1b4df]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 group-hover:border-[#755eb1]/40 group-hover:shadow-lg transition-all">
                  <div className="flex gap-4 sm:gap-6 md:gap-8 items-baseline w-full md:w-auto">
                      <span className={cn(
                        "text-xs sm:text-sm font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent flex-shrink-0",
                        service.gradient
                      )}>
                        {service.num}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-[#2b2e34] group-hover:text-[#755eb1] transition-colors">
                        {service.title}
                      </h3>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto md:max-w-md lg:max-w-lg">
                      <p className="text-[#4f75d] text-sm sm:text-base md:text-lg font-light text-left md:text-right leading-relaxed flex-grow">
                          {service.desc}
                      </p>
                      <ArrowUpRight className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all",
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