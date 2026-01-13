// app/blog/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '../_components/landingPage/Navbar';
import { Footer } from '../_components/landingPage/Footer';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Sustainability', 'Policy', 'Research', 'ESG', 'Climate', 'Inclusion'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, 'blog-posts'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const postsData: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-[#c1b4df]/20 via-white to-[#c7d6c1]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c1b4df]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c7d6c1]/20 rounded-full blur-[100px]" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#c1b4df] to-[#c7d6c1] rounded-full text-xs font-bold uppercase tracking-widest text-[#755eb1] mb-6">
              Insights & Research
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#755eb1] mb-6">
              Our Blog
            </h1>
            <p className="text-lg sm:text-xl text-[#4f75d] max-w-2xl mx-auto">
              Exploring sustainability, policy, and social impact through evidence-based research
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl border-2 border-[#c1b4df]/30 p-6 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] placeholder:text-[#4f75d]/40 focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-[#755eb1] text-white'
                        : 'bg-[#f4f7f5] text-[#4f75d] hover:bg-[#c1b4df]/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#755eb1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#c1b4df]/20 flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-[#755eb1]" />
              </div>
              <h3 className="text-xl font-serif text-[#755eb1] mb-2">No posts found</h3>
              <p className="text-[#4f75d]">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters' 
                  : 'Check back soon for new content'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white border-2 border-[#c1b4df]/30 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#755eb1]/50 transition-all duration-300">
                      {/* Featured Image */}
                      {post.featuredImage ? (
                        <div className="relative h-56 bg-[#f4f7f5] overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-56 bg-gradient-to-br from-[#c1b4df]/30 to-[#c7d6c1]/30 flex items-center justify-center">
                          <span className="text-6xl opacity-20">📝</span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-[#c1b4df]/40 text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full">
                            {post.category}
                          </span>
                        </div>

                        <h2 className="text-xl font-serif text-[#2b2e34] mb-3 line-clamp-2 group-hover:text-[#755eb1] transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-sm text-[#4f75d] mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-[#4f75d]/60 mb-4 pb-4 border-b border-[#c1b4df]/20">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          </div>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <Tag size={14} className="text-[#4f75d]/60" />
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-[#4f75d]/70 bg-[#c7d6c1]/30 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[#755eb1] font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}