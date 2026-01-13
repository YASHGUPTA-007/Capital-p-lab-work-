// components/admin/BlogsTab.tsx
import { useState } from 'react';
import { Search, Plus, FileText, Edit, Trash2 } from 'lucide-react';

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
  status: 'draft' | 'published';
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

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

  const filteredBlogs = blogPosts.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Blog Posts</h1>
        <p className="text-sm text-gray-600">Manage all blog content</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
            </span>
            <button
              onClick={onNewBlog}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={16} />
              New Post
            </button>
          </div>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileText size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-900 mb-1">No blog posts found</p>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Create your first blog post to get started'}
          </p>
          <button
            onClick={onNewBlog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
              {blog.featuredImage && (
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={blog.featuredImage} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {blog.status}
                  </span>
                  <span className="text-xs text-gray-500">{blog.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{blog.author}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditBlog(blog)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteBlog(blog.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}