// // app/blog/[slug]/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { motion } from 'framer-motion';
// import { Calendar, User, Tag, ArrowLeft, Twitter, Facebook, Linkedin, Clock, Share2, BookmarkPlus, ChevronRight, TrendingUp } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useParams, useRouter } from 'next/navigation';
// import { Navbar } from '@/app/_components/landingPage/Navbar';
// import { Footer } from '@/app/_components/landingPage/Footer';
// import '../blog-content.css';

// interface BlogPost {
//   id: string;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   author: string;
//   category: string;
//   tags: string[];
//   featuredImage?: string;
//   status: string;
//   createdAt: any;
//   publishedAt?: any;
// }

// export default function BlogPostPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params.slug as string;
  
//   const [post, setPost] = useState<BlogPost | null>(null);
//   const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [readingTime, setReadingTime] = useState(0);
//   const [readingProgress, setReadingProgress] = useState(0);

//   useEffect(() => {
//     if (slug) {
//       fetchPost();
//     }
//   }, [slug]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const windowHeight = window.innerHeight;
//       const documentHeight = document.documentElement.scrollHeight;
//       const scrollTop = window.scrollY;
//       const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
//       setReadingProgress(Math.min(scrollPercent, 100));
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const fetchPost = async () => {
//     try {
//       const q = query(
//         collection(db, 'blog-posts'),
//         where('slug', '==', slug),
//         where('status', '==', 'published')
//       );
      
//       const querySnapshot = await getDocs(q);
      
//       if (querySnapshot.empty) {
//         router.push('/blog');
//         return;
//       }
      
//       const postData = { 
//         id: querySnapshot.docs[0].id, 
//         ...querySnapshot.docs[0].data() 
//       } as BlogPost;
      
//       setPost(postData);
//       calculateReadingTime(postData.content);
//       fetchRelatedPosts(postData.category, postData.id);
//     } catch (error) {
//       console.error('Error fetching post:', error);
//       router.push('/blog');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateReadingTime = (content: string) => {
//     const text = content.replace(/<[^>]*>/g, '');
//     const words = text.trim().split(/\s+/).length;
//     const minutes = Math.ceil(words / 200);
//     setReadingTime(minutes);
//   };

//   const fetchRelatedPosts = async (category: string, currentPostId: string) => {
//     try {
//       const q = query(
//         collection(db, 'blog-posts'),
//         where('category', '==', category),
//         where('status', '==', 'published')
//       );
      
//       const querySnapshot = await getDocs(q);
//       const posts: BlogPost[] = [];
      
//       querySnapshot.forEach((doc) => {
//         if (doc.id !== currentPostId) {
//           posts.push({ id: doc.id, ...doc.data() } as BlogPost);
//         }
//       });
      
//       setRelatedPosts(posts.slice(0, 3));
//     } catch (error) {
//       console.error('Error fetching related posts:', error);
//     }
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return '';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     }).format(date);
//   };

//   const sharePost = (platform: string) => {
//     const url = window.location.href;
//     const title = post?.title || '';
    
//     const shareUrls: { [key: string]: string } = {
//       twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//       linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
//     };
    
//     window.open(shareUrls[platform], '_blank', 'width=600,height=400');
//   };

//   const copyLink = () => {
//     navigator.clipboard.writeText(window.location.href);
//     alert('Link copied to clipboard!');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 border-4 border-[#755eb1] border-t-transparent rounded-full animate-spin" />
//           <p className="text-[#4f475d] font-medium">Loading article...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!post) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
      
//       {/* Reading Progress Bar */}
//       <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
//         <motion.div 
//           className="h-full bg-gradient-to-r from-[#755eb1] to-[#6b54a5]"
//           style={{ width: `${readingProgress}%` }}
//           initial={{ width: 0 }}
//           animate={{ width: `${readingProgress}%` }}
//           transition={{ duration: 0.1 }}
//         />
//       </div>

//       {/* Hero Section with Full-Width Featured Image */}
//       <article className="relative">
//         {/* Featured Image - Full Width Hero */}
//         {post.featuredImage && (
//           <div className="relative w-full h-[60vh] md:h-[70vh] bg-gradient-to-br from-gray-900 to-gray-800">
//             <img
//               src={post.featuredImage}
//               alt={post.title}
//               className="absolute inset-0 w-full h-full object-cover opacity-80"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
//             {/* Hero Content Overlay */}
//             <div className="absolute inset-0 flex items-end">
//               <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
//                 {/* Breadcrumb */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="mb-6"
//                 >
//                   <Link 
//                     href="/blog"
//                     className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors text-sm backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full"
//                   >
//                     <ArrowLeft size={16} />
//                     <span>Back to Blog</span>
//                   </Link>
//                 </motion.div>

//                 {/* Category Badge */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                   className="mb-4"
//                 >
//                   <span className="inline-block px-4 py-2 bg-[#755eb1] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
//                     {post.category}
//                   </span>
//                 </motion.div>

//                 {/* Title */}
//                 <motion.h1
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                   className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 leading-tight max-w-4xl"
//                 >
//                   {post.title}
//                 </motion.h1>

//                 {/* Excerpt */}
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                   className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-3xl"
//                 >
//                   {post.excerpt}
//                 </motion.p>

//                 {/* Meta Info */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                   className="flex flex-wrap items-center gap-4 md:gap-6"
//                 >
//                   <div className="flex items-center gap-2 text-white/90 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
//                     <User size={16} />
//                     <span className="text-sm font-medium">{post.author}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-white/90 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
//                     <Calendar size={16} />
//                     <span className="text-sm">{formatDate(post.publishedAt || post.createdAt)}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-white/90 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
//                     <Clock size={16} />
//                     <span className="text-sm">{readingTime} min read</span>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Featured Image Fallback */}
//         {!post.featuredImage && (
//           <div className="relative w-full bg-gradient-to-br from-[#755eb1]/10 via-white to-[#c7d6c1]/10 pt-32 pb-16">
//             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//               <Link 
//                 href="/blog"
//                 className="inline-flex items-center gap-2 text-[#755eb1] hover:text-[#6b54a5] font-semibold transition-colors mb-8"
//               >
//                 <ArrowLeft size={20} />
//                 <span>Back to Blog</span>
//               </Link>
              
//               <span className="inline-block px-4 py-2 bg-[#c1b4df]/40 text-[#755eb1] text-sm font-bold uppercase tracking-wider rounded-full mb-6">
//                 {post.category}
//               </span>
              
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#2b2e34] mb-6 leading-tight">
//                 {post.title}
//               </h1>
              
//               <p className="text-xl text-[#4f475d] mb-8 leading-relaxed">
//                 {post.excerpt}
//               </p>
              
//               <div className="flex flex-wrap items-center gap-6">
//                 <div className="flex items-center gap-2 text-[#4f475d]">
//                   <User size={18} />
//                   <span className="font-medium">{post.author}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[#4f475d]">
//                   <Calendar size={18} />
//                   <span>{formatDate(post.publishedAt || post.createdAt)}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-[#4f475d]">
//                   <Clock size={18} />
//                   <span>{readingTime} min read</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content Area with Sidebar Layout */}
//         <div className="relative bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
//               {/* Sidebar - Company Branding & Share */}
//               <aside className="lg:col-span-3 order-2 lg:order-1">
//                 <div className="lg:sticky lg:top-24 space-y-6">
                  
//                   {/* Company Branding Card */}
//                   <div className="bg-gradient-to-br from-[#755eb1]/5 to-[#c7d6c1]/5 rounded-2xl p-6 border border-gray-100">
//                     <div className="flex items-center gap-3 mb-4">
//                       <Image 
//                         src="/logo.png" 
//                         alt="Company Logo" 
//                         width={48} 
//                         height={48} 
//                         className="rounded-lg"
//                       />
//                       <div>
//                         <h3 className="font-bold text-[#2b2e34] text-sm">Our Insights</h3>
//                         <p className="text-xs text-[#4f475d]">Research & Analysis</p>
//                       </div>
//                     </div>
//                     <p className="text-sm text-[#4f475d] mb-4">
//                       Evidence-based research on sustainability and social impact.
//                     </p>
//                     <Link 
//                       href="/blog" 
//                       className="inline-flex items-center gap-2 text-[#755eb1] hover:text-[#6b54a5] font-semibold text-sm transition-colors"
//                     >
//                       <span>Explore All Articles</span>
//                       <ChevronRight size={16} />
//                     </Link>
//                   </div>

//                   {/* Share Card */}
//                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//                     <h3 className="font-bold text-[#2b2e34] text-sm mb-4 flex items-center gap-2">
//                       <Share2 size={16} />
//                       Share Article
//                     </h3>
//                     <div className="space-y-2">
//                       <button
//                         onClick={() => sharePost('twitter')}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg transition-all group"
//                       >
//                         <Twitter size={18} />
//                         <span className="text-sm font-medium">Twitter</span>
//                       </button>
//                       <button
//                         onClick={() => sharePost('linkedin')}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg transition-all group"
//                       >
//                         <Linkedin size={18} />
//                         <span className="text-sm font-medium">LinkedIn</span>
//                       </button>
//                       <button
//                         onClick={() => sharePost('facebook')}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-[#1877F2]/10 text-[#1877F2] rounded-lg transition-all group"
//                       >
//                         <Facebook size={18} />
//                         <span className="text-sm font-medium">Facebook</span>
//                       </button>
//                       <button
//                         onClick={copyLink}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-[#755eb1]/10 text-[#755eb1] rounded-lg transition-all group"
//                       >
//                         <Share2 size={18} />
//                         <span className="text-sm font-medium">Copy Link</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Author Info Card */}
//                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//                     <h3 className="font-bold text-[#2b2e34] text-sm mb-3 flex items-center gap-2">
//                       <User size={16} />
//                       About the Author
//                     </h3>
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-lg">
//                         {post.author.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-[#2b2e34] text-sm">{post.author}</p>
//                         <p className="text-xs text-[#4f475d]">Contributing Writer</p>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               </aside>

//               {/* Main Content */}
//               <main className="lg:col-span-9 order-1 lg:order-2">
                
//                 {/* Article Content */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                   className="bg-white"
//                 >
//                   <div 
//                     className="blog-content prose prose-lg max-w-none text-[#2b2e34] marker:text-[#2b2e34]
//                       prose-headings:text-[#2b2e34] prose-headings:font-serif prose-headings:font-bold
//                       prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-10
//                       prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8
//                       prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
//                       prose-p:text-[#2b2e34] prose-p:leading-[1.8] prose-p:mb-0 prose-p:mt-0 prose-p:text-lg
//                       prose-a:text-[#755eb1] prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-[#6b54a5]
//                       prose-strong:text-[#2b2e34] prose-strong:font-bold
//                       prose-em:text-[#2b2e34] prose-em:italic
//                       prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3
//                       prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3
//                       prose-li:text-[#2b2e34] prose-li:text-lg prose-li:leading-relaxed
//                       prose-blockquote:border-l-4 prose-blockquote:border-[#755eb1] prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:bg-[#c1b4df]/5 prose-blockquote:rounded-r-lg
//                       prose-blockquote:text-[#4f475d] prose-blockquote:italic prose-blockquote:text-lg
//                       prose-code:text-[#755eb1] prose-code:bg-[#c1b4df]/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
//                       prose-pre:bg-[#2b2e34] prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:my-8 prose-pre:overflow-x-auto
//                       prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
//                       prose-hr:border-[#c1b4df]/30 prose-hr:my-10
//                       prose-table:my-8 prose-table:border-collapse
//                       prose-th:bg-[#c1b4df]/10 prose-th:text-[#2b2e34] prose-th:font-bold prose-th:p-3 prose-th:border prose-th:border-gray-200
//                       prose-td:p-3 prose-td:border prose-td:border-gray-200
//                       [&_p]:mb-[0.5em]
//                       [&_p:empty]:min-h-[1.8em]
//                       [&_p:empty]:mb-0"
//                     dangerouslySetInnerHTML={{ __html: post.content }}
//                   />
//                 </motion.div>

//                 {/* Tags Section */}
//                 {post.tags && post.tags.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                     className="mt-12 pt-8 border-t-2 border-gray-100"
//                   >
//                     <div className="flex flex-wrap items-center gap-3">
//                       <Tag size={18} className="text-[#4f475d]" />
//                       <span className="text-sm font-semibold text-[#4f475d]">Tags:</span>
//                       {post.tags.map((tag, index) => (
//                         <span
//                           key={index}
//                           className="px-4 py-2 bg-gradient-to-br from-[#c7d6c1]/20 to-[#c1b4df]/20 text-[#4f475d] text-sm font-semibold rounded-full hover:from-[#c7d6c1]/30 hover:to-[#c1b4df]/30 transition-all cursor-default border border-gray-100"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Newsletter CTA */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                   className="mt-12 bg-gradient-to-br from-[#755eb1] to-[#6b54a5] rounded-2xl p-8 md:p-10 text-white"
//                 >
//                   <div className="flex items-start gap-4 mb-4">
//                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
//                       <TrendingUp size={24} />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-serif mb-2">Stay Updated</h3>
//                       <p className="text-white/90 text-sm md:text-base">
//                         Get the latest insights on sustainability, policy, and social impact delivered to your inbox.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
//                     />
//                     <button className="px-6 py-3 bg-white text-[#755eb1] rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap">
//                       Subscribe Now
//                     </button>
//                   </div>
//                 </motion.div>

//               </main>

//             </div>
//           </div>
//         </div>

//         {/* Related Posts - Full Width Section */}
//         {relatedPosts.length > 0 && (
//           <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
//             <div className="max-w-7xl mx-auto">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="w-10 h-10 bg-[#755eb1]/10 rounded-lg flex items-center justify-center">
//                   <TrendingUp className="text-[#755eb1]" size={20} />
//                 </div>
//                 <h2 className="text-3xl font-serif text-[#2b2e34]">Related Articles</h2>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
//                 {relatedPosts.map((relatedPost, index) => (
//                   <motion.article
//                     key={relatedPost.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: index * 0.1 }}
//                   >
//                     <Link href={`/blog/${relatedPost.slug}`}>
//                       <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#755eb1]/30 transition-all duration-300 h-full flex flex-col">
//                         <div className="relative h-56 bg-gray-100 overflow-hidden">
//                           {relatedPost.featuredImage ? (
//                             <img
//                               src={relatedPost.featuredImage}
//                               alt={relatedPost.title}
//                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-[#c1b4df]/15 to-[#c7d6c1]/15 flex items-center justify-center">
//                               <span className="text-6xl opacity-20">📝</span>
//                             </div>
//                           )}
//                           <div className="absolute top-4 left-4">
//                             <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#755eb1] text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
//                               {relatedPost.category}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="p-6 flex-1 flex flex-col">
//                           <h3 className="text-xl font-serif text-[#2b2e34] mb-3 line-clamp-2 group-hover:text-[#755eb1] transition-colors">
//                             {relatedPost.title}
//                           </h3>

//                           <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
//                             {relatedPost.excerpt}
//                           </p>

//                           <div className="flex items-center gap-2 text-[#755eb1] font-semibold text-sm group-hover:gap-3 transition-all">
//                             <span>Read Article</span>
//                             <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.article>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//       </article>

//       <Footer />
//     </div>
//   );
// }

// app/blog/[slug]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Twitter, Facebook, Linkedin, Clock, Share2, Bookmark, ChevronRight, TrendingUp, Mail, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#755eb1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4f475d] font-medium">Loading article...</p>
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
      
      {/* Animated Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#755eb1] via-[#6b54a5] to-[#755eb1] z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Floating Action Buttons */}
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
        
        {/* Hero Section - Modern Magazine Style */}
        <div className="relative bg-gradient-to-br from-[#755eb1]/5 via-white to-[#c7d6c1]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            
            {/* Breadcrumb & Company Branding */}
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

            {/* Category & Reading Info */}
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

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#2b2e34] mb-6 leading-[1.1] max-w-5xl"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-[#4f475d] leading-relaxed max-w-4xl mb-8"
            >
              {post.excerpt}
            </motion.p>

            {/* Author & Share Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#2b2e34] text-lg">{post.author}</p>
                  <p className="text-sm text-[#4f475d]">Contributing Writer</p>
                </div>
              </div>

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

        {/* Featured Image - Full Display */}
       {/* Featured Image - Full Display */}
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
                {/* Image Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white/90 text-sm">Featured image for: {post.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Section */}
        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Main Content Column */}
              <main className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div 
                    className="blog-content prose prose-xl max-w-none text-[#2b2e34]
                      prose-headings:text-[#2b2e34] prose-headings:font-serif prose-headings:font-bold
                      prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                      prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
                      prose-h3:text-3xl prose-h3:mb-5 prose-h3:mt-8
                      prose-p:text-[#2b2e34] prose-p:leading-[1.9] prose-p:mb-0 prose-p:mt-0 prose-p:text-xl
                      prose-a:text-[#755eb1] prose-a:no-underline prose-a:font-semibold prose-a:underline-offset-2 hover:prose-a:underline hover:prose-a:text-[#6b54a5]
                      prose-strong:text-[#2b2e34] prose-strong:font-bold
                      prose-em:text-[#2b2e34] prose-em:italic
                      prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-ul:space-y-4
                      prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-ol:space-y-4
                      prose-li:text-[#2b2e34] prose-li:text-xl prose-li:leading-relaxed prose-li:marker:text-[#755eb1]
                      prose-blockquote:border-l-[6px] prose-blockquote:border-[#755eb1] prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:my-10 
                      prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#c1b4df]/10 prose-blockquote:to-transparent prose-blockquote:rounded-r-2xl
                      prose-blockquote:text-[#2b2e34] prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif
                      prose-code:text-[#755eb1] prose-code:bg-[#755eb1]/10 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-lg prose-code:text-base prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-gradient-to-br prose-pre:from-[#2b2e34] prose-pre:to-[#1a1c20] prose-pre:text-gray-100 prose-pre:p-8 prose-pre:rounded-2xl prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:shadow-xl
                      prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:border-4 prose-img:border-white
                      prose-hr:border-gray-200 prose-hr:my-12 prose-hr:border-t-2
                      prose-table:my-10 prose-table:border-collapse prose-table:shadow-lg prose-table:rounded-xl prose-table:overflow-hidden
                      prose-th:bg-gradient-to-br prose-th:from-[#755eb1] prose-th:to-[#6b54a5] prose-th:text-white prose-th:font-bold prose-th:p-4 prose-th:text-left
                      prose-td:p-4 prose-td:border-t prose-td:border-gray-200
                      [&_p]:mb-[0.6em]
                      [&_p:empty]:min-h-[1.9em]
                      [&_p:empty]:mb-0"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </motion.div>

                {/* Tags */}
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

                {/* Article Footer CTA */}
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
                    <button className="px-8 py-4 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap">
                      Subscribe Now
                    </button>
                  </div>
                </motion.div>

              </main>

              {/* Sticky Sidebar */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-6">
                  
                  {/* Company Card */}
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

                  {/* Table of Contents - Mock */}
                  {/* <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm"
                  >
                    <h3 className="font-bold text-[#2b2e34] mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#755eb1]/10 flex items-center justify-center">
                        <span className="text-[#755eb1] text-xs">≡</span>
                      </div>
                      Quick Navigation
                    </h3>
                    <div className="space-y-3">
                      <a href="#" className="block text-sm text-[#4f475d] hover:text-[#755eb1] transition-colors hover:translate-x-1 transform">
                        Introduction
                      </a>
                      <a href="#" className="block text-sm text-[#4f475d] hover:text-[#755eb1] transition-colors hover:translate-x-1 transform">
                        Key Findings
                      </a>
                      <a href="#" className="block text-sm text-[#4f475d] hover:text-[#755eb1] transition-colors hover:translate-x-1 transform">
                        Analysis
                      </a>
                      <a href="#" className="block text-sm text-[#4f475d] hover:text-[#755eb1] transition-colors hover:translate-x-1 transform">
                        Conclusion
                      </a>
                    </div>
                  </motion.div> */}

                  {/* Stats Card */}
                  {/* <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100"
                  >
                    <h3 className="font-bold text-[#2b2e34] mb-4 text-sm uppercase tracking-wider">Article Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4f475d]">
                          <Eye size={16} />
                          <span className="text-sm">Views</span>
                        </div>
                        <span className="font-bold text-[#2b2e34]">1.2k</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4f475d]">
                          <Heart size={16} />
                          <span className="text-sm">Reactions</span>
                        </div>
                        <span className="font-bold text-[#2b2e34]">89</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4f475d]">
                          <Share2 size={16} />
                          <span className="text-sm">Shares</span>
                        </div>
                        <span className="font-bold text-[#2b2e34]">43</span>
                      </div>
                    </div>
                  </motion.div> */}

                </div>
              </aside>

            </div>
          </div>
        </div>

        {/* Related Articles - Full Width Carousel Style */}
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