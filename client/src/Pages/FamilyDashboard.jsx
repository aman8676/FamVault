// pages/FamilyDashboard.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  Lock,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import {
  getMe,
  getMyFamilies,
  getFamilyDocuments,
  removeMember,
  leaveFamily,
  verifyPin,
  deleteFamilyApi,
} from "../hooks/useApi";
import { useAuth } from "../Context/AuthContext";

// Layout components
import { FamilyTopBar, FamilyContentHeader } from "../components/family/FamilyHeader";
import FamilySidebar, { FAMILY_VIEWS } from "../components/family/FamilySidebar";
import FamilyOverview from "../components/family/FamilyOverview";
import FamilyDocumentsSection from "../components/family/FamilyDocumentsSection";
import FamilyMembersView from "../components/family/FamilyMembersView";

// Modals
import InviteMemberModal from "../modals/InviteMemberModal";
import UploadFamilyDocModal from "../modals/UploadFamilyDocModal";
import FamilySettingsModal from "../modals/FamilySettingsModal";
import DocumentPreviewModal from "../modals/DocumentPreviewModal";
import EditFamilyModal from "../modals/EditFamilyModal";
import ChangePinModal from "../modals/ChangePinModal";

// ── PIN Gate Screen ──────────────────────────────────
const PinGate = ({ family, onVerified }) => {
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (pin.length < 4) return setError("PIN must be at least 4 digits");
    setVerifying(true);
    try {
      const r = await verifyPin(family._id, pin);
      if (r.data.success) {
        onVerified(r.data.family || family);
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
    <div className="min-h-screen bg-gray-50/80 dark:bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-xl p-8">
          {/* Family info */}
          <div className="flex flex-col items-center mb-8">
            {family.avatar ? (
              <img
                src={family.avatar}
                alt={family.name}
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-gray-100 dark:ring-white/[0.08] mb-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {family.name}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Enter PIN to access this family vault
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}
            <input
              type="password"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter PIN"
              maxLength={6}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.06] text-gray-900 dark:text-white text-center tracking-[.5em] text-lg focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/[0.1] focus:border-gray-300 dark:focus:border-white/[0.15] transition-all"
            />
            <button
              type="submit"
              disabled={verifying || pin.length < 4}
              className="w-full py-3.5 rounded-xl bg-gray-800 dark:bg-white/[0.12] hover:bg-gray-900 dark:hover:bg-white/[0.18] text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Unlock Vault
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 py-2.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Family Dashboard ────────────────────────────
const FamilyDashboard = () => {
  const { id: familyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Check if we arrived with a pre-verified PIN (from FamiliesSection)
  const preVerified = location.state?.pinVerified && location.state?.family;

  // ── State ─────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(
    preVerified ? location.state.family : null,
  );
  const [basicFamily, setBasicFamily] = useState(null);
  const [pinVerified, setPinVerified] = useState(!!preVerified);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState(FAMILY_VIEWS.OVERVIEW);

  // Modal visibility
  const [showInvite, setShowInvite] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditFamily, setShowEditFamily] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // ── Fetch user & basic family info ────────────────
  useEffect(() => {
    (async () => {
      try {
        const [meRes, famRes] = await Promise.all([getMe(), getMyFamilies()]);
        if (!meRes.data.success) return navigate("/auth");
        setUser(meRes.data.user);

        if (!preVerified) {
          const allFamilies = [
            ...(famRes.data.ownedFamilies || []),
            ...(famRes.data.memberFamilies || []),
          ];
          const found = allFamilies.find((f) => f._id === familyId);
          if (!found) return navigate("/dashboard");
          setBasicFamily(found);
        }
      } catch {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    })();
  }, [familyId, navigate, preVerified]);

  // ── PIN verification callback ─────────────────────
  const handlePinVerified = (verifiedFamily) => {
    setFamily(verifiedFamily);
    setPinVerified(true);
  };

  // ── Fetch family documents ────────────────────────
  const fetchDocuments = async () => {
    setDocsLoading(true);
    try {
      const r = await getFamilyDocuments(familyId);
      if (r.data.success) setDocuments(r.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch family documents:", err);
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    if (pinVerified && family) fetchDocuments();
  }, [pinVerified, family]);

  // ── Derived data ──────────────────────────────────
  const isOwner =
    family?.admin?._id === user?._id || family?.admin === user?._id;

  const rawMembers = family?.members || [];
  const admin = family?.admin || {};

  // Flatten members: { user: { _id, name, ... }, role } -> { _id, name, ... }
  const flatMembers = rawMembers.map((m) => {
    const u = m.user || m;
    return { _id: u._id, name: u.name, email: u.email, avatar: u.avatar };
  });

  // Combined list with admin first, flagged with _isAdmin
  const allMembers = [
    { ...admin, _isAdmin: true },
    ...flatMembers.filter((m) => m._id !== admin._id),
  ];

  // ── Actions ───────────────────────────────────────
  const handleRemoveMember = async (memberId) => {
    try {
      const r = await removeMember(familyId, memberId);
      if (r.data.success) {
        setFamily((prev) => ({
          ...prev,
          members: prev.members.filter((m) => {
            const uid = m.user?._id || m.user || m._id;
            return uid !== memberId;
          }),
          stats: {
            ...prev.stats,
            totalMembers: (prev.stats?.totalMembers || 2) - 1,
          },
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this family?")) return;
    try {
      const r = await leaveFamily(familyId);
      if (r.data.success) navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave family");
    }
  };

  const handleDeleteFamily = async () => {
    if (
      !window.confirm(
        `Delete "${family.name}" permanently? All documents and data will be lost. This cannot be undone.`,
      )
    )
      return;
    try {
      const r = await deleteFamilyApi(familyId);
      if (r.data.success) navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete family");
    }
  };

  
  const handleRefreshFamily = async () => {
    try {
      const famRes = await getMyFamilies();
      const allFamilies = [
        ...(famRes.data.ownedFamilies || []),
        ...(famRes.data.memberFamilies || []),
      ];
      const updated = allFamilies.find((f) => f._id === familyId);
      if (updated) {
        setFamily(updated);
       
        fetchDocuments();
      }
    } catch {
    }
  };
  
  const handleViewChange = (view) => {
    if (view === FAMILY_VIEWS.SETTINGS) {
      setShowSettings(true);
      return;
    }
    setCurrentView(view);
  };

  // ── Loading screen ────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[oklch(0.14_0.02_270)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 dark:bg-white/[0.12] flex items-center justify-center">
            <Shield className="w-6 h-6 text-white dark:text-gray-300" />
          </div>
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Loading family vault...
          </p>
        </div>
      </div>
    );
  }

  if (!basicFamily && !pinVerified) return null;

  // Show PIN gate if not yet verified
  if (!pinVerified) {
    return <PinGate family={basicFamily} onVerified={handlePinVerified} />;
  }

  if (!family) return null;

  // ── Render current view ───────────────────────────
  const renderView = () => {
    switch (currentView) {
      case FAMILY_VIEWS.DOCUMENTS:
        return (
          <FamilyDocumentsSection
            documents={documents}
            documentsLoading={docsLoading}
            onUpload={() => setShowUpload(true)}
            onPreview={setPreviewDoc}
            onDelete={fetchDocuments}
          />
        );
      case FAMILY_VIEWS.MEMBERS:
        return (
          <FamilyMembersView
            family={family}
            user={user}
            documents={documents}
            allMembers={allMembers}
            isOwner={isOwner}
            onInvite={() => setShowInvite(true)}
            onRemoveMember={handleRemoveMember}
          />
        );
      case FAMILY_VIEWS.OVERVIEW:
      default:
        return (
          <FamilyOverview
            family={family}
            documents={documents}
            allMembers={allMembers}
            isOwner={isOwner}
            onInvite={() => setShowInvite(true)}
            onUpload={() => setShowUpload(true)}
            onPreview={setPreviewDoc}
            onViewChange={setCurrentView}
          />
        );
    }
  };

  // ── Main dashboard layout ─────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-transparent">
      <FamilyTopBar family={family} setSidebarOpen={setSidebarOpen} />

      <FamilySidebar
        family={family}
        user={user}
        documents={documents}
        isOwner={isOwner}
        allMembers={allMembers}
        currentView={currentView}
        onViewChange={handleViewChange}
        onInvite={() => setShowInvite(true)}
        onSettings={() => setShowSettings(true)}
        onLeave={handleLeave}
        onRemoveMember={handleRemoveMember}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="pt-16 lg:pl-72">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
          <FamilyContentHeader
            family={family}
            isOwner={isOwner}
            onEditFamily={() => setShowEditFamily(true)}
            onChangePin={() => setShowChangePin(true)}
            onSettings={() => setShowSettings(true)}
            onDeleteFamily={handleDeleteFamily}
          />
          {renderView()}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showInvite && (
          <InviteMemberModal
            familyId={familyId}
            onClose={() => setShowInvite(false)}
            onSuccess={() => {
              setShowInvite(false);
              handleRefreshFamily();
            }}
          />
        )}
        {showUpload && (
          <UploadFamilyDocModal
            familyId={familyId}
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              fetchDocuments();
            }}
          />
        )}
        {showSettings && (
          <FamilySettingsModal
            family={family}
            onClose={() => setShowSettings(false)}
            onSuccess={() => {
              setShowSettings(false);
              handleRefreshFamily();
            }}
          />
        )}
        {showEditFamily && (
          <EditFamilyModal
            family={family}
            onClose={() => setShowEditFamily(false)}
            onSuccess={() => {
              setShowEditFamily(false);
              handleRefreshFamily();
            }}
          />
        )}
        {showChangePin && (
          <ChangePinModal
            family={family}
            onClose={() => setShowChangePin(false)}
            onSuccess={() => {
              setShowChangePin(false);
              handleRefreshFamily();
            }}
          />
        )}
        {previewDoc && (
          <DocumentPreviewModal
            document={previewDoc}
            onClose={() => setPreviewDoc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};;

export default FamilyDashboard;
