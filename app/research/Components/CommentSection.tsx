"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import CommentForm from "./CommentForm";

interface Comment {
  id: string;
  researchId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface CommentSectionProps {
  researchId: string;
}

export default function CommentSection({ researchId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const commentsPerPage = 5;
  const commentsListRef = useRef<HTMLDivElement>(null);

  const fetchComments = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/research-comments/${researchId}?page=${page}&limit=${commentsPerPage}`,
      );
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
        setTotalComments(data.total);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && comments.length > 0 && currentPage > 1) {
      const timer = setTimeout(() => {
        const yOffset = -100;
        const element = commentsListRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, comments, currentPage]);

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage, researchId, refreshTrigger]);

  const totalPages = Math.ceil(totalComments / commentsPerPage);

  const handleCommentSubmitted = () => {
    setCurrentPage(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  const scrollToComments = () => {
    setTimeout(() => {
      const yOffset = -100;
      const element = commentsListRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
  <section
  className="relative py-16 bg-white"
  aria-labelledby="comments-heading"
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#755eb1] to-[#6b54a5] flex items-center justify-center shadow-lg"
              aria-hidden="true"
            >
              <MessageCircle size={28} className="text-white" />
            </div>
            <h2
              id="comments-heading"
              className="text-4xl md:text-5xl font-serif text-[#2b2e34]"
            >
              Join the Conversation
            </h2>
          </div>
          <p className="text-lg text-[#4f475d] max-w-2xl mx-auto">
            Share your thoughts and engage with our community.
            <span className="inline-flex items-center gap-1 ml-2 text-[#755eb1] font-semibold">
              <Sparkles size={16} aria-hidden="true" />
              <span>
                {totalComments} {totalComments === 1 ? "comment" : "comments"}
              </span>
            </span>
          </p>
        </header>

        {/* Comment Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <CommentForm
            researchId={researchId}
            onCommentSubmitted={handleCommentSubmitted}
          />
        </div>

        {/* Comments List */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-20"
            role="status"
            aria-live="polite"
            aria-label="Loading comments"
          >
            <Loader2
              className="animate-spin text-[#755eb1] mb-4"
              size={48}
              aria-hidden="true"
            />
            <p className="text-[#4f475d] text-lg">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="max-w-4xl mx-auto" ref={commentsListRef}>
            <div className="space-y-6" role="list" aria-label="Comments">
              {comments.map((comment, index) => (
                <article
                  key={comment.id}
                  className="group bg-white border-2 border-[#c1b4df]/20 rounded-2xl p-6 md:p-8 hover:border-[#755eb1]/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  role="listitem"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#755eb1] to-[#c1b4df] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      >
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-[#2b2e34] text-lg">
                          {comment.authorName}
                        </h3>
                        <span className="text-[#4f759d]/40" aria-hidden="true">
                          •
                        </span>
                        <time
                          className="text-sm text-[#4f759d]/70"
                          dateTime={comment.createdAt}
                        >
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </time>
                      </div>
                      <p className="text-[#2b2e34] leading-relaxed text-base md:text-lg whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-4 mt-10"
                role="navigation"
                aria-label="Comments pagination"
              >
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    scrollToComments();
                  }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] font-semibold hover:border-[#755eb1] hover:bg-[#755eb1]/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-sm hover:shadow-md"
                  aria-label="Go to previous page"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div
                  className="flex items-center gap-2"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="text-[#2b2e34] font-medium px-4 py-2">
                    Page{" "}
                    <span className="font-bold text-[#755eb1]">
                      {currentPage}
                    </span>{" "}
                    of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    scrollToComments();
                  }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] font-semibold hover:border-[#755eb1] hover:bg-[#755eb1]/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-sm hover:shadow-md"
                  aria-label="Go to next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-[#c1b4df]/40 hover:border-[#755eb1]/40 transition-all">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#755eb1]/10 to-[#c1b4df]/10 flex items-center justify-center mx-auto mb-6"
                aria-hidden="true"
              >
                <MessageCircle size={40} className="text-[#755eb1]" />
              </div>
              <h3 className="text-2xl font-serif text-[#2b2e34] mb-3">
                Start the Discussion
              </h3>
              <p className="text-[#4f759d] text-lg mb-6">
                Be the first to share your thoughts on this research!
              </p>
              <div className="inline-flex items-center gap-2 text-[#755eb1] font-semibold">
                <Sparkles size={18} aria-hidden="true" />
                <span>Your insight matters</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}