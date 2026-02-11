// components/admin/Sidebar.tsx
import Image from 'next/image';
import { LayoutDashboard, Mail, LogOut, Users, FileText, Sparkles, ChevronLeft, ChevronRight, MessageCircle, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  contactsCount: number;
  newContactsCount: number;
  subscribersCount: number;
  blogPostsCount: number;
  researchItemsCount: number;
  commentsCount: number;
  pendingCommentsCount: number;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  contactsCount,
  newContactsCount,
  subscribersCount,
  blogPostsCount,
  researchItemsCount,
  commentsCount,
  pendingCommentsCount,
  onLogout,
  collapsed,
  onToggleCollapse
}: SidebarProps) {
  return (
    <aside className={`bg-gradient-to-b from-[#2b2e34] via-[#2b2e34] to-[#1a1c20] flex flex-col relative overflow-visible h-full transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#755eb1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4f7f5d]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Logo Section */}
      <div className={`hidden lg:flex h-20 items-center border-b border-white/10 relative z-10 bg-[#2b2e34]/80 backdrop-blur-sm transition-all duration-300 ${
        collapsed ? 'px-4 justify-center' : 'px-6 gap-3'
      }`}>
        {!collapsed ? (
          <>
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
          </>
        ) : (
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
        )}
      </div>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-4 top-24 z-20 w-8 h-8 bg-white hover:bg-gray-50 text-[#755eb1] rounded-full items-center justify-center shadow-xl border-2 border-[#755eb1] transition-all duration-200 hover:scale-110"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Overview' : ''}
        >
          <LayoutDashboard 
            size={18} 
            className={activeTab === 'overview' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          {!collapsed && <span className="truncate">Overview</span>}
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'contacts'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Inquiries' : ''}
        >
          <div className="relative">
            <Mail 
              size={18} 
              className={activeTab === 'contacts' ? '' : 'group-hover:scale-110 transition-transform'} 
            />
            {newContactsCount > 0 && collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Inquiries</span>
              {newContactsCount > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                  {newContactsCount}
                </span>
              )}
            </>
          )}
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'subscribers'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Newsletter' : ''}
        >
          <Users 
            size={18} 
            className={activeTab === 'subscribers' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Newsletter</span>
           
            </>
          )}
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'blogs'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Blog Posts' : ''}
        >
          <FileText 
            size={18} 
            className={activeTab === 'blogs' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Blog Posts</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                activeTab === 'blogs' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 text-white/60'
              }`}>
                {blogPostsCount}
              </span>
            </>
          )}
        </button>

        <button
          onClick={() => setActiveTab('research')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'research'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Research' : ''}
        >
          <BookOpen 
            size={18} 
            className={activeTab === 'research' ? '' : 'group-hover:scale-110 transition-transform'} 
          />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Research</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                activeTab === 'research' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 text-white/60'
              }`}>
                {researchItemsCount}
              </span>
            </>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-[#755eb1] to-[#755eb1]/90 text-white shadow-lg shadow-[#755eb1]/25'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Comments' : ''}
        >
          <div className="relative">
            <MessageCircle 
              size={18} 
              className={activeTab === 'comments' ? '' : 'group-hover:scale-110 transition-transform'} 
            />
            {pendingCommentsCount > 0 && collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            )}
          </div>
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">Comments</span>
              {pendingCommentsCount > 0 && (
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-yellow-500/30 animate-pulse">
                  {pendingCommentsCount}
                </span>
              )}
            </>
          )}
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 relative z-10">
        {/* User Info Card */}
        {!collapsed ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 mb-3 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#755eb1] to-[#4f7f5d] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles size={10} className="text-[#4f7f5d] flex-shrink-0" />
                <p className="text-xs text-white/50 font-medium truncate">Administrator</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#755eb1] to-[#4f7f5d] flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/40 ${
            collapsed ? 'justify-center' : 'justify-center'
          }`}
          title={collapsed ? 'Sign Out' : ''}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}