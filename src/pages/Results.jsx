// src/pages/Results.jsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLatestRecommendation, fetchRecommendedProducts } from '../utils/api/recommender';
import { Link, useLocation } from 'react-router-dom';

import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { SparklesIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const SpecCard = ({ title, description, icon, specs, isActive, onClick }) => (
    <div
        className={`card bg-base-100 shadow-lg transition-all cursor-pointer hover:shadow-2xl ${isActive ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'}`}
        onClick={onClick}
    >
        <div className="card-body">
            <div className="flex gap-4 items-center">
                {icon}
                <div>
                    <h2 className="card-title text-xl">{title}</h2>
                    <p className="text-sm text-base-content/60">{description}</p>
                </div>
            </div>
            <ul className="mt-4 space-y-2 text-xs">
                <li className="flex justify-between"><span>CPU:</span> <strong className="font-mono text-right">{specs.cpu}</strong></li>
                <li className="flex justify-between"><span>GPU:</span> <strong className="font-mono text-right">{specs.gpu}</strong></li>
                <li className="flex justify-between"><span>RAM:</span> <strong className="font-mono text-right">{specs.ram_gb} GB</strong></li>
                <li className="flex justify-between"><span>Storage:</span> <strong className="font-mono text-right">{specs.storage_gb} GB</strong></li>
            </ul>
        </div>
    </div>
);

const ProductGrid = ({ specLevel, specData }) => {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const { data: productData, isLoading, isError } = useQuery({
        queryKey: ['recommendedProducts', specData.id, specLevel],
        queryFn: () => fetchRecommendedProducts({ spec_level: specLevel }),
        enabled: !!specData,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (isError) {
        return <div className="alert alert-error">Could not load products. Please try again.</div>;
    }

    const products = productData?.results || [];

    return (
        <>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onViewDetails={() => setSelectedProductId(product.id)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-base-200 rounded-lg">
                    <p className="font-semibold text-lg">No Matching Products Found</p>
                    <p className="text-base-content/70 mt-1">There are no products in our inventory for this spec level.</p>
                </div>
            )}

            {selectedProductId && (
                <ProductDetailModal productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
            )}
        </>
    );
};

export default function Results() {
    const location = useLocation();
    const [activeSpec, setActiveSpec] = useState('recommended');

    const { data: specData, isLoading: isLoadingSpecs, isError } = useQuery({
        queryKey: ['latestRecommendation'],
        queryFn: fetchLatestRecommendation,
        initialData: location.state?.specData || undefined,
    });

    if (isLoadingSpecs) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-200">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg">Generating Your Custom PC Blueprint...</p>
                </div>
            </div>
        );
    }

    if (isError || !specData) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-200">
                <div className="text-center card bg-base-100 p-10 shadow-xl">
                    <h2 className="text-2xl font-bold">No Recommendation Found</h2>
                    <p className="mt-2 text-base-content/80">We couldn't find a recommendation for your session.</p>
                    <Link to="/" className="btn btn-primary mt-6">Start a New Recommendation</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8">
                {/* Header Section */}
                <header className="text-center mb-12">
                    <SparklesIcon className="w-12 h-12 text-primary mx-auto" />
                    <h1 className="text-4xl md:text-5xl font-extrabold mt-2">Your PC Blueprint</h1>
                    <p className="text-lg text-base-content/70 mt-3 max-w-2xl mx-auto">{specData.note}</p>
                </header>

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                    {/* --- Left Column (Sticky Sidebar) --- */}
                    <aside className="lg:col-span-1 xl:col-span-1 lg:sticky lg:top-8 space-y-6 self-start">
                        <h2 className="text-xl font-bold text-center lg:text-left">Select a Performance Tier</h2>
                        <SpecCard
                            title="Recommended"
                            description="Best performance & value"
                            icon={<ShieldCheckIcon className="w-8 h-8 text-primary" />}
                            specs={specData.recommended_specs}
                            isActive={activeSpec === 'recommended'}
                            onClick={() => setActiveSpec('recommended')}
                        />
                        <SpecCard
                            title="Minimum (Budget)"
                            description="For essential tasks"
                            icon={<ShieldExclamationIcon className="w-8 h-8 text-warning" />}
                            specs={specData.minimum_specs}
                            isActive={activeSpec === 'minimum'}
                            onClick={() => setActiveSpec('minimum')}
                        />
                    </aside>

                    {/* --- Right Column (Scrollable Products) --- */}
                    <section className="lg:col-span-2 xl:col-span-3">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">
                                Matching Products for <span className="text-primary capitalize">{activeSpec}</span> Specs
                            </h2>
                            <ProductGrid specLevel={activeSpec} specData={specData} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}