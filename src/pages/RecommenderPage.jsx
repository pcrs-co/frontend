import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    submitUserPreferences,
    generateAndFetchSpecs,
    fetchRecommendedProducts,
} from '../utils/api/recommender';

import ProductCard from '../components/products/ProductCard'; // We assume this component exists and is styled

// A SpecDisplay component using daisyUI's card component
const SpecDisplay = ({ title, specs }) => (
    <div className="card bg-base-200 shadow-md">
        <div className="card-body">
            <h3 className="card-title">{title} Specifications</h3>
            <div className="divider my-1"></div>
            <ul className="space-y-2 text-sm">
                <li><span className="font-semibold w-24 inline-block">CPU:</span> {specs?.cpu || 'Not specified'}</li>
                <li><span className="font-semibold w-24 inline-block">GPU:</span> {specs?.gpu || 'Not specified'}</li>
                <li><span className="font-semibold w-24 inline-block">RAM:</span> {specs?.ram ? `${specs.ram} GB` : 'Not specified'}</li>
                <li><span className="font-semibold w-24 inline-block">Storage:</span> {specs?.storage ? `${specs.storage} GB` : 'Not specified'}</li>
            </ul>
        </div>
    </div>
);


const RecommenderPage = () => {
    // State to manage the user's journey through the steps
    const [step, setStep] = useState(1); // 1: Form, 2: Specs, 3: Products

    // State for the form inputs
    const [mainActivity, setMainActivity] = useState('');
    const [otherActivities, setOtherActivities] = useState('');
    const [mainApp, setMainApp] = useState('');
    const [otherApps, setOtherApps] = useState('');

    // --- React Query Mutations and Queries ---

    const { mutate: getSpecs, isPending: isGeneratingSpecs, data: specData } = useMutation({
        mutationFn: generateAndFetchSpecs,
        onSuccess: () => setStep(2), // Move to the spec display step
        onError: (error) => alert(`Error generating specs: ${error.response?.data?.error || error.message}`),
    });

    const { mutate: submitPrefs, isPending: isSubmittingPrefs } = useMutation({
        mutationFn: submitUserPreferences,
        onSuccess: () => getSpecs(), // After preferences are saved, trigger spec generation
        onError: (error) => alert(`Error submitting preferences: ${error.response?.data?.error || error.message}`),
    });

    const { data: productData, isLoading: isLoadingProducts, isError: isProductError } = useQuery({
        queryKey: ['recommendedProducts'],
        queryFn: fetchRecommendedProducts,
        enabled: step === 3, // Only run this query when the user clicks the button for step 3
        retry: 1,
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const allActivities = [mainActivity, ...otherActivities.split(',')].filter(Boolean).map(s => s.trim());
        const allApps = [mainApp, ...otherApps.split(',')].filter(Boolean).map(s => s.trim());

        if (allActivities.length === 0 || allApps.length === 0) {
            alert('Please provide at least one activity and one application.');
            return;
        }

        submitPrefs({ activities: allActivities, applications: allApps });
    };

    const handleGetProductsClick = () => setStep(3);
    const isLoading = isSubmittingPrefs || isGeneratingSpecs;

    // --- RENDER LOGIC with daisyUI ---

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect PC</h1>
                <p className="py-6 text-lg">Just tell us what you'll be doing, and we'll handle the rest.</p>
            </div>

            {/* DaisyUI Steps component to visualize progress */}
            <ul className="steps w-full mb-12">
                <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Your Needs</li>
                <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Specifications</li>
                <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Products</li>
            </ul>

            {/* STEP 1: THE FORM */}
            {step === 1 && (
                <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl">
                    <form onSubmit={handleFormSubmit} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">What is your main activity?</span></label>
                            <input type="text" value={mainActivity} onChange={e => setMainActivity(e.target.value)} required className="input input-bordered w-full" placeholder="e.g., Gaming" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Any other activities? (comma-separated)</span></label>
                            <input type="text" value={otherActivities} onChange={e => setOtherActivities(e.target.value)} className="input input-bordered w-full" placeholder="e.g., Video Editing, Streaming" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">What is the main application you use?</span></label>
                            <input type="text" value={mainApp} onChange={e => setMainApp(e.target.value)} required className="input input-bordered w-full" placeholder="e.g., Cyberpunk 2077" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Any other applications? (comma-separated)</span></label>
                            <input type="text" value={otherApps} onChange={e => setOtherApps(e.target.value)} className="input input-bordered w-full" placeholder="e.g., Adobe Premiere Pro, Blender" />
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" disabled={isLoading} className={`btn btn-primary ${isLoading ? 'loading' : ''}`}>
                                {isLoading ? 'Analyzing...' : 'Generate Specifications'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: DISPLAY SPECS */}
            {step === 2 && specData && (
                <div className="card max-w-4xl mx-auto bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-3xl">Your Custom Specifications</h2>
                        <p className="text-base-content/70 mt-2 mb-6">{specData.note}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <SpecDisplay title="Minimum" specs={specData.minimum_specs} />
                            <SpecDisplay title="Recommended" specs={specData.recommended_specs} />
                        </div>
                        <div className="card-actions justify-end w-full mt-6">
                            <button onClick={handleGetProductsClick} className="btn btn-success w-full md:w-auto">
                                Find Matching Products
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: DISPLAY PRODUCTS */}
            {step === 3 && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-center">Matching Products For You</h2>
                    {isLoadingProducts && <div className="text-center"><button className="btn btn-ghost loading">Loading Products...</button></div>}
                    {isProductError && <div className="alert alert-error shadow-lg"><div><span>Error: Could not fetch products. Please try again later.</span></div></div>}
                    {productData && productData.results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productData.results.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {productData && productData.results.length === 0 && <div className="text-center text-lg p-8">No products found that match your specific requirements.</div>}
                </div>
            )}
        </main>
    );
};

export default RecommenderPage;