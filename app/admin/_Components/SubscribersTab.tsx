// components/admin/SubscribersTab.tsx
import { useState, useMemo } from 'react';
import { Search, Mail, Download, Trash2, CheckCircle, X, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Subscriber } from '@/types/admin';

interface SubscribersTabProps {
  subscribers: Subscriber[];
  onDeleteSubscriber: (id: string) => Promise<void>;
  onExportSubscribers: () => void;
  formatDate: (timestamp: any) => string;
}

const ITEMS_PER_PAGE = 20;

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${
      type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex-shrink-0">
        {type === 'success' ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-red-600" />
        )}
      </div>
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}

// Confirm Dialog Component
function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  isLoading 
}: { 
  title: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </span>
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (showEllipsisStart) {
        pages.push(-1);
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (showEllipsisEnd) {
        pages.push(-2);
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function SubscribersTab({
  subscribers,
  onDeleteSubscriber,
  onExportSubscribers,
  formatDate
}: SubscribersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter and pagination logic
  const { filteredSubscribers, paginatedSubscribers, totalPages } = useMemo(() => {
    const filtered = subscribers.filter(subscriber => {
      const matchesSearch = 
        subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || subscriber.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, endIndex);

    return { filteredSubscribers: filtered, paginatedSubscribers: paginated, totalPages };
  }, [subscribers, searchQuery, filterStatus, currentPage]);

  // Reset to page 1 when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDeleteClick = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
  };

  const handleConfirmDelete = async () => {
    if (!subscriberToDelete) return;
    
    setDeletingId(subscriberToDelete.id);
    try {
      await onDeleteSubscriber(subscriberToDelete.id);
      showToast('Subscriber removed successfully', 'success');
      setSubscriberToDelete(null);
      
      // Adjust page if current page becomes empty
      if (paginatedSubscribers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      showToast('Failed to remove subscriber', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    onExportSubscribers();
    showToast('Subscribers exported successfully', 'success');
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Newsletter Subscribers</h1>
            <p className="text-xs md:text-sm text-gray-600">Manage your newsletter subscribers</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md active:scale-95 whitespace-nowrap"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Mail size={22} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-0.5">Total Subscribers</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle size={22} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-0.5">Active</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {subscribers.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl mb-4 md:mb-6 shadow-sm">
          <div className="p-3 md:px-4 md:py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 text-gray-900 transition-shadow"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-32 md:w-40 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 bg-white transition-shadow"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
              <span className="hidden sm:block text-xs md:text-sm text-gray-600 whitespace-nowrap font-medium">
                {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        {filteredSubscribers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-gray-400" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">No subscribers found</p>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search or filters' : 'New subscribers will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200">
              {paginatedSubscribers.map((subscriber, index) => (
                <div 
                  key={subscriber.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{subscriber.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {subscriber.status === 'active' ? '● Active' : '● Unsubscribed'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">{subscriber.email}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-xs text-gray-500">
                          Source: <span className="font-medium text-gray-700">{subscriber.source}</span>
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(subscriber.subscribedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-sm font-medium border border-blue-200 hover:border-blue-300"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                    <button
                      onClick={() => handleDeleteClick(subscriber)}
                      disabled={deletingId === subscriber.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-sm font-medium disabled:opacity-50 border border-red-200 hover:border-red-300"
                    >
                      {deletingId === subscriber.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Remove
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      {subscriberToDelete && (
        <ConfirmDialog
          title="Remove Subscriber"
          message={`Are you sure you want to remove "${subscriberToDelete.name}" from your newsletter? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setSubscriberToDelete(null)}
          isLoading={deletingId === subscriberToDelete.id}
        />
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}