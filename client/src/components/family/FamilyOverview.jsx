// components/family/FamilyOverview.jsx
import {
  Users,
  FileText,
  Mail,
  Plus,
  Crown,
  User,
  Eye,
  Clock,
  Upload,
} from "lucide-react";
import { CAT_STYLES, CAT_LABELS } from "../dashboard/DocumentCard";

// ── Stat Card ───────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sublabel }) => (
  <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/[0.06] flex items-center justify-center">
        <Icon className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
      </div>
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    {sublabel && (
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
        {sublabel}
      </p>
    )}
  </div>
);

// ── Recent Doc Row ──────────────────────────────────
const RecentDocRow = ({ doc, onPreview }) => {
  const style = CAT_STYLES[doc.category] || CAT_STYLES.other;
  const uploaderName = doc.uploadedBy?.name || "Unknown";

  return (
    <button
      onClick={() => onPreview?.(doc)}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors text-left group"
    >
      {/* Category dot */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.icon}`}
      >
        <FileText className="w-4 h-4" />
      </div>

      {/* Title + uploader */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {doc.title}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1.5">
          <User className="w-2.5 h-2.5" />
          Uploaded by {uploaderName}
        </p>
      </div>

      {/* Category */}
      <span
        className={`hidden sm:inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-md ${style.bg} ${style.text}`}
      >
        {CAT_LABELS[doc.category] || "Other"}
      </span>

      {/* Date */}
      <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">
        {new Date(doc.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}
      </span>

      {/* View icon */}
      <Eye className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </button>
  );
};

// ── Main Overview ───────────────────────────────────
const FamilyOverview = ({
  family,
  documents,
  allMembers,
  isOwner,
  onInvite,
  onUpload,
  onPreview,
  onViewChange,
}) => {
  const pendingInvites = (family?.invitations || []).filter(
    (inv) => inv.status === "pending"
  );
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Members"
          value={family?.stats?.totalMembers || allMembers.length}
          sublabel={`of ${family?.settings?.maxMembers || 10} max`}
        />
        <StatCard
          icon={FileText}
          label="Documents"
          value={documents.length}
          sublabel="encrypted files"
        />
        <StatCard
          icon={Mail}
          label="Pending Invites"
          value={pendingInvites.length}
          sublabel={pendingInvites.length === 0 ? "no pending" : "awaiting response"}
        />
      </div>

      {/* Members row */}
      <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Members
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange?.("members")}
              className="text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              View all
            </button>
            {isOwner && (
              <button
                onClick={onInvite}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
              >
                <Plus className="w-3 h-3" /> Invite
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {allMembers.slice(0, 8).map((member) => (
            <div key={member._id} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
              <div className="relative">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-white/[0.08]"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      member._isAdmin
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {member._isAdmin && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate w-full text-center">
                {member.name?.split(" ")[0]}
              </span>
            </div>
          ))}

          {/* Invite button circle */}
          {isOwner && (
            <button
              onClick={onInvite}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16"
            >
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-white/[0.1] flex items-center justify-center hover:border-gray-300 dark:hover:border-white/[0.2] transition-colors">
                <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                Invite
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Recent documents */}
      <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/[0.04]">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Recent Documents
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange?.("documents")}
              className="text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              View all ({documents.length})
            </button>
            <button
              onClick={onUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gray-800 dark:bg-white/[0.12] hover:bg-gray-900 dark:hover:bg-white/[0.18] transition-colors"
            >
              <Upload className="w-3 h-3" />
              Upload
            </button>
          </div>
        </div>

        {recentDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No documents yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
            {recentDocs.map((doc) => (
              <RecentDocRow key={doc._id} doc={doc} onPreview={onPreview} />
            ))}
          </div>
        )}
      </div>

      {/* Pending invitations (if any) */}
      {pendingInvites.length > 0 && (
        <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Pending Invitations
          </h3>
          <div className="space-y-2">
            {pendingInvites.map((inv, i) => (
              <div
                key={inv._id || i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.04]"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {inv.email}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    Invitation sent
                  </p>
                </div>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyOverview;
