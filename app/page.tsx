'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  ArrowRight, 
  ArrowUpRight, 
  Menu, 
  X, 
  Mail, 
  Globe,
  Quote,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- COMPONENTS ---

const CustomCursor = () => {
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) }
  const [cursorVariant, setCursorVariant] = useState('default')
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 }
  const smoothMouse = { x: useSpring(mouse.x, smoothOptions), y: useSpring(mouse.y, smoothOptions) }

  const manageMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    mouse.x.set(clientX)
    mouse.y.set(clientY)
  }

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove)
    return () => window.removeEventListener("mousemove", manageMouseMove)
  }, [])

  return (
    <>
      <motion.div 
        style={{ left: smoothMouse.x, top: smoothMouse.y }} 
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        animate={cursorVariant}
        variants={{
          default: { scale: 1 },
          hover: { scale: 1.5 }
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-emerald-500/30 to-purple-600/30 blur-md animate-spin-slow" />
      </motion.div>
      <motion.div 
        style={{ left: smoothMouse.x, top: smoothMouse.y }} 
        className="fixed w-2 h-2 bg-purple-600 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
      />
    </>
  )
}

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.015] mix-blend-overlay"
    style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
  />
)

const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
        opacity: [0.05, 0.15, 0.05]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, -100, 0],
        y: [0, 100, 0],
        scale: [1, 1.3, 1],
        opacity: [0.05, 0.2, 0.05]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500 to-transparent rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        x: [0, 50, 0],
        y: [0, -100, 0],
        scale: [1, 1.1, 1],
        opacity: [0.03, 0.1, 0.03]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-300 to-transparent rounded-full blur-3xl"
    />
  </div>
)

// --- SECTIONS ---

const Hero = () => {
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
          className="mb-12"
        >
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
            Empowering Policy Action
          </span>
        </motion.div>

        {/* Main headline with artistic typography */}
        <motion.div className="mb-16">
          <motion.h1 
            style={{ y: y1 }} 
            className="text-[11vw] md:text-[10vw] leading-[0.85] font-serif tracking-tighter"
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
              className="text-[11vw] md:text-[10vw] leading-[0.85] font-serif tracking-tighter"
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
            { label: 'Planet', color: 'from-emerald-600 to-emerald-700' },
            { label: 'People', color: 'from-purple-600 to-purple-700' },
            { label: 'Profit', color: 'from-emerald-700 to-purple-700' }
          ].map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="relative group"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity",
                pillar.color
              )} />
              <div className="relative px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-purple-200/50 group-hover:border-purple-400 transition-all">
                <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r bg-clip-text text-transparent" style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  ...pillar.color.includes('emerald-6') ? { '--tw-gradient-from': '#059669', '--tw-gradient-to': '#047857' } :
                     pillar.color.includes('purple-6') ? { '--tw-gradient-from': '#9333ea', '--tw-gradient-to': '#7e22ce' } :
                     { '--tw-gradient-from': '#047857', '--tw-gradient-to': '#7e22ce' }
                } as any}>
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
          className="max-w-2xl ml-auto relative"
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

const AboutSection = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.95, 1]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

    return (
        <motion.section 
            id="about" 
            style={{ scale, opacity }}
            className="py-32 px-6 lg:px-12 bg-white rounded-t-[4rem] -mt-32 relative z-20 shadow-2xl"
        >
            <div className="max-w-[1400px] mx-auto">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full text-xs font-bold uppercase tracking-widest text-purple-800 mb-12"
                >
                    Who We Are
                </motion.span>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-12">
                            <span className="bg-gradient-to-br from-purple-900 to-purple-600 bg-clip-text text-transparent">
                                Turning Evidence
                            </span>
                            <br/>
                            <span className="italic bg-gradient-to-br from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                                into Impact.
                            </span>
                        </h2>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <p className="text-2xl font-light text-zinc-800 leading-relaxed">
                            We provide research and consulting services that support <span className="text-emerald-700 font-medium">sustainable development</span>, <span className="text-purple-700 font-medium">responsible investment</span>, and inclusive growth.
                        </p>
                        <p className="text-lg text-zinc-600 leading-relaxed">
                             The impact we seek goes beyond reports. We aim to strengthen institutions and translate evidence into actions that enhance social equity and economic value.
                        </p>
                        
                        {/* Stats/Features with enhanced design */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                            {[
                                { title: "SDG Aligned", sub: "Research Frameworks", gradient: "from-purple-600 to-purple-700" },
                                { title: "ESG Focused", sub: "Strategic Solutions", gradient: "from-emerald-600 to-emerald-700" },
                                { title: "Impact Driven", sub: "Measurable Outcomes", gradient: "from-purple-700 to-emerald-600" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group"
                                >
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-2xl",
                                        stat.gradient
                                    )} />
                                    <div className="relative p-6 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-2xl border border-purple-100 group-hover:border-purple-300 transition-all">
                                        <h4 className={cn(
                                            "text-xl font-serif mb-2 bg-gradient-to-br bg-clip-text text-transparent",
                                            stat.gradient
                                        )}>
                                            {stat.title}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">{stat.sub}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Our Story - Enhanced with testimonial integration */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-gradient-to-br from-purple-50 via-white to-emerald-50 p-10 md:p-20 rounded-3xl border border-purple-100 overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full blur-3xl" />
                    
                    <div className="max-w-3xl mx-auto relative z-10">
                        <span className="block text-center text-xs font-bold uppercase tracking-widest text-purple-600 mb-8">Our Story</span>
                        <h3 className="text-4xl md:text-5xl font-serif text-center mb-16 bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent">
                            "From Resilience to Purpose"
                        </h3>
                        
                        <div className="space-y-8 text-lg text-zinc-700 leading-loose font-serif">
                            <p>
                                <span className="text-5xl float-left mr-4 mt-[-6px] bg-gradient-to-br from-purple-600 to-emerald-600 bg-clip-text text-transparent font-bold">O</span>
                                ur story began in the period following COVID-19, a time when many professionals were navigating uncertainty. As two mothers balancing careers and caregiving, we found ourselves seeking meaningful ways to stay engaged.
                            </p>
                            <p>
                                We first connected through conducting STEAM workshops for students. What started as a shared effort quickly became a space for deeper collaboration. We discovered a common passion for research and using evidence to create positive change.
                            </p>
                            <p>
                                We recognized a gap between research and real-world application in the sustainability sector. This led us to establish our firm—grounded in professional expertise and lived experience.
                            </p>
                            <p className="italic text-purple-900 font-medium text-xl">
                                Our journey reflects resilience, curiosity, and collaboration. What began as a response to disruption has grown into a purpose-driven venture aimed at turning knowledge into action.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

const TestimonialSection = () => {
    return (
        <section className="py-32 px-6 lg:px-12 bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-[1200px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <Quote className="w-16 h-16 mx-auto mb-8 text-emerald-300" />
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white mb-8">
                        Client Testimonial
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-12 md:p-16 rounded-3xl border border-white/20"
                >
                    <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed mb-12 text-center max-w-4xl mx-auto">
                        "Planet People Profit stands out for the <span className="text-emerald-300 font-medium">clarity and integrity</span> with which it approaches sustainability and public policy. The founders bring complementary strengths that make the organisation both thoughtful and effective—combining strong analytical depth with an ability to work across sectors and stakeholders."
                    </blockquote>
                    
                    <blockquote className="text-lg md:text-xl font-light text-white/90 leading-relaxed mb-12 text-center max-w-4xl mx-auto">
                        "What I find especially compelling is the team's ability to <span className="text-purple-300 font-medium">move from insight to action</span>. Whether engaging with institutions, designing research-driven interventions, or supporting capacity-building efforts, Planet People Profit consistently delivers work that is practical, credible, and impact-oriented. The organisation reflects a rare balance of <span className="text-emerald-300 font-medium">intellectual rigour, ethical commitment, and long-term thinking</span>—making it a valuable partner for anyone serious about sustainable and inclusive change."
                    </blockquote>

                    <div className="flex flex-col items-center mt-12 pt-8 border-t border-white/20">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400 mb-4 flex items-center justify-center text-white text-2xl font-serif">
                            A
                        </div>
                        <p className="text-white font-serif text-xl mb-2">Ar. Aditi Chellapilla Kumar</p>
                        <p className="text-emerald-300 text-sm font-medium mb-1">Accessibility and Inclusive Urban Development Professional</p>
                        <p className="text-white/70 text-xs text-center max-w-md">
                            Contributor to policy advocacy, built-environment accessibility, and disability inclusion initiatives
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

const FocusSection = () => {
    const areas = [
        { 
            title: "Accessibility & Inclusion", 
            tag: "Social", 
            desc: "Advancing inclusion through evidence-based research and neurodiversity awareness.", 
            gradient: "from-purple-100 to-purple-50",
            iconGradient: "from-purple-600 to-purple-700",
            borderColor: "border-purple-200"
        },
        { 
            title: "Sustainability Emotion", 
            tag: "Psychology", 
            desc: "Integrating climate research with the emotional dimensions of mental health.", 
            gradient: "from-emerald-100 to-emerald-50",
            iconGradient: "from-emerald-600 to-emerald-700",
            borderColor: "border-emerald-200"
        },
        { 
            title: "Sustainable Practices", 
            tag: "Economy", 
            desc: "Behavioral science-informed research supporting responsible consumption.", 
            gradient: "from-purple-600 to-emerald-600",
            iconGradient: "from-white to-white",
            borderColor: "border-white/20",
            isInverted: true
        },
        { 
            title: "ESG Interdependencies", 
            tag: "Governance", 
            desc: "Analyzing how environmental and social factors interact across sectors.", 
            gradient: "from-emerald-100 via-purple-50 to-purple-100",
            iconGradient: "from-emerald-700 to-purple-700",
            borderColor: "border-purple-200"
        }
    ];

    return (
        <section id="focus" className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-100/40 to-transparent rounded-full blur-3xl" />
            
            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                     <motion.h2 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-serif bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent"
                     >
                        Areas of Focus
                     </motion.h2>
                     <motion.span 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full text-xs font-bold uppercase tracking-widest text-purple-800"
                     >
                        Core Pillars
                     </motion.span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {areas.map((area, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="group"
                        >
                            <div className={cn(
                                "relative p-10 rounded-3xl flex flex-col justify-between min-h-[400px] transition-all duration-500",
                                area.isInverted ? "bg-gradient-to-br text-white" : "bg-gradient-to-br",
                                area.gradient,
                                "border-2",
                                area.borderColor,
                                "hover:scale-[1.02] hover:shadow-2xl"
                            )}>
                                {/* Decorative corner accent */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-24 h-24 rounded-bl-3xl opacity-20",
                                    area.isInverted ? "bg-white" : "bg-gradient-to-bl",
                                    !area.isInverted && area.iconGradient
                                )} />
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                                        area.isInverted ? "bg-white/20 text-white" : "bg-white/70 text-purple-800"
                                    )}>
                                        {area.tag}
                                    </span>
                                    <ArrowUpRight className={cn(
                                        "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform",
                                        area.isInverted ? "text-white" : "text-purple-600"
                                    )} />
                                </div>
                                
                                <div className="relative z-10">
                                    <h3 className={cn(
                                        "text-3xl font-serif mb-6 leading-tight",
                                        area.isInverted ? "text-white" : "bg-gradient-to-br bg-clip-text text-transparent " + area.iconGradient
                                    )}>
                                        {area.title}
                                    </h3>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        area.isInverted ? "text-white/90" : "text-zinc-700"
                                    )}>
                                        {area.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const ServicesSection = () => {
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
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full blur-3xl" />
        
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

const TeamSection = () => {
    return (
      <section id="team" className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
          
          <div className="max-w-[1400px] mx-auto relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
              >
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full text-xs font-bold uppercase tracking-widest text-purple-800 mb-8">
                      The Collaborators
                  </span>
                  <h2 className="text-5xl md:text-6xl font-serif bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent">
                      People behind the impact
                  </h2>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  {/* Arti */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="group"
                  >
                      <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-purple-100 to-purple-50 mb-8 rounded-2xl overflow-hidden border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20"></div>
                           {/* Decorative corner */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-3xl" />
                      </div>
                      <h3 className="text-4xl font-serif bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent">
                          Arti Mishra Saran
                      </h3>
                      <span className="inline-block mt-2 mb-8 px-4 py-1 bg-gradient-to-r from-purple-100 to-purple-50 rounded-full text-xs font-bold uppercase tracking-widest text-purple-700">
                          Founder
                      </span>
                      
                      <div className="space-y-6 text-zinc-700 leading-relaxed text-lg">
                          <p>
                              Arti Mishra Saran is a research and consulting professional with over 15 years of experience in <span className="text-emerald-700 font-medium">renewable energy, sustainability, and the development sector</span>. She has led cross-functional teams, managed multi-sector portfolios, and delivered research and advisory services for government, private, and development organizations.
                          </p>
                          <p>
                              Her expertise spans applied research, project management, data analysis, financial modeling, and translating complex policy and technical insights into actionable strategies.
                          </p>
                      </div>

                      <div className="mt-8 pt-8 border-t-2 border-purple-100">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-purple-600 mb-4">Education</h4>
                          <ul className="text-sm text-zinc-800 space-y-2">
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>Master's in Business Management, Duke University</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>Diploma in Business Sustainability</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>Certified Project Management Professional</span>
                              </li>
                          </ul>
                      </div>
                      
                      <div className="mt-8">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-600 mb-4">Beyond the Work</h4>
                          <p className="text-sm text-zinc-600 leading-relaxed">
                            Beyond her professional work, Arti is committed to knowledge sharing and mentorship. She volunteers as a mentor for young students, supporting the next generation of researchers. She is driven by a <span className="text-purple-700 font-medium">people-, planet-, and prosperity-centered approach</span>.
                          </p>
                      </div>
                  </motion.div>
  
                  {/* Neha */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="group lg:mt-24"
                  >
                      <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-emerald-100 to-emerald-50 mb-8 rounded-2xl overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-400 transition-all">
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/20"></div>
                           {/* Decorative corner */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl" />
                      </div>
                      <h3 className="text-4xl font-serif bg-gradient-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
                          Dr. V Neha
                      </h3>
                      <span className="inline-block mt-2 mb-8 px-4 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-700">
                          Co-Founder
                      </span>
                      
                      <div className="space-y-6 text-zinc-700 leading-relaxed text-lg">
                          <p>
                            Dr. V Neha is a researcher, environmental educator, and learning designer who brings together <span className="text-emerald-700 font-medium">sustainability, environmental policy, and community-centred practice</span>. With nearly a decade of experience, she has designed interdisciplinary learning programmes and contributed to applied research on water security.
                          </p>
                      </div>
  
                      <div className="mt-8 pt-8 border-t-2 border-emerald-100">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-600 mb-4">Education</h4>
                          <ul className="text-sm text-zinc-800 space-y-2">
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>PhD in Environmental Policy, University of Hyderabad</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>Interdisciplinary grounding in social sciences</span>
                              </li>
                          </ul>
                      </div>
                      
                      <div className="mt-8">
                          <h4 className="font-bold text-xs uppercase tracking-widest text-purple-600 mb-4">Beyond the Work</h4>
                          <p className="text-sm text-zinc-600 leading-relaxed">
                            Guided by an inclusive, human-centred approach, she enjoys working at the meeting point of policy and practice. Outside her core work, she finds joy in teaching French and mentoring young learners to apply <span className="text-emerald-700 font-medium">STEM thinking to real-world issues</span>.
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
    )
  }

const InsightsSection = () => {
    return (
        <section id="insights" className="py-32 bg-gradient-to-br from-purple-50 via-white to-emerald-50 border-t-2 border-purple-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl" />
            
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-serif mb-20 bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent"
                >
                    Insights
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { type: "Report", title: "The Future of Sustainable Policy in India", date: "Oct 2024", color: "purple" },
                        { type: "Opinion", title: "Bridging the Gap: Mental Health & Climate", date: "Sep 2024", color: "emerald" },
                        { type: "Event", title: "Webinar: ESG Frameworks for Startups", date: "Aug 2024", color: "purple" },
                        { type: "Blog", title: "Neurodiversity in the Modern Workplace", date: "Jul 2024", color: "emerald" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative bg-white p-8 h-80 flex flex-col justify-between border-2 border-purple-100 group-hover:border-purple-400 rounded-2xl group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Decorative corner */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-24 h-24 rounded-bl-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                                    item.color === "purple" ? "bg-gradient-to-bl from-purple-600 to-transparent" : "bg-gradient-to-bl from-emerald-600 to-transparent"
                                )} />
                                
                                <div className="relative z-10">
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6",
                                        item.color === "purple" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {item.type}
                                    </span>
                                    <h3 className="text-2xl font-serif leading-tight group-hover:text-purple-700 transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 relative z-10">{item.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-emerald-700 rounded-3xl" />
                    <div className="relative bg-white p-12 lg:p-20 rounded-3xl border-2 border-purple-200 text-center m-1">
                        <Sparkles className="w-12 h-12 mx-auto mb-6 text-purple-600" />
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 rounded-full text-xs font-bold uppercase tracking-widest text-purple-800 mb-4">
                            Newsletter
                        </span>
                        <h3 className="text-4xl font-serif mt-4 mb-4 bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent">
                            Stay informed.
                        </h3>
                        <p className="text-zinc-600 mb-12 max-w-md mx-auto">
                            Curated research and perspectives on sustainability, delivered to your inbox.
                        </p>
                        
                        <form className="max-w-md mx-auto space-y-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full border-b-2 border-purple-200 focus:border-purple-600 py-3 focus:outline-none transition-colors bg-transparent text-zinc-900 placeholder:text-zinc-400" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full border-b-2 border-purple-200 focus:border-emerald-600 py-3 focus:outline-none transition-colors bg-transparent text-zinc-900 placeholder:text-zinc-400" 
                            />
                            <button className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 text-white py-4 mt-8 font-bold uppercase tracking-widest text-xs rounded-full hover:from-purple-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-zinc-400 mt-6">Respecting your privacy. No spam, ever.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// --- MAIN PAGE ---

export default function TheCapitalPLab() {
  const container = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div ref={container} className="bg-white min-h-screen text-zinc-900 selection:bg-purple-600 selection:text-white font-sans">
      <CustomCursor />
      <NoiseOverlay />

      {/* --- FLOATING NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none"
      >
        <div className="relative pointer-events-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-600 blur-xl opacity-20" />
          
          <div className="relative bg-white/80 backdrop-blur-md rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl border-2 border-purple-100">
             <a href="#" className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-emerald-600 rounded-full flex items-center justify-center font-serif font-bold mr-2 hover:scale-110 transition-transform group">
                <span className="text-white group-hover:rotate-12 transition-transform">P</span>
             </a>
             
             <div className="hidden md:flex items-center">
               {['About', 'Focus', 'Services', 'Team', 'Insights'].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'})} 
                    className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-emerald-50 rounded-full transition-all"
                  >
                    {item}
                  </button>
               ))}
             </div>

             <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} 
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:from-purple-700 hover:to-emerald-700 transition-all ml-2 shadow-lg"
             >
               Contact
             </button>
          </div>
        </div>
      </motion.nav>

      <Hero />

      <AboutSection />
      
      <TestimonialSection />

      <FocusSection />

      <ServicesSection />

      <TeamSection />

      <InsightsSection />

      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-gradient-to-br from-zinc-900 via-purple-900 to-emerald-900 pt-40 pb-12 px-6 lg:px-12 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
         </div>
         
         <div className="max-w-[1600px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-[5rem] md:text-[7rem] leading-[0.9] font-serif mb-12 text-white">
                     Let's talk.
                  </h2>
                  <p className="text-purple-200 text-xl font-light mb-16 max-w-md leading-relaxed">
                    Ready to turn evidence into action? Reach out to discuss how we can support your sustainability goals.
                  </p>
                  <a 
                    href="mailto:info@thecapitalplab.com" 
                    className="group inline-flex items-center gap-4 text-2xl md:text-3xl font-serif text-white hover:text-emerald-300 transition-colors"
                  >
                     <span className="border-b-2 border-emerald-400 pb-1 group-hover:border-emerald-300">
                        info@thecapitalplab.com
                     </span>
                     <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <p className="mt-12 text-purple-200 flex items-center gap-2">
                    <Globe size={16} className="text-emerald-400" /> 
                    <span>Based in India</span>
                  </p>
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex justify-end items-end"
               >
                   <div className="grid grid-cols-3 gap-12 md:gap-24 text-left">
                       <div>
                           <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-400 mb-6">Company</h4>
                           <ul className="space-y-4 text-sm text-purple-200 font-medium">
                               <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                               <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                           </ul>
                       </div>
                       <div>
                           <h4 className="font-bold text-xs uppercase tracking-widest text-purple-400 mb-6">Focus</h4>
                           <ul className="space-y-4 text-sm text-purple-200 font-medium">
                               <li><a href="#focus" className="hover:text-white transition-colors">Inclusion</a></li>
                               <li><a href="#focus" className="hover:text-white transition-colors">Climate Emotion</a></li>
                               <li><a href="#focus" className="hover:text-white transition-colors">ESG</a></li>
                           </ul>
                       </div>
                       <div>
                           <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-400 mb-6">Social</h4>
                           <ul className="space-y-4 text-sm text-purple-200 font-medium">
                               <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                               <li><a href="mailto:info@thecapitalplab.com" className="hover:text-white transition-colors">Email</a></li>
                           </ul>
                       </div>
                   </div>
               </motion.div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12">
               <span className="text-[12vw] leading-none font-serif text-white/10 pointer-events-none select-none">
                  The Capital P Lab
               </span>
               <div className="flex flex-wrap items-center gap-2 mb-4 font-bold text-xs uppercase tracking-widest mt-8 md:mt-0 text-purple-300">
                  <span>© 2024</span>
                  <span className="mx-2 text-emerald-400">·</span>
                  <span className="text-emerald-400">Planet</span>
                  <span className="mx-2">·</span>
                  <span className="text-purple-400">People</span>
                  <span className="mx-2 text-emerald-400">·</span>
                  <span className="text-white">Profit</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  )
}