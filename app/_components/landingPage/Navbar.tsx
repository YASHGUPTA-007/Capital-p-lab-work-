'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const Navbar = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none"
    >
      <div className="relative pointer-events-auto">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-600 blur-xl opacity-20 transform-gpu" />
        
        <div className="relative bg-white/80 backdrop-blur-md rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl border-2 border-purple-100">
             <a href="#" className="relative w-10 h-10 rounded-full flex items-center justify-center mr-2 hover:scale-110 transition-transform group overflow-hidden bg-white">
                <Image 
                  src="/logo.png" 
                  alt="The Capital P Lab Logo" 
                  fill
                  className="object-contain p-1.5"
                  sizes="40px"
                  priority
                />
             </a>
             
             <div className="hidden md:flex items-center">
               {['About', 'Focus', 'Services', 'Team', 'Insights'].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => scrollToSection(item.toLowerCase())} 
                    className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-emerald-50 rounded-full transition-all"
                  >
                    {item}
                  </button>
               ))}
             </div>

             <button 
               onClick={() => scrollToSection('contact')} 
               className="px-6 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:from-purple-700 hover:to-emerald-700 transition-all ml-2 shadow-lg"
             >
               Contact
             </button>
        </div>
      </div>
    </motion.nav>
  )
}