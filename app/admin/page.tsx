// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Sidebar from './_Components/sidebar';
import OverviewTab from './_Components/overview';
import BlogsTab from './_Components/blogManagement';
import BlogEditorModal from './_Components/blogEditor';
import { Contact, Subscriber, BlogPost } from '@/types/admin';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
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

  // Fetch contacts
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

  // Fetch subscribers
  useEffect(() => {
    const q = query(collection(db, 'newsletter-subscribers'), orderBy('subscribedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscribersData: Subscriber[] = [];
      snapshot.forEach((doc) => {
        subscribersData.push({ id: doc.id, ...doc.data() } as Subscriber);
      });
      setSubscribers(subscribersData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch blog posts
  useEffect(() => {
    const q = query(collection(db, 'blog-posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: BlogPost[] = [];
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setBlogPosts(postsData);
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

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setShowBlogEditor(true);
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    setShowBlogEditor(true);
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
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          contactsCount={contacts.length}
          newContactsCount={contacts.filter(c => c.status === 'new').length}
          subscribersCount={subscribers.length}
          blogPostsCount={blogPosts.length}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === 'overview' && (
              <OverviewTab
                contactsCount={contacts.length}
                newContactsCount={contacts.filter(c => c.status === 'new').length}
                subscribersCount={subscribers.length}
                publishedBlogsCount={blogPosts.filter(b => b.status === 'published').length}
                recentContacts={contacts.slice(0, 5)}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'contacts' && (
              <div className="p-8">
                {/* Add ContactsTab component here */}
                <h1 className="text-2xl font-semibold text-gray-900">Contacts Tab</h1>
                <p className="text-sm text-gray-600">Implement ContactsTab component</p>
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div className="p-8">
                {/* Add SubscribersTab component here */}
                <h1 className="text-2xl font-semibold text-gray-900">Subscribers Tab</h1>
                <p className="text-sm text-gray-600">Implement SubscribersTab component</p>
              </div>
            )}

            {activeTab === 'blogs' && (
              <BlogsTab
                blogPosts={blogPosts}
                onDeleteBlog={handleDeleteBlog}
                onEditBlog={handleEditBlog}
                onNewBlog={handleNewBlog}
                formatDate={formatDate}
              />
            )}
          </div>
        </main>
      </div>

      {showBlogEditor && (
        <BlogEditorModal
          blog={editingBlog}
          onClose={() => {
            setShowBlogEditor(false);
            setEditingBlog(null);
          }}
          onSave={() => {
            setShowBlogEditor(false);
            setEditingBlog(null);
          }}
        />
      )}
    </div>
  );
}