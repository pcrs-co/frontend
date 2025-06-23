// src/pages/admin/benchmarks/GpuBenchmarksPage.jsx
import React, { useState } from 'react';
import { useAdminResourceList } from '../../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../../utils/hooks/useAdminResourceActions';
import { useAdminFileUpload } from '../../../utils/hooks/useAdminFileUpload';

const GpuBenchmarksPage = () => {
    const resourceName = 'gpu-benchmarks'; // The only change!
    const [fileToUpload, setFileToUpload] = useState(null);

    const { data: benchmarks, isLoading } = useAdminResourceList(resourceName);
    const { deleteItem, isPending: isDeleting } = useAdminResourceActions(resourceName);
    const { mutate: uploadFile, isPending: isUploading } = useAdminFileUpload(resourceName);

    const handleFileChange = (e) => setFileToUpload(e.target.files[0]);

    const handleUpload = () => {
        if (fileToUpload) uploadFile(fileToUpload);
        else alert('Please select a file.');
    };

    if (isLoading) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manage GPU Benchmarks</h1>

            {/* File Upload Section */}
            <div className="p-4 bg-base-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Upload Benchmark File</h2>
                <div className="flex items-center gap-4">
                    <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" />
                    <button onClick={handleUpload} className="btn btn-primary" disabled={isUploading || !fileToUpload}>
                        {isUploading ? <span className="loading loading-spinner"></span> : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* ... Table structure identical to CPU page ... */}
                    <tbody>
                        {benchmarks?.map((gpu) => (
                            <tr key={gpu.id} className="hover">
                                <td className="font-medium">{gpu.name}</td>
                                <td>{gpu.benchmark_score}</td>
                                <td className="text-right">
                                    <button onClick={() => deleteItem(gpu.id)} className="btn btn-sm btn-error" disabled={isDeleting}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GpuBenchmarksPage;