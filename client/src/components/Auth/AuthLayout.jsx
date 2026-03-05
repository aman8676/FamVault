import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Shield, Users, Lock, Sun, Moon } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const AuthLayout = ({ children, title, subtitle }) => {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    { icon: Shield, text: "256-bit encryption" },
    { icon: Users, text: "Family sharing" },
    { icon: Lock, text: "PIN protection" },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* Theme toggle (floating) */}
      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
        className={`fixed top-5 right-5 z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
          isDark
            ? "bg-slate-800 border border-white/10 text-yellow-400 hover:bg-slate-700 shadow-black/30"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-gray-200/60"
        }`}
      >
        {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
      </motion.button>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[44%] bg-gradient-to-br from-[#0a0f1e] via-[#0d1f3c] to-[#071428] relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[360px] h-[360px] bg-teal-500/15 rounded-full blur-[100px]" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DocVault</span>
          </Link>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Secure Document
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Management
              </span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-sm mb-10">
              Store, organize, and share important documents with your family
              securely.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-slate-200 text-sm font-medium">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`w-full lg:w-[58%] flex items-center justify-center p-6 sm:p-8 lg:p-12 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-[#0f1629] via-[#111827] to-[#0c1220]"
            : "bg-white"
        }`}
      >
        <div className="w-full max-w-sm relative z-10">
          {/* Mobile Logo */}
          <Link
            to="/"
            className="flex lg:hidden items-center gap-2.5 mb-8 justify-center"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              DocVault
            </span>
          </Link>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left mb-6"
          >
            <h2
              className={`text-2xl font-bold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
