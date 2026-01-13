// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Mail, LogOut, Trash2, Eye, CheckCircle, X, Search, Filter, MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
  ipAddress?: string;
  userAgent?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: Contact[] = [];
      snapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() } as Contact);
      });
      setContacts(contactsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        if (selectedContact?.id === id) setSelectedContact(null);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contacts', id), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
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
              {contacts.filter(c => c.status === 'new').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {contacts.filter(c => c.status === 'new').length}
                </span>
              )}
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === 'overview' && (
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
                  <p className="text-sm text-gray-600">Overview of all inquiries</p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Inquiries', value: contacts.length, subtext: 'All time' },
                    { label: 'New', value: contacts.filter(c => c.status === 'new').length, subtext: 'Unread' },
                    { label: 'Completed', value: contacts.filter(c => c.status === 'read').length, subtext: 'Processed' },
                    { 
                      label: 'This Week', 
                      value: contacts.filter(c => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        const contactDate = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
                        return contactDate > weekAgo;
                      }).length, 
                      subtext: 'Last 7 days' 
                    }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.subtext}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">Recent Inquiries</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {contacts.slice(0, 5).map((contact) => (
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
                    {contacts.length === 0 && (
                      <div className="px-6 py-12 text-center">
                        <Mail size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-500">No inquiries yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">Inquiries</h1>
                  <p className="text-sm text-gray-600">Manage all contact submissions</p>
                </div>

                {/* Toolbar */}
                <div className="bg-white border border-gray-200 rounded-lg mb-6">
                  <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search inquiries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {filteredContacts.length} {filteredContacts.length === 1 ? 'inquiry' : 'inquiries'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table */}
                {filteredContacts.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Mail size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-900 mb-1">No inquiries found</p>
                    <p className="text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search' : 'Contact submissions will appear here'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  contact.status === 'new' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    contact.status === 'new' ? 'bg-blue-600' : 'bg-gray-600'
                                  }`} />
                                  {contact.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 flex-shrink-0">
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
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-500">{formatDate(contact.createdAt)}</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setSelectedContact(contact)}
                                    className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                                    title="View details"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
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
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Inquiry Details</h2>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    Contact Information
                  </label>
                  <p className="text-base font-semibold text-gray-900 mb-1">{selectedContact.name}</p>
                  <a href={`mailto:${selectedContact.email}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
                <div className="text-right">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    Received
                  </label>
                  <p className="text-sm text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                  {selectedContact.ipAddress && (
                    <p className="text-xs text-gray-500 mt-1">IP: {selectedContact.ipAddress}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Subject
                </label>
                <p className="text-base text-gray-900 font-medium">{selectedContact.subject}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex gap-2">
                {selectedContact.status === 'new' ? (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedContact.id);
                      setSelectedContact(prev => prev ? {...prev, status: 'read'} : null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    Mark as Read
                  </button>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
                    <CheckCircle size={16} />
                    Processed
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  handleDeleteContact(selectedContact.id);
                  setSelectedContact(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}