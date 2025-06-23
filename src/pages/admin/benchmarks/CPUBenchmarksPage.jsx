import React, { useState } from 'react';
import { useAdminResourceList } from '../../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../../utils/hooks/useAdminResourceActions';
import { useAdminFileUpload } from '../../../utils/hooks/useAdminFileUpload'; // <-- Our new hook!

const CpuBenchmarksPage = () => {
    const resourceName = 'cpu-benchmarks';
    const [fileToUpload, setFileToUpload] = useState(null);

    // 1. Hook to get the list of benchmarks
    const { data: benchmarks, isLoading, isError, error } = useAdminResourceList(resourceName);

    // 2. Hook for standard actions like DELETE
    const { deleteItem, isPending: isDeleting } = useAdminResourceActions(resourceName);

    // 3. Hook for our custom FILE UPLOAD action
    const { mutate: uploadFile, isPending: isUploading } = useAdminFileUpload(resourceName);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (fileToUpload) {
            uploadFile(fileToUpload);
        } else {
            alert('Please select a file to upload.');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            deleteItem(id);
        }
    };

    if (isLoading) {
        return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    }
    if (isError) {
        return <div className="p-6 alert alert-error">{error.message}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Manage CPU Benchmarks</h1>

            {/* File Upload Section */}
            <div className="p-4 bg-base-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Upload Benchmark File</h2>
                <p className="text-sm opacity-70 mb-4">Upload a .csv, .xls, .xlsx, or .ods file with 'name' and 'score' columns.</p>
                <div className="flex items-center gap-4">
                    <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" accept=".csv,.xls,.xlsx,.ods" />
                    <button onClick={handleUpload} className="btn btn-primary" disabled={isUploading || !fileToUpload}>
                        {isUploading ? <span className="loading loading-spinner"></span> : 'Upload'}
                    </button>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Benchmark Score</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {benchmarks?.map((cpu) => (
                            <tr key={cpu.id} className="hover">
                                <td className="font-medium">{cpu.name}</td>
                                <td>{cpu.benchmark_score}</td>
                                <td className="text-right">
                                    <button onClick={() => handleDelete(cpu.id)} className="btn btn-sm btn-error" disabled={isDeleting}>
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

export default CpuBenchmarksPage;