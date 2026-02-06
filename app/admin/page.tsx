// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "./_Components/sidebar";
import OverviewTab from "./_Components/overview";
import ContactsTab from "./_Components/ContactsTab";
import SubscribersTab from "./_Components/SubscribersTab";
import BlogsTab from "./_Components/blogManagement";
import BlogEditorModal from "./_Components/blogEditor";
import ContactDetailModal from "./_Components/ContactDetailModal";
import { Contact, Subscriber, BlogPost } from "@/types/admin";
import CommentsTab from "./_Components/CommentsTab";
import { Comment } from "@/types/admin";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // Data States
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);

  // Modal States
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const router = useRouter();

  // Authentication Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch Total Visits
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const docRef = doc(db, "site-stats", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTotalVisits(docSnap.data().totalVisits || 0);
        }
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    };
    fetchVisits();
  }, []);

  // Fetch contacts
  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
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
    const q = query(
      collection(db, "newsletter-subscribers"),
      orderBy("subscribedAt", "desc"),
    );
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
    const q = query(collection(db, "blog-posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: BlogPost[] = [];
      snapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setBlogPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: Comment[] = [];
      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, []);
  
  
  const handleApproveComment = async (id: string) => {
    try {
      await updateDoc(doc(db, "comments", id), {
        status: "approved",
      });
    } catch (error) {
      console.error("Error approving comment:", error);
      throw error;
    }
  };

  const handleRejectComment = async (id: string) => {
    try {
      await updateDoc(doc(db, "comments", id), {
        status: "rejected",
      });
    } catch (error) {
      console.error("Error rejecting comment:", error);
      throw error;
    }
  };
const handleDeleteComment = async (id: string) => {
  // ✅ FIXED - No confirm() needed, CommentsTab handles confirmation
  try {
    await deleteDoc(doc(db, "comments", id));
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // ✅ UPDATED: Removed confirm() - ContactsTab handles confirmation now
  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: "read",
      });
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  };

  // ✅ UPDATED: Removed confirm() - SubscribersTab handles confirmation now
  const handleDeleteSubscriber = async (id: string) => {
    try {
      await deleteDoc(doc(db, "newsletter-subscribers", id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      throw error;
    }
  };

  // ✅ UPDATED: Removed confirm() - BlogsTab handles confirmation now
  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blog-posts", id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
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

  const exportSubscribers = () => {
    const csv = [
      ["Name", "Email", "Subscribed At", "Source", "Status"],
      ...subscribers.map((sub) => [
        sub.name,
        sub.email,
        formatDate(sub.subscribedAt),
        sub.source,
        sub.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#2b2e34] border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex-shrink-0 rounded-lg bg-gradient-to-br from-[#755eb1] to-[#4f7f5d] p-0.5">
            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center text-xs font-bold">
              P
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">The Capital P Lab</h1>
            <p className="text-xs text-white/60">Admin</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            contactsCount={contacts.length}
            newContactsCount={contacts.filter((c) => c.status === "new").length}
            subscribersCount={subscribers.length}
            blogPostsCount={blogPosts.length}
            commentsCount={comments.length} // ADD THIS
            pendingCommentsCount={
              comments.filter((c) => c.status === "pending").length
            } // ADD THIS
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 pt-16">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                user={user}
                contactsCount={contacts.length}
                newContactsCount={
                  contacts.filter((c) => c.status === "new").length
                }
                subscribersCount={subscribers.length}
                blogPostsCount={blogPosts.length}
                commentsCount={comments.length} // ADD THIS
                pendingCommentsCount={
                  comments.filter((c) => c.status === "pending").length
                } // ADD THIS
                onLogout={handleLogout}
                collapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
          </>
        )}

        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === "overview" && (
              <OverviewTab
                contactsCount={contacts.length}
                newContactsCount={
                  contacts.filter((c) => c.status === "new").length
                }
                subscribersCount={subscribers.length}
                publishedBlogsCount={
                  blogPosts.filter((b) => b.status === "published").length
                }
                totalVisits={totalVisits}
                totalLikes={blogPosts.reduce(
                  (sum, post) => sum + (post.likes || 0),
                  0,
                )}
                recentContacts={contacts.slice(0, 5)}
                recentBlogs={blogPosts
                  .filter((b) => b.status === "published")
                  .slice(0, 5)}
                formatDate={formatDate}
                onNavigateToInquiries={() => setActiveTab("contacts")}
                onNavigateToBlogs={() => setActiveTab("blogs")}
              />
            )}

            {activeTab === "contacts" && (
              <ContactsTab
                contacts={contacts}
                onDeleteContact={handleDeleteContact}
                onMarkAsRead={handleMarkAsRead}
                onViewContact={setSelectedContact}
                formatDate={formatDate}
              />
            )}

            {activeTab === "subscribers" && (
              <SubscribersTab
                subscribers={subscribers}
                onDeleteSubscriber={handleDeleteSubscriber}
                onExportSubscribers={exportSubscribers}
                formatDate={formatDate}
              />
            )}

            {activeTab === "blogs" && (
              <BlogsTab
                blogPosts={blogPosts}
                onDeleteBlog={handleDeleteBlog}
                onEditBlog={handleEditBlog}
                onNewBlog={handleNewBlog}
                formatDate={formatDate}
              />
            )}

            {activeTab === "comments" && (
              <CommentsTab
                comments={comments}
                onApprove={handleApproveComment}
                onReject={handleRejectComment}
                onDelete={handleDeleteComment}
                blogPosts={blogPosts}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
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

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
