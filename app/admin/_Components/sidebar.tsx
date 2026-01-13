// components/admin/Sidebar.tsx
import Image from 'next/image';
import { LayoutDashboard, Mail, LogOut, Users, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  contactsCount: number;
  newContactsCount: number;
  subscribersCount: number;
  blogPostsCount: number;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  contactsCount,
  newContactsCount,
  subscribersCount,
  blogPostsCount,
  onLogout
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
        <div className="w-8 h-8 relative flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate">The Capital P Lab</h1>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={18} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === 'contacts'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Mail size={18} />
          Inquiries
          {newContactsCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {newContactsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === 'subscribers'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users size={18} />
          Newsletter
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {subscribersCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === 'blogs'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText size={18} />
          Blog Posts
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {blogPostsCount}
          </span>
        </button>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}