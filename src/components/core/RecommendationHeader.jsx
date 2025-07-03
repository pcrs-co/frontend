// src/components/core/RecommendationHeader.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { CpuChipIcon, ComputerDesktopIcon, CircleStackIcon, DeviceTabletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const SpecColumn = ({ title, specs, badgeText, badgeClass }) => (
    <div className="flex-1 p-4 rounded-lg bg-base-200">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{title}</h3>
            {badgeText && <div className={`badge ${badgeClass} badge-sm`}>{badgeText}</div>}
        </div>
        <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><CpuChipIcon className="w-5 h-5 text-primary" />{specs?.cpu || 'N/A'}</li>
            <li className="flex items-center gap-2"><ComputerDesktopIcon className="w-5 h-5 text-primary" />{specs?.gpu || 'N/A'}</li>
            <li className="flex items-center gap-2"><DeviceTabletIcon className="w-5 h-5 text-primary" />{specs?.ram_gb ? `${specs.ram_gb} GB RAM` : 'N/A'}</li>
            <li className="flex items-center gap-2"><CircleStackIcon className="w-5 h-5 text-primary" />{specs?.storage_gb ? `${specs.storage_gb} GB ${specs.storage_type}` : 'N/A'}</li>
        </ul>
    </div>
);


export default function RecommendationHeader({ specData }) {
    if (!specData) return null;

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="card-title text-2xl">Your AI-Generated Blueprint</h2>
                        <p className="text-base-content/70">{specData.note}</p>
                    </div>
                    <Link to="/" className="btn btn-outline btn-primary btn-sm md:btn-md">
                        <ArrowPathIcon className="w-4 h-4" />
                        Refine Recommendation
                    </Link>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                    <SpecColumn 
                        title="Recommended"
                        specs={specData.recommended_specs}
                        badgeText="Best Experience"
                        badgeClass="badge-secondary"
                    />
                    <SpecColumn 
                        title="Minimum"
                        specs={specData.minimum_specs}
                        badgeText="Budget Friendly"
                        badgeClass="badge-ghost"
                    />
                </div>
            </div>
        </div>
    );
}