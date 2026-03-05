// hooks/useApi.js
// Single source of truth for all API calls

import api from "../config/axios";

// ── Auth ────────────────────────────────────────────────
export const getMe = () => api.get("/auth/me");

// ── Families ────────────────────────────────────────
export const getMyFamilies = () => api.get("/my-families");
export const getMyInvitations = () => api.get("/my-invitation");
export const verifyPin = (id, pin) => api.post(`/verify-pin/${id}`, { pin });
export const acceptInvitation = (id) => api.post(`/accept-invitation/${id}`);
export const rejectInvitation = (id) => api.post(`/reject-invitation/${id}`);
export const createFamily = (fd) => api.post("/create-family", fd);

// ── Family detail operations ────────────────────────
export const getFamilyDocuments = (familyId) => api.get(`/family-documents/${familyId}`);
export const inviteMember = (familyId, data) => api.post(`/send-invitation/${familyId}`, data);
export const removeMember = (familyId, memberId) => api.post(`/remove-member/${familyId}/${memberId}`);
export const leaveFamily = (familyId) => api.post(`/leave-family/${familyId}`);
export const updateFamilySettings = (familyId, data) => api.patch(`/settings/${familyId}`, data);
export const updateFamilyInfo = (familyId, fd) => api.patch(`/info/${familyId}`, fd);
export const updateFamilyPin = (familyId, data) => api.patch(`/pin/${familyId}`, data);
export const deleteFamilyApi = (familyId) => api.delete(`/delete/${familyId}`);
export const uploadFamilyDocument = (familyId, fd) => api.post(`/upload/${familyId}`, fd);

// ── Documents ───────────────────────────────────────
export const getMyDocuments = () => api.get("/my-documents");
export const uploadDocument = (fd) => api.post("/upload", fd);
export const viewDocument = (id) =>
  api.get(`/${id}`, { params: { action: "view" }, responseType: "blob" });
export const downloadDocument = (id) =>
  api.get(`/${id}`, { params: { action: "download" }, responseType: "blob" });
export const deleteDocument = (id) => api.delete(`/${id}`);
