// components/family/FamilyDocumentsSection.jsx
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Upload,
  FileText,
  Loader2,
  X,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import FamilyDocCard from "./FamilyDocCard";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "identity", label: "Identity" },
  { value: "financial", label: "Financial" },
  { value: "medical", label: "Medical" },
  { value: "legal", label: "Legal" },
  { value: "education", label: "Education" },
  { value: "property", label: "Property" },
  { value: "other", label: "Other" },
];

const FamilyDocumentsSection = ({
  documents,
  documentsLoading,
  onUpload,
  onPreview,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Collect unique tags from all documents
  const allTags = useMemo(() => {
    const set = new Set();
    documents.forEach((d) => (d.tags || []).forEach((t) => set.add(t)));
    return [...set];
  }, [documents]);

  // Client-side filter
  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        (doc.description || "").toLowerCase().includes(q) ||
        (doc.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (doc.uploadedBy?.name || "").toLowerCase().includes(q);
      const matchCat =
        activeCategory === "all" || doc.category === activeCategory;
      const matchTag = !activeTag || (doc.tags || []).includes(activeTag);
      return matchSearch && matchCat && matchTag;
    });
  }, [documents, searchQuery, activeCategory, activeTag]);

  const hasFilters = searchQuery || activeCategory !== "all" || activeTag;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Family Documents
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {documents.length} file{documents.length !== 1 ? "s" : ""} ·
            encrypted
          </p>
        </div>
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 dark:bg-white/[0.12] hover:bg-gray-900 dark:hover:bg-white/[0.18] text-white text-sm font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, tag, uploader, or description..."
          className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills + Tag filter */}
      <div className="flex items-center gap-2.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all
              ${
                activeCategory === cat.value
                  ? "bg-gray-800 dark:bg-white/[0.12] text-white"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1] hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            {cat.label}
          </button>
        ))}

        {/* Tag filter */}
        <div className="ml-auto flex-shrink-0 relative">
          {activeTag ? (
            <button
              onClick={() => setActiveTag("")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold"
            >
              <Tag className="w-3 h-3" />#{activeTag}
              <X className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => setShowTagDropdown((p) => !p)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all
                ${showTagDropdown ? "bg-gray-200 dark:bg-white/[0.1] text-gray-700 dark:text-gray-300" : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Tags
            </button>
          )}
        </div>
      </div>

      {/* Tag dropdown */}
      <AnimatePresence>
        {showTagDropdown && !activeTag && allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
              <p className="w-full text-[11px] text-gray-400 dark:text-gray-500 font-semibold mb-1">
                Filter by tag
              </p>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag);
                    setShowTagDropdown(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.1] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/[0.2] hover:text-gray-800 dark:hover:text-gray-300 transition-colors font-medium"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-5 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Showing{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {filtered.length}
            </span>{" "}
            of {documents.length} documents
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              setActiveTag("");
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-2 font-semibold"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Content */}
      {documentsLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center mb-5">
            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            No family documents yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            Upload the first document to this family vault
          </p>
          <button
            onClick={onUpload}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 dark:bg-white/[0.12] hover:bg-gray-900 dark:hover:bg-white/[0.18] text-white text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02]">
          <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No documents match your filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              setActiveTag("");
            }}
            className="mt-4 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-2 font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <FamilyDocCard
              key={doc._id}
              document={doc}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FamilyDocumentsSection;
