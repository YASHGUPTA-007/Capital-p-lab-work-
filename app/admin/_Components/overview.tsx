// components/admin/OverviewTab.tsx
import { Mail, Eye } from 'lucide-react';

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
}

export default function OverviewTab({
  contactsCount,
  newContactsCount,
  subscribersCount,
  publishedBlogsCount,
  totalVisits,
  recentContacts,
  formatDate
}: OverviewTabProps) {
  
  const stats = [
    { label: 'Total Visits', value: totalVisits, subtext: 'Site Traffic', icon: Eye, color: 'blue' },
    { label: 'Total Inquiries', value: contactsCount, subtext: 'All time', icon: Mail, color: 'purple' },
    { label: 'New Messages', value: newContactsCount, subtext: 'Unread', icon: Mail, color: 'green' },
    { label: 'Subscribers', value: subscribersCount, subtext: 'Active', icon: Mail, color: 'orange' },
    { label: 'Blog Posts', value: publishedBlogsCount, subtext: 'Published', icon: Mail, color: 'pink' }
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-xs md:text-sm text-gray-600">Overview of all activities</p>
      </div>
      
      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl md:text-3xl font-semibold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-sm md:text-base font-semibold text-gray-900">Recent Inquiries</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentContacts.map((contact) => (
            <div key={contact.id} className="px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 w-full">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs md:text-sm font-semibold text-gray-700 flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{contact.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-xs text-gray-500">{formatDate(contact.createdAt)}</p>
                  <span className={`text-xs font-medium px-2 md:px-2.5 py-1 rounded-full ${
                    contact.status === 'new' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recentContacts.length === 0 && (
            <div className="px-4 md:px-6 py-8 md:py-12 text-center">
              <Mail size={40} className="md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-xs md:text-sm text-gray-500">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}