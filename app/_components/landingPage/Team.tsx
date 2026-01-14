'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const TeamSection = () => {
    return (
      <section id="team" className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
          {/* Optimized background decoration */}
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#c1b4df]/20 rounded-full blur-[100px]" />
          
          <div className="max-w-[1400px] mx-auto relative z-10">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16 sm:mb-20"
              >
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#755eb1] leading-tight">
                      Meet our Team
                  </h2>
              </motion.div>
              
              <div className="space-y-16 sm:space-y-20 md:space-y-24">
                  {/* Arti Mishra Saran */}
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-start"
                  >
                      {/* Passport Photo */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 rounded-2xl overflow-hidden border-2 border-[#c1b4df] shadow-lg group hover:border-[#755eb1] transition-all">
                               <Image 
                                 src="/Arti Mishra Saran.png" 
                                 alt="Arti Mishra Saran - Founder" 
                                 fill
                                 className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                 sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-[#755eb1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                          <div className="mb-4 sm:mb-6">
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#755eb1] mb-2">
                                  Arti Mishra Saran
                              </h3>
                              <span className="inline-block px-3 py-1 bg-[#c1b4df]/30 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#755eb1]">
                                  Founder
                              </span>
                          </div>
                          
                          <p className="text-sm sm:text-base md:text-lg text-[#4f75d] leading-relaxed">
                              Arti Mishra Saran is a research and consulting professional with over 15 years of experience in renewable energy, sustainability, and the development sector. She has led cross-functional teams, managed multi-sector portfolios, and delivered research and advisory services for government, private, and development organizations. Her expertise spans applied research, project management, data analysis, financial modeling, and translating complex policy and technical insights into actionable strategies. She holds a Master's in Business Management from Duke University, a Diploma in Business Sustainability, and is a Certified Project Management Professional. Beyond her professional work, Arti is committed to knowledge sharing and mentorship. She volunteers as a mentor for young students, supporting the next generation of researchers. She is driven by a people-, planet-, and prosperity-centered approach.
                          </p>
                      </div>
                  </motion.div>
  
                  {/* Dr. V Neha - Changed name color to green */}
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-start"
                  >
                      {/* Passport Photo */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 rounded-2xl overflow-hidden border-2 border-[#c7d6c1] shadow-lg group hover:border-[#4f7f5d] transition-all">
                               <Image 
                                 src="/Dr. V Neha.png" 
                                 alt="Dr. V Neha - Co-Founder" 
                                 fill
                                 className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                 sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-[#4f7f5d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                          <div className="mb-4 sm:mb-6">
                              {/* Changed to green #4f7f5d */}
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#4f7f5d] mb-2">
                                  Dr. V Neha
                              </h3>
                              <span className="inline-block px-3 py-1 bg-[#c7d6c1]/50 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4f7f5d]">
                                  Co-Founder
                              </span>
                          </div>
                          
                          <p className="text-sm sm:text-base md:text-lg text-[#4f75d] leading-relaxed">
                              Dr. V Neha is a researcher, environmental educator, and learning designer who brings together sustainability, environmental policy, and community-centred practice. With nearly a decade of experience, she has designed interdisciplinary learning programmes and contributed to applied research on water security. She holds a PhD in Environmental Policy from the University of Hyderabad and has an interdisciplinary grounding in social sciences. Guided by an inclusive, human-centred approach, she enjoys working at the meeting point of policy and practice. Outside her core work, she finds joy in teaching French and mentoring young learners to apply STEM thinking to real-world issues.
                          </p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
    )
}