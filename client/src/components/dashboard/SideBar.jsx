// components/Sidebar.jsx
import { Home, Users, Mail, FileText, Plus, X, Shield } from "lucide-react";

const VIEWS = {
  HOME: "home",
  DOCUMENTS: "documents",
  FAMILIES: "families",
  INVITATIONS: "invitations",
};

const NavItem = ({ icon: Icon, label, active, onClick, badge, badgeRed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${
        active
          ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon
        className={`w-[18px] h-[18px] ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}
      />
      {label}
    </div>
    {badge > 0 && (
      <span
        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
        ${badgeRed ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400" : "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"}`}
      >
        {badge}
      </span>
    )}
  </button>
);

const Sidebar = ({
  currentView,
  setCurrentView,
  families,
  invitations,
  documents,
  onCreateFamily,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const totalFamilies =
    (families.ownedFamilies?.length || 0) +
    (families.memberFamilies?.length || 0);

  const navigate = (view) => {
    setCurrentView(view);
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
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/90 dark:bg-[oklch(0.18_0.028_270/0.9)] backdrop-blur-xl border-r border-gray-200/60 dark:border-white/[0.08] flex flex-col
        transition-transform duration-200
        lg:translate-x-0 lg:top-16
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/[0.06] lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              FamVault
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 pt-4 pb-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
            Menu
          </p>

          <NavItem
            icon={Home}
            label="Dashboard"
            active={currentView === VIEWS.HOME}
            onClick={() => navigate(VIEWS.HOME)}
          />
          <NavItem
            icon={FileText}
            label="My Documents"
            active={currentView === VIEWS.DOCUMENTS}
            onClick={() => navigate(VIEWS.DOCUMENTS)}
            badge={documents.length}
          />
          <NavItem
            icon={Users}
            label="My Families"
            active={currentView === VIEWS.FAMILIES}
            onClick={() => navigate(VIEWS.FAMILIES)}
            badge={totalFamilies}
          />
          <NavItem
            icon={Mail}
            label="Invitations"
            active={currentView === VIEWS.INVITATIONS}
            onClick={() => navigate(VIEWS.INVITATIONS)}
            badge={invitations.length}
            badgeRed
          />

          <p className="px-4 pt-6 pb-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
            Actions
          </p>
          <NavItem
            icon={Plus}
            label="Create Family"
            onClick={() => {
              onCreateFamily();
              setSidebarOpen(false);
            }}
          />
        </nav>

        <div className="p-5 border-t border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">AES-256 Encrypted</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export { VIEWS };
export default Sidebar;
