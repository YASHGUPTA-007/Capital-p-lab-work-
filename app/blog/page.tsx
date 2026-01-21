// app/blog/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight,
  X,
  Mail,
  Check,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../_components/landingPage/Navbar";
import { Footer } from "../_components/landingPage/Footer";

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
  status: string;
  createdAt: any;
  publishedAt?: any;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ name: "", email: "" });
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const categories = [
    "All",
    "Sustainability",
    "Policy",
    "Research",
    "ESG",
    "Climate",
    "Inclusion",
  ];

  useEffect(() => {
    fetchPosts();

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

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "blog-posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const postsData: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });

      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
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

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Newsletter Popup */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewsletter(false)}
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
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>

              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-serif text-[#2b2e34] mb-2">
                  Stay in the Loop
                </h3>
                <p className="text-[#4f475d]">
                  Get our latest insights on sustainability, policy, and social
                  impact delivered to your inbox.
                </p>
              </div>

              {newsletterStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <p className="text-green-600 font-semibold text-lg">
                    {newsletterMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <input
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
                    <input
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
                    <p className="text-red-600 text-sm">{newsletterMessage}</p>
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

      {/* Hero Section with Branding */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2b2e34] mb-2">
                  Insights & Research
                </h1>
                <p className="text-lg text-[#4f475d]">
                  Evidence-based analysis on sustainability and social impact
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#2b2e34] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#755eb1]/30 focus:border-[#755eb1] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#755eb1] text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !searchQuery && selectedCategory === "All" && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-[#755eb1]" size={24} />
              <h2 className="text-2xl font-serif text-[#2b2e34]">
                Featured Article
              </h2>
            </div>
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full min-h-[400px]">
                    {featuredPost.featuredImage ? (
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#c1b4df]/20 to-[#c7d6c1]/20" />
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl md:text-4xl font-serif text-[#2b2e34] mb-4 group-hover:text-[#755eb1] transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-[#4f475d] mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {formatDate(
                            featuredPost.publishedAt || featuredPost.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#755eb1] font-semibold group-hover:gap-3 transition-all">
                      <span>Read Full Article</span>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-[#2b2e34]">
              {selectedCategory !== "All"
                ? `${selectedCategory} Articles`
                : "Latest Articles"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} articles
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#755eb1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#755eb1]/30 transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#c1b4df]/15 to-[#c7d6c1]/15 flex items-center justify-center">
                            <span className="text-5xl opacity-20">📝</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-serif text-[#2b2e34] mb-3 line-clamp-2 group-hover:text-[#755eb1] transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span className="truncate">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {post.tags.slice(0, 2).map((tag, idx) => (
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
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#755eb1] to-[#6b54a5]">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="mx-auto mb-6 text-white" size={48} />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Never Miss an Update
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join our community of changemakers and get the latest insights
            delivered to your inbox.
          </p>
          <button
            onClick={() => setShowNewsletter(true)}
            className="px-8 py-4 bg-white text-[#755eb1] rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Subscribe to Newsletter
          </button>
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
