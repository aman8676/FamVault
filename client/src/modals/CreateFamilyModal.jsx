// modals/CreateFamilyModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Plus, Loader2 } from "lucide-react";
import { createFamily } from "../hooks/useApi";

const CreateFamilyModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", description: "", pin: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.pin) return setError("Name and PIN are required");
    if (form.pin.length < 4) return setError("PIN must be 4–6 digits");
    if (!avatar) return setError("Family avatar is required");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("avatar", avatar);
      const r = await createFamily(fd);
      if (r.data.success) onSuccess();
      else setError(r.data.message || "Failed to create family");
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
        className="w-full max-w-md bg-white dark:bg-[oklch(0.18_0.02_275)] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.08]">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Create Family</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Set up a shared family vault
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

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0];
                  setAvatar(f);
                  setPreview(URL.createObjectURL(f));
                }}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-500/40 hover:border-indigo-400 dark:hover:border-indigo-400 transition-all"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/[0.06] border-2 border-dashed border-gray-200 dark:border-white/[0.12] flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors">
                  <Upload className="w-6 h-6 text-gray-300 dark:text-gray-600 mb-1" />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">Upload</span>
                </div>
              )}
            </label>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
              Family avatar (required)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Family Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter family name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
          </div>

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
              maxLength={150}
              placeholder="Brief description…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 resize-none transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 text-right">
              {form.description.length}/150
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              PIN * (4–6 digits)
            </label>
            <input
              type="password"
              value={form.pin}
              maxLength={6}
              onChange={(e) =>
                setForm({
                  ...form,
                  pin: e.target.value.replace(/\D/g, "").slice(0, 6),
                })
              }
              placeholder="• • • • • •"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-center tracking-[.5em] text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all bg-gray-50 dark:bg-white/[0.04]"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Required to access the family vault
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm shadow-indigo-200 dark:shadow-indigo-500/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Family
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateFamilyModal;
