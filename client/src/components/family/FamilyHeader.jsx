// components/family/FamilyHeader.jsx
import {
  ArrowLeft,
  Users,
  Menu,
  Sun,
  Moon,
  Pencil,
  Lock,
  Settings,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

// ── Top bar (fixed) — slim navigation bar ───────────
const FamilyTopBar = ({ family, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/80 dark:bg-[oklch(0.16_0.02_270/0.85)] backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.06] flex items-center px-5 lg:px-8 gap-4">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Back button (desktop) */}
      <button
        onClick={() => navigate("/dashboard")}
        className="hidden lg:flex p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Family identity */}
      <div className="flex items-center gap-2.5">
        {family?.avatar ? (
          <img
            src={family.avatar}
            alt={family.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-gray-100 dark:ring-white/[0.08]"
          />
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-white/[0.1] flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <span className="hidden sm:block text-sm font-semibold text-gray-800 dark:text-gray-200">
          {family?.name}
        </span>
      </div>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="w-[17px] h-[17px]" />
        ) : (
          <Moon className="w-[17px] h-[17px]" />
        )}
      </button>
    </header>
  );
};

// ── Content header (in main area) — family name + actions ──
const FamilyContentHeader = ({
  family,
  isOwner,
  onEditFamily,
  onChangePin,
  onSettings,
  onDeleteFamily,
}) => {
  return (
    <div className="mb-8">
      {/* Family name + description */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {family?.avatar ? (
            <img
              src={family.avatar}
              alt={family.name}
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-gray-100 dark:ring-white/[0.08] flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {family?.name}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-md">
              {family?.description || "No description"}
            </p>
          </div>
        </div>

        {/* Admin action buttons */}
        {isOwner && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onEditFamily}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={onChangePin}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> PIN
            </button>
            <button
              onClick={onSettings}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.08] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
            <button
              onClick={onDeleteFamily}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 border border-red-200 dark:border-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { FamilyTopBar, FamilyContentHeader };
export default FamilyTopBar;
