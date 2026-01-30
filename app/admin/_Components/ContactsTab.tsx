// components/admin/ContactsTab.tsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Mail, CheckCircle, Trash2, Eye, X, XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

// Types
interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  createdAt: any;
}

interface ContactsTabProps {
  contacts: Contact[];
  onDeleteContact: (id: string) => Promise<void>;
  onMarkAsRead: (id: string) => Promise<void>;
  onViewContact: (contact: Contact) => void;
  formatDate: (timestamp: any) => string;
}

const ITEMS_PER_PAGE = 20;

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg transition-all ${
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
      <button 
        onClick={onClose} 
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
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
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isLoading, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-600" />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Contact Card Component
function ContactCard({ 
  contact, 
  onView, 
  onMarkAsRead, 
  onDelete, 
  isDeleting,
  isMarkingAsRead,
  formatDate 
}: {
  contact: Contact;
  onView: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isMarkingAsRead: boolean;
  formatDate: (timestamp: any) => string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-bold text-gray-900 truncate">{contact.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
              contact.status === 'new' 
                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
            }`}>
              {contact.status === 'new' ? '● New' : '✓ Read'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={12} className="text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-600 truncate">{contact.email}</p>
          </div>
          <p className="text-sm text-gray-900 font-semibold mb-1 line-clamp-1">{contact.subject}</p>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">{contact.message}</p>
          <p className="text-xs text-gray-400 font-medium">{formatDate(contact.createdAt)}</p>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-1.5">
        <button
          onClick={onView}
          aria-label={`View inquiry from ${contact.name}`}
          className="flex items-center justify-center gap-1 px-2 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-xs font-semibold ring-1 ring-blue-200"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View</span>
        </button>
        {contact.status === 'new' ? (
          <button
            onClick={onMarkAsRead}
            disabled={isMarkingAsRead}
            aria-label={`Mark inquiry from ${contact.name} as read`}
            className="flex items-center justify-center gap-1 px-2 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-green-200"
          >
            {isMarkingAsRead ? (
              <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle size={14} />
                <span className="hidden sm:inline">Read</span>
              </>
            )}
          </button>
        ) : (
          <div></div>
        )}
        <button
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={`Delete inquiry from ${contact.name}`}
          className="flex items-center justify-center gap-1 px-2 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-red-200"
        >
          {isDeleting ? (
            <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Trash2 size={14} />
              <span className="hidden sm:inline">Delete</span>
            </>
          )}
        </button>
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
        pages.push('ellipsis-start');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (showEllipsisEnd) {
        pages.push('ellipsis-end');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span key={page} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// Main Component
export default function ContactsTab({
  contacts,
  onDeleteContact,
  onMarkAsRead,
  onViewContact,
  formatDate
}: ContactsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingAsReadId, setMarkingAsReadId] = useState<string | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timeoutId = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [toast]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus]);

  // Memoized filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.subject.toLowerCase().includes(searchLower) ||
        contact.message.toLowerCase().includes(searchLower);
      
      const matchesFilter = 
        filterStatus === 'all' || contact.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [contacts, debouncedSearch, filterStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    
    setDeletingId(contactToDelete.id);
    try {
      await onDeleteContact(contactToDelete.id);
      showToast('Contact deleted successfully', 'success');
      setContactToDelete(null);
      
      // Adjust page if current page is now empty
      if (paginatedContacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
      showToast(errorMessage, 'error');
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setMarkingAsReadId(id);
    try {
      await onMarkAsRead(id);
      showToast('Marked as read', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      showToast(errorMessage, 'error');
      console.error('Mark as read error:', error);
    } finally {
      setMarkingAsReadId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newContactsCount = contacts.filter(c => c.status === 'new').length;

  return (
    <>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2">Contact Inquiries</h1>

        </div>
{/* Stats */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
  <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center text-center gap-1">
      <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Mail size={14} className="text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">Total Inquiries</p>
        <p className="text-lg font-bold text-gray-900">{contacts.length}</p>
      </div>
    </div>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center text-center gap-1">
      <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle size={14} className="text-green-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">New Inquiries</p>
        <p className="text-lg font-bold text-gray-900">{newContactsCount}</p>
      </div>
    </div>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center text-center gap-1">
      <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center flex-shrink-0">
        <Eye size={14} className="text-purple-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">Read</p>
        <p className="text-lg font-bold text-gray-900">{contacts.filter(c => c.status === 'read').length}</p>
      </div>
    </div>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col items-center text-center gap-1">
      <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center flex-shrink-0">
        <Filter size={14} className="text-orange-600" />
      </div>
      <div>
        <p className="text-xs text-gray-600">Filtered Results</p>
        <p className="text-lg font-bold text-gray-900">{filteredContacts.length}</p>
      </div>
    </div>
  </div>
</div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, email, subject, or message... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-500 text-gray-900"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-medium"
              >
                <option value="all">All Status</option>
                <option value="new">New Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
              </span>
              {totalPages > 1 && (
                <span className="text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 md:p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={40} className="text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-900 mb-2">No contacts found</p>
            <p className="text-sm text-gray-500">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'New inquiries will appear here'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onView={() => onViewContact(contact)}
                  onMarkAsRead={() => handleMarkAsRead(contact.id)}
                  onDelete={() => handleDeleteClick(contact)}
                  isDeleting={deletingId === contact.id}
                  isMarkingAsRead={markingAsReadId === contact.id}
                  formatDate={formatDate}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
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
      {contactToDelete && (
        <ConfirmDialog
          title="Delete Contact Inquiry"
          message={`Are you sure you want to permanently delete the inquiry from "${contactToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setContactToDelete(null)}
          isLoading={deletingId === contactToDelete.id}
        />
      )}

      <style jsx>{`
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
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}