// components/family/FamilyMembersView.jsx
import { useState } from "react";
import {
  Crown,
  Users,
  FileText,
  UserMinus,
  Mail,
  Plus,
  Loader2,
  Search,
  Calendar,
} from "lucide-react";

const MemberCard = ({ member, isAdmin, isOwner, isSelf, documentCount, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${member.name} from this family?`)) return;
    setRemoving(true);
    try {
      await onRemove(member._id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-white/[0.08]"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                isAdmin
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400"
              }`}
            >
              {member.name?.charAt(0).toUpperCase()}
            </div>
          )}
          {isAdmin && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <Crown className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              {member.name}
            </h3>
            {isSelf && (
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {member.email}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                isAdmin
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400"
              }`}
            >
              {isAdmin ? "Admin" : "Member"}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" />
              {documentCount} document{documentCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Remove button */}
        {isOwner && !isAdmin && !isSelf && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
            title="Remove member"
          >
            {removing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserMinus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const FamilyMembersView = ({
  family,
  user,
  documents,
  allMembers,
  isOwner,
  onInvite,
  onRemoveMember,
}) => {
  const [search, setSearch] = useState("");

  const getDocCount = (memberId) => {
    return documents.filter((doc) => {
      const uploaderId = doc.uploadedBy?._id || doc.uploadedBy;
      return uploaderId === memberId || uploaderId?.toString() === memberId?.toString();
    }).length;
  };

  const filtered = allMembers.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  const pendingInvites = (family?.invitations || []).filter(
    (inv) => inv.status === "pending"
  );

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Members
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {allMembers.length} member{allMembers.length !== 1 ? "s" : ""} ·{" "}
            {family?.settings?.maxMembers || 10} max
          </p>
        </div>
        {isOwner && (
          <button
            onClick={onInvite}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
          >
            <Plus className="w-4 h-4" /> Invite Member
          </button>
        )}
      </div>

      {/* Search */}
      {allMembers.length > 4 && (
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] transition-all"
          />
        </div>
      )}

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filtered.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            isAdmin={member._isAdmin}
            isOwner={isOwner}
            isSelf={member._id === user?._id}
            documentCount={getDocCount(member._id)}
            onRemove={onRemoveMember}
          />
        ))}
      </div>

      {/* Pending invitations */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Pending Invitations ({pendingInvites.length})
          </h3>
          <div className="space-y-2">
            {pendingInvites.map((inv, i) => (
              <div
                key={inv._id || i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-white/[0.06] border border-gray-100 dark:border-white/[0.06]"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {inv.email}
                  </p>
                  {inv.createdAt && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(inv.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FamilyMembersView;
