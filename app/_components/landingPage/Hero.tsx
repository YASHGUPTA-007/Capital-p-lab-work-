'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// --- TYPEWRITER COMPONENT ---
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
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <img 
            src="/Bridging the gap between research and reality.avif" 
            alt="Policy collaboration"
            className="w-full h-full object-cover grayscale-[15%]" 
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f5]/95 via-[#f4f7f5]/85 to-[#f4f7f5]/95" />
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#c7d6c1]/30 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#c1b4df]/30 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>


      {/* --- DESKTOP LAYOUT (768px+) --- */}
      <motion.div 
        style={{ y: isDesktop ? contentY : 0, opacity: isDesktop ? opacity : 1 }}
        className="hidden md:flex relative z-10 w-full max-w-[1600px] px-12 pl-32 items-center justify-center gap-20"
      >
        {/* Logo */}
        <div className="relative z-20 flex-shrink-0 group">
          <div className="absolute inset-0 -m-8 border border-[#755eb1]/10 rounded-full" />
          <div className="absolute inset-0 -m-16 border border-[#4f75d]/10 rounded-full" />
          <div className="relative w-[24vw] h-[24vw] max-w-[380px] max-h-[380px] bg-white/80 backdrop-blur-xl rounded-full shadow-2xl shadow-[#755eb1]/10 flex items-center justify-center p-2 border border-white/50 transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c7d6c1]/40 to-[#c1b4df]/40 opacity-50" />
            <img 
              src="/logo.png" 
              alt="The Capital P Lab" 
              className="w-full h-full object-contain rounded-full relative z-10 drop-shadow-sm"
              loading="eager"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start text-left min-w-0">
          <div>
            <span className="block text-[#2b2e34] font-serif italic text-3xl lg:text-4xl mb-3 h-[1.5em]">
              <Typewriter words={["Driving", "Accelerating", "Transforming"]} />
            </span>
            <h1 className="text-[#755eb1] text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Empowering
            </h1>
            <h1 className="text-[#755eb1] text-[7.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Policy Action
            </h1>
            <div className="mt-8 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#755eb1] to-[#4f75d]" />
              <p className="pl-6 text-[#2b2e34]/70 max-w-lg text-lg font-medium leading-relaxed">
                Turning evidence into reality for <br />
                <span className="text-[#2b2e34] font-bold">Planet</span>, 
                <span className="text-[#2b2e34] font-bold mx-1">People</span>, and 
                <span className="text-[#2b2e34] font-bold"> Profit</span>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>


      {/* --- MOBILE LAYOUT (below 768px) --- */}
      <div className="md:hidden relative z-10 w-full h-full flex flex-col items-center justify-between py-8 px-6">
        
        {/* Top: Logo */}
        <div className="flex-shrink-0 mt-8">
          <div className="relative w-[120px] h-[120px] bg-white/95 backdrop-blur-xl rounded-full shadow-2xl shadow-[#755eb1]/20 flex items-center justify-center p-2 border-2 border-white/80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c7d6c1]/50 to-[#c1b4df]/50 opacity-60" />
            <img 
              src="/logo.png" 
              alt="The Capital P Lab" 
              className="w-full h-full object-contain rounded-full relative z-10"
              loading="eager"
            />
          </div>
        </div>

        {/* Middle: Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 max-w-[360px]">
          
          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block text-[#2b2e34] font-serif italic text-xl h-[1.4em]">
              <Typewriter words={["Driving", "Accelerating", "Transforming"]} />
            </span>
          </motion.div>
          
          {/* Headlines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-0"
          >
            <h1 className="text-[#755eb1] text-[14vw] font-black tracking-tighter leading-[0.85] uppercase">
              Empowering
            </h1>
            <h1 className="text-[#755eb1] text-[14vw] font-black tracking-tighter leading-[0.85] uppercase">
              Policy
            </h1>
            <h1 className="text-[#755eb1] text-[14vw] font-black tracking-tighter leading-[0.85] uppercase">
              Action
            </h1>
          </motion.div>

          {/* Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/90 shadow-lg"
          >
            <p className="text-[#2b2e34]/80 text-sm font-medium leading-relaxed">
              Turning evidence into reality for{' '}
              <span className="text-[#755eb1] font-bold">Planet</span>,{' '}
              <span className="text-[#755eb1] font-bold">People</span>, and{' '}
              <span className="text-[#755eb1] font-bold">Profit</span>.
            </p>
          </motion.div>

          {/* 3 Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex items-center justify-center gap-3 mt-3"
          >
            <div className="bg-[#c7d6c1]/30 backdrop-blur-sm rounded-full px-4 py-2 border border-[#c7d6c1]/50">
              <span className="text-[#2b2e34] text-xs font-bold">🌍 Planet</span>
            </div>
            <div className="bg-[#c1b4df]/30 backdrop-blur-sm rounded-full px-4 py-2 border border-[#c1b4df]/50">
              <span className="text-[#2b2e34] text-xs font-bold">👥 People</span>
            </div>
            <div className="bg-[#755eb1]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-[#755eb1]/40">
              <span className="text-[#2b2e34] text-xs font-bold">💰 Profit</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom: EST 2025 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex-shrink-0 mb-4"
        >
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#755eb1]/60">EST. 2025</span>
        </motion.div>
      </div>

      {/* --- CORNER TAG (Desktop Only) --- */}
      <div className="absolute top-6 right-6 hidden md:block z-20">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#755eb1] opacity-50">EST. 2025</span>
      </div>

    </section>
  )
}