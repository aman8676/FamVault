// components/DocumentCard.jsx
import { useState } from "react";
import {
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Eye,
  Shield,
  Tag,
  Loader2,
} from "lucide-react";
import { downloadDocument, deleteDocument } from "../../hooks/useApi";

const CAT_STYLES = {
  identity: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-100 dark:border-sky-500/20",
    icon: "bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400",
    strip: "from-sky-400 to-sky-500",
  },
  financial: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-100 dark:border-emerald-500/20",
    icon: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    strip: "from-emerald-400 to-emerald-500",
  },
  medical: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-100 dark:border-rose-500/20",
    icon: "bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400",
    strip: "from-rose-400 to-rose-500",
  },
  legal: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-100 dark:border-violet-500/20",
    icon: "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400",
    strip: "from-violet-400 to-violet-500",
  },
  education: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-100 dark:border-amber-500/20",
    icon: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
    strip: "from-amber-400 to-amber-500",
  },
  property: {
    bg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-100 dark:border-teal-500/20",
    icon: "bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400",
    strip: "from-teal-400 to-teal-500",
  },
  other: {
    bg: "bg-gray-50 dark:bg-gray-500/10",
    text: "text-gray-600 dark:text-gray-300",
    border: "border-gray-100 dark:border-gray-500/20",
    icon: "bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400",
    strip: "from-gray-400 to-gray-500",
  },
};

const CAT_LABELS = {
  identity: "Identity",
  financial: "Financial",
  medical: "Medical",
  legal: "Legal",
  education: "Education",
  property: "Property",
  other: "Other",
};

const DocumentCard = ({ document, onRefresh, onPreview }) => {
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const style = CAT_STYLES[document.category] || CAT_STYLES.other;
  const FileIcon = document.fileType?.startsWith("image/")
    ? Image
    : document.fileType === "application/pdf"
      ? FileText
      : File;

  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const r = await downloadDocument(document._id);
      if (r.data.type === "application/json") {
        const t = await r.data.text();
        throw new Error(JSON.parse(t).message || "Download failed");
      }
      const url = URL.createObjectURL(new Blob([r.data]));
      const link = window.document.createElement("a");
      link.href = url;
      link.setAttribute("download", document.fileName || document.title);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${document.title}"? This cannot be undone.`))
      return;
    setDeleting(true);
    try {
      const r = await deleteDocument(document._id);
      if (r.data.success) onRefresh?.();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const tags = document.tags || [];

  return (
    <div
      onClick={() => onPreview?.(document)}
      className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-lg dark:hover:shadow-none hover:border-gray-200 dark:hover:border-white/[0.12] transition-all cursor-pointer group"
    >
      {/* Top color strip */}
      <div className={`h-1.5 rounded-t-2xl bg-gradient-to-r ${style.strip}`} />

      <div className="p-5">
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}
          >
            <FileIcon className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-bold text-gray-900 dark:text-white truncate leading-snug"
              title={document.title}
            >
              {document.title}
            </h3>
            {/* Category badge - more spacious */}
            <span
              className={`inline-flex items-center mt-2 text-xs font-semibold px-3 py-1 rounded-lg ${style.bg} ${style.text}`}
            >
              {CAT_LABELS[document.category] || "Other"}
            </span>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {document.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 text-[11px] font-medium"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 text-[11px]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
          <span>
            {new Date(document.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
            <Shield className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(document);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors disabled:opacity-40"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Download
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-40"
          >
            {deleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CAT_STYLES, CAT_LABELS };
export default DocumentCard;
