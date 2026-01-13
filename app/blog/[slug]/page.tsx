// app/blog/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/app/_components/landingPage/Navbar';
import { Footer } from '@/app/_components/landingPage/Footer';

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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const q = query(
        collection(db, 'blog-posts'),
        where('slug', '==', slug),
        where('status', '==', 'published')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        router.push('/blog');
        return;
      }
      
      const postData = { 
        id: querySnapshot.docs[0].id, 
        ...querySnapshot.docs[0].data() 
      } as BlogPost;
      
      setPost(postData);
      fetchRelatedPosts(postData.category, postData.id);
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
      const q = query(
        collection(db, 'blog-posts'),
        where('category', '==', category),
        where('status', '==', 'published')
      );
      
      const querySnapshot = await getDocs(q);
      const posts: BlogPost[] = [];
      
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentPostId) {
          posts.push({ id: doc.id, ...doc.data() } as BlogPost);
        }
      });
      
      setRelatedPosts(posts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#755eb1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4f75d]">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <article className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-[#755eb1] hover:text-[#6b54a5] font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </Link>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#c1b4df]/40 text-[#755eb1] text-sm font-bold uppercase tracking-wider rounded-full">
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#2b2e34] mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-[#4f75d] mb-8 leading-relaxed"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b-2 border-[#c1b4df]/20"
          >
            <div className="flex items-center gap-2 text-[#4f75d]">
              <User size={18} />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4f75d]">
              <Calendar size={18} />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[#4f75d] mr-2">Share:</span>
              <button
                onClick={() => sharePost('twitter')}
                className="p-2 hover:bg-[#c1b4df]/20 text-[#755eb1] rounded-lg transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} />
              </button>
              <button
                onClick={() => sharePost('facebook')}
                className="p-2 hover:bg-[#c1b4df]/20 text-[#755eb1] rounded-lg transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={18} />
              </button>
              <button
                onClick={() => sharePost('linkedin')}
                className="p-2 hover:bg-[#c1b4df]/20 text-[#755eb1] rounded-lg transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </button>
            </div>
          </motion.div>

          {/* Featured Image */}
          {post.featuredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="prose prose-lg max-w-none mb-12"
            style={{
              color: '#2b2e34',
              lineHeight: '1.8'
            }}
          >
            <div className="text-[#2b2e34] leading-relaxed space-y-6 text-lg">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center gap-3 pt-8 border-t-2 border-[#c1b4df]/20"
            >
              <Tag size={18} className="text-[#4f75d]" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#c7d6c1]/30 text-[#4f75d] text-sm font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif text-[#755eb1] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white border-2 border-[#c1b4df]/30 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#755eb1]/50 transition-all">
                    {relatedPost.featuredImage ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#c1b4df]/30 to-[#c7d6c1]/30 flex items-center justify-center">
                        <span className="text-5xl opacity-20">📝</span>
                      </div>
                    )}
                    <div className="p-6">
                      <span className="px-3 py-1 bg-[#c1b4df]/40 text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-serif text-[#2b2e34] mt-3 mb-2 line-clamp-2 hover:text-[#755eb1] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[#4f75d] line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}