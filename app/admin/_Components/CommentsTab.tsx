"use client";

import { useState } from "react";
import {
  MessageCircle,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Mail,
  Trash2,
  AlertTriangle,
  FileText,
  BookOpen,
} from "lucide-react";
import { Comment } from "@/types/admin";

interface CommentsTabProps {
  comments: Comment[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  blogPosts: any[];
  researchItems?: any[];
}

type ContentFilter = "all" | "blogs" | "research";

export default function CommentsTab({
  comments,
  onApprove,
  onReject,
  onDelete,
  blogPosts,
  researchItems = [],
}: CommentsTabProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const commentsPerPage = 10;

  // Helper functions for blogs
  const getBlogTitle = (blogId: string) => {
    const blog = blogPosts.find((b) => b.id === blogId);
    return blog?.title || "Unknown Blog";
  };

  const getBlogSlug = (blogId: string) => {
    const blog = blogPosts.find((b) => b.id === blogId);
    return blog?.slug || "";
  };

  // Helper functions for research
  const getResearchTitle = (researchId: string) => {
    const research = researchItems.find((r) => r.id === researchId);
    return research?.title || "Unknown Research";
  };

  const getResearchSlug = (researchId: string) => {
    const research = researchItems.find((r) => r.id === researchId);
    return research?.slug || "";
  };

  // Get content title and slug
  const getContentInfo = (comment: Comment) => {
    if (comment.blogId) {
      return {
        title: getBlogTitle(comment.blogId),
        slug: getBlogSlug(comment.blogId),
        type: "blog" as const,
        url: `/blogs/${getBlogSlug(comment.blogId)}`,
      };
    } else if (comment.researchId) {
      return {
        title: getResearchTitle(comment.researchId),
        slug: getResearchSlug(comment.researchId),
        type: "research" as const,
        url: `/research/${getResearchSlug(comment.researchId)}`,
      };
    }
    return {
      title: "Unknown",
      slug: "",
      type: "unknown" as const,
      url: "#",
    };
  };

  // Filter comments
  const filteredComments = comments.filter((comment) => {
    // Status filter
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter;

    // Content type filter
    const matchesContentType =
      contentFilter === "all" ||
      (contentFilter === "blogs" && comment.blogId) ||
      (contentFilter === "research" && comment.researchId);

    // Search filter
    const contentInfo = getContentInfo(comment);
    const matchesSearch =
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.authorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contentInfo.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesContentType && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = filteredComments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  // Counts
  const blogComments = comments.filter((c) => c.blogId);
  const researchComments = comments.filter((c) => c.researchId);

  const counts = {
    all: comments.length,
    blogs: blogComments.length,
    research: researchComments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  // Reset to page 1 when filter/search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      onDelete(commentToDelete.id);
      setCommentToDelete(null);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedComments.size === paginatedComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(paginatedComments.map(c => c.id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    selectedComments.forEach(id => onDelete(id));
    setSelectedComments(new Set());
    setShowBulkDeleteConfirm(false);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "#",
      "Author Name",
      "Email",
      "Content Type",
      "Content Title",
      "Comment",
      "Status",
      "Date",
    ];
    const rows = filteredComments.map((comment, index) => {
      const contentInfo = getContentInfo(comment);
      return [
        index + 1,
        comment.authorName,
        comment.authorEmail,
        contentInfo.type,
        contentInfo.title,
        comment.content.replace(/"/g, '""'),
        comment.status,
        new Date(comment.createdAt).toLocaleString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Comments Management</h1>
          <div className="flex items-center gap-3">
            {selectedComments.size > 0 && (
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-sm"
              >
                <Trash2 size={18} />
                Delete Selected ({selectedComments.size})
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all font-medium shadow-sm"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setContentFilter("all");
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                contentFilter === "all"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Comments
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {counts.all}
              </span>
            </button>
            <button
              onClick={() => {
                setContentFilter("blogs");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                contentFilter === "blogs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText size={16} />
              Blog Comments
              <span className="ml-1 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-600">
                {counts.blogs}
              </span>
            </button>
            <button
              onClick={() => {
                setContentFilter("research");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                contentFilter === "research"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BookOpen size={16} />
              Research Comments
              <span className="ml-1 py-0.5 px-2 rounded-full text-xs bg-purple-100 text-purple-600">
                {counts.research}
              </span>
            </button>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Total
              </div>
              <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
                <Mail size={14} className="text-blue-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">{counts.all}</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Pending
              </div>
              <div className="w-7 h-7 rounded-md bg-yellow-50 flex items-center justify-center">
                <MessageCircle size={14} className="text-yellow-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {counts.pending}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Approved
              </div>
              <div className="w-7 h-7 rounded-md bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-green-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {counts.approved}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Rejected
              </div>
              <div className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center">
                <XCircle size={14} className="text-red-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {counts.rejected}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or content..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-gray-900 
                    focus:border-transparent transition-all
                    text-black placeholder:text-gray-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-gray-900 
                  focus:border-transparent transition-all 
                  bg-white cursor-pointer text-black"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {paginatedComments.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle size={56} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No comments found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Comments will appear here once submitted"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedComments.size === paginatedComments.length && paginatedComments.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
                        />
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedComments.map((comment, index) => {
                      const contentInfo = getContentInfo(comment);
                      return (
                        <tr
                          key={comment.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedComments.has(comment.id)}
                              onChange={() => handleCheckboxToggle(comment.id)}
                              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-700">
                            {startIndex + index + 1}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {comment.authorName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {comment.authorEmail}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {contentInfo.type === "blog" ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                <FileText size={12} />
                                Blog
                              </span>
                            ) : contentInfo.type === "research" ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                <BookOpen size={12} />
                                Research
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Unknown</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <a  
                              href={contentInfo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-900 hover:text-blue-600 hover:underline font-medium max-w-xs truncate block"
                            >
                              {contentInfo.title}
                            </a>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                                comment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : comment.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  comment.status === "pending"
                                    ? "bg-yellow-600"
                                    : comment.status === "approved"
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                }`}
                              />
                              {comment.status.charAt(0).toUpperCase() +
                                comment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(comment.createdAt)}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedComment(comment)}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                                title="View details"
                              >
                                <Eye size={16} />
                              </button>
                              {comment.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => onApprove(comment.id)}
                                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => onReject(comment.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              {comment.status === "approved" && (
                                <button
                                  onClick={() => onReject(comment.id)}
                                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                              {comment.status === "rejected" && (
                                <button
                                  onClick={() => onApprove(comment.id)}
                                  className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all"
                                  title="Approve"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => setCommentToDelete(comment)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(
                        startIndex + commentsPerPage,
                        filteredComments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredComments.length}
                    </span>{" "}
                    comments
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>

                    <div className="hidden md:flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${
                                currentPage === pageNum
                                  ? "bg-gray-900 text-white"
                                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <span className="md:hidden text-sm font-medium text-gray-700 px-3">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Multiple Comments
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-bold">{selectedComments.size}</span> selected comment{selectedComments.size > 1 ? 's' : ''}? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                <Trash2 size={16} />
                Delete {selectedComments.size} Comment{selectedComments.size > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Comment
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {commentToDelete.authorName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {commentToDelete.authorEmail}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {commentToDelete.content}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setCommentToDelete(null)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                <Trash2 size={16} />
                Delete Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedComment && (() => {
        const contentInfo = getContentInfo(selectedComment);
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">
                  Comment Details
                </h3>
                <button
                  onClick={() => setSelectedComment(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                >
                  <XCircle size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedComment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">
                      {selectedComment.authorName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedComment.authorEmail}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        selectedComment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedComment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedComment.status === "pending"
                            ? "bg-yellow-600"
                            : selectedComment.status === "approved"
                              ? "bg-green-600"
                              : "bg-red-600"
                        }`}
                      />
                      {selectedComment.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Content Type
                    </label>
                    <div className="mt-1.5">
                      {contentInfo.type === "blog" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700">
                          <FileText size={14} />
                          Blog Post
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700">
                          <BookOpen size={14} />
                          Research Article
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {contentInfo.type === "blog" ? "Blog Post" : "Research Article"}
                    </label>
                    
                    <a  href={contentInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-1.5 text-gray-900 hover:text-blue-600 hover:underline font-medium"
                    >
                      {contentInfo.title}
                    </a>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Submitted
                    </label>
                    <p className="mt-1.5 text-gray-900">
                      {(() => {
                        const date = selectedComment.createdAt.toDate
                          ? selectedComment.createdAt.toDate()
                          : new Date(selectedComment.createdAt);
                        return date.toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      })()}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Comment
                    </label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {selectedComment.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedComment(null)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
                >
                  Close
                </button>
                {selectedComment.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        onApprove(selectedComment.id);
                        setSelectedComment(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        onReject(selectedComment.id);
                        setSelectedComment(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}
                {selectedComment.status !== "pending" && (
                  <button
                    onClick={() => {
                      selectedComment.status === "approved"
                        ? onReject(selectedComment.id)
                        : onApprove(selectedComment.id);
                      setSelectedComment(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      selectedComment.status === "approved"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {selectedComment.status === "approved" ? (
                      <>
                        <XCircle size={16} />
                        Reject
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Approve
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedComment(null);
                    setCommentToDelete(selectedComment);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}