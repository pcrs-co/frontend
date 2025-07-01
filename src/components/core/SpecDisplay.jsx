// src/components/core/SpecDisplay.jsx

import React from 'react';
import { CpuChipIcon, ComputerDesktopIcon, CircleStackIcon, DeviceTabletIcon } from '@heroicons/react/24/outline';

const SpecItem = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 text-primary">{icon}</div>
            <div>
                <p className="font-semibold text-base-content">{label}</p>
                <p className="text-sm text-base-content/70 -mt-1">{value}</p>
            </div>
        </div>
    );
};

export default function SpecDisplay({ title, specs, badgeText, badgeClass }) {
    if (!specs || !specs.cpu) {
        return (
            <div className="p-4 border border-dashed rounded-lg text-center text-base-content/60">
                <p>{title} specs not available.</p>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow">
            <div className="card-body p-5">
                <div className="flex justify-between items-center">
                    <h3 className="card-title text-lg">{title}</h3>
                    {badgeText && <div className={`badge ${badgeClass}`}>{badgeText}</div>}
                </div>
                <div className="divider my-2"></div>
                <div className="space-y-4">
                    <SpecItem icon={<CpuChipIcon />} label="Processor (CPU)" value={specs.cpu} />
                    <SpecItem icon={<ComputerDesktopIcon />} label="Graphics (GPU)" value={specs.gpu} />
                    <SpecItem icon={<DeviceTabletIcon />} label="Memory (RAM)" value={`${specs.ram_gb} GB`} />
                    <SpecItem icon={<CircleStackIcon />} label="Storage" value={`${specs.storage_gb} GB ${specs.storage_type}`} />
                </div>
            </div>
        </div>
    );
}