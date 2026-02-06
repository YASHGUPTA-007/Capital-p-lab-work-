// components/admin/BlogsTab.tsx
import { useState } from 'react';
import { Search, FileText, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, X, Heart } from 'lucide-react';
import { BlogPost } from '@/types/admin';
import { formatViewCount } from '@/lib/formatters';

interface BlogsTabProps {
  blogPosts: BlogPost[];
  onDeleteBlog: (id: string) => Promise<void>;
  onEditBlog: (blog: BlogPost) => void;
  onNewBlog: () => void;
  formatDate: (timestamp: any) => string;
}

// Simple Toast Component (inline)
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${
      type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex-shrink-0">
        {type === 'success' ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-600" />
        )}
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// Simple Confirm Dialog Component (inline)
function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  isLoading 
}: { 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogsTab({
  blogPosts,
  onDeleteBlog,
  onEditBlog,
  onNewBlog,
  formatDate
}: BlogsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredBlogs = blogPosts.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filterStatus === 'all' || blog.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate total views
  const totalViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const { formatted: totalViewsFormatted } = formatViewCount(totalViews, 'intl');
  const totalLikes = blogPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
const { formatted: totalLikesFormatted } = formatViewCount(totalLikes, 'intl');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog);
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    
    setDeletingId(blogToDelete.id);
    try {
      await onDeleteBlog(blogToDelete.id);
      showToast('Blog post deleted successfully', 'success');
      setBlogToDelete(null);
    } catch (error) {
      showToast('Failed to delete blog post', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Blog Posts</h1>
            
          </div>
          <button
            onClick={onNewBlog}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </div>

        {/* Stats */}
   <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{blogPosts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Published</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {blogPosts.filter(b => b.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {blogPosts.filter(b => b.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">{totalViewsFormatted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
      <Heart size={20} className="text-red-600" />
    </div>
    <div>
      <p className="text-xs md:text-sm font-medium text-gray-600">Total Likes</p>
      <p className="text-xl md:text-2xl font-semibold text-gray-900">{totalLikesFormatted}</p>
    </div>
  </div>
</div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
          <div className="p-3 md:px-4 md:py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-600 text-gray-900"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-32 md:w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <span className="hidden sm:block text-xs md:text-sm text-gray-600 whitespace-nowrap">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 text-center">
            <FileText size={40} className="md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-900 mb-1">No blog posts found</p>
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first blog post to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={onNewBlog}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} />
                Create Post
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
               <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Title
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Category
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Views
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Likes
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Status
    </th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
      Actions
    </th>
  </tr>
</thead>
              <tbody className="divide-y divide-gray-200">
  {filteredBlogs.map((blog) => {
    const { formatted: viewsFormatted, full: viewsFull } = formatViewCount(blog.views, 'intl');
    const { formatted: likesFormatted, full: likesFull } = formatViewCount(blog.likes, 'intl');
    
    return (
      <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {blog.featuredImage && (
              <img 
                src={blog.featuredImage} 
                alt={blog.title}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
              <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            {blog.category}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span 
            className="text-sm font-semibold text-gray-900 cursor-help"
            title={`${viewsFull} total views`}
          >
            {viewsFormatted}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div 
            className="flex items-center gap-2 cursor-help" 
            title={`${likesFull} total likes`}
          >
            <Heart size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-900">
              {likesFormatted}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            blog.status === 'published' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {blog.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEditBlog(blog)}
              disabled={deletingId === blog.id}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              title="Edit post"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(blog)}
              disabled={deletingId === blog.id}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete post and all images"
            >
              {deletingId === blog.id ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
           <div className="md:hidden space-y-3">
  {filteredBlogs.map((blog) => {
    const { formatted: viewsFormatted, full: viewsFull } = formatViewCount(blog.views, 'intl');
    const { formatted: likesFormatted, full: likesFull } = formatViewCount(blog.likes, 'intl');
    
    return (
      <div 
        key={blog.id} 
        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
      >
        {blog.featuredImage && (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{formatDate(blog.createdAt)}</p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {blog.status}
            </span>
          </div>
          
          {blog.excerpt && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{blog.excerpt}</p>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {blog.category}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
            <div 
              className="flex items-center gap-2"
              title={`${viewsFull} total views`}
            >
              <Eye size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">
                {viewsFormatted}
              </span>
            </div>
            <div 
              className="flex items-center gap-2"
              title={`${likesFull} total likes`}
            >
              <Heart size={14} className="text-red-500" />
              <span className="text-sm text-gray-600 font-medium">
                {likesFormatted}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditBlog(blog)}
              disabled={deletingId === blog.id}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(blog)}
              disabled={deletingId === blog.id}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              {deletingId === blog.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      {blogToDelete && (
        <ConfirmDialog
          title="Delete Blog Post"
          message={`Are you sure you want to delete "${blogToDelete.title}"? This will permanently delete the post and all associated images.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setBlogToDelete(null)}
          isLoading={deletingId === blogToDelete.id}
        />
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}