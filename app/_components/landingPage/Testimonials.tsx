'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export const TestimonialSection = () => {
    return (
        <section className="py-32 px-6 lg:px-12 bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl transform-gpu" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-3xl transform-gpu" />
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