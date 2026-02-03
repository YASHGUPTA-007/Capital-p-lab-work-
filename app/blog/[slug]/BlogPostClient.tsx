"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatViewCount } from "@/lib/formatters";
import {
  Calendar,
  Heart,
  Tag,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Clock,
  Share2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/_components/landingPage/Navbar";
import { Footer } from "@/app/_components/landingPage/Footer";
import "../blog-content.css";
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
  featuredImageAlt?: string;      // ✅ ADD THIS
  featuredImageName?: string;     // ✅ ADD THIS
  status: string;
  createdAt: string;
  publishedAt?: string;
  likes?: number;
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  readingTime: number;
}

export default function BlogPostClient({
  post,
  relatedPosts,
  readingTime,
}: BlogPostClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Newsletter form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "scroll";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "visible";

    return () => {};
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const trackView = async () => {
      const viewedKey = `blog_viewed_${post.id}`;
      const hasViewed = sessionStorage.getItem(viewedKey);

      if (!hasViewed) {
        timeoutId = setTimeout(async () => {
          try {
            await fetch("/api/blog/view", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ blogId: post.id }),
            });

            sessionStorage.setItem(viewedKey, "true");
          } catch (error) {
            console.error("Failed to track view:", error);
          }
        }, 3000);
      }
    };

    trackView();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [post.id]);

  useEffect(() => {
    const likedKey = `blog_liked_${post.id}`;
    const hasLikedBefore = localStorage.getItem(likedKey);
    if (hasLikedBefore) {
      setHasLiked(true);
    }
  }, [post.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handleLike = async () => {
    if (hasLiked || isLiking) return;

    setIsLiking(true);

    setLikes((prev) => prev + 1);
    setHasLiked(true);

    try {
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();

      setLikes(data.likes);

      localStorage.setItem(`blog_liked_${post.id}`, "true");
    } catch (error) {
      console.error("Error liking post:", error);
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const scrollToSubscribe = () => {
    const subscribeSection = document.getElementById("newsletter-subscribe");
    if (subscribeSection) {
      subscribeSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (newsletterStatus !== "idle") {
      setNewsletterStatus("idle");
      setNewsletterMessage("");
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please fill in all fields.");
      return;
    }

    if (formData.name.length < 2) {
      setNewsletterStatus("error");
      setNewsletterMessage("Name must be at least 2 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus("success");
        setNewsletterMessage(
          "🎉 Welcome! You're now subscribed to our newsletter.",
        );
        setFormData({ name: "", email: "" });

        setTimeout(() => {
          setNewsletterStatus("idle");
          setNewsletterMessage("");
        }, 5000);
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(
          data.error || "Subscription failed. Please try again.",
        );
      }
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterMessage(
        "Network error. Please check your connection and try again.",
      );
    }
  };

  const handleNewsletterKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleNewsletterSubmit();
    }
  };

  const hasAuthor = post?.author && post.author.trim() !== "";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#755eb1] via-[#6b54a5] to-[#755eb1] z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        aria-live="polite"
      />

      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 h-14 bg-white text-[#755eb1] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#755eb1] hover:text-white transition-all"
          aria-label="Scroll to top"
        >
          <ArrowLeft size={22} className="rotate-90" />
        </motion.button>
      </div>

<article className="relative">
  {/* Progress Bar */}
  <motion.div
    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#755eb1] via-[#6b54a5] to-[#755eb1] z-50 origin-left"
    style={{ scaleX: readingProgress / 100 }}
    initial={{ scaleX: 0 }}
    role="progressbar"
    aria-valuenow={Math.round(readingProgress)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Reading progress"
    aria-live="polite"
  />

  {/* Scroll to Top Button */}
  <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="w-14 h-14 bg-white text-[#755eb1] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#755eb1] hover:text-white transition-all"
      aria-label="Scroll to top"
    >
      <ArrowLeft size={22} className="rotate-90" />
    </motion.button>
  </div>

  {/* ✅ HEADER LANDMARK - Contains ALL intro content */}
  <header className="relative bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      
      {/* Navigation */}
      <nav
        className="flex items-center justify-between mb-8"
        aria-label="Breadcrumb and site info"
      >
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-[#755eb1] hover:text-[#6b54a5] font-semibold transition-all"
          aria-label="Back to Blog"
        >
          <div className="w-8 h-8 rounded-full bg-[#755eb1]/10 flex items-center justify-center group-hover:bg-[#755eb1]/20 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span>Back to Blog</span>
        </Link>

        <div className="flex items-center gap-3" aria-label="Site branding">
          <Image
            src="/logo.png"
            alt="The Capital P Lab Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#755eb1] uppercase tracking-wider">
              Insights
            </p>
            <p className="text-xs text-[#4f475d]">Research & Analysis</p>
          </div>
        </div>
      </nav>

      {/* Category & Meta - NO motion.div wrapper */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span 
          className="px-4 py-2 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg"
          aria-label={`Category: ${post.category}`}
        >
          {post.category}
        </span>
        <div className="flex items-center gap-4 text-sm text-[#4f475d]">
          <div className="flex items-center gap-1.5">
            <Clock size={16} aria-hidden="true" />
            <span aria-label={`Estimated reading time: ${readingTime} minutes`}>
              {readingTime} min read
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} aria-hidden="true" />
            <time 
              dateTime={post.publishedAt || post.createdAt}
              aria-label={`Published on ${formatDate(post.publishedAt || post.createdAt)}`}
            >
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
          </div>
        </div>
      </div>

      {/* Title - NO motion.h1 wrapper */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#2b2e34] mb-6 leading-[1.1] max-w-5xl">
        {post.title}
      </h1>

      {/* Excerpt - NO motion.p wrapper */}
      <p className="text-xl md:text-2xl text-[#4f475d] leading-relaxed max-w-4xl mb-8">
        {post.excerpt}
      </p>

      {/* Author & Share */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-4" role="region" aria-label="Author information">
          {hasAuthor ? (
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-xl shadow-lg" aria-hidden="true">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[#2b2e34] text-lg">
                  {post.author}
                </p>
                <p className="text-sm text-[#4f475d]">
                  Contributing Writer
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-xl shadow-lg" aria-hidden="true">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="font-bold text-[#2b2e34] text-lg">
                  Editorial Team
                </p>
                <p className="text-sm text-[#4f475d]">
                  Research & Analysis
                </p>
              </div>
            </>
          )}
        </div>

        <nav aria-label="Share article">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#2b2e34] mr-2">
              Share:
            </span>
            {/* Share buttons */}
            <button
              onClick={() => sharePost("twitter")}
              className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-all flex items-center justify-center shadow-md"
              aria-label="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
            <button
              onClick={() => sharePost("linkedin")}
              className="w-10 h-10 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-all flex items-center justify-center shadow-md"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </button>
            <button
              onClick={() => sharePost("facebook")}
              className="w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-[#0c63d4] transition-all flex items-center justify-center shadow-md"
              aria-label="Share on Facebook"
            >
              <Facebook size={18} />
            </button>
            <button
              onClick={copyLink}
              className="w-10 h-10 rounded-full bg-[#2b2e34] text-white hover:bg-[#1a1c20] transition-all flex items-center justify-center shadow-md"
              aria-label="Copy link to clipboard"
            >
              <Share2 size={18} />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <button
                onClick={handleLike}
                disabled={hasLiked || isLiking}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md ${
                  hasLiked
                    ? "bg-red-500 text-white cursor-default"
                    : "bg-red-50 text-red-700 hover:bg-red-500 hover:text-white"
                }`}
                aria-label={
                  hasLiked
                    ? `You've liked this post. ${formatViewCount(likes, "intl").full} total likes`
                    : `Like this post. ${formatViewCount(likes, "intl").full} total likes`
                }
              >
                <Heart
                  size={18}
                  className={
                    hasLiked ? "fill-current" : "group-hover:fill-current"
                  }
                  aria-hidden="true"
                />
                <span className="text-sm">
                  {formatViewCount(likes, "intl").formatted}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Tags - NO motion.div wrapper */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6">
          <span className="text-sm font-semibold text-gray-700 mb-2 block">Topics:</span>
          <ul className="flex items-center gap-2 flex-wrap list-none" aria-label="Article topics">
            {post.tags.map((tag, index) => (
              <li key={index}>
                <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition-colors border border-gray-200">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {/* ✅ Featured Image INSIDE header landmark */}
    {post.featuredImage && (
      <figure className="relative w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || `Featured image for: ${post.title}`}
              className="w-full h-auto object-contain"
              style={{
                maxHeight: "80vh",
                display: "block",
                margin: "0 auto",
              }}
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white/90 text-sm">
                {post.featuredImageName || post.title}
              </p>
            </figcaption>
          </div>
        </div>
      </figure>
    )}
  </header>

  {/* Rest of article (main, aside, etc.) */}
</article>

      <Footer />
    </div>
  );
}
