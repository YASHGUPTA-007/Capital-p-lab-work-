'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export const InsightsSection = () => {
    return (
        <section id="insights" className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#c1b4df]/20 via-white to-[#c7d6c1]/20 border-t-2 border-[#c1b4df]/30 relative overflow-hidden">
            {/* Optimized background decoration */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#c1b4df]/20 rounded-full blur-[100px]" />
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-12 sm:mb-16 md:mb-20 text-[#755eb1]"
                >
                    Insights
                </motion.h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {[
                        { type: "Reports", title: "The Future of Sustainable Policy in India", date: "Oct 2024", color: "purple" },
                        { type: "Opinions", title: "Bridging the Gap: Mental Health & Climate", date: "Sep 2024", color: "green" },
                        { type: "Events", title: "Webinar: ESG Frameworks for Startups", date: "Aug 2024", color: "purple" },
                        { type: "Blogs", title: "Neurodiversity in the Modern Workplace", date: "Jul 2024", color: "green" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative bg-white p-6 sm:p-8 h-72 sm:h-80 flex flex-col justify-between border-2 border-[#c1b4df]/30 group-hover:border-[#755eb1] rounded-xl sm:rounded-2xl group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Decorative corner */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-bl-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                                    item.color === "purple" ? "bg-gradient-to-bl from-[#755eb1] to-transparent" : "bg-gradient-to-bl from-[#4f75d] to-transparent"
                                )} />
                                
                                <div className="relative z-10">
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 sm:mb-6",
                                        item.color === "purple" ? "bg-[#c1b4df]/40 text-[#755eb1]" : "bg-[#c7d6c1]/50 text-[#4f75d]"
                                    )}>
                                        {item.type}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-serif leading-tight text-[#2b2e34] group-hover:text-[#755eb1] transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#4f75d]/50 relative z-10">{item.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 sm:mt-24 md:mt-32 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#755eb1] via-[#6b54a5] to-[#4f75d] rounded-2xl sm:rounded-3xl" />
                    <div className="relative bg-white p-8 sm:p-12 lg:p-16 xl:p-20 rounded-2xl sm:rounded-3xl border-2 border-[#c1b4df] text-center m-1">
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 text-[#755eb1]" />
                        <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#c1b4df] to-[#c7d6c1] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#755eb1] mb-3 sm:mb-4">
                            Newsletter
                        </span>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif mt-3 sm:mt-4 mb-3 sm:mb-4 text-[#755eb1]">
                            Stay informed.
                        </h3>
                        <p className="text-sm sm:text-base text-[#4f75d] mb-8 sm:mb-12 max-w-md mx-auto">
                            Curated research and perspectives on sustainability, delivered to your inbox.
                        </p>
                        
                        <form className="max-w-md mx-auto space-y-4">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full border-b-2 border-[#c1b4df] focus:border-[#755eb1] py-3 focus:outline-none transition-colors bg-transparent text-[#2b2e34] placeholder:text-[#4f75d]/40" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full border-b-2 border-[#c7d6c1] focus:border-[#4f75d] py-3 focus:outline-none transition-colors bg-transparent text-[#2b2e34] placeholder:text-[#4f75d]/40" 
                            />
                            <button className="w-full bg-gradient-to-r from-[#755eb1] to-[#4f75d] text-white py-3 sm:py-4 mt-6 sm:mt-8 font-bold uppercase tracking-widest text-xs rounded-full hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-[#4f75d]/50 mt-4 sm:mt-6">Respecting your privacy. No spam, ever.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}