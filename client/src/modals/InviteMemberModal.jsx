// modals/InviteMemberModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, Loader2 } from "lucide-react";
import { inviteMember } from "../hooks/useApi";

const InviteMemberModal = ({ familyId, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) return setError("Email is required");
    if (!pin || pin.length < 4)
      return setError("Family PIN is required (4-6 digits)");
    setLoading(true);
    try {
      const r = await inviteMember(familyId, {
        email: email.trim(),
        familyPin: pin,
      });
      if (r.data.success) {
        setSuccess("Invitation sent successfully!");
        setEmail("");
        setPin("");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(r.data.message || "Failed to send invitation");
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
              Invite Member
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Send an invitation to join this family
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-600 dark:hover:text-gray-300"
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
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              {success}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all bg-gray-50 dark:bg-white/[0.06]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Family PIN * (to confirm authority)
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter family PIN"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white text-center tracking-[.5em] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all bg-gray-50 dark:bg-white/[0.06]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-800 dark:bg-white/[0.15] hover:bg-gray-900 dark:hover:bg-white/[0.2] text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" /> Send Invitation
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InviteMemberModal;
