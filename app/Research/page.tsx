'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion'
import { Search, Download, ArrowUpRight, ArrowRight, Filter, X, Calendar, Clock, User } from 'lucide-react'
import Image from 'next/image'

// --- Types ---
type Category = "All" | "Environment" | "Social" | "Economic" | "Policy"

interface Doc {
  id: number
  title: string
  category: Category
  date: string
  author: string
  summary: string
  fileSize: string
  readTime: string
  fullDescription: string
  image: string // Added Image Property
}

// --- Static Data with Images ---
const CATEGORIES: Category[] = ["All", "Environment", "Social", "Economic", "Policy"]

const RESEARCH_DOCS: Doc[] = [
  {
    id: 1,
    title: "Urban Resilience in Coastal Cities",
    category: "Environment",
    date: "Jan 28, 2026",
    author: "Dr. Elena Rostova",
    summary: "Adaptation strategies for rising sea levels in Southeast Asia focusing on nature-based solutions.",
    fileSize: "2.8 MB",
    readTime: "12 min",
    // Using high-quality Unsplash placeholders matching the theme
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "This report examines the escalating risks faced by coastal megacities in Southeast Asia. Through a comparative analysis of Jakarta, Manila, and Bangkok, we evaluate the efficacy of hard infrastructure versus nature-based solutions. The findings suggest a hybrid approach offers the highest ROI over a 20-year horizon."
  },
  {
    id: 2,
    title: "The Social ROI of Inclusive Hiring",
    category: "Social",
    date: "Jan 15, 2026",
    author: "Sarah Jenkins & Team",
    summary: "Quantitative analysis of how diverse workforces drive innovation and long-term profitability.",
    fileSize: "1.5 MB",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "Beyond the moral imperative, inclusive hiring drives tangible business results. This study correlates diversity metrics with patent filings and revenue per employee across 500 tech companies."
  },
  {
    id: 3,
    title: "Carbon Markets: A 2025 Retrospective",
    category: "Economic",
    date: "Dec 10, 2025",
    author: "Capital P Economics",
    summary: "Evaluating the efficacy of voluntary carbon markets and the rise of high-integrity credits.",
    fileSize: "3.1 MB",
    readTime: "22 min",
   image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "2025 was a watershed year for carbon markets. This retrospective analyzes the collapse of low-quality offsets and the rise of the 'High-Integrity' standard."
  },
  {
    id: 4,
    title: "Green Hydrogen Policy Brief",
    category: "Policy",
    date: "Nov 22, 2025",
    author: "Marcus Thorne",
    summary: "Key regulatory hurdles and infrastructure investment needs for scaling green hydrogen.",
    fileSize: "1.2 MB",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "Green hydrogen is touted as the savior of heavy industry, but regulatory bottlenecks remain. This brief outlines the three critical policy changes needed in the EU and US markets."
  },
  {
    id: 5,
    title: "Regenerative Agriculture Frameworks",
    category: "Environment",
    date: "Oct 05, 2025",
    author: "Dr. Aris Thorne",
    summary: "A practical guide for supply chain leaders to implement and measure regenerative practices.",
    fileSize: "5.4 MB",
    readTime: "18 min",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "Moving beyond 'sustainable' to 'regenerative'. This framework provides KPIs for soil health, biodiversity, and water retention."
  },
  {
    id: 6,
    title: "Community-Led Development",
    category: "Social",
    date: "Sep 18, 2025",
    author: "Capital P Social Impact",
    summary: "Case studies from Sub-Saharan Africa demonstrating the efficacy of localized funding.",
    fileSize: "2.1 MB",
    readTime: "14 min",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    fullDescription: "Top-down aid often fails. This paper explores 'Trust-Based Philanthropy' and localized funding structures."
  },
]

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function ResearchPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Filter Logic
  const filteredDocs = RESEARCH_DOCS.filter((doc) => {
    const matchesCategory = activeCategory === "All" || doc.category === activeCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // --- Modal Component ---
  const DocModal = () => (
    <AnimatePresence>
      {selectedDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            className="absolute inset-0 bg-[#2b2e34]/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-64 w-full">
              <Image 
                src={selectedDoc.image} 
                alt={selectedDoc.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <button 
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md ${
                   selectedDoc.category === 'Environment' ? 'bg-[#4f7f5d]/90 text-white' :
                   selectedDoc.category === 'Social' ? 'bg-[#755eb1]/90 text-white' :
                   'bg-white/90 text-gray-800'
                }`}>
                  {selectedDoc.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white leading-tight drop-shadow-md">
                  {selectedDoc.title}
                </h3>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto bg-white">
              <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-gray-400 mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2">
                   <Calendar size={14} /> {selectedDoc.date}
                </div>
                <div className="flex items-center gap-2">
                   <User size={14} /> {selectedDoc.author}
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={14} /> {selectedDoc.readTime} Read
                </div>
              </div>

              <p className="text-lg text-[#2b2e34] font-serif italic mb-6">
                "{selectedDoc.summary}"
              </p>
              
              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="leading-relaxed text-base">
                  {selectedDoc.fullDescription}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
              <span className="text-xs text-gray-400 font-mono hidden sm:block">REF: {selectedDoc.id.toString().padStart(4, '0')}</span>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#2b2e34] text-white text-sm font-bold hover:bg-[#755eb1] transition-colors rounded-lg w-full sm:w-auto justify-center">
                <Download size={16} /> Download Full Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <main ref={containerRef} className="min-h-screen bg-white relative overflow-hidden">
      <DocModal />

      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c1b4df]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c7d6c1]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="grid lg:grid-cols-12 gap-12 items-end"
          >
            <div className="lg:col-span-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                 <div className="h-px w-12 bg-[#755eb1]" />
                 <span className="text-[#755eb1] font-bold tracking-[0.2em] uppercase text-xs">Knowledge Hub</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#2b2e34] leading-[0.9]">
                Research <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#755eb1] to-[#4f7f5d]">Archive.</span>
              </motion.h1>
            </div>
            
            <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pb-4">
              <p className="text-lg text-[#2b2e34]/70 leading-relaxed border-l-2 border-[#2b2e34]/10 pl-6">
                Explore our library of policy briefs, impact assessments, and economic models designed for sustainable decision making.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FILTERS & GRID --- */}
      <section className="px-4 sm:px-6 lg:px-12 pb-32 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Controls */}
          <div className="sticky top-4 z-40 mb-12 bg-white/80 backdrop-blur-xl border border-gray-100 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeCategory === cat 
                      ? "bg-[#2b2e34] text-white shadow-md" 
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search insights..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#755eb1]/20 outline-none transition-all"
                />
             </div>
          </div>

          {/* Grid */}
          <motion.div 
             layout
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
             <AnimatePresence mode="popLayout">
               {filteredDocs.length > 0 ? (
                 filteredDocs.map((doc) => (
                   <motion.div
                     layout
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                     key={doc.id}
                     className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#755eb1]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
                   >
                     {/* Card Image */}
                     <div className="relative h-48 w-full overflow-hidden">
                        <Image 
                           src={doc.image} 
                           alt={doc.title}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        {/* Floating Category Tag */}
                        <div className="absolute top-4 left-4">
                           <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${
                              doc.category === 'Environment' ? 'bg-[#4f7f5d]/90 text-white' :
                              doc.category === 'Social' ? 'bg-[#755eb1]/90 text-white' :
                              'bg-white/90 text-gray-800'
                           }`}>
                              {doc.category}
                           </span>
                        </div>
                     </div>

                     {/* Card Content */}
                     <div className="p-6 sm:p-8 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-serif text-[#2b2e34] group-hover:text-[#755eb1] transition-colors leading-tight line-clamp-2">
                              {doc.title}
                           </h3>
                           <ArrowUpRight className="text-gray-300 group-hover:text-[#755eb1] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-2" size={20} />
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow line-clamp-3">
                           {doc.summary}
                        </p>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                           <span>{doc.date}</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full" />
                           <span>{doc.readTime} Read</span>
                        </div>
                        
                        <button 
                           onClick={() => setSelectedDoc(doc)}
                           className="mt-6 w-full py-3 rounded-lg bg-gray-50 text-[#2b2e34] text-xs font-bold uppercase tracking-widest hover:bg-[#2b2e34] hover:text-white transition-colors"
                        >
                           View Details
                        </button>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="col-span-full py-20 text-center text-gray-400">
                    <Filter className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="text-lg font-serif">No documents found.</p>
                    <button onClick={() => {setActiveCategory("All"); setSearchQuery("")}} className="mt-2 text-[#755eb1] text-sm font-bold uppercase tracking-widest hover:underline">Clear Filters</button>
                 </div>
               )}
             </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-[#2b2e34] py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-white opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6">
               Need bespoke analysis?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
               Our team conducts custom impact assessments and policy research for organizations worldwide.
            </p>
            <a 
               href="/contact" 
               className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2b2e34] text-sm font-bold uppercase tracking-widest hover:bg-[#755eb1] hover:text-white transition-all duration-300 rounded-lg"
            >
               Request a Proposal <ArrowRight size={16} />
            </a>
         </div>
      </section>
    </main>
  )
}