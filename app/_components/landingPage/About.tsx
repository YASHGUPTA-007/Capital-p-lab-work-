'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const AboutSection = () => {
    return (
        <section 
            id="about" 
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
                                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl",
                                        stat.gradient
                                    )} />
                                    <div className="relative p-6 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-2xl border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                                        <h4 className={cn(
                                            "text-xl font-serif mb-2 bg-gradient-to-br bg-clip-text text-transparent font-bold",
                                            stat.gradient
                                        )}>
                                            {stat.title}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">{stat.sub}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Our Story */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-gradient-to-br from-purple-50 via-white to-emerald-50 p-10 md:p-20 rounded-3xl border-2 border-purple-200 overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full blur-3xl transform-gpu" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-3xl transform-gpu" />
                    
                    <div className="max-w-3xl mx-auto relative z-10">
                        <span className="block text-center text-xs font-bold uppercase tracking-widest text-purple-700 mb-8">Our Story</span>
                        <h3 className="text-4xl md:text-5xl font-serif text-center mb-16 bg-gradient-to-r from-purple-900 to-emerald-900 bg-clip-text text-transparent font-bold">
                            "From Resilience to Purpose"
                        </h3>
                        
                        <div className="space-y-8 text-lg text-zinc-800 leading-loose font-serif">
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
        </section>
    )
}