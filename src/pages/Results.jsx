// src/pages/Results.jsx

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRecommendedProducts, fetchLatestRecommendation } from '../utils/api/recommender';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import RecommendationHeader from '../components/core/RecommendationHeader'; // <-- Import the new header
import SpecDrawer from '../components/layout/SpecDrawer';                 // <-- Import the new drawer content
import { Bars3Icon, InformationCircleIcon } from '@heroicons/react/24/solid';

export default function Results() {
    const queryClient = useQueryClient();
    const location = useLocation();

    // State management remains the same
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [specLevel, setSpecLevel] = useState('recommended');
    const [maxPrice, setMaxPrice] = useState('');
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedMaxPrice(maxPrice); }, 500);
        return () => clearTimeout(handler);
    }, [maxPrice]);

    // Spec fetching logic remains the same
    const navStateSpecData = location.state?.specData;
    const cachedSpecData = queryClient.getQueryData(['generatedSpecs']);
    const { data: fetchedSpecData, isLoading: isLoadingSpecs } = useQuery({
        queryKey: ['latestRecommendation'],
        queryFn: fetchLatestRecommendation,
        enabled: !navStateSpecData && !cachedSpecData,
    });
    const specData = navStateSpecData || cachedSpecData || fetchedSpecData;

    // Product fetching logic remains the same
    const { data: productData, isLoading: isLoadingProducts, isError, error } = useQuery({
        queryKey: ['recommendedProducts', specData?.id, specLevel, debouncedMaxPrice],
        queryFn: () => fetchRecommendedProducts({ spec_level: specLevel, max_price: debouncedMaxPrice }),
        enabled: !!specData,
    });

    if (isLoadingSpecs) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg">Analyzing your needs...</p>
                </div>
            </div>
        );
    }

    if (!specData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center card bg-base-100 p-10 shadow-xl">
                    <h2 className="text-2xl font-bold">No Recommendation Found</h2>
                    <p className="mt-2">We couldn't find a recommendation for your session.</p>
                    <div className="mt-6">
                        <Link to="/" className="btn btn-primary">Start a New Recommendation</Link>
                    </div>
                </div>
            </div>
        );
    }

    const products = productData?.results || [];

    return (
        <div className="drawer">
            <input id="spec-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-base-100">

                {/* --- Main Page Content --- */}
                <main className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
                    
                    {/* 1. The NEW Recommendation Header - (Hidden on mobile) */}
                    <div className="hidden lg:block">
                        <RecommendationHeader specData={specData} />
                    </div>

                    {/* Mobile-only button to open drawer */}
                     <div className="lg:hidden text-center">
                        <label htmlFor="spec-drawer" className="btn btn-primary drawer-button">
                           <InformationCircleIcon className="w-6 h-6"/> View Your Recommended Specs
                        </label>
                    </div>

                    {/* 2. Filter & Search Section */}
                    <div className="card bg-base-200/50 shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="form-control w-full sm:w-auto flex-grow">
                                <label className="label py-1"><span className="label-text font-semibold">Show products matching:</span></label>
                                <div className="join w-full">
                                    <button className={`join-item btn flex-1 ${specLevel === 'recommended' ? 'btn-active btn-primary' : ''}`} onClick={() => setSpecLevel('recommended')}>
                                        Recommended
                                    </button>
                                    <button className={`join-item btn flex-1 ${specLevel === 'minimum' ? 'btn-active btn-primary' : ''}`} onClick={() => setSpecLevel('minimum')}>
                                        Minimum
                                    </button>
                                </div>
                            </div>
                            <div className="form-control w-full sm:w-auto">
                                <label className="label py-1"><span className="label-text font-semibold">Max Budget (TSh)</span></label>
                                <input type="number" placeholder="e.g., 2500000" className="input input-bordered w-full sm:w-48" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Product Display Area */}
                    <div>
                        <h2 className="text-2xl font-bold">Matching Products ({productData?.count || 0})</h2>
                        {isLoadingProducts ? (
                            <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
                        ) : isError ? (
                            <div role="alert" className="alert alert-error mt-4">
                                <span>Error fetching products: {error.message}. Please try again.</span>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} onViewDetails={() => setSelectedProductId(product.id)} />
                                ))}
                            </div>
                        ) : (
                            <div className="card bg-base-200 mt-6">
                                <div className="card-body items-center text-center p-10">
                                    <span className="text-6xl">😞</span>
                                    <h2 className="card-title text-2xl mt-4">No Products Found</h2>
                                    <p>No available products match the current filters. <br/> Try adjusting your budget or selecting a different spec level.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

            </div>
            {/* --- The Drawer for Mobile --- */}
            <div className="drawer-side z-50">
                <label htmlFor="spec-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <SpecDrawer specData={specData} />
            </div>

            {/* Modal for viewing product details */}
            {selectedProductId && (
                <ProductDetailModal productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
            )}
        </div>
    );
}