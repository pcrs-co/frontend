// src/components/layout/VendorLayout.jsx
import { Outlet } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';
import { useAuth } from '../../utils/hooks/useAuth';

export default function VendorLayout() {
    const { user, isLoading } = useAuth();
    
    // This provides a better loading experience
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // You can add a check here to redirect if user is not a vendor
    if (!user?.vendor_profile) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-error">Access Denied</h1>
                <p>You do not have a vendor profile associated with your account.</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-base-300">
            <VendorSidebar />
            <main className="flex-1 p-6">
                <Outlet /> {/* Child routes will be rendered here */}
            </main>
        </div>
    );
}