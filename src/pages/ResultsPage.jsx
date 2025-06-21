// src/pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { laptops as allLaptops } from '../data/mockData.js';
import ProductCard from '../components/products/ProductCard';

export default function ResultsPage() {
  const { state } = useLocation(); // Gets the form data passed from the previous page
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!state || !state.purpose) {
      // If someone lands here directly, send them back
      navigate('/');
      return;
    }

    // --- OUR "AI" LOGIC ---
    let filtered = allLaptops.filter(laptop => laptop.usage === state.purpose);

    // Filter by budget
    const budgetLevel = parseInt(state.budget, 10); // The slider is 0-100
    if (budgetLevel < 33) { // "Budget"
      filtered = filtered.filter(l => l.price < 1200);
    } else if (budgetLevel >= 33 && budgetLevel < 66) { // "Balanced"
      filtered = filtered.filter(l => l.price >= 1000 && l.price < 2000);
    } else { // "Performance"
      filtered = filtered.filter(l => l.price >= 1800);
    }

    setRecommendations(filtered);
  }, [state, navigate]);

  if (!state) return null; // Avoid rendering before redirect

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Your Personalized Recommendations</h1>
        <p className="text-lg mt-2">Based on your need for <span className="font-bold text-primary capitalize">{state.purpose}</span> use.</p>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map(laptop => (
            <ProductCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-box">
          <h2 className="text-2xl font-semibold">No exact matches found!</h2>
          <p className="mt-2">We're expanding our catalog. Try adjusting your search.</p>
        </div>
      )}

      <div className="text-center mt-12">
        <button onClick={() => navigate('/')} className="btn btn-outline">
          Start a New Search
        </button>
      </div>
    </div>
  );
}
