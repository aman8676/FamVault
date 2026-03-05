// modals/ChangePinModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { updateFamilyPin } from "../hooks/useApi";

const ChangePinModal = ({ family, onClose, onSuccess }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (currentPin.length < 4) return setError("Current PIN must be at least 4 digits");
    if (newPin.length < 4) return setError("New PIN must be at least 4 digits");
    if (newPin !== confirmPin) return setError("PINs do not match");
    if (currentPin === newPin) return setError("New PIN must be different");

    setSaving(true);
    try {
      const r = await updateFamilyPin(family._id, {
        currentPin,
        newPin,
      });
      if (r.data.success) {
        onSuccess?.();
      } else {
        setError(r.data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change PIN");
    } finally {
      setSaving(false);
    }
  };

  const pinInput = (value, onChange, placeholder, show, toggleShow) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder={placeholder}
        maxLength={6}
        className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white text-center tracking-[.35em] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[oklch(0.18_0.02_270)] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Change PIN
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                All members will be notified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Current PIN
            </label>
            {pinInput(currentPin, setCurrentPin, "Enter current PIN", showCurrent, () => setShowCurrent((p) => !p))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              New PIN
            </label>
            {pinInput(newPin, setNewPin, "Enter new PIN", showNew, () => setShowNew((p) => !p))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Confirm New PIN
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Re-enter new PIN"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white text-center tracking-[.35em] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || currentPin.length < 4 || newPin.length < 4 || confirmPin.length < 4}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gray-800 dark:bg-white/[0.15] hover:bg-gray-900 dark:hover:bg-white/[0.2] disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                "Change PIN"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePinModal;
