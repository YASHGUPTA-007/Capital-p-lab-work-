'use client'

import React, { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle, AlertCircle, FileText, MessageSquare, Calendar, PenTool } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const InsightCard = memo(({ item, index }: { item: any; index: number }) => {
    const router = useRouter()
    
    const handleClick = useCallback(() => {
        if (item.type === "Blogs") {
            router.push('/blog')
        }
    }, [item.type, router])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className={`group ${item.type === "Blogs" ? "cursor-pointer" : ""}`}
            onClick={handleClick}
        >
            <div className="relative h-80 sm:h-96 flex flex-col justify-between border-2 border-[#c1b4df]/30 group-hover:border-[#755eb1] rounded-xl sm:rounded-2xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden will-change-transform">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={item.image}
                        alt={item.type}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={75}
                        loading={index < 2 ? "eager" : "lazy"}
                    />
                    {/* Gradient Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-300"
                    )} />
                    
                    {/* Color Accent Overlay */}
                    <div className={cn(
                        "absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300",
                        item.color === "purple" 
                            ? "bg-gradient-to-br from-[#755eb1] to-transparent" 
                            : "bg-gradient-to-br from-[#4f7f5d] to-transparent"
                    )} />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm",
                                item.color === "purple" 
                                    ? "bg-[#755eb1]/20 border border-[#755eb1]/30" 
                                    : "bg-[#4f7f5d]/20 border border-[#4f7f5d]/30"
                            )}>
                                <item.icon size={16} className={cn(
                                    item.color === "purple" ? "text-[#c1b4df]" : "text-[#c7d6c1]"
                                )} />
                            </div>
                            <span className={cn(
                                "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm",
                                item.color === "purple" 
                                    ? "bg-[#755eb1]/30 text-[#c1b4df] border border-[#755eb1]/30" 
                                    : "bg-[#4f7f5d]/30 text-[#c7d6c1] border border-[#4f7f5d]/30"
                            )}>
                                {item.type}
                            </span>
                        </div>
                        
                   <h3 className="text-xl sm:text-2xl font-serif leading-tight text-white group-hover:text-[#d4cbea] transition-colors mb-3">
                            {item.title}
                        </h3>
                    </div>
                    
                    {/* Bottom Section */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                            {item.date}
                        </span>
                        <div className={cn(
                            "w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 will-change-transform",
                            item.color === "purple" 
                                ? "bg-[#755eb1]/30 border border-[#755eb1]/50" 
                                : "bg-[#4f7f5d]/30 border border-[#4f7f5d]/50"
                        )}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})
InsightCard.displayName = 'InsightCard'

const NewsletterForm = memo(() => {
    const [newsletterData, setNewsletterData] = useState({
        name: '',
        email: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNewsletterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewsletterData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsletterData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            setStatus('success');
            setNewsletterData({ name: '', email: '' });
            
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    }, [newsletterData]);

    return (
        <AnimatePresence mode="wait">
            {status === 'success' ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-md mx-auto py-8"
                >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                   <p className="text-lg font-bold font-serif text-[#755eb1] mb-2">Successfully Subscribed!</p>
                    <p className="text-sm text-[#4f75d]">
                        Thank you for joining our newsletter. Check your inbox soon!
                    </p>
                </motion.div>
            ) : (
                <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubmit}
                    className="max-w-md mx-auto space-y-4"
                >
                    <input 
                        type="text"
                        name="name"
                        value={newsletterData.name}
                        onChange={handleNewsletterChange}
                        placeholder="Your Name"
                        required
                        disabled={status === 'loading'}
                        className="w-full border-b-2 border-[#c1b4df] focus:border-[#755eb1] py-3 focus:outline-none transition-colors bg-transparent text-[#2b2e34] placeholder:text-[#4f75d]/40 disabled:opacity-50" 
                    />
                    <input 
                        type="email"
                        name="email"
                        value={newsletterData.email}
                        onChange={handleNewsletterChange}
                        placeholder="Email Address"
                        required
                        disabled={status === 'loading'}
                        className="w-full border-b-2 border-[#c7d6c1] focus:border-[#4f75d] py-3 focus:outline-none transition-colors bg-transparent text-[#2b2e34] placeholder:text-[#4f75d]/40 disabled:opacity-50" 
                    />
                    
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-red-600 text-sm"
                        >
                            <AlertCircle size={16} />
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-gradient-to-r from-[#755eb1] to-[#4f75d] text-white py-3 sm:py-4 mt-4 sm:mt-6 font-bold uppercase tracking-widest text-xs rounded-full hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Subscribing...</span>
                            </>
                        ) : (
                            'Subscribe'
                        )}
                    </button>
                </motion.form>
            )}
        </AnimatePresence>
    )
})
NewsletterForm.displayName = 'NewsletterForm'

export const InsightsSection = memo(() => {
    const insightItems = [
        { 
            type: "Reports", 
    
            color: "purple",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
            icon: FileText
        },
        { 
            type: "Opinions", 
  
            color: "green",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
            icon: MessageSquare
        },
        { 
            type: "Events", 
  
            color: "purple",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop",
            icon: Calendar
        },
        { 
            type: "Blogs", 

            color: "green",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop",
            icon: PenTool
        }
    ];

    return (
        <section id="insights" className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-[#c1b4df]/20 via-white to-[#c7d6c1]/20 border-t-2 border-[#c1b4df]/30 relative overflow-hidden">
            {/* Optimized background decoration */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#c1b4df]/20 rounded-full blur-[100px] will-change-transform" />
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                {/* Main Heading */}
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#755eb1] leading-tight mb-3 sm:mb-4"
                >
                    Insights
                </motion.h2>
                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[#4f7f5d] leading-tight mb-12 sm:mb-16 md:mb-20"
                >
                    Dialogue and conversations
                </motion.p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {insightItems.map((item, i) => (
                        <InsightCard key={i} item={item} index={i} />
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 sm:mt-24 md:mt-32 relative max-w-3xl mx-auto"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#755eb1] via-[#6b54a5] to-[#4f7f5d] rounded-2xl sm:rounded-3xl" />
                    <div className="relative bg-white p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl border-2 border-[#c1b4df] text-center m-1">
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-[#755eb1]" />
                        <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#c1b4df] to-[#c7d6c1] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#755eb1] mb-2 sm:mb-3">
                            Newsletter
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif mt-2 sm:mt-3 mb-2 sm:mb-3 text-[#755eb1]">
                            Stay informed
                        </h3>
                        <p className="text-sm sm:text-base text-[#4f75d] mb-6 sm:mb-8 max-w-md mx-auto">
                            Curated research and perspectives on sustainability, delivered to your inbox
                        </p>
                        
                        <NewsletterForm />
                        
                        <p className="text-xs text-[#4f75d]/50 mt-3 sm:mt-4">Respecting your privacy. No spam, ever.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
})
InsightsSection.displayName = 'InsightsSection'