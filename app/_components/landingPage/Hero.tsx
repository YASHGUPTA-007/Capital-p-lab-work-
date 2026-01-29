'use client'

import React, { useState, useEffect, useMemo, memo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

// --- TYPEWRITER COMPONENT ---
const Typewriter = memo(({ words }: { words: string[] }) => {
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
})
Typewriter.displayName = 'Typewriter'

export const Hero = memo(() => {
  const { scrollY } = useScroll()
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Existing transforms for content
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const contentY = useTransform(scrollY, [0, 400], [0, 80])
  
  // New transform for background parallax effect
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.05])

  const typewriterWords = useMemo(() => ["Driving", "Accelerating", "Transforming"], [])

  return (
    <section 
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-[#f4f7f5] selection:bg-[#c7d6c1] selection:text-[#4f75d]"
    >
      
      {/* --- ENHANCED BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* 1. Image Layer with Parallax Scale */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 origin-center">
          <Image 
            src="/Bridging the gap between research and reality.avif" 
            alt="Policy collaboration"
            fill
            // Removed grayscale for a more vibrant, premium feel
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </motion.div>
        
        {/* 2. Sophisticated Mesh Gradient Overlay & Subtle Blur */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f7f5]/98 via-[#f4f7f5]/85 to-[#c7d6c1]/10" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        
        {/* 3. Animated Accent Blobs & Noise Texture (Desktop Only to save mobile perf) */}
        {isDesktop && (
          <>
            {/* Green blob with slow pulse animation */}
            <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-[#4f7f5d]/20 rounded-full blur-[120px] mix-blend-multiply will-change-transform animate-[pulse_8s_ease-in-out_infinite]" />
            {/* Purple blob */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#755eb1]/20 rounded-full blur-[120px] mix-blend-multiply will-change-transform" />
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </>
        )}
      </div>


      {/* --- DESKTOP LAYOUT (768px+) - Client Requirements Maintained --- */}
      <motion.div 
        style={{ y: isDesktop ? contentY : 0, opacity: isDesktop ? opacity : 1 }}
        className="hidden md:flex relative z-10 w-full max-w-[1600px] px-12 pl-32 items-center justify-center gap-20 will-change-transform"
      >
        {/* Logo with Organization Name */}
        <div className="relative z-20 flex-shrink-0 group flex flex-col items-center">
          {/* Client Req: Organization Name Above Logo with specific color */}
          <div className="mb-6 text-center">
            <h2 className="text-[#4f7f5d] text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm">
              The Capital P Lab
            </h2>
            <div className="mt-2 h-[3px] w-24 mx-auto bg-[#4f7f5d]/30 rounded-full" />
          </div>
          
          <div className="absolute inset-0 -m-8 border border-[#4f7f5d]/10 rounded-full animate-pulse" />
          
          {/* Increased Logo Size (w-24vw -> w-28vw) */}
          <div className="relative w-[28vw] h-[28vw] max-w-[420px] max-h-[420px] bg-white/90 backdrop-blur-xl rounded-full shadow-2xl shadow-[#4f7f5d]/10 flex items-center justify-center p-2 border border-white transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c7d6c1]/20 to-[#4f7f5d]/10 opacity-50" />
            <Image 
              src="/logo.png" 
              alt="The Capital P Lab Logo" 
              fill
              className="object-contain rounded-full relative z-10 drop-shadow-md p-6"
              priority
              sizes="(min-width: 768px) 28vw, 0px"
              quality={95}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start text-left min-w-0">
          <div>
            <span className="block text-[#2b2e34] font-serif italic text-3xl lg:text-4xl mb-3 h-[1.5em]">
              <Typewriter words={typewriterWords} />
            </span>
            <h1 className="text-[#755eb1] text-[6.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Empowering
            </h1>
            <h1 className="text-[#755eb1] text-[6.5vw] font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
              Policy Action
            </h1>
            <div className="mt-8 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#755eb1] to-[#4f75d]" />
              <p className="pl-6 text-[#2b2e34]/70 max-w-lg text-lg font-medium leading-relaxed">
                Turning evidence into reality for <br />
                <span className="text-[#2b2e34] font-bold">Planet · People · Profit</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>


      {/* --- MOBILE LAYOUT - Client Requirements Maintained --- */}
<div className="md:hidden relative z-10 w-full h-full flex flex-col items-center justify-between pt-20 pb-10 px-6">
        
        {/* Top: Organization Name + Logo */}
        <div className="flex-shrink-0 mt-4 flex flex-col items-center">
          {/* Client Req: Name above logo with specific color */}
          <div className="mb-5 text-center">
            <h2 className="text-[#4f7f5d] text-3xl font-black tracking-tight">
              The Capital P Lab
            </h2>
            <div className="mt-1 h-[2px] w-16 mx-auto bg-[#4f7f5d]/40" />
          </div>
          
          {/* Increased Logo Size (120px -> 160px) */}
          <div className="relative w-[160px] h-[160px] bg-white rounded-full shadow-2xl flex items-center justify-center p-3 border-4 border-white">
            <Image 
              src="/logo.png" 
              alt="The Capital P Lab" 
              fill
              className="object-contain rounded-full relative z-10 p-2"
              priority
              sizes="160px"
              quality={95}
            />
          </div>
        </div>

        {/* Middle: Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-[360px] mt-8">
          
          <div>
            <span className="block text-[#2b2e34] font-serif italic text-xl h-[1.4em]">
              <Typewriter words={typewriterWords} />
            </span>
          </div>
          
          <div className="space-y-0">
            <h1 className="text-[#755eb1] text-[10vw] font-black tracking-tighter leading-[0.85] uppercase">
              Empowering
            </h1>
            <h1 className="text-[#755eb1] text-[10vw] font-black tracking-tighter leading-[0.85] uppercase">
              Policy
            </h1>
            <h1 className="text-[#755eb1] text-[10vw] font-black tracking-tighter leading-[0.85] uppercase">
              Action
            </h1>
          </div>

          <div className="bg-white/95 rounded-2xl p-6 border border-white shadow-xl">
            <p className="text-[#2b2e34]/80 text-sm font-medium leading-relaxed">
              Turning evidence into reality for{' '}
              <span className="text-[#4f7f5d] font-bold">Planet</span>,{' '}
              <span className="text-[#4f7f5d] font-bold">People</span> and{' '}
              <span className="text-[#4f7f5d] font-bold">Profit</span>.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <div className="bg-[#e8f1e6] rounded-full px-4 py-2 border border-[#c7d6c1]">
              <span className="text-[#2b2e34] text-xs font-bold">🌍 Planet</span>
            </div>
            <div className="bg-[#ede8f5] rounded-full px-4 py-2 border border-[#c1b4df]">
              <span className="text-[#2b2e34] text-xs font-bold">👥 People</span>
            </div>
            <div className="bg-[#f0ebf8] rounded-full px-4 py-2 border border-[#755eb1]">
              <span className="text-[#2b2e34] text-xs font-bold">💰 Profit</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 mt-8">
           {/* Space for additional footer elements if needed */}
        </div>
      </div>
    </section>
  )
})
Hero.displayName = 'Hero'