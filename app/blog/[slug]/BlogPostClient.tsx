// app/blog/[slug]/BlogPostClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Twitter, Facebook, Linkedin, Clock, Share2, Bookmark, ChevronRight, TrendingUp, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/app/_components/landingPage/Navbar';
import { Footer } from '@/app/_components/landingPage/Footer';
import '../blog-content.css';

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
  createdAt: string; // ISO string
  publishedAt?: string; // ISO string
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  readingTime: number;
}

export default function BlogPostClient({ post, relatedPosts, readingTime }: BlogPostClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Newsletter form state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const scrollToSubscribe = () => {
    const subscribeSection = document.getElementById('newsletter-subscribe');
    if (subscribeSection) {
      subscribeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (newsletterStatus !== 'idle') {
      setNewsletterStatus('idle');
      setNewsletterMessage('');
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please fill in all fields.');
      return;
    }

    if (formData.name.length < 2) {
      setNewsletterStatus('error');
      setNewsletterMessage('Name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage('🎉 Welcome! You\'re now subscribed to our newsletter.');
        setFormData({ name: '', email: '' });
        
        setTimeout(() => {
          setNewsletterStatus('idle');
          setNewsletterMessage('');
        }, 5000);
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleNewsletterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
      />

      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
            isBookmarked 
              ? 'bg-[#755eb1] text-white' 
              : 'bg-white text-[#755eb1] hover:bg-[#755eb1] hover:text-white'
          }`}
        >
          <Bookmark size={22} fill={isBookmarked ? 'currentColor' : 'none'} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-white text-[#755eb1] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#755eb1] hover:text-white transition-all"
        >
          <ArrowLeft size={22} className="rotate-90" />
        </motion.button>
      </div>

      <article className="relative">
        <div className="relative bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-8"
            >
              <Link 
                href="/blog"
                className="group inline-flex items-center gap-2 text-[#755eb1] hover:text-[#6b54a5] font-semibold transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#755eb1]/10 flex items-center justify-center group-hover:bg-[#755eb1]/20 transition-all">
                  <ArrowLeft size={16} />
                </div>
                <span>Back to Blog</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Company Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-lg"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-[#755eb1] uppercase tracking-wider">Insights</p>
                  <p className="text-xs text-[#4f475d]">Research & Analysis</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-[#4f475d]">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#2b2e34] mb-6 leading-[1.1] max-w-5xl"
            >
              {post.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-[#4f475d] leading-relaxed max-w-4xl mb-8"
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-200"
            >
              {hasAuthor ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#2b2e34] text-lg">{post.author}</p>
                    <p className="text-sm text-[#4f475d]">Contributing Writer</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#2b2e34] text-lg">Editorial Team</p>
                    <p className="text-sm text-[#4f475d]">Research & Analysis</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#4f475d] mr-2">Share:</span>
                <button
                  onClick={() => sharePost('twitter')}
                  className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center justify-center"
                >
                  <Twitter size={18} />
                </button>
                <button
                  onClick={() => sharePost('linkedin')}
                  className="w-10 h-10 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all flex items-center justify-center"
                >
                  <Linkedin size={18} />
                </button>
                <button
                  onClick={() => sharePost('facebook')}
                  className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center"
                >
                  <Facebook size={18} />
                </button>
                <button
                  onClick={copyLink}
                  className="w-10 h-10 rounded-full bg-[#755eb1]/10 text-[#755eb1] hover:bg-[#755eb1] hover:text-white transition-all flex items-center justify-center"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full bg-gray-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto object-contain"
                  style={{ 
                    maxHeight: '80vh',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white/90 text-sm">Featured image for: {post.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              <main className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div 
                    className="blog-content prose prose-lg max-w-none text-[#2b2e34]
                      prose-headings:text-[#2b2e34] prose-headings:font-serif prose-headings:font-bold
                      prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                      prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
                      prose-h3:text-3xl prose-h3:mb-5 prose-h3:mt-8
                      
                      prose-a:text-[#755eb1] prose-a:no-underline prose-a:font-semibold prose-a:underline-offset-2 hover:prose-a:underline hover:prose-a:text-[#6b54a5]
                      prose-strong:text-[#2b2e34] prose-strong:font-bold
                      prose-em:text-[#2b2e34] prose-em:italic
                      prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-ul:space-y-4
                      prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-ol:space-y-4
                      prose-li:text-[#2b2e34] prose-li:text-lg prose-li:leading-relaxed prose-li:marker:text-[#755eb1]
                      prose-blockquote:border-l-[6px] prose-blockquote:border-[#755eb1] prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 
                      prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#c1b4df]/10 prose-blockquote:to-transparent prose-blockquote:rounded-r-2xl
                      prose-blockquote:text-[#2b2e34] prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:font-serif
                      prose-code:text-[#755eb1] prose-code:bg-[#755eb1]/10 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-lg prose-code:text-base prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-gradient-to-br prose-pre:from-[#2b2e34] prose-pre:to-[#1a1c20] prose-pre:text-gray-100 prose-pre:p-8 prose-pre:rounded-2xl prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:shadow-xl
                      prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:border-4 prose-img:border-white
                      prose-hr:border-gray-200 prose-hr:my-12 prose-hr:border-t-2
                      prose-table:my-10 prose-table:border-collapse prose-table:shadow-lg prose-table:rounded-xl prose-table:overflow-hidden
                      prose-th:bg-gradient-to-br prose-th:from-[#755eb1] prose-th:to-[#6b54a5] prose-th:text-white prose-th:font-bold prose-th:p-4 prose-th:text-left
                      prose-td:p-4 prose-td:border-t prose-td:border-gray-200"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </motion.div>

                {post.tags && post.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 pt-10 border-t-2 border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#755eb1]/10 flex items-center justify-center flex-shrink-0">
                        <Tag size={20} className="text-[#755eb1]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#4f475d] uppercase tracking-wider mb-3">Related Topics</h3>
                        <div className="flex flex-wrap gap-3">
                          {post.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.05 }}
                              className="px-5 py-2.5 bg-gradient-to-br from-[#c7d6c1]/30 to-[#c1b4df]/30 text-[#2b2e34] text-sm font-semibold rounded-full hover:from-[#c7d6c1]/50 hover:to-[#c1b4df]/50 transition-all cursor-default border border-gray-200 shadow-sm"
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-16 bg-gradient-to-br from-[#755eb1]/5 via-[#c7d6c1]/5 to-[#755eb1]/5 rounded-3xl p-8 md:p-10 border-2 border-[#755eb1]/20"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center flex-shrink-0 shadow-xl">
                      <Mail size={36} className="text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl md:text-3xl font-serif text-[#2b2e34] mb-2">Enjoyed this article?</h3>
                      <p className="text-[#4f475d] text-lg">Subscribe to get our latest insights delivered to your inbox.</p>
                    </div>
                    <button 
                      onClick={scrollToSubscribe}
                      className="px-8 py-4 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap"
                    >
                      Subscribe Now
                    </button>
                  </div>
                </motion.div>

              </main>

              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-6">
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-2xl p-6 text-white shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Image 
                        src="/logo.png" 
                        alt="Company Logo" 
                        width={50} 
                        height={50} 
                        className="rounded-xl bg-white p-1"
                      />
                      <div>
                        <h3 className="font-bold text-lg">Insights Hub</h3>
                        <p className="text-white/80 text-sm">Research & Analysis</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      Evidence-based research on sustainability, policy, and social impact.
                    </p>
                    <Link 
                      href="/blog" 
                      className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all group"
                    >
                      <span>Explore All Articles</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                  <motion.div
                    id="newsletter-subscribe"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-2xl p-6 text-white shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Stay Updated</h3>
                        <p className="text-white/80 text-sm">Get insights in your inbox</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleNewsletterChange}
                        onKeyPress={handleNewsletterKeyPress}
                        disabled={newsletterStatus === 'loading'}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                      
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleNewsletterChange}
                        onKeyPress={handleNewsletterKeyPress}
                        disabled={newsletterStatus === 'loading'}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />

                      <button
                        onClick={handleNewsletterSubmit}
                        disabled={newsletterStatus === 'loading'}
                        className="w-full px-4 py-3 bg-white hover:bg-white/90 text-[#755eb1] font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        {newsletterStatus === 'loading' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          'Subscribe Now'
                        )}
                      </button>
                    </div>

                    {newsletterMessage && (
                      <div className={`p-3 rounded-lg flex items-start gap-2 ${
                        newsletterStatus === 'success' 
                          ? 'bg-green-500/20 border border-green-400/30' 
                          : 'bg-red-500/20 border border-red-400/30'
                      }`}>
                        {newsletterStatus === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
                        )}
                        <p className={`text-sm ${
                          newsletterStatus === 'success' ? 'text-green-100' : 'text-red-100'
                        }`}>
                          {newsletterMessage}
                        </p>
                      </div>
                    )}
                  </motion.div>

                </div>
              </aside>

            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="relative py-20 bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5 border-t-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#2b2e34]">Continue Reading</h2>
                </div>
                <p className="text-lg text-[#4f475d]">More articles you might enjoy</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.article
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-[#755eb1]/30 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                          {relatedPost.featuredImage ? (
                            <img
                              src={relatedPost.featuredImage}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#c1b4df]/20 to-[#c7d6c1]/20 flex items-center justify-center">
                              <span className="text-7xl opacity-20">📝</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                              {relatedPost.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-2xl font-serif text-[#2b2e34] mb-4 line-clamp-2 group-hover:text-[#755eb1] transition-colors leading-tight">
                            {relatedPost.title}
                          </h3>

                          <p className="text-base text-[#4f475d] mb-6 line-clamp-3 flex-1 leading-relaxed">
                            {relatedPost.excerpt}
                          </p>

                          <div className="flex items-center gap-3 text-[#755eb1] font-bold text-sm group-hover:gap-4 transition-all">
                            <span>Read More</span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

      </article>

      <Footer />
    </div>
  );
}