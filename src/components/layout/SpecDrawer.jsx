// src/components/layout/SpecDrawer.jsx

import React from 'react';
import RecommendationHeader from '../core/RecommendationHeader'; // We can reuse the header!

export default function SpecDrawer({ specData }) {
    return (
        <div className="p-4 bg-base-200 h-full overflow-y-auto">
            <RecommendationHeader specData={specData} />
        </div>
    );
}