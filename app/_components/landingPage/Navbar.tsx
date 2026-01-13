'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const navItems = ['About', 'Focus', 'Services', 'Insights', 'Team']

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto px-4 sm:px-6 flex justify-center pointer-events-none"
      >
        <div className="relative pointer-events-auto w-full sm:w-auto">
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#755eb1] to-[#4f75d] blur-xl transition-opacity duration-300 ${scrolled ? 'opacity-30' : 'opacity-20'}`} />
          
          <div className="relative bg-white/90 backdrop-blur-md rounded-full px-3 sm:px-2 py-2 flex items-center justify-between sm:gap-2 shadow-xl border-2 border-[#c1b4df]/40">
               {/* Logo */}
               <a 
                 href="#" 
                 onClick={(e) => {
                   e.preventDefault()
                   window.scrollTo({ top: 0, behavior: 'smooth' })
                 }}
                 className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center sm:mr-2 hover:scale-110 transition-transform overflow-hidden bg-white flex-shrink-0"
               >
                  <Image 
                    src="/logo.png" 
                    alt="The Capital P Lab Logo" 
                    fill
                    className="object-contain p-1.5"
                    sizes="40px"
                    priority
                  />
               </a>
               
               {/* Desktop Navigation */}
               <div className="hidden md:flex items-center">
                 {navItems.map((item) => (
                    <button 
                      key={item} 
                      onClick={() => scrollToSection(item.toLowerCase())} 
                      className="px-4 lg:px-5 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[#4f75d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1] rounded-full transition-all"
                    >
                      {item}
                    </button>
                 ))}
               </div>

               {/* Contact Button */}
               <button 
                 onClick={() => scrollToSection('contact')} 
                 className="hidden sm:block px-4 lg:px-6 py-2 bg-gradient-to-r from-[#755eb1] to-[#4f75d] text-white rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all sm:ml-2 shadow-lg"
               >
                 Contact
               </button>

               {/* Mobile Menu Button */}
               <button 
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className="md:hidden p-2 text-[#755eb1] hover:bg-[#c1b4df]/20 rounded-full transition-colors"
                 aria-label="Toggle menu"
               >
                 {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
               </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-[#c1b4df]/40 z-50 md:hidden overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="w-full text-left px-5 py-3 text-sm font-bold uppercase tracking-widest text-[#4f75d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1] rounded-xl transition-all"
                  >
                    {item}
                  </motion.button>
                ))}
                
                {/* Contact Button in Mobile */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={() => scrollToSection('contact')}
                  className="w-full px-5 py-3 bg-gradient-to-r from-[#755eb1] to-[#4f75d] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-lg"
                >
                  Contact
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}