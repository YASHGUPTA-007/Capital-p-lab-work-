// components/admin/OverviewTab.tsx
import { Mail } from 'lucide-react';

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
  recentContacts: Contact[];
  formatDate: (timestamp: any) => string;
}

export default function OverviewTab({
  contactsCount,
  newContactsCount,
  subscribersCount,
  publishedBlogsCount,
  recentContacts,
  formatDate
}: OverviewTabProps) {
  const stats = [
    { label: 'Total Inquiries', value: contactsCount, subtext: 'All time' },
    { label: 'New Messages', value: newContactsCount, subtext: 'Unread' },
    { label: 'Subscribers', value: subscribersCount, subtext: 'Active' },
    { label: 'Blog Posts', value: publishedBlogsCount, subtext: 'Published' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of all activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtext}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Recent Inquiries</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentContacts.map((contact) => (
            <div key={contact.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="text-xs text-gray-500">{formatDate(contact.createdAt)}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
            <div className="px-6 py-12 text-center">
              <Mail size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}