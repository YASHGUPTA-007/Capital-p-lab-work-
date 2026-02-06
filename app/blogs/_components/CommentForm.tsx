'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, User, Mail as MailIcon, Edit2, MessageSquare } from 'lucide-react';
import Cookies from 'js-cookie';

interface CommentFormProps {
  blogId: string;
  onCommentSubmitted: () => void;
}

const COOKIE_NAME = 'commentAuthor';
const COOKIE_EXPIRY = 365; // days

export default function CommentForm({ blogId, onCommentSubmitted }: CommentFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasStoredData, setHasStoredData] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [touched, setTouched] = useState({
    authorName: false,
    authorEmail: false,
    content: false,
  });

  // Load saved data from cookies on mount
  useEffect(() => {
    const savedData = Cookies.get(COOKIE_NAME);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          authorName: parsed.authorName || '',
          authorEmail: parsed.authorEmail || '',
        }));
        setHasStoredData(true);
      } catch (e) {
        console.error('Failed to parse cookie data');
      }
    } else {
      setShowFullForm(true);
    }
  }, []);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.authorName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (formData.authorName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!formData.authorEmail.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Please write a comment');
      return false;
    }
    if (formData.content.trim().length < 10) {
      setError('Comment must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      authorName: true,
      authorEmail: true,
      content: true,
    });

    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, blogId }),
      });

      const data = await response.json();

      if (data.success) {
        // Save author details to cookies
        Cookies.set(
          COOKIE_NAME,
          JSON.stringify({
            authorName: formData.authorName,
            authorEmail: formData.authorEmail,
          }),
          { expires: COOKIE_EXPIRY }
        );

        setSuccess(true);
        setFormData(prev => ({ ...prev, content: '' }));
        setTouched({ authorName: false, authorEmail: false, content: false });
        setHasStoredData(true);
        setShowFullForm(false);
        
        setTimeout(() => {
          setSuccess(false);
          onCommentSubmitted();
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit comment. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick comment UI for returning users
  if (hasStoredData && !showFullForm) {
    return (
      <div className="bg-white border-2 border-[#c1b4df]/30 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center shadow-md">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2b2e34]">Welcome back, {formData.authorName}!</h3>
              <p className="text-sm text-[#4f475d]">Ready to share your thoughts?</p>
            </div>
          </div>
          <button
            onClick={() => setShowFullForm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#755eb1] hover:bg-[#755eb1]/5 rounded-lg transition-all"
          >
            <Edit2 size={16} />
            <span>Edit Details</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="content" 
              className="flex items-center justify-between text-sm font-semibold text-[#2b2e34] mb-2"
            >
              <span>Your Comment <span className="text-[#755eb1]">*</span></span>
              <span className="text-xs text-[#4f475d]/60 font-normal">
                {formData.content.length} characters
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              onBlur={() => handleBlur('content')}
              className="w-full px-4 py-3 border-2 border-[#c1b4df]/30 rounded-xl focus:ring-2 focus:ring-[#755eb1]/50 focus:border-[#755eb1] text-[#2b2e34] bg-white placeholder:text-[#4f475d]/40 resize-none transition-all"
              rows={5}
              placeholder="Share your thoughts, insights, or questions about this article..."
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">🎉 Comment submitted successfully!</p>
                <p className="text-xs mt-1 text-green-600">
                  Your comment will appear after admin approval. Thank you for contributing!
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white font-bold rounded-xl hover:from-[#6b54a5] hover:to-[#5a4894] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Posting...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Submitted!</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Full form UI
  return (
    <div className="bg-white border-2 border-[#c1b4df]/30 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center shadow-md">
          <Send size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#2b2e34]">Share Your Thoughts</h3>
          <p className="text-sm text-[#4f475d]">Your perspective enriches our community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label 
              htmlFor="authorName" 
              className="flex items-center gap-2 text-sm font-semibold text-[#2b2e34] mb-2"
            >
              <User size={16} className="text-[#755eb1]" />
              Your Name <span className="text-[#755eb1]">*</span>
            </label>
            <input
              id="authorName"
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              onBlur={() => handleBlur('authorName')}
              className="w-full px-4 py-3 border-2 border-[#c1b4df]/30 rounded-xl focus:ring-2 focus:ring-[#755eb1]/50 focus:border-[#755eb1] text-[#2b2e34] bg-white placeholder:text-[#4f475d]/40 transition-all"
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="authorEmail" 
              className="flex items-center gap-2 text-sm font-semibold text-[#2b2e34] mb-2"
            >
              <MailIcon size={16} className="text-[#755eb1]" />
              Your Email <span className="text-[#755eb1]">*</span>
            </label>
            <input
              id="authorEmail"
              type="email"
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleChange}
              onBlur={() => handleBlur('authorEmail')}
              className="w-full px-4 py-3 border-2 border-[#c1b4df]/30 rounded-xl focus:ring-2 focus:ring-[#755eb1]/50 focus:border-[#755eb1] text-[#2b2e34] bg-white placeholder:text-[#4f475d]/40 transition-all"
              placeholder="john@example.com"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="content" 
            className="flex items-center justify-between text-sm font-semibold text-[#2b2e34] mb-2"
          >
            <span>Your Comment <span className="text-[#755eb1]">*</span></span>
            <span className="text-xs text-[#4f475d]/60 font-normal">
              {formData.content.length} characters
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            onBlur={() => handleBlur('content')}
            className="w-full px-4 py-3 border-2 border-[#c1b4df]/30 rounded-xl focus:ring-2 focus:ring-[#755eb1]/50 focus:border-[#755eb1] text-[#2b2e34] bg-white placeholder:text-[#4f475d]/40 resize-none transition-all"
            rows={5}
            placeholder="Share your thoughts, insights, or questions about this article..."
            disabled={loading}
            required
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700">
            <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">🎉 Comment submitted successfully!</p>
              <p className="text-xs mt-1 text-green-600">
                Your comment will appear after admin approval. Thank you for contributing!
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#4f759d]/60 max-w-md">
            💡 Your email won't be published. All comments are moderated to ensure quality discussion.
          </p>
          
          <button
            type="submit"
            disabled={loading || success}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] text-white font-bold rounded-xl hover:from-[#6b54a5] hover:to-[#5a4894] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Posting...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={18} />
                <span>Submitted!</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}