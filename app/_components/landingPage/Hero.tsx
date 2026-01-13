'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FloatingOrbs } from '../BackgroundElements'
import { cn } from '@/lib/utils'

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-[#e6e0f3] via-white to-[#bee3b7]/20">
      <FloatingOrbs />
      
      {/* Floating badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-8 right-8 md:top-12 md:right-12 hidden md:block"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-emerald-500 blur-xl opacity-30 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full border-2 border-purple-600/20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-purple-800 font-bold block">Est.</span>
              <span className="text-2xl font-serif text-purple-900">2024</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity }}
          className="mb-12 mt-20 md:mt-32"
        >
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
            Empowering Policy Action
          </span>
        </motion.div>

        {/* Main headline with artistic typography */}
        <motion.div className="mb-16">
          <motion.h1 
            style={{ y: y1 }} 
            className="text-[11vw] md:text-[10vw] leading-[0.85] font-serif tracking-tighter will-change-transform"
          >
            <span className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 bg-clip-text text-transparent inline-block">
              Evidence
            </span>
            <br/>
            <span className="text-zinc-800">into</span>
          </motion.h1>
          
          <div className="flex items-center gap-4 md:gap-12 ml-[8vw] md:ml-[12vw] mt-2">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: "12vw" }} 
              transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
              className="h-[3px] bg-gradient-to-r from-emerald-600 to-purple-600 mt-4 md:mt-8 hidden md:block" 
            />
            <motion.h1 
              style={{ y: y2 }} 
              className="text-[11vw] md:text-[10vw] leading-[0.85] font-serif tracking-tighter will-change-transform"
            >
              <span className="bg-gradient-to-br from-emerald-700 via-emerald-500 to-emerald-700 bg-clip-text text-transparent italic inline-block">
                Impact.
              </span>
            </motion.h1>
          </div>
        </motion.div>
        
        {/* Three Pillars - Enhanced */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-6 mb-16"
        >
          {[
            { label: 'Planet', gradient: 'from-emerald-600 to-emerald-700', textColor: 'text-emerald-700' },
            { label: 'People', gradient: 'from-purple-600 to-purple-700', textColor: 'text-purple-700' },
            { label: 'Profit', gradient: 'from-emerald-700 to-purple-700', textColor: 'text-purple-700' }
          ].map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="relative group cursor-pointer"
            >
              {/* Glow effect on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500",
                pillar.gradient
              )} />
              
              {/* Pill container */}
              <div className={cn(
                "relative px-8 py-3 bg-white/80 backdrop-blur-sm rounded-full border-2 transition-all duration-300",
                "group-hover:scale-105 group-hover:shadow-lg",
                i === 0 ? "border-emerald-300 group-hover:border-emerald-500" :
                i === 1 ? "border-purple-300 group-hover:border-purple-500" :
                "border-purple-300 group-hover:border-emerald-500"
              )}>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-[0.3em] transition-colors",
                  pillar.textColor,
                  "group-hover:scale-105"
                )}>
                  {pillar.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Description with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-2xl ml-auto relative mb-16 md:mb-24"
        >
          <div className="absolute -left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-600 via-emerald-500 to-purple-600" />
          <div className="pl-12 pr-8 py-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50 shadow-xl">
            <p className="text-xl md:text-2xl font-light text-zinc-700 leading-relaxed">
              At The Capital P Lab, our focus on <span className="text-purple-700 font-medium">sustainability and beyond</span> fuels impactful research that elevates policy advocacy, driving meaningful change across <span className="text-emerald-700 font-medium">public and private sectors in India</span>.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-purple-600 font-bold">Scroll</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-purple-600 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}