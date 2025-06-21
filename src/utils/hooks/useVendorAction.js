// src/utils/hooks/useVendorAction.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as vendorApi from "../api/vendors"; // Import all functions

export const useVendorAction = () => {
    const navigate = useNavigate();

    // State for the CREATE action
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    // State for the UPDATE action
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // State for the DELETE action
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // --- CREATE VENDOR ---
    const createVendor = async (formData, { onSuccess, onError } = {}) => {
        setIsCreating(true);
        setCreateError(null);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const newVendor = await vendorApi.createVendor(formDataToSend);
            setIsCreating(false);
            if (onSuccess) onSuccess(newVendor); // Call success callback
            return newVendor;
        } catch (err) {
            const errorData = err.response?.data || { message: err.message };
            setCreateError(errorData);
            setIsCreating(false);
            if (onError) onError(errorData); // Call error callback
            throw err; // Re-throw for component-level handling if needed
        }
    };

    // --- UPDATE VENDOR ---
    const updateVendor = async (vendorId, formData, { onSuccess, onError } = {}) => {
        setIsUpdating(true);
        setUpdateError(null);

        // NOTE: For updates, you might not always send FormData.
        // Let's assume JSON for simplicity here, but adjust if you allow file updates.
        try {
            const updatedVendor = await vendorApi.updateVendor(vendorId, formData);
            setIsUpdating(false);
            if (onSuccess) onSuccess(updatedVendor);
            return updatedVendor;
        } catch (err) {
            const errorData = err.response?.data || { message: err.message };
            setUpdateError(errorData);
            setIsUpdating(false);
            if (onError) onError(errorData);
            throw err;
        }
    };

    // --- DELETE VENDOR ---
    const deleteVendor = async (vendorId, { onSuccess, onError } = {}) => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await vendorApi.deleteVendor(vendorId);
            setIsDeleting(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            const errorData = err.response?.data || { message: err.message };
            setDeleteError(errorData);
            setIsDeleting(false);
            if (onError) onError(errorData);
            throw err;
        }
    };

    return {
        createVendor,
        isCreating,
        createError,
        updateVendor,
        isUpdating,
        updateError,
        deleteVendor,
        isDeleting,
        deleteError,
    };
};