// app/blog/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Clock } from 'lucide-react';
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
  const [readingTime, setReadingTime] = useState(0);

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
      calculateReadingTime(postData.content);
      fetchRelatedPosts(postData.category, postData.id);
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    setReadingTime(minutes);
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
          <p className="text-[#4f475d]">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
            className="text-xl text-[#4f475d] mb-8 leading-relaxed"
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
            <div className="flex items-center gap-2 text-[#4f475d]">
              <User size={18} />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4f475d]">
              <Calendar size={18} />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4f475d]">
              <Clock size={18} />
              <span>{readingTime} min read</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[#4f475d] mr-2">Share:</span>
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

          {/* Content - FIXED: Proper paragraph spacing with empty paragraph support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <div 
              className="prose prose-lg max-w-none text-[#2b2e34] marker:text-[#2b2e34]
                prose-headings:text-[#2b2e34] prose-headings:font-serif prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
                prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                prose-p:text-[#2b2e34] prose-p:leading-[1.8] prose-p:mb-6 prose-p:mt-0 prose-p:text-lg prose-p:min-h-[1.8em]
                prose-a:text-[#755eb1] prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-[#6b54a5]
                prose-strong:text-[#2b2e34] prose-strong:font-bold
                prose-em:text-[#2b2e34] prose-em:italic
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3
                prose-li:text-[#2b2e34] prose-li:text-lg prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-[#755eb1] prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:my-8 prose-blockquote:bg-[#c1b4df]/5 prose-blockquote:rounded-r-lg
                prose-blockquote:text-[#4f475d] prose-blockquote:italic prose-blockquote:text-lg
                prose-code:text-[#755eb1] prose-code:bg-[#c1b4df]/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#2b2e34] prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-8 prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                prose-hr:border-[#c1b4df]/30 prose-hr:my-10
                prose-table:my-8
                prose-th:bg-[#c1b4df]/10 prose-th:text-[#2b2e34] prose-th:font-bold prose-th:p-3
                prose-td:p-3 prose-td:border prose-td:border-[#c1b4df]/20
                [&_p:empty]:min-h-[1.8em] [&_p:empty]:mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center gap-3 pt-8 border-t-2 border-[#c1b4df]/20"
            >
              <Tag size={18} className="text-[#4f475d]" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#c7d6c1]/30 text-[#4f475d] text-sm font-semibold rounded-full hover:bg-[#c7d6c1]/50 transition-colors cursor-default"
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif text-[#755eb1] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white border border-[#c1b4df]/20 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#755eb1]/40 transition-all group">
                    {relatedPost.featuredImage ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#c1b4df]/15 to-[#c7d6c1]/15 flex items-center justify-center">
                        <span className="text-5xl opacity-15">📝</span>
                      </div>
                    )}
                    <div className="p-6">
                      <span className="px-3 py-1 bg-[#c1b4df]/20 text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-serif text-[#2b2e34] mt-3 mb-2 line-clamp-2 group-hover:text-[#755eb1] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[#4f475d] line-clamp-2">
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