import { createContext, useContext, useState } from "react";
import api from "../config/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [authStep, setAuthStep] = useState("login");

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      setEmail(res.data.user.email);
      setAuthStep("verify-email");
     
    }

    return res.data; 
  };

  const login = async (emailInput, password) => {
    const res = await api.post("/auth/login", { email: emailInput, password });
    if (res.data.success) {
      setEmail(emailInput);
    } else {
      throw new Error(res.data.message || "Invalid email or password");
    }
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setToken(null);
    setEmail("");
    setAuthStep("login");
  };

  const verifyAccount = async (otp) => {
    const res = await api.post("/auth/verify-account", { otp });
    return res.data;
  };

  const sendResetOtp = async (emailInput) => {
    const res = await api.post("/auth/send-reset-otp", { email: emailInput });
    if (res.data.success) {
      setEmail(emailInput);
      setAuthStep("reset-password");
    }
    return res.data;
  };

  const value = {
    user,
    setUser,
    token,
    email,
    authStep,
    setAuthStep,
    register,
    login,
    logout,
    verifyAccount,
    sendResetOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
