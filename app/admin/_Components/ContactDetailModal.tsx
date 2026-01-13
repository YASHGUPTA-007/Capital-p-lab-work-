// components/admin/ContactDetailModal.tsx
import { X, Mail, Calendar, Globe, Monitor } from 'lucide-react';
import { Contact } from '@/types/admin';

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
  formatDate: (timestamp: any) => string;
}

export default function ContactDetailModal({ 
  contact, 
  onClose, 
  formatDate 
}: ContactDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Status Badge */}
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              contact.status === 'new' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {contact.status === 'new' ? '● New' : '● Read'}
            </span>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <p className="text-base text-gray-900">{contact.subject}</p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Received</p>
                <p className="text-sm text-gray-900">{formatDate(contact.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-sm text-gray-900 break-all">{contact.email}</p>
              </div>
            </div>

            {contact.ipAddress && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">IP Address</p>
                  <p className="text-sm text-gray-900 font-mono">{contact.ipAddress}</p>
                </div>
              </div>
            )}

            {contact.userAgent && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Monitor size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Device Info</p>
                  <p className="text-sm text-gray-900 line-clamp-2" title={contact.userAgent}>
                    {contact.userAgent}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <a
            href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Mail size={16} />
            Reply via Email
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}