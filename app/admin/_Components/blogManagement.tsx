// components/admin/BlogsTab.tsx
import { useState } from 'react';
import { Search, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { BlogPost } from '@/types/admin';

interface BlogsTabProps {
  blogPosts: BlogPost[];
  onDeleteBlog: (id: string) => void;
  onEditBlog: (blog: BlogPost) => void;
  onNewBlog: () => void;
  formatDate: (timestamp: any) => string;
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

  const filteredBlogs = blogPosts.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filterStatus === 'all' || blog.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Blog Posts</h1>
          <p className="text-xs md:text-sm text-gray-600">Manage all blog content</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
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
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
        <div className="p-3 md:px-4 md:py-3 space-y-3">
          {/* Search */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-600 text-gray-900"
            />
          </div>
          
          {/* Filter */}
          <div className="flex items-center justify-between gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
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
                      Date
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
                  {filteredBlogs.map((blog) => (
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
                            {blog.excerpt && (
                              <p className="text-xs text-gray-500 truncate">{blog.excerpt}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatDate(blog.createdAt)}</p>
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteBlog(blog.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredBlogs.map((blog) => (
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
                    <h3 className="text-sm font-medium text-gray-900 flex-1 line-clamp-2">
                      {blog.title}
                    </h3>
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
                    <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditBlog(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteBlog(blog.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}