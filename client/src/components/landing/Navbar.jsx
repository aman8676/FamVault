import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, Sun, Moon } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Security", href: "#security" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg shadow-gray-200/40"
          : isDark
            ? "bg-slate-900/50 backdrop-blur-md"
            : "bg-white/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                DocVault
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className={`relative font-medium transition duration-300 group ${
                  isDark
                    ? "text-white/70 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isDark
                  ? "bg-white/10 text-yellow-400 hover:bg-white/15"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            <Link to="/auth">
              <motion.span
                className={`font-medium transition duration-300 cursor-pointer ${
                  isDark
                    ? "text-white/80 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log in
              </motion.span>
            </Link>

            <Link to="/auth">
              <motion.span
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/40 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.span>
            </Link>
          </div>

          {/* Mobile: Theme + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isDark
                  ? "bg-white/10 text-yellow-400 hover:bg-white/15"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              className={`p-2.5 rounded-xl transition-all ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 backdrop-blur-sm lg:hidden ${
                isDark ? "bg-black/40" : "bg-black/20"
              }`}
              style={{ top: "80px" }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute top-full left-0 right-0 shadow-2xl lg:hidden ${
                isDark
                  ? "bg-slate-900 border-t border-white/10 shadow-black/40"
                  : "bg-white border-t border-gray-200 shadow-gray-200/40"
              }`}
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`block py-3 rounded-lg transition ${
                      isDark
                        ? "text-white/80 hover:text-white hover:bg-white/5"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}

                <div
                  className={`pt-4 border-t space-y-4 ${
                    isDark ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <Link
                    to="/auth"
                    className={`block text-center py-3 border rounded-full transition ${
                      isDark
                        ? "border-white/20 text-white/80 hover:text-white hover:border-white/40"
                        : "border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>

                  <Link
                    to="/auth"
                    className="block text-center py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold rounded-full shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
