'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const FocusSection = () => {
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
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-100/40 to-transparent rounded-full blur-3xl transform-gpu" />
            
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