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
  Heart,
  Eye,
  ChevronRight,
} from "lucide-react";
import { ResearchItem } from "@/types/research";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LeadCaptureModal from "../LeadCaptureModal";
import Cookies from "js-cookie";

interface ResearchDetailClientProps {
  item: ResearchItem;
}

export default function ResearchDetailClient({
  item,
}: ResearchDetailClientProps) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [likes, setLikes] = useState(item.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  // Check if user has already liked this research
  useEffect(() => {
    const likedResearch = Cookies.get(`liked_research_${item.id}`);
    if (likedResearch === "true") {
      setHasLiked(true);
    }
  }, [item.id]);

  // Increment view count
  useEffect(() => {
    if (item?.id) {
      updateDoc(doc(db, "research-items", item.id), {
        views: increment(1),
      }).catch((err) => console.error("Error updating views", err));
    }
  }, [item.id]);

  // Handle like
  const handleLike = async () => {
    if (hasLiked || isLiking) return;

    setIsLiking(true);
    try {
      const docRef = doc(db, "research-items", item.id);

      // Optimistic update
      setLikes((prev: number) => prev + 1);
      setHasLiked(true);

      // Update Firestore
      await updateDoc(docRef, {
        likes: increment(1),
      });

      // Save to cookies (expires in 365 days)
      Cookies.set(`liked_research_${item.id}`, "true", { expires: 365 });

      // Verify the update
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikes(docSnap.data().likes || 0);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert optimistic update on error
      setLikes((prev: number) => prev - 1);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Helper for date formatting
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "";
    }
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
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Author
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={12} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item.author}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Published
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar size={14} className="text-slate-400" />
                  {item.publishedAt ? formatDate(item.publishedAt) : "Recently"}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Read Time
                </p>
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
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-50 text-slate-500 text-sm font-medium rounded-md border border-slate-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right: Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              {/* Like Button Card */}
              <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-2xl border border-pink-100 p-6 shadow-sm text-center">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Community
                </h4>

                {/* Heart Button */}
                <button
                  onClick={handleLike}
                  disabled={hasLiked || isLiking}
                  className={`
      relative mx-auto flex items-center justify-center
      w-16 h-16 rounded-full transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-pink-300
      active:scale-95
      ${
        hasLiked
          ? "bg-pink-500 text-white shadow-lg cursor-not-allowed"
          : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-500 hover:text-white hover:shadow-lg"
      }
    `}
                >
                  <Heart
                    size={28}
                    className={`transition-transform duration-200 ${
                      hasLiked
                        ? "fill-current scale-110"
                        : "group-hover:scale-110"
                    }`}
                  />
                </button>

                {/* Likes Count */}
                <p className="text-2xl font-bold text-slate-900 mt-3 leading-none">
                  {likes}
                </p>
                <p className="text-xs text-slate-500">
                  people found this valuable
                </p>

                {/* Views */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <Eye size={12} />
                  <span>{item.views || 0}</span>
                </div>

                {/* Share Section */}
                <div className="mt-6 pt-6 border-t border-pink-100">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-sm font-semibold text-slate-600">
                      Share:
                    </span>
                    
                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>

                    {/* Generic Share (Copy Link) */}
                    <button
                      onClick={handleCopyLink}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-500 hover:text-white hover:border-slate-500 transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Copy link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Copy confirmation message */}
                  {showCopyMessage && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-green-600 font-medium"
                    >
                      Link copied!
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Main Action Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
                <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">
                  {item.type === "document"
                    ? "Full Report"
                    : "External Resource"}
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
                  {item.type === "document" ? (
                    <Download size={18} />
                  ) : (
                    <ExternalLinkIcon size={18} />
                  )}
                  <span>
                    {item.type === "document" ? "Download PDF" : "Access Link"}
                  </span>
                </button>

                {item.documentSize && (
                  <div className="mt-4 text-center">
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      File Size: {item.documentSize}
                    </span>
                  </div>
                )}
              </div>
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