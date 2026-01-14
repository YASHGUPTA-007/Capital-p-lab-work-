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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            {/* Changed to "Our Services" with larger font and purple color matching Areas of Focus */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#755eb1] leading-tight mb-6 sm:mb-8">
                Our Services
            </h2>
            {/* Reduced size and changed to black */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-4 mb-6 sm:mb-8 leading-tight text-[#2b2e34]">
                <span>Impact through</span>
                {' '}
                <span className="italic">precision.</span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-[#4f75d] max-w-2xl leading-relaxed">
                We provide research and consulting services that help organizations create measurable impact for <span className="text-[#4f75d] font-semibold">people</span>, <span className="text-[#755eb1] font-semibold">planet</span>, and prosperity.
            </p>
          </motion.div>
  
          {/* Reduced service card sizes */}
          <div className="flex flex-col gap-3 sm:gap-4">
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
                {/* Reduced padding */}
                <div className="relative bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border-2 border-[#c1b4df]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 group-hover:border-[#755eb1]/40 group-hover:shadow-lg transition-all">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 items-baseline w-full md:w-auto">
                      <span className={cn(
                        "text-xs sm:text-sm font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent flex-shrink-0",
                        service.gradient
                      )}>
                        {service.num}
                      </span>
                      {/* Reduced title size */}
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-[#2b2e34] group-hover:text-[#755eb1] transition-colors">
                        {service.title}
                      </h3>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:max-w-md lg:max-w-lg">
                      {/* Reduced description size */}
                      <p className="text-[#4f75d] text-xs sm:text-sm md:text-base font-light text-left md:text-right leading-relaxed flex-grow">
                          {service.desc}
                      </p>
                      <ArrowUpRight className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all",
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