// src/components/layout/SpecSidebar.jsx

import React from 'react';
import SpecDisplay from './SpecDisplay';
import { Link } from 'react-router-dom';

export default function SpecSidebar({ specData, note }) {
    return (
        <div className="bg-base-200 h-full p-4 space-y-6 overflow-y-auto">
            <div className="text-center">
                <Link to="/" className="inline-block">
                    <img src="/PCRS.svg" alt="PCRS Logo" className="h-6 mx-auto" />
                </Link>
                <h2 className="text-xl font-bold mt-2">Your Blueprint</h2>
            </div>

            {note && (
                <div role="alert" className="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{note}</span>
                </div>
            )}

            <SpecDisplay
                title="Recommended Specs"
                specs={specData.recommended_specs}
                badgeText="Best Experience"
                badgeClass="badge-secondary"
            />

            <SpecDisplay
                title="Minimum Specs"
                specs={specData.minimum_specs}
                badgeText="Budget Friendly"
                badgeClass="badge-ghost"
            />

            <div className="text-center pt-4">
                <Link to="/" className="btn btn-outline btn-primary w-full">
                    Start a New Recommendation
                </Link>
            </div>
        </div>
    );
}