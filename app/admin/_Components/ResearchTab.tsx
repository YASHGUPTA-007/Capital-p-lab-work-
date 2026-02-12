// app/admin/_Components/ResearchTab.tsx

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Heart,
} from "lucide-react";
import { ResearchItem } from "@/types/research";
import { formatViewCount } from "@/lib/formatters";

interface ResearchTabProps {
  items: ResearchItem[];
  onDeleteItem: (id: string) => Promise<void>;
  onEditItem: (item: ResearchItem) => void;
  onNewItem: () => void;
  formatDate: (timestamp: any) => string;
}

const ITEMS_PER_PAGE = 20;

export default function ResearchTab({
  items,
  onDeleteItem,
  onEditItem,
  onNewItem,
  formatDate,
}: ResearchTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research item?")) return;

    setDeletingId(id);
    try {
      await onDeleteItem(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate totals for stats
  const totalDownloads = items.reduce(
    (sum, item) => sum + (item.downloads || 0),
    0,
  );
  const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = items.reduce((sum, item) => sum + (item.likes || 0), 0);

  const { formatted: downloadsFormatted } = formatViewCount(
    totalDownloads,
    "intl",
  );
  const { formatted: viewsFormatted } = formatViewCount(totalViews, "intl");
  const { formatted: likesFormatted } = formatViewCount(totalLikes, "intl");

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Library</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage research documents and resources
          </p>
        </div>
        <button
          onClick={onNewItem}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Research Item</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats - Now with 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {items.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Eye size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {items.filter((i) => i.status === "published").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Download size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Downloads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {downloadsFormatted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Eye size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {viewsFormatted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Heart size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Likes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {likesFormatted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500 text-gray-900"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Environment">Environment</option>
              <option value="Social">Social</option>
              <option value="Economic">Economic</option>
              <option value="Policy">Policy</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </span>
          {(searchQuery ||
            categoryFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setStatusFilter("All");
                setCurrentPage(1);
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-900 font-medium mb-1">
            No research items found
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first research item"}
          </p>
          {!searchQuery && (
            <button
              onClick={onNewItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
            >
              <Plus size={16} />
              Add Research Item
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[280px]">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedItems.map((item) => {
                    const { formatted: downloadCount } = formatViewCount(
                      item.downloads || 0,
                      "intl",
                    );
                    const { formatted: viewCount } = formatViewCount(
                      item.views || 0,
                      "intl",
                    );
                    const { formatted: likeCount } = formatViewCount(
                      item.likes || 0,
                      "intl",
                    );

                    // Truncate title if longer than 30 characters
                    const displayTitle =
                      item.title.length > 30
                        ? item.title.substring(0, 30) + "..."
                        : item.title;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 max-w-[250px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className="font-medium text-gray-900 truncate"
                                title={item.title}
                              >
                                {displayTitle}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {item.author}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                            {item.type === "document" ? (
                              <>
                                <FileText size={16} />
                                Document
                              </>
                            ) : (
                              <>
                                <ExternalLink size={16} />
                                Link
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                          {downloadCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                          {viewCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                          {likeCount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                              item.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onEditItem(item)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg disabled:opacity-50 transition-colors"
                              title="Delete"
                            >
                              {deletingId === item.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}