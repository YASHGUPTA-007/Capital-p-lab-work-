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
      <span className="ml-1 w-[2px] h-[1em] bg-[#2b2e34] animate-pulse" />
    </span>
  )
}

export const Hero = () => {
  const { scrollY } = useScroll()
  // Only apply scroll animations on desktop
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])
  
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
            src="/Bridging the gap between research and reality.avif" 
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
        style={{ y: isDesktop ? contentY : 0, opacity: isDesktop ? opacity : 1 }}
        className="relative z-10 w-full max-w-[1600px] px-6 py-12 md:px-12 md:pl-32 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-20"
      >
        
        {/* --- LOGO (Left) --- */}
        <div className="relative z-20 flex-shrink-0 group order-1">
          {/* Rings - Hidden on mobile */}
          <div className="hidden md:block absolute inset-0 -m-6 sm:-m-8 border border-[#755eb1]/10 rounded-full" />
          <div className="hidden md:block absolute inset-0 -m-12 sm:-m-16 border border-[#4f75d]/10 rounded-full" />

          {/* Logo Container */}
          <div className="relative w-[45vw] h-[45vw] sm:w-[40vw] sm:h-[40vw] md:w-[24vw] md:h-[24vw] max-w-[320px] max-h-[320px] lg:max-w-[380px] lg:max-h-[380px] bg-white/80 backdrop-blur-xl rounded-full shadow-2xl shadow-[#755eb1]/10 flex items-center justify-center p-2 border border-white/50 md:transition-transform md:duration-300 md:hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c7d6c1]/40 to-[#c1b4df]/40 opacity-50" />
            <img 
              src="/logo.png" 
              alt="The Capital P Lab" 
              className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>


        {/* --- TEXT CONTENT (Right) --- */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 min-w-0">
          <div>
            {/* Typewriter - Changed to Black */}
            <span className="block text-[#2b2e34] font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 h-[1.5em]">
              <Typewriter words={["Driving", "Accelerating", "Transforming"]} />
            </span>
            
            {/* Main Headline - Changed to Purple */}
            <h1 className="text-[#755eb1] text-[11vw] sm:text-[10vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Empowering
            </h1>
            
            {/* Policy Action - Changed to Purple, Removed Full Stop */}
            <h1 className="text-[#755eb1] text-[11vw] sm:text-[10vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Policy Action
            </h1>

            {/* Description */}
            <div className="mt-6 sm:mt-8 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#755eb1] to-[#4f75d]" />
              {/* Changed Planet, People, and Profit to Bold Black */}
              <p className="pl-6 text-[#2b2e34]/70 max-w-lg text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                Turning evidence into reality for <br className="hidden md:block" />
                <span className="text-[#2b2e34] font-bold">Planet</span>, 
                <span className="text-[#2b2e34] font-bold mx-1">People</span>, and 
                <span className="text-[#2b2e34] font-bold"> Profit</span>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- CORNER TAG - Changed to 2025 --- */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 hidden sm:block z-20">
         <span className="text-[10px] font-bold tracking-[0.2em] text-[#755eb1] opacity-50">EST. 2025</span>
      </div>

    </section>
  )
}