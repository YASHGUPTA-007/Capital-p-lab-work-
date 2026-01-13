// components/admin/Sidebar.tsx
import Image from 'next/image';
import { LayoutDashboard, Mail, LogOut, Users, FileText, Sparkles } from 'lucide-react';

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
    <aside className="w-64 bg-gradient-to-b from-[#2b2e34] via-[#2b2e34] to-[#1a1c20] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#755eb1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4f7f5d]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Logo Section */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10 relative z-10 bg-[#2b2e34]/80 backdrop-blur-sm">
        <div className="w-10 h-10 relative flex-shrink-0 rounded-lg bg-gradient-to-br from-[#755eb1] to-[#4f7f5d] p-0.5">
          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white truncate tracking-tight">The Capital P Lab</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4f7f5d] animate-pulse" />
            <p className="text-xs text-white/60 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <LayoutDashboard 
            size={18} 
            className={activeTab === 'overview' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'contacts'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Mail 
            size={18} 
            className={activeTab === 'contacts' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          Inquiries
          {newContactsCount > 0 && (
            <span className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
              {newContactsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'subscribers'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Users 
            size={18} 
            className={activeTab === 'subscribers' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          Newsletter
          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
            activeTab === 'subscribers' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/60'
          }`}>
            {subscribersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'blogs'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <FileText 
            size={18} 
            className={activeTab === 'blogs' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          Blog Posts
          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
            activeTab === 'blogs' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/60'
          }`}>
            {blogPostsCount}
          </span>
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 relative z-10">
        {/* User Info Card */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 mb-3 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#755eb1] to-[#4f7f5d] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles size={10} className="text-[#4f7f5d]" />
              <p className="text-xs text-white/50 font-medium">Administrator</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}