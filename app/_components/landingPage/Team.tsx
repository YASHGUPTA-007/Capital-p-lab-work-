'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export const TeamSection = () => {
    return (
      <section id="team" className="py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl transform-gpu" />
          
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
                      <div className="relative w-full aspect-[4/5] mb-8 rounded-2xl overflow-hidden border-2 border-purple-200 group-hover:border-purple-400 group-hover:shadow-2xl transition-all bg-gradient-to-br from-purple-100 to-purple-50">
                           <Image 
                             src="/Arti Mishra Saran.png" 
                             alt="Arti Mishra Saran - Founder" 
                             fill
                             className="object-cover object-center"
                             sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                             priority
                           />
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/30 group-hover:to-purple-900/40 transition-all"></div>
                           {/* Decorative corner */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-3xl group-hover:from-emerald-500/30 transition-all" />
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
                      <div className="relative w-full aspect-[4/5] mb-8 rounded-2xl overflow-hidden border-2 border-emerald-200 group-hover:border-emerald-400 group-hover:shadow-2xl transition-all bg-gradient-to-br from-emerald-100 to-emerald-50">
                           <Image 
                             src="/Dr. V Neha.png" 
                             alt="Dr. V Neha - Co-Founder" 
                             fill
                             className="object-cover object-center"
                             sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                             priority
                           />
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/30 group-hover:to-emerald-900/40 transition-all"></div>
                           {/* Decorative corner */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl group-hover:from-purple-500/30 transition-all" />
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