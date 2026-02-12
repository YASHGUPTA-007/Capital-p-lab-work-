"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Share2,
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
  const [currentUrl, setCurrentUrl] = useState("");

  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    if (!item.publishedAt) return "Recently";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(item.publishedAt));
    } catch {
      return "Recently";
    }
  }, [item.publishedAt]);

  // Memoize share URLs
  const shareUrls = useMemo(() => {
    if (!currentUrl) return null;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(item.title);
    
    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
  }, [currentUrl, item.title]);

  // Set current URL only on client side to avoid SSR mismatch
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Check if user has already liked this research
  useEffect(() => {
    const likedResearch = Cookies.get(`liked_research_${item.id}`);
    if (likedResearch === "true") {
      setHasLiked(true);
    }
  }, [item.id]);

  // Increment view count - debounced to avoid multiple calls
  useEffect(() => {
    if (!item?.id) return;

    const timer = setTimeout(() => {
      updateDoc(doc(db, "research-items", item.id), {
        views: increment(1),
      }).catch((err) => console.error("Error updating views", err));
    }, 1000);

    return () => clearTimeout(timer);
  }, [item.id]);

  // Handle like with useCallback to prevent recreation
  const handleLike = useCallback(async () => {
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
  }, [hasLiked, isLiking, item.id]);

  // Handle copy link with useCallback
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }, [currentUrl]);

  // Handle modal with useCallback
  const openLeadModal = useCallback(() => setShowLeadModal(true), []);
  const closeLeadModal = useCallback(() => setShowLeadModal(false), []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#6b5ba6] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b5ba6]"
      >
        Skip to main content
      </a>

      {/* CLEAN NAVIGATION */}
      <nav 
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/research"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#755eb1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Return to research page"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Research
          </Link>

          <div className="flex items-center gap-4">
            {/* Mobile CTA */}
            <button
              onClick={openLeadModal}
              className="sm:hidden px-4 py-1.5 bg-[#6b5ba6] text-white text-xs font-bold rounded-full hover:bg-[#5f5198] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b5ba6] transition-colors"
              aria-label={item.type === "document" ? "Download research document" : "Access external resource"}
            >
              {item.type === "document" ? "Download" : "Access"}
            </button>
          </div>
        </div>
      </nav>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        {/* SPLIT HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-24 border-b border-slate-100 pb-12">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#755eb1] mb-6">
                <li>Research</li>
                <li aria-hidden="true">
                  <ChevronRight size={12} className="text-slate-300" />
                </li>
                <li aria-current="page">{item.category}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              {item.title}
            </h1>

            {/* Author / Meta Grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 pt-6 border-t border-slate-100 mt-2">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Author
                </dt>
                <dd className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400" aria-hidden="true">
                    <User size={12} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item.author}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Published
                </dt>
                <dd className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar size={14} className="text-slate-400" aria-hidden="true" />
                  <time dateTime={item.publishedAt}>{formattedDate}</time>
                </dd>
              </div>

              <div>
                <dt className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Read Time
                </dt>
                <dd className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock size={14} className="text-slate-400" aria-hidden="true" />
                  {item.readTime}
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Right: The Image */}
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

        {/* CONTENT & SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Main Content */}
          <article className="lg:col-span-8" aria-label="Research article content">
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
              <div className="mt-16 pt-8 border-t border-slate-100">
                <h2 className="sr-only">Tags</h2>
                <ul className="flex flex-wrap gap-2" role="list">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 hover:border-[#755eb1] hover:bg-purple-50 transition-colors">
                        #{tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FULL REPORT SECTION */}
            <aside className="mt-12 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl border-2 border-purple-100 p-8 shadow-lg" aria-label="Download section">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-16 h-16 
             bg-gradient-to-br from-[#6b5ba6] to-[#5a4c8e] 
             rounded-2xl flex items-center justify-center 
             shadow-lg shadow-[#6b5ba633]"
             aria-hidden="true"
                >
                  {item.type === "document" ? (
                    <Download size={28} className="text-white" />
                  ) : (
                    <ExternalLinkIcon size={28} className="text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-2xl text-slate-900 mb-3">
                    {item.type === "document"
                      ? "Download Full Report"
                      : "Access External Resource"}
                  </h3>
                  <p className="text-base text-slate-600 mb-6 leading-relaxed">
                    {item.type === "document"
                      ? "Get instant access to the complete findings, detailed methodology, comprehensive data tables, and all supplementary materials in a professional PDF format."
                      : "Explore the complete resource with interactive tools, detailed analysis, and additional materials available at the official source."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      onClick={openLeadModal}
                      className="flex items-center justify-center gap-2 px-8 py-4 
             bg-gradient-to-r from-[#6b5ba6] to-[#5a4c8e] 
             hover:from-[#5f5198] hover:to-[#4e417d] 
             text-white rounded-xl font-bold transition-all 
             shadow-lg shadow-[#6b5ba633] hover:shadow-xl hover:shadow-[#6b5ba655] 
             active:scale-[0.98] text-base
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b5ba6]"
             aria-label={item.type === "document" ? "Download PDF report" : "Access external resource"}
                    >
                      {item.type === "document" ? (
                        <Download size={20} aria-hidden="true" />
                      ) : (
                        <ExternalLinkIcon size={20} aria-hidden="true" />
                      )}
                      <span>
                        {item.type === "document"
                          ? "Download PDF"
                          : "Access Resource"}
                      </span>
                    </button>

                    {item.documentSize && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm" role="status" aria-label={`File size: ${item.documentSize}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                        <span className="text-sm font-semibold text-slate-600">
                          {item.documentSize}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </article>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:col-span-4 relative" aria-label="Engagement and sharing">
            <div className="sticky top-24 space-y-6">
              {/* Engagement Stats Card */}
              <section className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-sm" aria-labelledby="engagement-heading">
                <h2 id="engagement-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Engagement
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Likes */}
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <button
                      onClick={handleLike}
                      disabled={hasLiked || isLiking}
                      className={`
                        mx-auto flex items-center justify-center
                        w-12 h-12 rounded-full transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2
                        active:scale-95 mb-2
                        ${
                          hasLiked
                            ? "bg-pink-500 text-white shadow-md cursor-not-allowed"
                            : "bg-pink-50 text-pink-500 border border-pink-200 hover:bg-pink-500 hover:text-white hover:shadow-md"
                        }
                      `}
                      aria-label={hasLiked ? `Already liked (${likes} likes)` : `Like this research (${likes} likes)`}
                      aria-pressed={hasLiked}
                    >
                      <Heart
                        size={20}
                        className={hasLiked ? "fill-current" : ""}
                        aria-hidden="true"
                      />
                    </button>
                    <p className="text-2xl font-bold text-slate-900" aria-hidden="true">{likes}</p>
                    <p className="text-xs text-slate-500 mt-1">Likes</p>
                  </div>

                  {/* Views */}
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border border-blue-200 mb-2" aria-hidden="true">
                      <Eye size={20} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {item.views || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Views</p>
                  </div>
                </div>
              </section>

              {/* Share Card */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6" aria-labelledby="share-heading">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 size={16} className="text-slate-400" aria-hidden="true" />
                  <h2 id="share-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Share This Research
                  </h2>
                </div>

                <nav aria-label="Social media sharing">
                  <ul className="grid grid-cols-4 gap-3" role="list">
                    {/* Twitter */}
                    <li>
                      <a
                        href={shareUrls?.twitter || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2]"
                        aria-label="Share on Twitter"
                      >
                        <svg
                          className="w-5 h-5 mb-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-white">
                          Twitter
                        </span>
                      </a>
                    </li>

                    {/* Facebook */}
                    <li>
                      <a
                        href={shareUrls?.facebook || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
                        aria-label="Share on Facebook"
                      >
                        <svg
                          className="w-5 h-5 mb-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-white">
                          Facebook
                        </span>
                      </a>
                    </li>

                    {/* LinkedIn */}
                    <li>
                      <a
                        href={shareUrls?.linkedin || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
                        aria-label="Share on LinkedIn"
                      >
                        <svg
                          className="w-5 h-5 mb-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-white">
                          LinkedIn
                        </span>
                      </a>
                    </li>

                    {/* Copy Link */}
                    <li>
                      <button
                        onClick={handleCopyLink}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-600 hover:text-white hover:border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 w-full"
                        aria-label="Copy link to clipboard"
                      >
                        <svg
                          className="w-5 h-5 mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        <span className="text-[10px] font-medium text-slate-600 group-hover:text-white">
                          Copy
                        </span>
                      </button>
                    </li>
                  </ul>
                </nav>

                {/* Copy confirmation message */}
                {showCopyMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Link copied to clipboard!
                    </p>
                  </motion.div>
                )}
              </section>
            </div>
          </aside>
        </div>
      </main>

      {/* LEAD MODAL */}
      {showLeadModal && (
        <LeadCaptureModal item={item} onClose={closeLeadModal} />
      )}
    </div>
  );
}