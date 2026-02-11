// app/research/LeadCaptureModal.tsx
"use client";

import { useState } from "react";
import { X, Download, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { ResearchItem } from "@/types/research";
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDownloadUrl } from "@/lib/cloudinary-utils"; // ✅ Import from cloudinary-utils

interface LeadCaptureModalProps {
  item: ResearchItem;
  onClose: () => void;
}

export default function LeadCaptureModal({
  item,
  onClose,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save lead to Firestore
      await addDoc(collection(db, "research-leads"), {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        researchId: item.id,
        researchTitle: item.title,
        createdAt: serverTimestamp(),
      });

      // Increment download count
      await updateDoc(doc(db, "research-items", item.id), {
        downloads: increment(1),
      });

      setSubmitted(true);


setTimeout(() => {
  if (item.type === "document" && item.documentUrl) {
    // ✅ Force download without opening new tab
    const link = document.createElement("a");
    link.href = item.documentUrl;
    link.download = item.documentName || "document.pdf";
    link.style.display = "none";
    // ❌ NO target="_blank" - this was causing PDF viewer to open
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (item.type === "link" && item.externalLink) {
    window.open(item.externalLink, "_blank");
  }

  setTimeout(onClose, 500);
}, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
          <p className="text-gray-600">
            {item.type === "document"
              ? "Your download will begin shortly..."
              : "Redirecting to the resource..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#755eb1] to-[#6b54a5] p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {item.type === "document" ? (
                <Download size={24} />
              ) : (
                <ExternalLink size={24} />
              )}
              <h2 className="text-xl font-bold">
                {item.type === "document" ? "Download Research" : "Access Resource"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-white/90 text-sm">{item.title}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-600 text-sm mb-4">
            Please provide your information to{" "}
            {item.type === "document" ? "download" : "access"} this resource.
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organization
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#755eb1] focus:border-transparent"
              placeholder="Your Company (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-[#755eb1] to-[#6b54a5] hover:from-[#6b54a5] hover:to-[#5a4894] text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                {item.type === "document" ? (
                  <>
                    <Download size={20} />
                    Download Now
                  </>
                ) : (
                  <>
                    <ExternalLink size={20} />
                    Access Resource
                  </>
                )}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Your information will only be used to provide
            you with relevant content and updates.
          </p>
        </form>
      </div>
    </div>
  );
}