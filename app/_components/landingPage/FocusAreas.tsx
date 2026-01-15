'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Detailed content for each focus area
const focusDetails = {
  accessibility: {
    fullTitle: "Accessibility & Inclusion",
    sections: [
      {
        title: "Our Approach",
        content: "We work at the intersection of inclusive design and policy advocacy. Our research examines barriers to participation across education, employment, and public services, with a focus on evidence-based interventions that advance equity."
      },
      {
        title: "Key Areas",
        points: [
          "Neurodiversity awareness and workplace inclusion",
          "Accessibility awareness and inclusive design frameworks",
          "Policy analysis for disability rights and social protection",
          "Community consultation and participatory research"
        ]
      },
      {
        title: "Impact",
        content: "Our work supports organizations in building more inclusive environments, informs policy development, and contributes to broader conversations on equity and social justice."
      }
    ]
  },
  emotion: {
    fullTitle: "Sustainability Emotions",
    sections: [
      {
        title: "Our Approach",
        content: "We explore the psychological dimensions of climate change and environmental degradation, examining how emotional responses—such as eco-anxiety, climate grief, and hope—shape engagement with sustainability. Our research integrates insights from environmental psychology and mental health practices."
      },
      {
        title: "Key Areas",
        points: [
          "Climate anxiety and emotional resilience",
          "Psychological impact of environmental change",
          "Community-level emotional responses to sustainability transitions",
          "Integration of mental health into climate policy"
        ]
      },
      {
        title: "Impact",
        content: "By recognizing the emotional dimensions of sustainability, we help organizations and policymakers design interventions that are both effective and human-centered."
      }
    ]
  },
  practices: {
    fullTitle: "Sustainable Practices",
    sections: [
      {
        title: "Our Approach",
        content: "We apply behavioral science to understand and influence sustainable consumption patterns. Our research examines how individuals and organizations make decisions about resource use, waste management, and purchasing behavior."
      },
      {
        title: "Key Areas",
        points: [
          "Consumer behavior and sustainable consumption",
          "Circular economy models and waste reduction",
          "Review of Public and Private Sector Sustainability Strategies"
        ]
      },
      {
        title: "Impact",
        content: "Our work supports businesses and policymakers in designing programs that encourage responsible consumption, reduce environmental footprints, and promote long-term sustainability."
      }
    ]
  },
  esg: {
    fullTitle: "ESG Interdependencies",
    sections: [
      {
        title: "Our Approach",
        content: "We analyze how environmental, social, and governance factors interact across sectors and scales. Our research examines trade-offs, synergies, and unintended consequences in sustainability initiatives, supporting more integrated and effective decision-making."
      },
      {
        title: "Key Areas",
        points: [
          "Systemic Analysis of interconnected ESG impacts across sectors",
          "Policy coherence across SDGs"
        ]
      },
      {
        title: "Impact",
        content: "By mapping interdependencies, we help organizations avoid siloed approaches and develop strategies that address multiple dimensions of sustainability simultaneously."
      }
    ]
  }
}

interface FocusCardProps {
  title: string
  desc: string
  bgColor: string
  textColor: string
  hoverBg: string
  image: string
  detailKey: keyof typeof focusDetails
  index: number
  isMobile: boolean
}

const FocusCard = ({ title, desc, bgColor, textColor, hoverBg, image, detailKey, index, isMobile }: FocusCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const details = focusDetails[detailKey]

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Simpler animations for mobile
  const cardVariants = isMobile 
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }

  return (
    <>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
        transition={{ 
          delay: isMobile ? 0 : index * 0.1, 
          duration: isMobile ? 0.3 : 0.5 
        }}
        variants={cardVariants}
        className="group h-full"
      >
        <div 
          className={cn(
            "relative rounded-2xl sm:rounded-3xl flex flex-col h-full min-h-[420px] sm:min-h-[450px]",
            "transition-all duration-300 ease-out",
            "border-2 border-transparent",
            "overflow-hidden",
            bgColor,
            hoverBg,
            "active:scale-[0.98] sm:active:scale-100", // Mobile tap feedback
            "hover:shadow-xl hover:border-[#755eb1]/20",
            "cursor-pointer"
          )}
          onClick={() => setIsOpen(true)}
        >
          {/* Image Section */}
          <div className="relative w-full h-48 sm:h-56 overflow-hidden">
            <Image 
              src={image}
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform",
                isMobile ? "duration-300" : "duration-500 group-hover:scale-105"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={index < 2} // Prioritize first 2 images
              quality={isMobile ? 75 : 85} // Lower quality on mobile
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-40",
              textColor === "text-white" ? "from-[#755eb1]" : "from-[#755eb1]/30"
            )} />
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h3 className={cn(
                "text-2xl sm:text-3xl font-serif leading-tight flex-grow",
                textColor
              )}>
                {title}
              </h3>
              <ArrowUpRight 
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ml-2",
                  isMobile ? "transition-transform duration-200" : "transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
                  textColor === "text-white" ? "text-white" : "text-[#755eb1]"
                )} 
              />
            </div>
            
            <p className={cn(
              "text-sm sm:text-base leading-relaxed mb-6 flex-grow",
              textColor === "text-white" ? "text-white/90" : "text-[#4f75d]"
            )}>
              {desc}
            </p>

            {/* Learn More Button */}
            <button
              className={cn(
                "inline-flex items-center gap-2 text-sm font-semibold transition-all",
                isMobile ? "duration-200" : "duration-300 group-hover:gap-3",
                textColor === "text-white" ? "text-white" : "text-[#755eb1]"
              )}
            >
              <span>Learn More</span>
              <ChevronDown className={cn(
                "w-4 h-4 rotate-[-90deg] transition-transform",
                isMobile ? "duration-200" : "duration-300 group-hover:translate-x-1"
              )} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 50 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 50 : 20 }}
              transition={{ duration: isMobile ? 0.25 : 0.3, ease: "easeOut" }}
              className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-24 z-50 overflow-hidden"
            >
              <div 
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl h-full flex flex-col max-w-5xl mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative h-40 sm:h-48 md:h-64 flex-shrink-0">
                  <Image 
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    quality={isMobile ? 75 : 85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#755eb1] to-transparent opacity-60" />
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors active:scale-95"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-[#755eb1]" />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white font-medium">
                      {details.fullTitle}
                    </h2>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto p-5 sm:p-6 md:p-8 lg:p-10 overscroll-contain">
                  <div className="max-w-3xl space-y-6 sm:space-y-8">
                    {details.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[#755eb1] mb-3 sm:mb-4">
                          {section.title}
                        </h3>
                        {section.content && (
                          <p className="text-sm sm:text-base text-[#4f75d] leading-relaxed mb-3 sm:mb-4">
                            {section.content}
                          </p>
                        )}
                        {section.points && (
                          <ul className="space-y-2 sm:space-y-3">
                            {section.points.map((point, pidx) => (
                              <li key={pidx} className="flex items-start gap-2 sm:gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#755eb1] mt-2 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-[#4f75d] leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export const FocusSection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    
    // Optional: Update on resize (debounced)
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const areas = [
    { 
      title: "Accessibility & Inclusion", 
      desc: "Advancing inclusion through evidence-based research and neurodiversity awareness.", 
      bgColor: "bg-[#c1b4df]",
      textColor: "text-[#755eb1]",
      hoverBg: "hover:bg-[#b5a6d8]",
      image: "/Accessibility & Inclusion.avif",
      detailKey: "accessibility" as const
    },
    { 
      title: "Sustainability Emotions", 
      desc: "Integrating climate research with the emotional dimensions of mental health.", 
      bgColor: "bg-[#c7d6c1]",
      textColor: "text-[#4f75d]",
      hoverBg: "hover:bg-[#bccfb6]",
      image: "/sustainablity emotion.png",
      detailKey: "emotion" as const
    },
    { 
      title: "Sustainable Practices", 
      desc: "Behavioral science-informed research supporting responsible consumption.", 
      bgColor: "bg-[#755eb1]",
      textColor: "text-white",
      hoverBg: "hover:bg-[#6b54a5]",
      image: "/Sustainable Practices.avif",
      detailKey: "practices" as const
    },
    { 
      title: "ESG Interdependencies", 
      desc: "Analyzing how environmental and social factors interact across sectors.", 
      bgColor: "bg-gradient-to-br from-[#c1b4df] via-[#c7d6c1] to-[#c7d6c1]",
      textColor: "text-[#755eb1]",
      hoverBg: "hover:brightness-95",
      image: "/ESG Interdependencies.avif",
      detailKey: "esg" as const
    }
  ]

  // Simpler animations for mobile section headers
  const headerVariants = isMobile
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
      }

  return (
    <section id="focus" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration - hidden on mobile for performance */}
      <div className="hidden md:block absolute top-0 right-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#c1b4df]/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="mb-12 sm:mb-16 md:mb-24">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            transition={{ duration: isMobile ? 0.3 : 0.5 }}
            variants={headerVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight mb-3 sm:mb-4"
          >
            Areas of Focus
          </motion.h2>
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0 : 0.1 }}
            variants={headerVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-tight text-[#4f7f5d]"
          >
            <span>Where Evidence, Equity, and Sustainability</span>
            {' '}
            <span className="italic">Converge</span>
          </motion.h3>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {areas.map((area, i) => (
            <FocusCard key={i} {...area} index={i} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  )
}