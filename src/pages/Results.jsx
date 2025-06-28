// src/pages/Results.jsx

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRecommendedProducts, fetchLatestRecommendation } from '../utils/api/recommender';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard'; // Assuming you have this styled component

const SpecSidebarDisplay = ({ title, specs, isRecommended = false }) => (
    <div className={`card shadow-md ${isRecommended ? 'bg-primary text-primary-content' : 'bg-base-300'}`}>
        <div className="card-body p-4">
            <h4 className="card-title text-lg">{title}</h4>
            <div className="divider my-1"></div>
            <ul className="space-y-1 text-sm">
                <li className="flex justify-between"><span>CPU:</span> <strong>{specs?.cpu || 'N/A'}</strong></li>
                <li className="flex justify-between"><span>GPU:</span> <strong>{specs?.gpu || 'N/A'}</strong></li>
                {/* ++ FIX: Match the backend serializer's output ++ */}
                <li className="flex justify-between"><span>RAM:</span> <strong>{specs?.ram_gb ? `${specs.ram_gb} GB` : 'N/A'}</strong></li>
                <li className="flex justify-between"><span>Storage:</span> <strong>{specs?.storage_gb ? `${specs.storage_gb} GB ${specs.storage_type}` : 'N/A'}</strong></li>
            </ul>
        </div>
    </div>
);

export default function Results() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // --- LOGIC CHANGE START ---
    // 1. Try to get specs instantly from the cache (from the previous page).
    const cachedSpecData = queryClient.getQueryData(['generatedSpecs']);

    // 2. If the cache is empty (e.g., page was reloaded), fetch the latest recommendation.
    const { data: fetchedSpecData, isLoading: isLoadingSpecs, isError: isErrorSpecs } = useQuery({
        queryKey: ['latestRecommendation'],
        queryFn: fetchLatestRecommendation,
        // ONLY run this query if the cached data does NOT exist.
        enabled: !cachedSpecData,
    });

    // 3. Determine the final spec data to display. Prioritize the fresh cache.
    const specData = cachedSpecData || fetchedSpecData;
    // --- LOGIC CHANGE END ---
    // This query will only run when `enabled` is true
    const { data: productData, isLoading, isError, refetch } = useQuery({
        queryKey: ['recommendedProducts'],
        queryFn: fetchRecommendedProducts,
        enabled: false, // Don't run on page load
        retry: 1,
    });

    if (!specData) {
        // This handles cases where the user navigates directly to /results
        return (
            <div className="hero min-h-[calc(100vh-200px)]">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-4xl font-bold">Let's Find Your PC!</h1>
                        <p className="py-6">It looks like you landed here directly. Please start from the homepage to get a personalized recommendation.</p>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const products = productData?.results || [];

    return (
        <div className="drawer lg:drawer-open">
            <input id="results-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-4 md:p-6 bg-base-200">
                {/* Main Content Area */}
                <div className="text-center p-4">
                    <h1 className="text-3xl font-bold">Your Custom PC Blueprint</h1>
                    <p className="text-base-content/70 mt-2">Based on your needs, we recommend the following hardware. Click below to find matching products.</p>
                </div>

                <div className="text-center my-6">
                    <button className="btn btn-success btn-lg" onClick={() => refetch()} disabled={isLoading}>
                        {isLoading ? <>
                            <span className="loading loading-spinner"></span>
                            Searching...
                        </> : 'Show Matching PCs'}
                    </button>
                </div>

                {/* Product Display Area */}
                {productData && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
                {productData && products.length === 0 && !isLoading && (
                    <div className="card bg-base-100 shadow-xl mt-6">
                        <div className="card-body items-center text-center">
                            <span className="text-5xl">😞</span>
                            <h2 className="card-title text-2xl mt-4">No Products Found In Stock</h2>
                            <p>We couldn't find any PCs in our current inventory that match your recommended specs. You can still use these specs to search elsewhere!</p>
                        </div>
                    </div>
                )}
                {isError && (
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Error fetching products. Please try again.</span>
                        </div>
                    </div>
                )}

            </div>
            <aside className="drawer-side" style={{ scrollbarWidth: 'none' }}>
                <label htmlFor="results-drawer" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 bg-base-300 text-base-content overflow-y-auto">
                    <h3 className="text-xl font-bold p-2">Your Specifications</h3>
                    <div className="divider mt-0"></div>
                    <div className="p-2 space-y-4">
                        <SpecSidebarDisplay title="Recommended" specs={specData.recommended_specs} isRecommended={true} />
                        <SpecSidebarDisplay title="Minimum" specs={specData.minimum_specs} />
                    </div>
                </div>
            </aside>
        </div>
    );
}