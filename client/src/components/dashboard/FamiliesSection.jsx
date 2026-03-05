// components/FamiliesSection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Crown, User, Lock, Loader2, ChevronRight } from "lucide-react";
import { verifyPin } from "../../hooks/useApi";

// ── Single family card (used in home preview) ──────────────
export const FamilyCard = ({ family, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-sm p-5 hover:shadow-lg dark:hover:shadow-none hover:border-gray-200 dark:hover:border-white/[0.12] transition-all cursor-pointer group"
  >
    <div className="flex items-start gap-4">
      {family.avatar ? (
        <img
          src={family.avatar}
          alt={family.name}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-white/[0.08]"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center">
          <Users className="w-5.5 h-5.5 text-indigo-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {family.name}
          </p>
          {family.userRole === "owner" ? (
            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          ) : (
            <User className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
          {family.description || "No description"}
        </p>
        <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-2.5">
          {family.stats?.totalMembers || 1} members
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
    </div>
  </div>
);

// ── Family detail card (with PIN entry) ────────────────────
export const FamilyDetailCard = ({ family, isOwner }) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    try {
      const r = await verifyPin(family._id, pin);
      if (r.data.success) {
        navigate(`/family/${family._id}`, {
          state: { pinVerified: true, family: r.data.family },
        });
      } else {
        setError(r.data.message || "Invalid PIN");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-5">
        {family.avatar ? (
          <img
            src={family.avatar}
            alt={family.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-white/[0.08]"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center">
            <Users className="w-5.5 h-5.5 text-indigo-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {family.name}
            </p>
            {isOwner && (
              <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-1">
            {family.description || "No description"}
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[11px] text-gray-300 dark:text-gray-600">
              {family.stats?.totalMembers || 1} members
            </p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600">
              {new Date(family.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {!showPin ? (
        <button
          onClick={() => setShowPin(true)}
          className="w-full py-3 rounded-xl bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-2.5 border border-gray-100 dark:border-white/[0.08]"
        >
          <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> Enter Family
        </button>
      ) : (
        <form onSubmit={handleVerify} className="space-y-3">
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 text-center font-semibold">
              {error}
            </p>
          )}
          <input
            type="password"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter PIN"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-white/[0.06] text-gray-900 dark:text-white text-center tracking-[.5em] text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-all"
          />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowPin(false);
                setPin("");
                setError("");
              }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.1] text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={verifying || pin.length < 4}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
            >
              {verifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ── Families full view ─────────────────────────────────────
const FamiliesSection = ({ families, loading }) => {
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
      </div>
    );

  const total =
    (families.ownedFamilies?.length || 0) +
    (families.memberFamilies?.length || 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Families</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Manage your family vaults and memberships
        </p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.02]">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">No families yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            Create a family to start sharing documents securely
          </p>
        </div>
      ) : (
        <>
          {families.ownedFamilies?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4 flex items-center gap-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Owned (
                {families.ownedFamilies.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {families.ownedFamilies.map((f) => (
                  <FamilyDetailCard key={f._id} family={f} isOwner />
                ))}
              </div>
            </div>
          )}
          {families.memberFamilies?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4 flex items-center gap-2.5">
                <User className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" /> Member of (
                {families.memberFamilies.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {families.memberFamilies.map((f) => (
                  <FamilyDetailCard key={f._id} family={f} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FamiliesSection;
