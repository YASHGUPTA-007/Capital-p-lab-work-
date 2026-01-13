'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ServicesSection = () => {
    const services = [
        { title: 'Research & Analysis', desc: 'Transforming complex data into clear, actionable policy recommendations.', num: '01', gradient: 'from-purple-600 to-purple-700' },
        { title: 'Monitoring & Evaluation', desc: 'Robust frameworks to track performance and demonstrate measurable outcomes.', num: '02', gradient: 'from-emerald-600 to-emerald-700' },
        { title: 'Strategy & Advisory', desc: 'Integrating sustainability principles into decision-making and operations.', num: '03', gradient: 'from-purple-700 to-emerald-600' },
        { title: 'Capacity Building', desc: 'Tailored training programs that strengthen institutional capacity.', num: '04', gradient: 'from-emerald-700 to-purple-600' },
        { title: 'Content Development', desc: 'Designing engaging learning materials that inspire change.', num: '05', gradient: 'from-purple-600 to-emerald-600' },
        { title: 'Proposal Development', desc: 'Articulating vision and methodology to stakeholders and funders.', num: '06', gradient: 'from-emerald-600 to-purple-700' },
    ]
  
    return (
      <section id="services" className="px-4 py-32 bg-gradient-to-br from-purple-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full blur-3xl transform-gpu" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full text-xs font-bold uppercase tracking-widest text-purple-800 mb-8">
                Our Expertise
            </span>
            <h2 className="text-6xl md:text-8xl font-serif mt-4 mb-8">
                <span className="bg-gradient-to-br from-purple-900 to-purple-600 bg-clip-text text-transparent">Impact through</span>
                <br/>
                <span className="italic bg-gradient-to-br from-emerald-700 to-emerald-500 bg-clip-text text-transparent">precision.</span>
            </h2>
            <p className="text-xl text-zinc-700 max-w-2xl leading-relaxed">
                We provide research and consulting services that help organizations create measurable impact for <span className="text-emerald-700 font-medium">people</span>, <span className="text-purple-700 font-medium">planet</span>, and prosperity.
            </p>
          </motion.div>
  
          <div className="flex flex-col gap-6">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 blur-xl transition-opacity rounded-2xl",
                    service.gradient
                  )}
                />
                <div className="relative bg-white p-8 md:p-12 rounded-2xl shadow-sm border-2 border-purple-100/50 flex flex-col md:flex-row justify-between items-start md:items-center group-hover:border-purple-300 group-hover:shadow-xl transition-all">
                  <div className="flex gap-8 items-baseline">
                      <span className={cn(
                        "text-sm font-bold font-mono bg-gradient-to-br bg-clip-text text-transparent",
                        service.gradient
                      )}>
                        {service.num}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-serif text-zinc-900 group-hover:italic transition-all">
                        {service.title}
                      </h3>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <p className="text-zinc-600 max-w-md text-lg font-light text-left md:text-right">
                          {service.desc}
                      </p>
                      <ArrowUpRight className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-br bg-clip-text text-transparent",
                        service.gradient
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