import { useState, useRef } from "react";
import {useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Check,
  ImagePlus,
} from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";
import {
  InputField,
  getStrength,
  strengthLabel,
  strengthColor,
} from "../../Pages/auth/AuthPage";

export const RegisterForm = ({ onSwitch }) => {
  const { register: registerUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [agreed, setAgreed] = useState(false);

  const strength = getStrength(form.password);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min. 8 characters";
    if (!form.confirm) e.confirm = "Please confirm password";
    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    if (!avatar) e.avatar = "Profile photo is required";
    if (!agreed) e.agreed = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setServerErr("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("avatar", avatar);

      const res = await registerUser(formData);

      console.log("API Response:", res); // ← add this

      if (res.success) {
        navigate("/verify", { state: { flow: "verify-email" } });
      } else {
        setServerErr(res.message);
      }
    } catch (err){
      console.error("Error:", err); // ← and this
      setServerErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
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

      {/* Avatar Upload */}
      <div className="space-y-1.5">
        <label
          className={`text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Profile Photo
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`flex items-center gap-3 px-3.5 py-2.5 border rounded-xl cursor-pointer transition-colors ${
            isDark
              ? `bg-white/5 border-white/10 hover:bg-white/10 ${
                  errors.avatar ? "border-red-500/60" : ""
                }`
              : `hover:bg-gray-50 ${
                  errors.avatar ? "border-red-400" : "border-gray-200"
                }`
          }`}
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className={`w-9 h-9 rounded-full object-cover border ${
                isDark ? "border-white/20" : "border-gray-200"
              }`}
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isDark
                  ? "bg-white/10 border border-white/10"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              <ImagePlus
                className={`w-4 h-4 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
          )}
          <span
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {avatar ? avatar.name : "Upload profile photo"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        {errors.avatar && (
          <p className={`text-xs ${isDark ? "text-red-400" : "text-red-500"}`}>
            {errors.avatar}
          </p>
        )}
      </div>

      <InputField
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Jane Smith"
        icon={User}
        error={errors.name}
        isDark={isDark}
      />

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

      {/* Password with strength bar */}
      <div className="space-y-1.5">
        <InputField
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Min. 8 characters"
          icon={Lock}
          toggle
          showToggle={showPass}
          onToggle={() => setShowPass(!showPass)}
          error={errors.password}
          isDark={isDark}
        />
        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength
                      ? strengthColor[strength]
                      : isDark
                        ? "bg-white/10"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {strengthLabel[strength]} password
            </p>
          </div>
        )}
      </div>

      <InputField
        label="Confirm Password"
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        placeholder="Re-enter password"
        icon={Lock}
        toggle
        showToggle={showConfirm}
        onToggle={() => setShowConfirm(!showConfirm)}
        error={errors.confirm}
        isDark={isDark}
      />

      {/* Terms checkbox */}
      <div className="space-y-1">
        <label
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-2.5 cursor-pointer group"
        >
          <div
            className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              agreed
                ? "bg-blue-600 border-blue-600"
                : isDark
                  ? "border-gray-600 group-hover:border-blue-400"
                  : "border-gray-300 group-hover:border-blue-400"
            }`}
          >
            {agreed && (
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            )}
          </div>
          <span
            className={`text-sm leading-snug ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            I agree to the{" "}
            <span className="text-blue-500 font-medium">Terms of Service</span>{" "}
            and{" "}
            <span className="text-blue-500 font-medium">Privacy Policy</span>
          </span>
        </label>
        {errors.agreed && (
          <p
            className={`text-xs pl-6 ${
              isDark ? "text-red-400" : "text-red-500"
            }`}
          >
            {errors.agreed}
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
            Create Account <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      <p
        className={`text-center text-sm pt-1 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
