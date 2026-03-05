// components/Header.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Menu, Shield, Mail, Users, Sun, Moon } from "lucide-react";
import { VIEWS } from "./SideBar";
import { useTheme } from "../../Context/ThemeContext";

const Header = ({
  user,
  invitations,
  onLogout,
  setSidebarOpen,
  setCurrentView,
}) => {
  const [showNotif, setShowNotif] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/80 dark:bg-[oklch(0.18_0.028_270/0.8)] backdrop-blur-xl border-b border-gray-200/60 dark:border-white/[0.08] flex items-center px-5 lg:px-8 gap-4">
      {/* Mobile menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-base hidden sm:block tracking-tight">
          FamVault
        </span>
      </div>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotif((p) => !p)}
          className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
        >
          <Bell className="w-[18px] h-[18px]" />
          {invitations.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[oklch(0.18_0.028_270)]" />
          )}
        </button>

        <AnimatePresence>
          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-[oklch(0.22_0.03_268)] rounded-2xl shadow-2xl border border-gray-200/60 dark:border-white/[0.08] z-50 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Notifications
                </p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {invitations.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      No pending notifications
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {invitations.slice(0, 5).map((inv) => (
                      <button
                        key={inv._id}
                        onClick={() => {
                          setShowNotif(false);
                          setCurrentView(VIEWS.INVITATIONS);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.06] text-left transition-colors"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {inv.familyName}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            From {inv.invitedBy?.name || inv.admin?.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {invitations.length > 0 && (
                <div className="px-2 py-2 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    onClick={() => {
                      setShowNotif(false);
                      setCurrentView(VIEWS.INVITATIONS);
                    }}
                    className="w-full py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors font-semibold"
                  >
                    View all invitations
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {showNotif && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotif(false)}
          />
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-3 pl-4 border-l border-gray-200/60 dark:border-white/[0.08]">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
            {user?.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{user?.email}</p>
        </div>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-white/[0.12]"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
        title="Logout"
      >
        <LogOut className="w-4.5 h-4.5" />
      </button>
    </header>
  );
};

export default Header;
