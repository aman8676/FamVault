// modals/DocumentPreviewModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Download,
  FileText,
  Image,
  File,
  Loader2,
  XCircle,
  Shield,
  Tag,
} from "lucide-react";
import { viewDocument, downloadDocument } from "../hooks/useApi";
import { CAT_STYLES, CAT_LABELS } from "../components/dashboard/DocumentCard";

const DocumentPreviewModal = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    (async () => {
      try {
        const r = await viewDocument(document._id);
        if (r.data.type === "application/json") {
          const t = await r.data.text();
          throw new Error(JSON.parse(t).message || "Failed to load");
        }
        objectUrl = URL.createObjectURL(
          new Blob([r.data], { type: document.fileType }),
        );
        setPreviewUrl(objectUrl);
      } catch (err) {
        if (err.response?.data instanceof Blob) {
          try {
            const t = await err.response.data.text();
            setError(JSON.parse(t).message || "Load failed");
          } catch {
            setError(`Server error (${err.response?.status})`);
          }
        } else {
          setError(err.message || "Failed to load document");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document._id, document.fileType]);

  const handleDownload = async () => {
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

  const isImage = document.fileType?.startsWith("image/");
  const isPDF = document.fileType === "application/pdf";
  const style = CAT_STYLES[document.category] || CAT_STYLES.other;

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
        className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[oklch(0.18_0.02_275)] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/[0.08] flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}
          >
            {isImage ? (
              <Image className="w-4 h-4" />
            ) : isPDF ? (
              <FileText className="w-4 h-4" />
            ) : (
              <File className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {document.title}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">{document.fileType}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.1] hover:bg-gray-200 dark:hover:bg-white/[0.15] text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors disabled:opacity-40"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-5 bg-gray-50 dark:bg-white/[0.02]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Decrypting document…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <XCircle className="w-10 h-10 text-red-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px]">
              {isImage ? (
                <img
                  src={previewUrl}
                  alt={document.title}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-sm"
                />
              ) : isPDF ? (
                <iframe
                  src={previewUrl}
                  title={document.title}
                  className="w-full h-[65vh] rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04]"
                />
              ) : (
                <div className="text-center py-12">
                  <File className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
                    Preview not available for this file type
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 dark:bg-white/[0.15] hover:bg-gray-900 dark:hover:bg-white/[0.2] text-white text-sm font-semibold transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download to View
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.08] bg-white dark:bg-[oklch(0.18_0.02_275)] flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(document.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {document.category && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
              >
                {CAT_LABELS[document.category] || "Other"}
              </span>
            )}
            {(document.tags || []).slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 text-[11px]"
              >
                <Tag className="w-2.5 h-2.5" />
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0">
            <Shield className="w-3 h-3" />
            <span>AES-256</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentPreviewModal;
