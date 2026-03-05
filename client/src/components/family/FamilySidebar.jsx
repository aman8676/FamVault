// components/family/FamilySidebar.jsx
import {
  Crown,
  Users,
  FileText,
  Mail,
  Settings,
  X,
  Shield,
  UserMinus,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import { useState } from "react";

// ── Family view constants ───────────────────────────
const FAMILY_VIEWS = {
  OVERVIEW: "overview",
  DOCUMENTS: "documents",
  MEMBERS: "members",
  SETTINGS: "settings",
};

// ── Nav item ────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
      ${
        active
          ? "bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-white"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:text-gray-700 dark:hover:text-gray-300"
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon
        className={`w-[16px] h-[16px] ${active ? "text-gray-700 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}`}
      />
      {label}
    </div>
    {badge > 0 && (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400">
        {badge}
      </span>
    )}
  </button>
);

// ── Member item in sidebar ──────────────────────────
const MemberItem = ({
  member,
  isAdmin,
  isOwner,
  isSelf,
  documentCount,
  onRemove,
}) => {
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
    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors group">
      {/* Avatar */}
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-100 dark:ring-white/[0.08] flex-shrink-0"
        />
      ) : (
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
            isAdmin
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-gray-400"
          }`}
        >
          {member.name?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {member.name}
            {isSelf && (
              <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
                (You)
              </span>
            )}
          </p>
          {isAdmin && <Crown className="w-3 h-3 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            {documentCount} doc{documentCount !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {isAdmin ? "Admin" : "Member"}
          </span>
        </div>
      </div>

      {/* Remove button (admin only, not self, not other admin) */}
      {isOwner && !isAdmin && !isSelf && (
        <button
          onClick={handleRemove}
          disabled={removing}
          className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
          title="Remove member"
        >
          {removing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <UserMinus className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  );
};

// ── Pending invitation item ─────────────────────────
const PendingInviteItem = ({ invitation }) => (
  <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
    <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0">
      <Mail className="w-3 h-3 text-gray-400 dark:text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
        {invitation.email}
      </p>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
        <Clock className="w-2.5 h-2.5" />
        Pending
      </p>
    </div>
  </div>
);

// ── Main Family Sidebar ─────────────────────────────
const FamilySidebar = ({
  family,
  user,
  documents,
  isOwner,
  allMembers,
  currentView,
  onViewChange,
  onInvite,
  onSettings,
  onLeave,
  onRemoveMember,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [membersExpanded, setMembersExpanded] = useState(true);
  const [invitesExpanded, setInvitesExpanded] = useState(true);

  // Count documents per member
  const getDocCount = (memberId) => {
    return documents.filter((doc) => {
      const uploaderId = doc.uploadedBy?._id || doc.uploadedBy;
      return uploaderId === memberId || uploaderId?.toString() === memberId?.toString();
    }).length;
  };

  // Pending invitations
  const pendingInvites = (family?.invitations || []).filter(
    (inv) => inv.status === "pending"
  );

  const navigate = (view) => {
    onViewChange(view);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 bg-white/95 dark:bg-[oklch(0.16_0.02_270/0.95)] backdrop-blur-xl border-r border-gray-200/60 dark:border-white/[0.06] flex flex-col
          transition-transform duration-200
          lg:translate-x-0 lg:top-16
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/[0.06] lg:hidden">
          <div className="flex items-center gap-2.5">
            {family?.avatar ? (
              <img
                src={family.avatar}
                alt={family.name}
                className="w-8 h-8 rounded-xl object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-white/[0.1] flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {family?.name}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Family identity + stats (desktop) */}
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.06] hidden lg:block">
          <div className="flex items-center gap-3 mb-3">
            {family?.avatar ? (
              <img
                src={family.avatar}
                alt={family.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-white/[0.08]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {family?.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {family?.description || "No description"}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center py-2 px-1 rounded-lg bg-gray-50 dark:bg-white/[0.04]">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {family?.stats?.totalMembers || allMembers.length}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                Members
              </p>
            </div>
            <div className="text-center py-2 px-1 rounded-lg bg-gray-50 dark:bg-white/[0.04]">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {documents.length}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                Docs
              </p>
            </div>
            <div className="text-center py-2 px-1 rounded-lg bg-gray-50 dark:bg-white/[0.04]">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {family?.settings?.maxMembers || 10}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                Limit
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 border-b border-gray-100 dark:border-white/[0.06]">
          <p className="px-3.5 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em]">
            Navigation
          </p>
          <div className="space-y-0.5 mt-1">
            <NavItem
              icon={LayoutDashboard}
              label="Overview"
              active={currentView === FAMILY_VIEWS.OVERVIEW}
              onClick={() => navigate(FAMILY_VIEWS.OVERVIEW)}
            />
            <NavItem
              icon={FileText}
              label="Documents"
              active={currentView === FAMILY_VIEWS.DOCUMENTS}
              onClick={() => navigate(FAMILY_VIEWS.DOCUMENTS)}
              badge={documents.length}
            />
            <NavItem
              icon={Users}
              label="Members"
              active={currentView === FAMILY_VIEWS.MEMBERS}
              onClick={() => navigate(FAMILY_VIEWS.MEMBERS)}
              badge={allMembers.length}
            />
            {isOwner && (
              <NavItem
                icon={Settings}
                label="Settings"
                active={currentView === FAMILY_VIEWS.SETTINGS}
                onClick={() => navigate(FAMILY_VIEWS.SETTINGS)}
              />
            )}
          </div>
        </div>

        {/* People list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            {/* Members header */}
            <button
              onClick={() => setMembersExpanded((p) => !p)}
              className="w-full flex items-center justify-between px-2.5 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em]"
            >
              <span className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                People ({allMembers.length})
              </span>
              {membersExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>

            {membersExpanded && (
              <div className="space-y-0.5 mt-1">
                {allMembers.map((member) => (
                  <MemberItem
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
            )}

            {/* Pending invitations */}
            {pendingInvites.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setInvitesExpanded((p) => !p)}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em]"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Pending ({pendingInvites.length})
                  </span>
                  {invitesExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                {invitesExpanded && (
                  <div className="space-y-0.5 mt-1">
                    {pendingInvites.map((inv, i) => (
                      <PendingInviteItem key={inv._id || i} invitation={inv} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/[0.06] space-y-3">
          {!isOwner && (
            <button
              onClick={onLeave}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Leave Family
            </button>
          )}
          <div className="flex items-center gap-2 px-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              AES-256 Encrypted
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export { FAMILY_VIEWS };
export default FamilySidebar;
