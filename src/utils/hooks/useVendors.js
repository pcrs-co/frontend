// src/utils/hooks/useVendors.js (The Query Hook)
import { useEffect, useState } from "react";
import * as vendorApi from "../api/vendors";

export const useVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVendors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendorApi.getVendors();
            // This check for paginated vs non-paginated response is smart.
            const data = Array.isArray(response) ? response : response.results;
            setVendors(data);
        } catch (err) {
            console.error("Error fetching vendors", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // This hook is now focused only on the list
    return { vendors, loading, error, refetch: fetchVendors };
};