// components/admin/BlogEditorModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

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

interface BlogEditorModalProps {
  blog: BlogPost | null;
  onClose: () => void;
  onSave: () => void;
}

export default function BlogEditorModal({ blog, onClose, onSave }: BlogEditorModalProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    author: blog?.author || '',
    category: blog?.category || 'Sustainability',
    tags: blog?.tags?.join(', ') || '',
    featuredImage: blog?.featuredImage || '',
    status: blog?.status || 'draft' as 'draft' | 'published'
  });
  const [saving, setSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const blogData = {
        ...formData,
        tags: tagsArray,
        updatedAt: serverTimestamp(),
        ...(formData.status === 'published' && !blog?.publishedAt && { publishedAt: serverTimestamp() })
      };

      if (blog) {
        await updateDoc(doc(db, 'blog-posts', blog.id), blogData);
      } else {
        await addDoc(collection(db, 'blog-posts'), {
          ...blogData,
          createdAt: serverTimestamp()
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="blog-post-slug"
              />
              <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || 'your-slug'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="Sustainability">Sustainability</option>
                <option value="Policy">Policy</option>
                <option value="Research">Research</option>
                <option value="ESG">ESG</option>
                <option value="Climate">Climate</option>
                <option value="Inclusion">Inclusion</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : blog ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}