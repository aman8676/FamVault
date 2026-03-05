// modals/UploadDocumentModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, FileText, Image, File, Loader2 } from "lucide-react";
import { uploadDocument } from "../hooks/useApi";

const CATEGORIES = [
  { value: "identity", label: "Identity Documents" },
  { value: "financial", label: "Financial Documents" },
  { value: "medical", label: "Medical Records" },
  { value: "legal", label: "Legal Documents" },
  { value: "education", label: "Education" },
  { value: "property", label: "Property Documents" },
  { value: "other", label: "Other" },
];

const UploadDocumentModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const FileIcon = file
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
      const r = await uploadDocument(fd);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-[oklch(0.18_0.02_275)] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08] max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-[oklch(0.18_0.02_275)] flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.08] z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Upload Document
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Encrypted with AES-256 before storing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* File drop zone */}
          <label className="cursor-pointer block">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div
              className={`p-5 rounded-xl border-2 border-dashed transition-all
              ${file ? "border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10" : "border-gray-200 dark:border-white/[0.12] hover:border-gray-300 dark:hover:border-white/[0.2] bg-gray-50 dark:bg-white/[0.04]"}`}
            >
              {file ? (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/15">
                    <FileIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
                    className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
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

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Document title"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="Brief description…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 resize-none transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all bg-gray-50 dark:bg-white/[0.04]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Tags{" "}
              <span className="text-gray-400 dark:text-gray-600 font-normal">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. passport, 2024, important"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm shadow-indigo-200 dark:shadow-indigo-500/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Encrypting & Uploading…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload to Vault
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UploadDocumentModal;
