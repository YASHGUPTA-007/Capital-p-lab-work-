'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe } from 'lucide-react'

export const Footer = () => {
    return (
      <footer id="contact" className="bg-gradient-to-br from-[#2b2e34] via-[#755eb1] to-[#4f7f5d] pt-40 pb-12 px-6 lg:px-12 relative overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c1b4df] rounded-full blur-3xl transform-gpu" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c7d6c1] rounded-full blur-3xl transform-gpu" />
         </div>
         
         <div className="max-w-[1600px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  
                 
                  <a 
                    href="mailto:contact@thecapitalplab.com" 
                    className="group inline-flex items-center gap-4 text-2xl md:text-3xl font-serif text-white hover:text-[#c7d6c1] transition-colors"
                  >
                     <span className="border-b-2 border-[#c7d6c1] pb-1 group-hover:border-white">
                        contact@thecapitalplab.com
                     </span>
                     <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <p className="mt-12 text-white/80 flex items-center gap-2 text-lg">
                    <Globe size={18} className="text-[#c7d6c1]" /> 
                    <span>Based in India · USA </span>
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
                           <h4 className="font-bold text-xs uppercase tracking-widest text-[#c7d6c1] mb-6">Company</h4>
                           <ul className="space-y-4 text-sm text-white/80 font-medium">
                               <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                               <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                           </ul>
                       </div>
                       <div>
                           <h4 className="font-bold text-xs uppercase tracking-widest text-[#c1b4df] mb-6">Focus</h4>
                           <ul className="space-y-4 text-sm text-white/80 font-medium">
                               <li><a href="#focus" className="hover:text-white transition-colors">Inclusion</a></li>
                               <li><a href="#focus" className="hover:text-white transition-colors">Climate Emotion</a></li>
                               <li><a href="#focus" className="hover:text-white transition-colors">ESG</a></li>
                           </ul>
                       </div>
                       <div>
                           <h4 className="font-bold text-xs uppercase tracking-widest text-[#c7d6c1] mb-6">Social</h4>
                           <ul className="space-y-4 text-sm text-white/80 font-medium">
                               {/* <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li> */}
                               <li><a href="mailto:contact@thecapitalplab.com" className="hover:text-white transition-colors">Email</a></li>
                           </ul>
                       </div>
                   </div>
               </motion.div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-t border-white/20 pt-12 gap-8">
               {/* Logo and company name */}
               <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white p-2 shadow-2xl">
                     <Image 
                        src="/logo.png" 
                        alt="The Capital P Lab Logo" 
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                     />
                  </div>
                  <div>
                     <span className="text-2xl md:text-3xl font-serif text-white block">
                        The Capital P Lab
                     </span>
                     <span className="text-xs text-white/70 uppercase tracking-widest">
                        Planet · People · Profit
                     </span>
                  </div>
               </div>
               
               <div className="flex flex-wrap items-center gap-2 font-bold text-xs uppercase tracking-widest text-white/70">
                  <span>© 2026</span>
                  <span className="mx-2 text-[#c7d6c1]">·</span>
                  <span className="text-[#c7d6c1]">Planet</span>
                  <span className="mx-2">·</span>
                  <span className="text-[#c1b4df]">People</span>
                  <span className="mx-2 text-[#c7d6c1]">·</span>
                  <span className="text-white">Profit</span>
               </div>
            </div>
         </div>
      </footer>
    )
}