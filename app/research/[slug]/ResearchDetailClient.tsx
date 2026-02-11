"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ExternalLink as ExternalLinkIcon,
  Clock,
  User,
  Calendar,
  Share2,
  FileText,
  ChevronRight,
  Eye,
  Hash
} from "lucide-react";
import { ResearchItem } from "@/types/research";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LeadCaptureModal from "../LeadCaptureModal";

interface ResearchDetailClientProps {
  item: ResearchItem;
}

export default function ResearchDetailClient({ item }: ResearchDetailClientProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Increment view count
  useEffect(() => {
    if (item?.id) {
      updateDoc(doc(db, "research-items", item.id), {
        views: increment(1),
      }).catch((err) => console.error("Error updating views", err));
    }
  }, [item.id]);

  // Helper for date formatting
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch { return ""; }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* 1. CLEAN NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link 
            href="/research"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#755eb1] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Research
          </Link>

          <div className="flex items-center gap-4">
             {/* View Counter (Subtle) */}
             {/* <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <Eye size={12}/> <span>{item.views || 0} views</span>
             </div> */}
             
             {/* Mobile CTA */}
             <button 
                onClick={() => setShowLeadModal(true)}
                className="sm:hidden px-4 py-1.5 bg-[#755eb1] text-white text-xs font-bold rounded-full"
             >
                {item.type === "document" ? "Download" : "Access"}
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        
        {/* 2. SPLIT HERO SECTION (Title Left, Image Right) */}
        {/* This solves the "Image too large" issue by putting it side-by-side with the title */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-24 border-b border-slate-100 pb-12">
          
          {/* Left: Typography */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#755eb1] mb-6">
               <span>Research</span>
               <ChevronRight size={12} className="text-slate-300" />
               <span>{item.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              {item.title}
            </h1>

            {/* Author / Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 pt-6 border-t border-slate-100 mt-2">
               <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Author</p>
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={12} />
                     </div>
                     <span className="text-sm font-semibold text-slate-700">{item.author}</span>
                  </div>
               </div>
               
               <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Published</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                     <Calendar size={14} className="text-slate-400" />
                     {item.publishedAt ? formatDate(item.publishedAt) : "Recently"}
                  </div>
               </div>

               <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Read Time</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                     <Clock size={14} className="text-slate-400" />
                     {item.readTime}
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Right: The Image (Rectangular & Contained) */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xl shadow-slate-200 order-1 lg:order-2 bg-slate-50"
          >
             <Image
                src={item.coverImage}
                alt={item.coverImageAlt || item.title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
             />
          </motion.div>
        </section>

        {/* 3. CONTENT & SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left: Main Content (8 cols) */}
           <article className="lg:col-span-8">
              <div 
                 className="prose prose-lg prose-slate max-w-none
                 prose-headings:font-serif prose-headings:text-slate-900 prose-headings:font-bold
                 prose-p:text-slate-600 prose-p:leading-relaxed
                 prose-a:text-[#755eb1] prose-a:no-underline hover:prose-a:underline
                 prose-img:rounded-xl prose-img:shadow-md
                 prose-blockquote:border-l-4 prose-blockquote:border-[#755eb1] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg"
                 dangerouslySetInnerHTML={{ __html: item.description }}
              />

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                 <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-sm font-medium rounded-md border border-slate-100">
                          #{tag}
                       </span>
                    ))}
                 </div>
              )}
           </article>

           {/* Right: Sticky Sidebar (4 cols) */}
           <aside className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-6">
                 
                 {/* 1. Main Action Card */}
                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
                    <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">
                       {item.type === "document" ? "Full Report" : "External Resource"}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                       {item.type === "document" 
                          ? "Access the complete findings, methodology, and data tables by downloading the verified PDF." 
                          : "Explore further details and tools available at the official source link."}
                    </p>

                    <button
                       onClick={() => setShowLeadModal(true)}
                       className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#755eb1] hover:bg-[#624ca0] text-white rounded-xl font-bold transition-all shadow-md shadow-purple-100 active:scale-[0.98]"
                    >
                       {item.type === "document" ? <Download size={18} /> : <ExternalLinkIcon size={18} />}
                       <span>{item.type === "document" ? "Download PDF" : "Access Link"}</span>
                    </button>

                    {item.documentSize && (
                       <div className="mt-4 text-center">
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                             File Size: {item.documentSize}
                          </span>
                       </div>
                    )}
                 </div>

                 {/* 2. Share / Secondary Actions */}
                 {/* <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium text-sm">
                       <Share2 size={16} /> Share
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium text-sm">
                       <Hash size={16} /> Cite
                    </button>
                 </div> */}

                 {/* 3. Newsletter Mini */}
                 {/* <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Stay Updated</h4>
                    <p className="text-xs text-slate-500 mb-4">New research delivered directly to your inbox.</p>
                    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                       <input 
                          type="email" 
                          placeholder="Email" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#755eb1]"
                       />
                       <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Go</button>
                    </form>
                 </div> */}

              </div>
           </aside>

        </div>
      </main>

      {/* LEAD MODAL */}
      {showLeadModal && (
        <LeadCaptureModal item={item} onClose={() => setShowLeadModal(false)} />
      )}
    </div>
  );
}