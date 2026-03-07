// modals/UploadFamilyDocModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  FileText,
  Image,
  File,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { uploadFamilyDocument } from "../hooks/useApi";

const CATEGORIES = [
  { value: "identity", label: "Identity Documents" },
  { value: "financial", label: "Financial Documents" },
  { value: "medical", label: "Medical Records" },
  { value: "legal", label: "Legal Documents" },
  { value: "education", label: "Education" },
  { value: "property", label: "Property Documents" },
  { value: "other", label: "Other" },
];

const UploadFamilyDocModal = ({ familyId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const FileIconComp = file
    ? file.type.startsWith("image/")
      ? Image
      : file.type === "application/pdf"
        ? FileText
        : File
    : Upload;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title) return setError("Title is required");
    if (!file) return setError("Please select a document");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("document", file);
      const r = await uploadFamilyDocument(familyId, fd);
      if (r.data.success) onSuccess();
      else setError(r.data.message || "Upload failed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-[oklch(0.18_0.02_270)] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08] max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-[oklch(0.18_0.02_270)] flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.06] z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Upload to Family
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Encrypted with AES-256
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <label className="cursor-pointer block">
            <input
              type="file"
              className="hidden"
              title=""
              tabIndex={-1}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div
              className={`p-6 rounded-xl border-2 border-dashed transition-all ${
                file
                  ? "border-gray-300 dark:border-white/[0.15] bg-gray-50 dark:bg-white/[0.06]"
                  : "border-gray-200 dark:border-white/[0.1] hover:border-gray-300 dark:hover:border-white/[0.15] bg-gray-50 dark:bg-white/[0.04]"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.08]">
                    <FileIconComp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <Upload className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Click to select a file
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    PDF, images, or any document
                  </p>
                </div>
              )}
            </div>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Document title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all bg-gray-50 dark:bg-white/[0.06]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="Brief description..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] resize-none transition-all bg-gray-50 dark:bg-white/[0.06]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Category
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] transition-all bg-gray-50 dark:bg-white/[0.06]"
              >
                <span>
                  {CATEGORIES.find((c) => c.value === form.category)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>
              {categoryOpen && (
                <div className="absolute z-20 w-full mt-1 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-[oklch(0.22_0.02_270)] shadow-lg overflow-hidden">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, category: c.value });
                        setCategoryOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                        form.category === c.value
                          ? "bg-gray-100 dark:bg-white/[0.1] text-gray-900 dark:text-white font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Tags{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. passport, 2024, important"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all bg-gray-50 dark:bg-white/[0.06]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-800 dark:bg-white/[0.15] hover:bg-gray-900 dark:hover:bg-white/[0.2] text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Encrypting &
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload to Family Vault
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UploadFamilyDocModal;
