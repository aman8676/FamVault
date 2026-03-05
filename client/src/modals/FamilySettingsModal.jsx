// modals/FamilySettingsModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Settings, Loader2, Users, Hash } from "lucide-react";
import { updateFamilySettings } from "../hooks/useApi";

const FamilySettingsModal = ({ family, onClose, onSuccess }) => {
  const [maxMembers, setMaxMembers] = useState(
    family?.settings?.maxMembers || 10
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (maxMembers < 2 || maxMembers > 50)
      return setError("Max members must be between 2 and 50");
    setLoading(true);
    try {
      const r = await updateFamilySettings(family._id, { maxMembers });
      if (r.data.success) {
        setSuccess("Settings updated successfully!");
        setTimeout(() => onSuccess(), 1200);
      } else {
        setError(r.data.message || "Failed to update settings");
      }
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
        className="w-full max-w-md bg-white dark:bg-[oklch(0.18_0.02_270)] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.08]"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Family Settings
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Manage family capacity and preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              {success}
            </div>
          )}

          {/* Current stats */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Current Usage
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {family?.stats?.totalMembers || 1}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  / {family?.settings?.maxMembers || 10} members
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 dark:bg-gray-400 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, ((family?.stats?.totalMembers || 1) / (family?.settings?.maxMembers || 10)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Maximum Members (2-50)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMaxMembers((p) => Math.max(2, p - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/[0.1] transition-colors flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={maxMembers}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 2;
                  setMaxMembers(Math.min(50, Math.max(2, v)));
                }}
                min={2}
                max={50}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all bg-gray-50 dark:bg-white/[0.06]"
              />
              <button
                type="button"
                onClick={() => setMaxMembers((p) => Math.min(50, p + 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/[0.1] transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-800 dark:bg-white/[0.15] hover:bg-gray-900 dark:hover:bg-white/[0.2] text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" /> Save Settings
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FamilySettingsModal;
