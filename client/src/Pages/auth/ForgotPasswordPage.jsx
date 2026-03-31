import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";

const ForgotPassword = () => {
  const { sendResetOtp } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const handleSubmit = async () => {
    if (!email) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email");
    setError("");
    setServerErr("");
    setLoading(true);

    try {
      const res = await sendResetOtp(email);

      if (res.success) {
        setSent(true);
        setTimeout(() => navigate("/verify"), 2000);
      } else {
        setServerErr(res.message);
      }
    } catch {
      setServerErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? `OTP sent to ${email}. Redirecting...`
          : "Enter your email and we'll send you a reset OTP"
      }
    >
      <h1 className="sr-only">
        {sent ? "Check your inbox" : "Forgot password?"}
      </h1>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {serverErr && (
              <div
                className={`px-3.5 py-2.5 rounded-xl ${
                  isDark
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-red-50 border border-red-100"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {serverErr}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <div className="relative group">
                <div
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark
                      ? "text-gray-500 group-focus-within:text-blue-400"
                      : "text-gray-400 group-focus-within:text-blue-500"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setServerErr("");
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? `bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:ring-blue-500/30 focus:border-blue-500 ${
                          error
                            ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500"
                            : ""
                        }`
                      : `bg-gray-50 border-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 ${
                          error
                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                            : ""
                        }`
                  }`}
                />
              </div>
              {error && (
                <p
                  className={`text-xs ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  {error}
                </p>
              )}
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send OTP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <button
              onClick={() => navigate("/auth")}
              className={`flex items-center justify-center gap-1.5 text-sm transition-colors w-full pt-1 ${
                isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center lg:justify-start"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-teal-500/10 border border-teal-500/20"
                    : "bg-teal-50 border border-teal-200"
                }`}
              >
                <CheckCircle2 className="w-7 h-7 text-teal-500" />
              </div>
            </motion.div>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              A 6-digit OTP has been sent to{" "}
              <span
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {email}
              </span>
              . Redirecting you to enter it now...
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
