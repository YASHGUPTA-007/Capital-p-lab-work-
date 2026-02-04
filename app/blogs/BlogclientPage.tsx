// app/blog/BlogClientPage.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  X,
  Mail,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../_components/landingPage/Navbar";
import { Footer } from "../_components/landingPage/Footer";
import Lenis from "lenis";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageName?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  likes?: number;
}

interface BlogClientPageProps {
  initialPosts: BlogPost[];
  initialCategories: string[];
}

const POSTS_PER_PAGE = 18;

export default function BlogClientPage({ initialPosts, initialCategories }: BlogClientPageProps) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<string[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ name: "", email: "" });
const [newsletterStatus, setNewsletterStatus] = useState<
  "idle" | "loading" | "success" | "error"
>("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Add this useEffect to FORCE scroll to work
  useEffect(() => {
    // Force body scroll on mount
    document.body.style.overflow = 'scroll';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'visible';
    
    return () => {
      // Don't reset - let it stay scrollable
    };
  }, []);

  useEffect(() => {
    // Show newsletter popup after 8 seconds if not shown before
    const timer = setTimeout(() => {
      const hasShown = sessionStorage.getItem("newsletterShown");
      if (!hasShown) {
        setShowNewsletter(true);
        sessionStorage.setItem("newsletterShown", "true");
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletterData),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus("success");
        setNewsletterMessage("Thank you for subscribing!");
        setTimeout(() => {
          setShowNewsletter(false);
          setNewsletterData({ name: "", email: "" });
          setNewsletterStatus("idle");
        }, 2000);
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterMessage("Failed to subscribe. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "";
      }
      
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              aria-label="Go to page 1"
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-gray-600"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400" aria-hidden="true">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            aria-label={`${currentPage === page ? 'Current page, ' : ''}Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`px-4 py-2 rounded-lg border transition-all font-semibold ${
              currentPage === page
                ? "bg-[#755eb1] text-white border-[#755eb1]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400" aria-hidden="true">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              aria-label={`Go to page ${totalPages}`}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-gray-600"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Newsletter Popup - Outside main landmarks as it's a modal */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewsletter(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setShowNewsletter(false)}
                aria-label="Close newsletter popup"
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>

              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
                  <Mail className="text-white" size={32} />
                </div>
                <h3 id="newsletter-title" className="text-2xl font-serif text-[#2b2e34] mb-2">
                  Stay in the Loop
                </h3>
                <p className="text-[#4f475d]">
                  Get our latest insights on sustainability, policy, and social
                  impact delivered to your inbox.
                </p>
              </div>

              {newsletterStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <p className="text-green-600 font-semibold text-lg" role="status">
                    {newsletterMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="newsletter-name" className="sr-only">Your name</label>
                    <input
                      id="newsletter-name"
                      type="text"
                      placeholder="Your name"
                      value={newsletterData.name}
                      onChange={(e) =>
                        setNewsletterData({
                          ...newsletterData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#755eb1]/30 focus:border-[#755eb1] transition-all text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newsletter-email" className="sr-only">Your email</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Your email"
                      value={newsletterData.email}
                      onChange={(e) =>
                        setNewsletterData({
                          ...newsletterData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#755eb1]/30 focus:border-[#755eb1] transition-all text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  {newsletterStatus === "error" && (
                    <p className="text-red-600 text-sm" role="alert">{newsletterMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="w-full bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === "loading"
                      ? "Subscribing..."
                      : "Subscribe Now"}
                  </button>
                  <p className="text-xs text-center text-gray-500">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Single <main> landmark for entire page */}
      <main>
        {/* Hero Section with Branding */}
        <section aria-labelledby="page-title" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div>
                  <h1 id="page-title" className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2b2e34] mb-2">
                    Insights & Research
                  </h1>
                  <p className="text-lg text-[#4f475d]">
                    Evidence-based analysis on sustainability and social impact
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <label htmlFor="blog-search" className="sr-only">Search articles</label>
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="blog-search"
                    type="text"
                    placeholder="Search articles, topics, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#2b2e34] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#755eb1]/30 focus:border-[#755eb1] transition-all"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    aria-label="Filter by category"
                    aria-expanded={showCategoryDropdown}
                    aria-haspopup="true"
                    className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap min-w-[200px]"
                  >
                    <Filter size={20} aria-hidden="true" />
                    <span className="flex-1 text-left">{selectedCategory}</span>
                    <ChevronDown size={20} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        role="menu"
                        aria-label="Category filter options"
                        className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl border border-gray-200 shadow-2xl z-10 overflow-hidden"
                      >
                        <div className="max-h-96 overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category}
                              role="menuitem"
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowCategoryDropdown(false);
                              }}
                              className={`w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors ${
                                selectedCategory === category
                                  ? "bg-[#755eb1]/10 text-[#755eb1] font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{category}</span>
                                {selectedCategory === category && (
                                  <Check size={16} className="text-[#755eb1]" aria-hidden="true" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || selectedCategory !== "All") && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600 font-semibold">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== "All" && (
                      <span className="px-3 py-1 bg-[#755eb1]/10 text-[#755eb1] text-sm font-semibold rounded-full flex items-center gap-2">
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("All")}
                          aria-label={`Remove ${selectedCategory} filter`}
                          className="hover:bg-[#755eb1]/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full flex items-center gap-2">
                        "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          aria-label="Clear search query"
                          className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section aria-labelledby="articles-heading" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 id="articles-heading" className="text-2xl font-serif text-[#2b2e34]">
                {selectedCategory !== "All"
                  ? `${selectedCategory} Articles`
                  : "Latest Articles"}
              </h2>
              <span className="text-sm text-gray-500" aria-live="polite">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-serif text-[#2b2e34] mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== "All"
                    ? "Try adjusting your search or filters"
                    : "Check back soon for new content"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-6 py-3 bg-[#755eb1] text-white rounded-xl font-semibold hover:bg-[#6b54a5] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <Link href={`/blogs/${post.slug}`} className="block h-full">
                        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#755eb1]/30 transition-all duration-300 h-full flex flex-col">
                          {/* Fixed Height Image Container */}
                          <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.featuredImageAlt || post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#c1b4df]/15 to-[#c7d6c1]/15 flex items-center justify-center">
                                <span className="text-5xl opacity-20" aria-hidden="true">📝</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full">
                                {post.category}
                              </span>
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="p-6 flex-1 flex flex-col">
                            {/* Title - Fixed 2 lines */}
                            <h3 className="text-xl font-serif text-[#2b2e34] mb-3 line-clamp-2 group-hover:text-[#755eb1] transition-colors min-h-[3.5rem]">
                              {post.title}
                            </h3>

                            {/* Excerpt - Fixed 3 lines */}
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 min-h-[4.5rem]">
                              {post.excerpt}
                            </p>

                            {/* Tags Section */}
                            <div className="mb-4 min-h-[2rem]">
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {post.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Meta Information */}
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                              {post.author && post.author.trim() !== "" ? (
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <User size={14} className="flex-shrink-0" aria-hidden="true" />
                                  <span className="truncate">{post.author}</span>
                                </div>
                              ) : (
                                <div className="flex-1"></div>
                              )}
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <Calendar size={14} aria-hidden="true" />
                                <time dateTime={post.publishedAt || post.createdAt} className="whitespace-nowrap">
                                  {formatDate(post.publishedAt || post.createdAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}