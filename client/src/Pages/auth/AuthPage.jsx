import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/Auth/LoginForm";
import { RegisterForm } from "../../components/Auth/RegisterForm";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  Check,
  ImagePlus,
} from "lucide-react";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  toggle,
  showToggle,
  onToggle,
  isDark,
}) => (
  <div className="space-y-1.5">
    <label
      className={`text-sm font-medium ${
        isDark ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
    <div className="relative group">
      <div
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
          isDark
            ? "text-gray-500 group-focus-within:text-blue-400"
            : "text-gray-400 group-focus-within:text-blue-500"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={toggle ? (showToggle ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 ${toggle ? "pr-10" : "pr-4"} py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
          isDark
            ? `bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:ring-blue-500/30 focus:border-blue-500 ${
                error
                  ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500"
                  : ""
              }`
            : `bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 ${
                error
                  ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                  : ""
              }`
        }`}
      />
      {toggle && (
        <button
          type="button"
          onClick={onToggle}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {showToggle ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p className={`text-xs ${isDark ? "text-red-400" : "text-red-500"}`}>
        {error}
      </p>
    )}
  </div>
);

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = [
  "",
  "bg-red-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-teal-500",
];

// Export shared helpers so LoginForm and RegisterForm can use them
export { InputField, getStrength, strengthLabel, strengthColor };

const AuthPage = () => {
  const { isDark } = useTheme();
  const [mode, setMode] = useState("login");

  return (
    <AuthLayout
      title={mode === "login" ? "Welcome back" : "Create account"}
      subtitle={
        mode === "login"
          ? "Sign in to your DocVault account"
          : "Start managing your documents securely"
      }
    >
      {/* Tab switcher */}
      <div
        className={`flex rounded-xl p-1 mb-5 ${
          isDark ? "bg-white/5" : "bg-gray-100"
        }`}
      >
        {["login", "register"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMode(tab)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              mode === tab
                ? isDark
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-white text-gray-900 shadow-sm"
                : isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Animate between forms */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "login" ? (
            <LoginForm onSwitch={() => setMode("register")} />
          ) : (
            <RegisterForm onSwitch={() => setMode("login")} />
          )}
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthPage;
