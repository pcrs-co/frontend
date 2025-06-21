// src/utils/hooks/useVendors.js
import { useEffect, useState } from "react";
import * as vendorApi from "../api/vendors";

export const useVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const response = await vendorApi.getVendors();
            const data = Array.isArray(response) ? response : response.results; // ✅ this line
            setVendors(data);
        } catch (error) {
            console.error("Error fetching vendors", error);
        } finally {
            setLoading(false);
        }
    };

    const removeVendor = async (id) => {
        await vendorApi.deleteVendor(id);
        await fetchVendors();
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    return {
        vendors,
        loading,
        fetchVendors,
        removeVendor,
        ...vendorApi, // includes createVendor, updateVendor, getVendor
    };
};
