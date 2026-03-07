// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader2, Shield } from "lucide-react";

import {
  getMyFamilies,
  getMyInvitations,
  getMyDocuments,
  getMe,
} from "../hooks/useApi";

import { useAuth } from "../Context/AuthContext";

import Header from "../components/dashboard/Header";
import Sidebar, { VIEWS } from "../components/dashboard/SideBar";
import FamiliesSection, { FamilyCard } from "../components/dashboard/FamiliesSection";
import InvitationsSection, {
  InvitationCard,
} from "../components/dashboard/InvitationSection";
import DocumentsSection from "../components/dashboard/DocumentSection";

import CreateFamilyModal from "../modals/CreateFamilyModal";
import UploadDocumentModal from "../modals/UploadDocumentModal";
import DocumentPreviewModal from "../modals/DocumentPreviewModal";

import { Users, Mail, FileText, Plus, ChevronRight } from "lucide-react";

// Stats Card
const StatsCard = ({ label, value, sub, icon: Icon, color, bg, darkBg }) => (
  <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${darkBg || ""}`}
    >
      <Icon className={`w-5.5 h-5.5 ${color}`} />
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1.5">{label}</p>
      <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-0.5">{sub}</p>
    </div>
  </div>
);

// Home View
const HomeView = ({
  user,
  families,
  invitations,
  documents,
  documentsLoading,
  onViewFamilies,
  onViewInvitations,
  onCreateFamily,
  onUploadDoc,
  onRefreshDocuments,
  onPreviewDoc,
  onRefreshInvitations,
  onRefreshFamilies,
}) => {
  const navigate = useNavigate();
  const total =
    (families.ownedFamilies?.length || 0) +
    (families.memberFamilies?.length || 0);

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {user?.name?.split(" ")[0]}
          </span>
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Your vault is secure and up to date.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          label="Families"
          value={total}
          sub={`${families.ownedFamilies?.length || 0} owned · ${families.memberFamilies?.length || 0} member`}
          icon={Users}
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50"
          darkBg="dark:bg-indigo-500/15"
        />
        <StatsCard
          label="Invitations"
          value={invitations.length}
          sub="Awaiting response"
          icon={Mail}
          color="text-rose-500 dark:text-rose-400"
          bg="bg-rose-50"
          darkBg="dark:bg-rose-500/15"
        />
        <StatsCard
          label="Documents"
          value={documents.length}
          sub="In personal vault"
          icon={FileText}
          color="text-cyan-600 dark:text-cyan-400"
          bg="bg-cyan-50"
          darkBg="dark:bg-cyan-500/15"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: Plus, label: "Create Family", fn: onCreateFamily },
            { icon: Users, label: "View Families", fn: onViewFamilies },
            {
              icon: Mail,
              label: "Invitations",
              fn: onViewInvitations,
              badge: invitations.length,
            },
          ].map(({ icon: Icon, label, fn, badge }) => (
            <button
              key={label}
              onClick={fn}
              className="flex items-center gap-3.5 px-5 py-4 rounded-xl bg-white dark:bg-white/[0.06] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-white/[0.12] transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
              </div>
              {label}
              {badge > 0 && (
                <span className="ml-auto text-[11px] bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Documents section */}
      <DocumentsSection
        documents={documents}
        documentsLoading={documentsLoading}
        onUpload={onUploadDoc}
        onRefresh={onRefreshDocuments}
        onPreview={onPreviewDoc}
      />

      {/* Families preview */}
      {total > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Families
            </h2>
            <button
              onClick={onViewFamilies}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ...(families.ownedFamilies || []),
              ...(families.memberFamilies || []),
            ]
              .slice(0, 3)
              .map((f) => (
                <FamilyCard
                  key={f._id}
                  family={f}
                  onClick={() => navigate(`/family/${f._id}`)}
                  isOwner={families.ownedFamilies?.some((o) => o._id === f._id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Invitations preview */}
      {invitations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Pending Invitations
            </h2>
            <button
              onClick={onViewInvitations}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {invitations.slice(0, 2).map((inv) => (
              <InvitationCard
                key={inv._id}
                invitation={inv}
                onRefresh={onRefreshInvitations}
                onAccepted={onRefreshFamilies}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard root
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showUploadDoc, setShowUploadDoc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [families, setFamilies] = useState({
    ownedFamilies: [],
    memberFamilies: [],
  });
  const [invitations, setInvitations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [familiesLoading, setFamiliesLoading] = useState(false);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // ── Fetch user ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await getMe();
        r.data.success ? setUser(r.data.user) : navigate("/auth");
      } catch {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Fetch helpers 
  const fetchFamilies = async () => {
    setFamiliesLoading(true);
    try {
      const r = await getMyFamilies();
      if (r.data.success)
        setFamilies({
          ownedFamilies: r.data.ownedFamilies || [],
          memberFamilies: r.data.memberFamilies || [],
        });
    } catch (err) {
      console.error("Failed to fetch families:", err);
    } finally {
      setFamiliesLoading(false);
    }
  };
  const fetchInvitations = async () => {
    setInvitationsLoading(true);
    try {
      const r = await getMyInvitations();
      if (r.data.success) setInvitations(r.data.invitations || []);
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    } finally {
      setInvitationsLoading(false);
    }
  };
  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    try {
      const r = await getMyDocuments();
      if (r.data.success) setDocuments(r.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    if ([VIEWS.FAMILIES, VIEWS.HOME].includes(currentView)) fetchFamilies();
    if ([VIEWS.INVITATIONS, VIEWS.HOME].includes(currentView))
      fetchInvitations();
    if ([VIEWS.HOME, VIEWS.DOCUMENTS].includes(currentView)) fetchDocuments();
  }, [currentView]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/auth");
    }
  };

  // Loading screen
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[oklch(0.14_0.03_275)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading your vault...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-transparent">
      <Header
        user={user}
        invitations={invitations}
        onLogout={handleLogout}
        setSidebarOpen={setSidebarOpen}
        setCurrentView={setCurrentView}
      />

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        families={families}
        invitations={invitations}
        documents={documents}
        onCreateFamily={() => setShowCreateFamily(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="pt-16 lg:pl-64">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
          {currentView === VIEWS.HOME && (
            <HomeView
              user={user}
              families={families}
              invitations={invitations}
              documents={documents}
              documentsLoading={documentsLoading}
              onViewFamilies={() => setCurrentView(VIEWS.FAMILIES)}
              onViewInvitations={() => setCurrentView(VIEWS.INVITATIONS)}
              onCreateFamily={() => setShowCreateFamily(true)}
              onUploadDoc={() => setShowUploadDoc(true)}
              onRefreshDocuments={fetchDocuments}
              onPreviewDoc={setPreviewDoc}
              onRefreshInvitations={fetchInvitations}
              onRefreshFamilies={fetchFamilies}
            />
          )}
          {currentView === VIEWS.DOCUMENTS && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Documents
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  All your personal documents in one place
                </p>
              </div>
              <DocumentsSection
                documents={documents}
                documentsLoading={documentsLoading}
                onUpload={() => setShowUploadDoc(true)}
                onRefresh={fetchDocuments}
                onPreview={setPreviewDoc}
              />
            </div>
          )}
          {currentView === VIEWS.FAMILIES && (
            <FamiliesSection families={families} loading={familiesLoading} />
          )}
          {currentView === VIEWS.INVITATIONS && (
            <InvitationsSection
              invitations={invitations}
              loading={invitationsLoading}
              onRefresh={fetchInvitations}
              onAccepted={fetchFamilies}
            />
          )}
        </div>
      </main>

      <AnimatePresence>
        {showCreateFamily && (
          <CreateFamilyModal
            onClose={() => setShowCreateFamily(false)}
            onSuccess={() => {
              setShowCreateFamily(false);
              fetchFamilies();
            }}
          />
        )}
        {showUploadDoc && (
          <UploadDocumentModal
            onClose={() => setShowUploadDoc(false)}
            onSuccess={() => {
              setShowUploadDoc(false);
              fetchDocuments();
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
};

export default Dashboard;
