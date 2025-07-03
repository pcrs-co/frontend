// src/utils/api/vendors.js
import api from "../api";

// READ
export const getVendors = () => api.get("/admin/vendors/").then(res => res.data);
export const getVendor = (id) => api.get(`/admin/vendors/${id}/`).then(res => res.data);

// CREATE
export const createVendor = (data) => api.post("/admin/vendors/", data).then(res => res.data);

// UPDATE
export const updateVendor = (id, data) => api.put(`/admin/vendors/${id}/`, data).then(res => res.data);

// DELETE
export const deleteVendor = (id) => api.delete(`/admin/vendors/${id}/`).then(res => res.data);

// A vendor fetches THEIR OWN profile. No ID needed.
export const getVendorProfile = () => api.get(`/vendor/profile/`).then(res => res.data);

// A vendor updates THEIR OWN profile. No ID needed.
export const updateVendorProfile = (data) => api.put(`/vendor/profile/`, data).then(res => res.data);
