// components/admin/SubscribersTab.tsx
import { useState } from 'react';
import { Search, Users, Trash2, Download } from 'lucide-react';
import { Subscriber } from '@/types/admin';

interface SubscribersTabProps {
  subscribers: Subscriber[];
  onDeleteSubscriber: (id: string) => void;
  onExportSubscribers: () => void;
  formatDate: (timestamp: any) => string;
}

export default function SubscribersTab({
  subscribers,
  onDeleteSubscriber,
  onExportSubscribers,
  formatDate
}: SubscribersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');

  // Get unique sources
  const sources = ['all', ...Array.from(new Set(subscribers.map(s => s.source)))];

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterSource === 'all' || subscriber.source === filterSource;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Newsletter Subscribers</h1>
        <p className="text-xs md:text-sm text-gray-600">Manage all newsletter subscribers</p>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">{subscribers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Active</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {subscribers.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">This Month</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {subscribers.filter(s => {
                  const subDate = s.subscribedAt?.toDate ? s.subscribedAt.toDate() : new Date(s.subscribedAt);
                  const now = new Date();
                  return subDate.getMonth() === now.getMonth() && 
                         subDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
        <div className="p-3 md:px-4 md:py-3 space-y-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-600 text-gray-900"
            />
          </div>
          
          {/* Filter and Export Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              {sources.map(source => (
                <option key={source} value={source} className="text-gray-900">
                  {source === 'all' ? 'All Sources' : source}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'}
              </span>
              <button
                onClick={onExportSubscribers}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 text-center">
          <Users size={40} className="md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-900 mb-1">No subscribers found</p>
          <p className="text-xs md:text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search or filters' : 'No newsletter subscribers yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscriber
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed At
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
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                            {subscriber.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{subscriber.name}</p>
                            <p className="text-sm text-gray-500">{subscriber.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {subscriber.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatDate(subscriber.subscribedAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onDeleteSubscriber(subscriber.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                      {subscriber.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{subscriber.name}</p>
                      <p className="text-xs text-gray-500 truncate">{subscriber.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteSubscriber(subscriber.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {subscriber.source}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                    subscriber.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {subscriber.status}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">{formatDate(subscriber.subscribedAt)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}