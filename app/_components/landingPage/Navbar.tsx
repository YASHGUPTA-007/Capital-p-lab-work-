'use client'

import React, { useState, useEffect, memo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export const Navbar = memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMobileMenuOpen])

  const scrollToSection = useCallback((id: string) => {
    setIsMobileMenuOpen(false)
    
    if (!isHomePage) {
      // Navigate to home page with hash - page.tsx will handle scrolling
      window.location.href = `/#${id}`
      return
    }

    // On homepage - scroll immediately
    const element = document.getElementById(id)
    if (element) {
      const navbarHeight = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navbarHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [isHomePage])

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Focus', id: 'focus' },
    { label: 'Services', id: 'services' },
    { label: 'Insights', id: 'insights' },
    { label: 'Team', id: 'team' }
  ]

  return (
    <>
      <nav 
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto px-4 sm:px-6 flex justify-center pointer-events-none"
      >
        <div className="relative pointer-events-auto w-full sm:w-auto">
          <div className={`absolute inset-0 bg-gradient-to-r from-[#755eb1] to-[#4f475d] blur-xl transition-opacity duration-300 ${scrolled ? 'opacity-30' : 'opacity-20'}`} />
          
          <div className="relative bg-white/90 backdrop-blur-md rounded-full px-3 sm:px-2 py-2 flex items-center justify-between sm:gap-2 shadow-xl border-2 border-[#c1b4df]/40">
            {/* Logo */}
            <Link 
              href="/"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center sm:mr-2 hover:scale-110 transition-transform overflow-hidden bg-white flex-shrink-0"
            >
              <Image 
                src="/logo.png" 
                alt="The Capital P Lab Logo" 
                fill
                className="object-contain p-1.5"
                sizes="40px"
                priority
                quality={90}
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)} 
                  className="px-4 lg:px-5 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[#4f475d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1] rounded-full transition-all"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Blog Link */}
              <Link 
                href="/blogs"
                className={`px-4 lg:px-5 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest rounded-full transition-all ${
                  pathname.startsWith('/blogs')
                    ? 'bg-gradient-to-r from-[#c1b4df]/30 to-[#c7d6c1]/30 text-[#755eb1]'
                    : 'text-[#4f475d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1]'
                }`}
              >
                Blog
              </Link>
            </div>

            {/* Contact Button */}
            <button 
              onClick={() => scrollToSection('contact')} 
              className="hidden sm:block px-4 lg:px-6 py-2 bg-gradient-to-r from-[#755eb1] to-[#4f475d] text-white rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all sm:ml-2 shadow-lg"
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
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-[#c1b4df]/40 z-50 md:hidden overflow-hidden">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-5 py-3 text-sm font-bold uppercase tracking-widest text-[#4f475d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1] rounded-xl transition-all"
                >
                  {item.label}
                </button>
              ))}
              
              <Link
                href="/blogs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-5 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                  pathname.startsWith('/blogs')
                    ? 'bg-gradient-to-r from-[#c1b4df]/30 to-[#c7d6c1]/30 text-[#755eb1]'
                    : 'text-[#4f475d] hover:bg-gradient-to-r hover:from-[#c1b4df]/30 hover:to-[#c7d6c1]/30 hover:text-[#755eb1]'
                }`}
              >
                Blog
              </Link>
              
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full px-5 py-3 bg-gradient-to-r from-[#755eb1] to-[#4f475d] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-lg"
              >
                Contact
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
})
Navbar.displayName = 'Navbar'