'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Globe } from 'lucide-react'

// --- 1. OPTIMIZED TYPEWRITER COMPONENT ---
const Typewriter = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, words])

  return (
    <span className="inline-flex items-center">
      {words[index].substring(0, subIndex)}
      <span className="ml-1 w-[2px] h-[1em] bg-[#755eb1] animate-pulse" />
    </span>
  )
}

export const Hero = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const contentY = useTransform(scrollY, [0, 400], [0, 80])

  return (
    <section 
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-[#f4f7f5] selection:bg-[#c7d6c1] selection:text-[#4f75d]"
    >
      
      {/* --- OPTIMIZED BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Static Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop" 
            alt="Policy collaboration"
            className="w-full h-full object-cover grayscale-[15%]" 
            loading="eager"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f5]/95 via-[#f4f7f5]/85 to-[#f4f7f5]/95" />
        
        {/* Static Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#c7d6c1]/30 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#c1b4df]/30 rounded-full blur-[100px] mix-blend-multiply" />
        
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>


      {/* --- MAIN CONTENT --- */}
      <motion.div 
        style={{ y: contentY, opacity }}
        // UPDATED:
        // 1. `gap-16` (increased from 8) to prevents rings from overlapping text on mobile
        // 2. `py-12` ensures top/bottom rings aren't cut off by the screen edge
        // 3. `md:pl-32` keeps your desktop right-shift
        className="relative z-10 w-full max-w-[1600px] px-6 py-12 md:px-12 md:pl-32 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-20"
      >
        
        {/* --- LOGO (Left) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-20 flex-shrink-0 group order-1"
        >
          {/* Rings - CSS Only */}
          {/* Note: The largest ring is -m-12 (3rem/48px). The gap-16 (4rem/64px) above ensures it doesn't touch the text. */}
          <div className="absolute inset-0 -m-6 sm:-m-8 border border-[#755eb1]/10 rounded-full" />
          <div className="absolute inset-0 -m-12 sm:-m-16 border border-[#4f75d]/10 rounded-full" />

          {/* Logo Container */}
          <div className="relative w-[45vw] h-[45vw] sm:w-[40vw] sm:h-[40vw] md:w-[24vw] md:h-[24vw] max-w-[320px] max-h-[320px] lg:max-w-[380px] lg:max-h-[380px] bg-white/80 backdrop-blur-xl rounded-full shadow-2xl shadow-[#755eb1]/10 flex items-center justify-center p-2 border border-white/50 transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c7d6c1]/40 to-[#c1b4df]/40 opacity-50" />
            <img 
              src="/logo.png" 
              alt="The Capital P Lab" 
              className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-sm"
              loading="eager"
            />
          </div>
        </motion.div>


        {/* --- TEXT CONTENT (Right) --- */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 min-w-0">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Typewriter */}
            <span className="block text-[#755eb1] font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 h-[1.5em]">
              <Typewriter words={["Driving", "Accelerating", "Transforming"]} />
            </span>
            
            {/* Main Headline */}
            <h1 className="text-[#2b2e34] text-[11vw] sm:text-[10vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Empowering
            </h1>
            
            <h1 className="text-[#2b2e34] text-[11vw] sm:text-[10vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Policy <span className="text-[#4f75d]">Action</span><span className="text-[#755eb1]">.</span>
            </h1>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 sm:mt-8 relative"
            >
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#755eb1] to-[#4f75d]" />
              <p className="pl-6 text-[#2b2e34]/70 max-w-lg text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                Turning evidence into reality for <br className="hidden md:block" />
                <span className="text-[#4f75d] font-bold">Planet</span>, 
                <span className="text-[#755eb1] font-bold mx-1">People</span>, and 
                <span className="text-[#2b2e34] font-bold">Profit</span>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* --- CORNER TAG --- */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 hidden sm:block z-20">
         <span className="text-[10px] font-bold tracking-[0.2em] text-[#755eb1] opacity-50">EST. 2026</span>
      </div>

    </section>
  )
}