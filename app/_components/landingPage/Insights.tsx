'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export const InsightsSection = () => {
    return (
        <section id="insights" className="py-32 bg-gradient-to-br from-purple-50 via-white to-emerald-50 border-t-2 border-purple-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl transform-gpu" />
            
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