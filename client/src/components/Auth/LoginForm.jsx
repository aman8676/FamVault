import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import { InputField } from "../../Pages/auth/AuthPage";

export const LoginForm = ({ onSwitch }) => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerErr("");
    setLoading(true);

    try {
      const res = await login(form.email, form.password);

      if (res.success) {
        navigate("/dashboard");
      } else {
        setServerErr(res.message);
      }
    } catch(err){
      setServerErr(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {serverErr && (
        <div
          className={`px-3.5 py-2.5 rounded-xl ${
            isDark
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-red-50 border border-red-100"
          }`}
        >
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
            {serverErr}
          </p>
        </div>
      )}

      <InputField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="you@example.com"
        icon={Mail}
        error={errors.email}
        isDark={isDark}
      />

      <InputField
        label="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Enter your password"
        icon={Lock}
        toggle
        showToggle={showPass}
        onToggle={() => setShowPass(!showPass)}
        error={errors.password}
        isDark={isDark}
      />

      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-3.5 h-3.5 accent-blue-500 rounded"
          />
          <span
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Remember me
          </span>
        </label>
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
        >
          Forgot password?
        </button>
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
            Sign In <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      <p
        className={`text-center text-sm pt-1 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};
