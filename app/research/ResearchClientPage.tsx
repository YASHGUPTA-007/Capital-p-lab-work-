// app/research/ResearchClientPage.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowRight,
  Filter,
  X,
  Calendar,
  Clock,
  User,
  ExternalLink as ExternalLinkIcon,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ResearchItem } from "@/types/research";

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface ResearchClientPageProps {
  initialItems: ResearchItem[];
}

export default function ResearchClientPage({
  initialItems,
}: ResearchClientPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories from database items dynamically
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(initialItems.map((item) => item.category))
    ).sort();
    return ["All", ...uniqueCategories];
  }, [initialItems]);

  // Filter Logic
  const filteredItems = initialItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate a consistent color for any category using a hash function
  const getCategoryColor = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Predefined color palette for better aesthetics
    const colors = [
      "bg-[#4f7f5d]/90 text-white",   // Green
      "bg-[#755eb1]/90 text-white",   // Purple
      "bg-[#d4a574]/90 text-white",   // Gold
      "bg-[#c97064]/90 text-white",   // Coral
      "bg-[#5e8fb8]/90 text-white",   // Blue
      "bg-[#8b7355]/90 text-white",   // Brown
      "bg-[#6b9080]/90 text-white",   // Teal
      "bg-[#a87c9f]/90 text-white",   // Mauve
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
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
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-12 bg-[#755eb1]" />
                <span className="text-[#755eb1] font-bold tracking-[0.2em] uppercase text-xs">
                  Knowledge Hub
                </span>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#2b2e34] leading-[0.9]"
              >
                Research <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#755eb1] to-[#4f7f5d]">
                  Reports
                </span>
              </motion.h1>
            </div>

            <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pb-4">
              <p className="text-lg text-[#2b2e34]/70 leading-relaxed border-l-2 border-[#2b2e34]/10 pl-6">
                Explore our library of policy briefs, impact assessments, and
                economic models designed for sustainable decision making.
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
              {categories.map((cat) => (
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
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-sm placeholder:text-gray-500 placeholder:opacity-100 focus:ring-2 focus:ring-[#755eb1]/20 focus:border-[#755eb1] outline-none transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/research/${item.slug}`}
                    className="block"
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#755eb1]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full cursor-pointer"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={item.coverImageAlt || item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* Floating Category Tag */}
                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${getCategoryColor(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 sm:p-8 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-serif text-[#2b2e34] group-hover:text-[#755eb1] transition-colors leading-tight line-clamp-2">
                            {item.title}
                          </h3>
                          <ArrowUpRight
                            className="text-gray-300 group-hover:text-[#755eb1] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 ml-2"
                            size={20}
                          />
                        </div>

                        <div
                          className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              item.description
                                .replace(/<[^>]*>/g, " ")
                                .substring(0, 150) + "...",
                          }}
                        />

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <span>{item.publishedAt}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{item.readTime}</span>
                        </div>

                        <div className="mt-6 w-full py-3 rounded-lg bg-gray-50 text-[#2b2e34] text-xs font-bold uppercase tracking-widest group-hover:bg-[#2b2e34] group-hover:text-white transition-colors flex items-center justify-center">
                          View Details
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                  <Filter className="mx-auto mb-4 opacity-20" size={48} />
                  <p className="text-lg font-serif">No documents found.</p>
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-2 text-[#755eb1] text-sm font-bold uppercase tracking-widest hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      {/* <section className="bg-[#2b2e34] py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6">
            Need bespoke analysis?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Our team conducts custom impact assessments and policy research for
            organizations worldwide.
          </p>
          
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2b2e34] text-sm font-bold uppercase tracking-widest hover:bg-[#755eb1] hover:text-white transition-all duration-300 rounded-lg"
          >
            Request a Proposal <ArrowRight size={16} />
          </a>
        </div>
      </section> */}
    </main>
  );
}