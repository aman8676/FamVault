import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import api from "../../config/axios";

const OTP_LENGTH = 6;

const requirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];
const strengthColor = [
  "",
  "bg-red-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-teal-500",
];

const VerifyPage = () => {
  const { authStep, email, verifyAccount } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // OTP state
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef([]);

  // New Password state (reset-password flow only)
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [passError, setPassError] = useState("");
  const [confError, setConfError] = useState("");

  // Shared state
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (authStep !== "verify-email" && authStep !== "reset-password") {
      navigate("/auth");
    }
  }, [authStep, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const metCount = requirements.filter((r) => r.test(password)).length;

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    try {
      const endpoint =
        authStep === "verify-email"
          ? "/auth/send-verify-otp"
          : "/auth/send-reset-otp";
      await api.post(endpoint, { email });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setResendCooldown(60);
    } catch {
      setServerErr("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length < OTP_LENGTH)
      return setOtpError("Please enter the full 6-digit code");

    if (authStep === "reset-password") {
      if (!password) return setPassError("New password is required");
      if (metCount < 4)
        return setPassError("Password doesn't meet all requirements");
      if (!confirm) return setConfError("Please confirm your password");
      if (password !== confirm)
        return setConfError("Passwords do not match");
    }

    setOtpError("");
    setPassError("");
    setConfError("");
    setServerErr("");
    setLoading(true);

    try {
      let res;

      if (authStep === "verify-email") {
        res = await verifyAccount(code);
      } else {
        const response = await api.post("/auth/reset-password", {
          email,
          otp: code,
          newPassword: password,
        });
        res = response.data;
      }

      if (res.success) {
        setSuccess(true);
      } else {
        setServerErr(res.message);
      }
    } catch {
      setServerErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isVerifyFlow = authStep === "verify-email";
  const title = success
    ? isVerifyFlow
      ? "Email verified!"
      : "Password reset!"
    : isVerifyFlow
      ? "Verify your email"
      : "Reset your password";
  const subtitle = success
    ? isVerifyFlow
      ? "Your account is now active."
      : "Your password has been updated."
    : isVerifyFlow
      ? "Enter the 6-digit code sent to your email"
      : "Enter the OTP sent to your email and set a new password";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <AnimatePresence mode="wait">
        {/* Success State */}
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 text-center lg:text-left"
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
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {isVerifyFlow
                ? "Your account is now verified and ready to use."
                : "You can now sign in with your new password."}
            </p>

            <motion.button
              onClick={() =>
                navigate(isVerifyFlow ? "/dashboard" : "/auth")
              }
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              {isVerifyFlow ? "Go to Dashboard" : "Sign In"}{" "}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          /* OTP + (optional) Password Form */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Email hint */}
            <div
              className={`px-3.5 py-2.5 rounded-xl ${
                isDark
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : "bg-blue-50 border border-blue-100"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              >
                Code sent to{" "}
                <span className="font-semibold">
                  {email || "your email"}
                </span>
              </p>
            </div>

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

            {/* OTP Boxes */}
            <div className="space-y-1.5">
              <label
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Verification Code
              </label>
              <div
                className="flex gap-2 justify-between"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-11 h-12 text-center text-lg font-bold border rounded-xl focus:outline-none focus:ring-2 transition-all caret-transparent ${
                      isDark
                        ? `bg-white/5 focus:bg-white/10 focus:ring-blue-500/30 focus:border-blue-500 text-white ${
                            digit
                              ? "border-blue-400/60 bg-blue-500/10 text-blue-300"
                              : "border-white/10"
                          } ${otpError ? "border-red-500/60" : ""}`
                        : `bg-gray-50 focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 ${
                            digit
                              ? "border-blue-400 bg-blue-50/50 text-blue-700"
                              : "border-gray-200"
                          } ${otpError ? "border-red-400" : ""}`
                    }`}
                  />
                ))}
              </div>
              {otpError && (
                <p
                  className={`text-xs ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  {otpError}
                </p>
              )}
            </div>

            {/* New Password Fields (reset-password flow only) */}
            {!isVerifyFlow && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3.5"
              >
                <div
                  className={`border-t pt-3.5 ${
                    isDark ? "border-white/10" : "border-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Set New Password
                  </p>

                  {/* New password */}
                  <div className="space-y-1.5 mb-3">
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      New Password
                    </label>
                    <div className="relative group">
                      <div
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                          isDark
                            ? "text-gray-500 group-focus-within:text-blue-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPassError("");
                        }}
                        placeholder="Create a strong password"
                        className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          isDark
                            ? `bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:ring-blue-500/30 focus:border-blue-500 ${
                                passError ? "border-red-500/60" : ""
                              }`
                            : `bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 ${
                                passError ? "border-red-400" : "border-gray-200"
                              }`
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                          isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passError && (
                      <p
                        className={`text-xs ${
                          isDark ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {passError}
                      </p>
                    )}
                    {/* Strength bar */}
                    {password && (
                      <div className="flex gap-1 pt-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= metCount
                                ? strengthColor[metCount]
                                : isDark
                                  ? "bg-white/10"
                                  : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Requirements checklist */}
                  {password && (
                    <div
                      className={`rounded-xl p-3 space-y-1.5 mb-3 ${
                        isDark
                          ? "bg-white/5 border border-white/10"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      {requirements.map((req) => {
                        const met = req.test(password);
                        return (
                          <div
                            key={req.label}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                met
                                  ? "bg-teal-500"
                                  : isDark
                                    ? "bg-white/10"
                                    : "bg-gray-200"
                              }`}
                            >
                              {met && (
                                <Check
                                  className="w-2.5 h-2.5 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <span
                              className={`text-xs transition-colors ${
                                met
                                  ? isDark
                                    ? "text-gray-200"
                                    : "text-gray-700"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            >
                              {req.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                          isDark
                            ? "text-gray-500 group-focus-within:text-blue-400"
                            : "text-gray-400 group-focus-within:text-blue-500"
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConf ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => {
                          setConfirm(e.target.value);
                          setConfError("");
                        }}
                        placeholder="Re-enter new password"
                        className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          isDark
                            ? `bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:ring-blue-500/30 focus:border-blue-500 ${
                                confError ? "border-red-500/60" : ""
                              }`
                            : `bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 ${
                                confError
                                  ? "border-red-400"
                                  : "border-gray-200"
                              }`
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConf(!showConf)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                          isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {showConf ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {confError && (
                      <p
                        className={`text-xs ${
                          isDark ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {confError}
                      </p>
                    )}
                    {confirm && password && (
                      <p
                        className={`text-xs ${
                          confirm === password
                            ? "text-teal-500"
                            : isDark
                              ? "text-red-400"
                              : "text-red-500"
                        }`}
                      >
                        {confirm === password
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit button */}
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
                  {isVerifyFlow ? "Verify Email" : "Reset Password"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              {resendCooldown > 0 ? (
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Resend code in{" "}
                  <span
                    className={`font-semibold ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {resendCooldown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors flex items-center gap-1.5 mx-auto disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      resending ? "animate-spin" : ""
                    }`}
                  />
                  {resending ? "Sending..." : "Resend code"}
                </button>
              )}
            </div>

            <button
              onClick={() => navigate("/auth")}
              className={`flex items-center justify-center gap-1.5 text-sm transition-colors w-full ${
                isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default VerifyPage;
