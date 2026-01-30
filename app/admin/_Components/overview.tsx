// components/admin/OverviewTab.tsx
import { Mail, Eye, TrendingUp, Users, FileText, ArrowRight } from 'lucide-react';
import { formatViewCount } from '@/lib/formatters';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
}

interface OverviewTabProps {
  contactsCount: number;
  newContactsCount: number;
  subscribersCount: number;
  publishedBlogsCount: number;
  totalVisits: number;
  recentContacts: Contact[];
  formatDate: (timestamp: any) => string;
  onNavigateToInquiries?: () => void;
}

export default function OverviewTab({
  contactsCount,
  newContactsCount,
  subscribersCount,
  publishedBlogsCount,
  totalVisits,
  recentContacts,
  formatDate,
  onNavigateToInquiries
}: OverviewTabProps) {
  
  // Only show latest 5 messages
  const displayedContacts = recentContacts.slice(0, 5);
  const hasMoreContacts = recentContacts.length > 5;

  const stats = [
    { 
      label: 'Total Visits', 
      value: totalVisits, 
      subtext: 'Site Traffic', 
      icon: Eye, 
      gradient: 'from-blue-50 to-white',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Total Inquiries', 
      value: contactsCount, 
      subtext: 'All time', 
      icon: Mail, 
      gradient: 'from-purple-50 to-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      label: 'New Messages', 
      value: newContactsCount, 
      subtext: 'Unread', 
      icon: TrendingUp, 
      gradient: 'from-green-50 to-white',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Subscribers', 
      value: subscribersCount, 
      subtext: 'Active', 
      icon: Users, 
      gradient: 'from-orange-50 to-white',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    { 
      label: 'Blog Posts', 
      value: publishedBlogsCount, 
      subtext: 'Published', 
      icon: FileText, 
      gradient: 'from-pink-50 to-white',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-sm text-gray-600">Monitor your website performance and activities</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, i) => {
          const { formatted, full } = formatViewCount(stat.value, 'intl');
          
          return (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${stat.gradient} border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm`}>
                  <stat.icon size={24} className={stat.iconColor} />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                {stat.label}
              </p>
              <div className="relative">
                <p 
                  className="text-3xl font-bold text-gray-900 mb-1 cursor-help" 
                  title={full}
                >
                  {formatted}
                </p>
                {/* Tooltip on hover showing full number */}
                <div className="absolute left-0 top-full mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {full}
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Inquiries</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest customer messages</p>
          </div>
          {hasMoreContacts && onNavigateToInquiries && (
            <button
              onClick={onNavigateToInquiries}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              View All
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {displayedContacts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-900 mb-1">No inquiries yet</p>
              <p className="text-sm text-gray-500">Customer messages will appear here</p>
            </div>
          ) : (
            displayedContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 flex-shrink-0 shadow-sm">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          contact.status === 'new' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {contact.status === 'new' ? '● New' : '● Read'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(contact.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with count info */}
        {displayedContacts.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Showing {displayedContacts.length} of {recentContacts.length} total inquiries
              {hasMoreContacts && onNavigateToInquiries && (
                <>
                  {' · '}
                  <button
                    onClick={onNavigateToInquiries}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    View all messages
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}