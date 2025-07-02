// src/pages/Results.jsx

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom'; // <-- 1. IMPORT useLocation
import { fetchRecommendedProducts, fetchLatestRecommendation } from '../utils/api/recommender';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';

// This is a new, reusable sidebar component for the results page.
const SpecSidebarDisplay = ({ spec, title, isRecommended = false }) => {
    if (!spec || !spec.cpu) return null;
    return (
        <div className={`p-4 rounded-lg ${isRecommended ? 'bg-primary/10 border border-primary/20' : 'bg-base-300/50'}`}>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="space-y-1 text-sm">
                <p><strong>CPU:</strong> {spec.cpu}</p>
                <p><strong>GPU:</strong> {spec.gpu}</p>
                <p><strong>RAM:</strong> {spec.ram_gb} GB</p>
                <p><strong>Storage:</strong> {spec.storage_gb} GB {spec.storage_type}</p>
            </div>
        </div>
    );
};


export default function Results() {
    const queryClient = useQueryClient();
    const location = useLocation(); // <-- 2. GET THE CURRENT LOCATION OBJECT

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [specLevel, setSpecLevel] = useState('recommended');
    const [maxPrice, setMaxPrice] = useState('');
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedMaxPrice(maxPrice);
        }, 500);
        return () => clearTimeout(handler);
    }, [maxPrice]);

    // --- 3. THE CRITICAL LOGIC UPDATE ---
    // Prioritize spec data in this order:
    // 1. Data passed directly from another page (e.g., history)
    // 2. Data cached from the main recommender form submission
    // 3. Fetch the latest recommendation as a fallback (for page reloads)
    const passedSpecData = location.state?.specData;
    const cachedSpecData = queryClient.getQueryData(['generatedSpecs']);

    const { data: fetchedSpecData, isLoading: isLoadingSpecs } = useQuery({
        queryKey: ['latestRecommendation'],
        queryFn: fetchLatestRecommendation,
        enabled: !passedSpecData && !cachedSpecData, // Only fetch if the other two don't exist
    });

    // This line now correctly prioritizes the data source.
    const specData = passedSpecData || cachedSpecData || fetchedSpecData;

    const { data: productData, isLoading, isError } = useQuery({
        queryKey: ['recommendedProducts', specData?.id, specLevel, debouncedMaxPrice], // Add spec ID to key
        queryFn: () => fetchRecommendedProducts({ spec_level: specLevel, max_price: debouncedMaxPrice }),
        enabled: !!specData,
    });

    if (isLoadingSpecs && !specData) {
        return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
    }

    if (!specData) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">No Recommendation Found</h2>
                <p className="mt-2">We couldn't find any recommendation data for your session.</p>
                <div className="mt-4">
                    <Link to="/" className="btn btn-primary">Start a New Recommendation</Link>
                </div>
            </div>
        );
    }

    const products = productData?.results || [];

    return (
        <div className="drawer lg:drawer-open">
            <input id="results-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-4 md:p-6 bg-base-200">
                <div className="text-center p-4">
                    <h1 className="text-3xl font-bold">Your Custom PC Blueprint</h1>
                    <p className="text-base-content/70 mt-2">We've found products matching your specifications.</p>
                </div>

                <div className="card bg-base-100 shadow-md p-4 my-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                        <label className="label font-semibold">Match Type</label>
                        <div className="join w-full">
                            <button
                                className={`join-item btn btn-sm flex-1 ${specLevel === 'recommended' ? 'btn-active btn-primary' : ''}`}
                                onClick={() => setSpecLevel('recommended')}
                            >
                                Recommended
                            </button>
                            <button
                                className={`join-item btn btn-sm flex-1 ${specLevel === 'minimum' ? 'btn-active btn-primary' : ''}`}
                                onClick={() => setSpecLevel('minimum')}
                            >
                                Minimum (Budget)
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full md:w-auto">
                        <label className="label font-semibold">Max Budget (TSh)</label>
                        <input
                            type="number"
                            placeholder="e.g., 2500000"
                            className="input input-bordered w-full input-sm"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading && <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>}
                {!isLoading && (
                    <>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onViewDetails={() => setSelectedProductId(product.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="card bg-base-100 shadow-xl mt-6">
                                <div className="card-body items-center text-center">
                                    <span className="text-5xl">😞</span>
                                    <h2 className="card-title text-2xl mt-4">No Products Found</h2>
                                    <p>Try adjusting your filters or increasing your budget.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {isError && <div className="alert alert-error shadow-lg"><span>Error fetching products. Please try again.</span></div>}
            </div>

            <aside className="drawer-side" style={{ scrollbarWidth: 'none' }}>
                <label htmlFor="results-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="p-4 w-80 min-h-full bg-base-200 text-base-content space-y-4">
                    <h2 className="text-2xl font-bold p-2">Your Specifications</h2>
                    <p className="text-sm px-2 text-base-content/70">{specData.note}</p>
                    <SpecSidebarDisplay spec={specData.recommended_specs} title="Recommended" isRecommended={true} />
                    <SpecSidebarDisplay spec={specData.minimum_specs} title="Minimum" />
                </div>
            </aside>

            {selectedProductId && <ProductDetailModal productId={selectedProductId} onClose={() => setSelectedProductId(null)} />}
        </div>
    );
}