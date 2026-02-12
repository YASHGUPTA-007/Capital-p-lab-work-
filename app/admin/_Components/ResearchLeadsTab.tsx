"use client";

import { useState } from "react";
import {
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Trash2,
  AlertTriangle,
  FileText,
  Building2,
  Target,
  CheckSquare,
  Square,
} from "lucide-react";

interface ResearchLead {
  id: string;
  researchId: string;
  researchTitle: string;
  name: string;
  email: string;
  organization?: string;
  purpose?: string;
  createdAt: any;
  ipAddress?: string;
  userAgent?: string;
}

interface ResearchLeadsTabProps {
  leads: ResearchLead[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  researchItems: any[];
}

export default function ResearchLeadsTab({
  leads,
  onDelete,
  onBulkDelete,
  researchItems,
}: ResearchLeadsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<ResearchLead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<ResearchLead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const leadsPerPage = 10;

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get research title
  const getResearchTitle = (researchId: string) => {
    const research = researchItems.find((r) => r.id === researchId);
    return research?.title || "Unknown Research";
  };

  const getResearchSlug = (researchId: string) => {
    const research = researchItems.find((r) => r.id === researchId);
    return research?.slug || "";
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.researchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.organization &&
        lead.organization.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + leadsPerPage
  );

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map((lead) => lead.id)));
    }
  };

  // Toggle single selection
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  // Handle bulk delete
  const handleBulkDeleteConfirm = () => {
    onBulkDelete(Array.from(selectedLeads));
    setSelectedLeads(new Set());
    setShowBulkDeleteConfirm(false);
    showNotification("success", `${selectedLeads.size} leads deleted successfully`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (leadToDelete) {
      onDelete(leadToDelete.id);
      setLeadToDelete(null);
      showNotification("success", "Lead deleted successfully");
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "#",
      "Name",
      "Email",
      "Research Title",
      "Organization",
      "Purpose",
      "Date",
    ];
    const rows = filteredLeads.map((lead, index) => [
      index + 1,
      lead.name,
      lead.email,
      lead.researchTitle,
      lead.organization || "N/A",
      lead.purpose || "N/A",
      formatDate(lead.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
      }}
    >
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg border-2 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <p className="font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Leads</h1>
            <p className="text-gray-600 mt-1">
              Manage download requests and lead generation
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedLeads.size > 0 && (
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-sm"
              >
                <Trash2 size={18} />
                Delete ({selectedLeads.size})
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all font-medium shadow-sm"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Total Leads
              </div>
              <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center">
                <Users size={14} className="text-purple-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">{leads.length}</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                With Organization
              </div>
              <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
                <Building2 size={14} className="text-blue-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {leads.filter((l) => l.organization).length}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                With Purpose
              </div>
              <div className="w-7 h-7 rounded-md bg-green-50 flex items-center justify-center">
                <Target size={14} className="text-green-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {leads.filter((l) => l.purpose).length}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, organization, or research..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-gray-900 
                  focus:border-transparent transition-all
                  text-black placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Table */}
          {paginatedLeads.length === 0 ? (
            <div className="text-center py-20">
              <Users size={56} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">No leads found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Leads will appear here once submitted"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5 text-left">
                        <button
                          onClick={toggleSelectAll}
                          className="hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                          {selectedLeads.size === paginatedLeads.length ? (
                            <CheckSquare size={18} className="text-gray-700" />
                          ) : (
                            <Square size={18} className="text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Research
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedLeads.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedLeads.has(lead.id) ? "bg-purple-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleSelect(lead.id)}
                            className="hover:bg-gray-100 p-1 rounded transition-colors"
                          >
                            {selectedLeads.has(lead.id) ? (
                              <CheckSquare size={18} className="text-purple-600" />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-xs text-gray-500">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          
                         <a   href={`/research/${getResearchSlug(lead.researchId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-900 hover:text-purple-600 hover:underline font-medium max-w-xs truncate block"
                          >
                            {lead.researchTitle}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {lead.organization || (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                              title="View details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => setLeadToDelete(lead)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(startIndex + leadsPerPage, filteredLeads.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredLeads.length}
                    </span>{" "}
                    leads
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>

                    <span className="text-sm font-medium text-gray-700 px-3">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Multiple Leads
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete {selectedLeads.size} selected
                leads? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                <Trash2 size={16} />
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Lead</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this lead? This action cannot be
                undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {leadToDelete.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">{leadToDelete.email}</p>
                <p className="text-sm text-gray-700">
                  Research: {leadToDelete.researchTitle}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                <Trash2 size={16} />
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Lead Details</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-all"
              >
                <span className="text-2xl text-gray-600">×</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedLead.name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedLead.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Research Article
                  </label>
                  
                   <a href={`/research/${getResearchSlug(selectedLead.researchId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1.5 text-gray-900 hover:text-purple-600 hover:underline font-medium"
                  >
                    {selectedLead.researchTitle}
                  </a>
                </div>

                {selectedLead.organization && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Organization
                    </label>
                    <p className="mt-1.5 text-gray-900">
                      {selectedLead.organization}
                    </p>
                  </div>
                )}

                {selectedLead.purpose && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Purpose
                    </label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {selectedLead.purpose}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Submitted
                  </label>
                  <p className="mt-1.5 text-gray-900">
                    {(() => {
                      const date = selectedLead.createdAt.toDate
                        ? selectedLead.createdAt.toDate()
                        : new Date(selectedLead.createdAt);
                      return date.toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    })()}
                  </p>
                </div>

                {selectedLead.ipAddress && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      IP Address
                    </label>
                    <p className="mt-1.5 text-gray-600 font-mono text-sm">
                      {selectedLead.ipAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-all font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  setLeadToDelete(selectedLead);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all font-medium"
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