// app/_components/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c1b4df]/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c7d6c1]/15 rounded-full blur-[100px]" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Changed "Get in Touch" to green */}
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#c7d6c1] to-[#c7d6c1] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4f7f5d] mb-6">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#755eb1] mb-6 leading-tight">
              Let's start a conversation
            </h2>
            <p className="text-base sm:text-lg text-[#4f75d] leading-relaxed mb-8">
              Ready to turn evidence into action? Share your project details and we'll get back to you within 24 hours to discuss how we can support your sustainability goals.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              {/* Email - Updated to contact@thecapitalplab.com */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c1b4df]/30 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-[#755eb1]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2b2e34] mb-1">Email Us</p>
                  <a href="mailto:contact@thecapitalplab.com" className="text-sm text-[#4f75d] hover:text-[#755eb1] transition-colors">
                    contact@thecapitalplab.com
                  </a>
                </div>
              </div>
              
              {/* Location - Updated to India. USA */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c7d6c1]/50 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#4f75d]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2b2e34] mb-1">Location</p>
                  <p className="text-sm text-[#4f75d]">India. USA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-[#c1b4df]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif text-[#755eb1] mb-2">Message Sent!</h3>
                  <p className="text-[#4f75d] mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-sm text-[#755eb1] hover:text-[#6b54a5] font-semibold transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#4f75d] mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] placeholder:text-[#4f75d]/40 focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                        placeholder="ex -John doe"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#4f75d] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] placeholder:text-[#4f75d]/40 focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                        placeholder="ex-john@example.com"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-[#4f75d] mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] placeholder:text-[#4f75d]/40 focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                        placeholder="How can we help?"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#4f75d] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] placeholder:text-[#4f75d]/40 focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project or inquiry..."
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl"
                    >
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-[#755eb1] to-[#4f75d] hover:from-[#6b54a5] hover:to-[#5a8a6a] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#4f75d]/60 text-center">
                    We respect your privacy and will never share your information.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};