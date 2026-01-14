// components/admin/ContactsTab.tsx
import { useState } from 'react';
import { Search, Mail, Trash2, Eye, Check } from 'lucide-react';
import { Contact } from '@/types/admin';

interface ContactsTabProps {
  contacts: Contact[];
  onDeleteContact: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onViewContact: (contact: Contact) => void;
  formatDate: (timestamp: any) => string;
}

export default function ContactsTab({
  contacts,
  onDeleteContact,
  onMarkAsRead,
  onViewContact,
  formatDate
}: ContactsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || contact.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Contact Inquiries</h1>
        <p className="text-xs md:text-sm text-gray-600">Manage all contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">New Messages</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {contacts.filter(c => c.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Eye size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Read</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                {contacts.filter(c => c.status === 'read').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
        <div className="p-3 md:px-4 md:py-3 space-y-3">
          {/* Search */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-600 text-gray-900"
            />
          </div>
          
          {/* Filter */}
          <div className="flex items-center justify-between gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
            </select>
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
              {filteredContacts.length} {filteredContacts.length === 1 ? 'inquiry' : 'inquiries'}
            </span>
          </div>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 text-center">
          <Mail size={40} className="md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-900 mb-1">No inquiries found</p>
          <p className="text-xs md:text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search or filters' : 'No contact inquiries yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 truncate max-w-xs">{contact.subject}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatDate(contact.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'new' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewContact(contact)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {contact.status === 'new' && (
                            <button
                              onClick={() => onMarkAsRead(contact.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteContact(contact.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                onClick={() => onViewContact(contact)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    contact.status === 'new' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-900 mb-2 line-clamp-2">{contact.subject}</p>
                <p className="text-xs text-gray-500 mb-3">{formatDate(contact.createdAt)}</p>
                
                <div className="flex items-center gap-2">
                  {contact.status === 'new' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(contact.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Check size={16} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteContact(contact.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}