// components/family/FamilyDocCard.jsx
import { useState } from "react";
import {
  FileText,
  Image,
  File,
  Download,
  Eye,
  Shield,
  Tag,
  Loader2,
  User,
  Trash2,
} from "lucide-react";
import { downloadDocument, deleteDocument } from "../../hooks/useApi";
import { CAT_STYLES, CAT_LABELS } from "../dashboard/DocumentCard";

const FamilyDocCard = ({ document, onPreview, onDelete }) => {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const style = CAT_STYLES[document.category] || CAT_STYLES.other;
  const FileIcon = document.fileType?.startsWith("image/")
    ? Image
    : document.fileType === "application/pdf"
      ? FileText
      : File;

  const uploaderName = document.uploadedBy?.name || "Unknown";
  const uploaderAvatar = document.uploadedBy?.avatar;

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
      if (r.data.success) onDelete?.();
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
      className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md dark:hover:shadow-none hover:border-gray-200 dark:hover:border-white/[0.1] transition-all cursor-pointer group"
    >
      {/* Top color strip */}
      <div className={`h-1 rounded-t-2xl bg-gradient-to-r ${style.strip}`} />

      <div className="p-5">
        {/* Icon + title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}
          >
            <FileIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate leading-snug"
              title={document.title}
            >
              {document.title}
            </h3>
            {/* Category badge */}
            <span
              className={`inline-flex items-center mt-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${style.bg} ${style.text}`}
            >
              {CAT_LABELS[document.category] || "Other"}
            </span>
          </div>
        </div>

        {/* Uploaded by badge */}
        <div className="flex items-center gap-2 mb-3.5 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.04]">
          {uploaderAvatar ? (
            <img
              src={uploaderAvatar}
              alt={uploaderName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200 dark:ring-white/[0.08]"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Uploaded by{" "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {uploaderName}
            </span>
          </span>
        </div>

        {/* Description */}
        {document.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3.5 line-clamp-2 leading-relaxed">
            {document.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400 text-[10px] font-medium"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-white/[0.04] text-gray-400 dark:text-gray-500 text-[10px]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-3.5 border-t border-gray-100 dark:border-white/[0.04]">
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
        <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-gray-100 dark:border-white/[0.04]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(document);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-medium transition-colors disabled:opacity-40"
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
            className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 text-red-400 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-40"
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

export default FamilyDocCard;
