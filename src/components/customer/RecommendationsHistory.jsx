// src/pages/customer/components/RecommendationsHistory.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUserRecommendationHistory } from '../../utils/api/recommender'; // Adjust the import path as needed
import { format } from 'date-fns';

export default function RecommendationsHistory() {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['userRecommendationHistory'],
        queryFn: fetchUserRecommendationHistory,
    });

    if (isLoading) return <div className="flex justify-center p-4"><span className="loading loading-dots loading-md"></span></div>;

    const recommendations = data?.results || data || [];

    if (recommendations.length === 0) {
        return <div className="text-center py-8 text-base-content/70">You don't have any past recommendations.</div>;
    }

    return (
        <div className="space-y-4">
            {recommendations.map(rec => (
                <div key={rec.id} className="card card-compact bg-base-300/50 shadow">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="card-title text-base">Recommendation from {format(new Date(rec.created_at), 'dd MMM, yyyy')}</h3>
                                <p className="text-xs text-base-content/70">For: {rec.activities.join(', ')}</p>
                            </div>
                            <button
                                onClick={() => navigate('/results', { state: { specData: rec } })}
                                className="btn btn-sm btn-outline btn-secondary"
                            >
                                View Products
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}