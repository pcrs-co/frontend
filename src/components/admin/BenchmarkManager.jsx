import React, { useState, useEffect, useRef } from 'react';
import { useAdminResourceList } from '../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../utils/hooks/useAdminResourceActions';
import { useAdminFileUpload } from '../../utils/hooks/useAdminFileUpload';
import { useToast } from '../../context/ToastContext';
import PaginationControls from '../common/PaginationControls';

function BenchmarkManager({ resourceName, title, fileTypeHint }) {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { showSuccess, showError } = useToast();

    // useRef to hold the interval ID to prevent re-renders from affecting it
    const pollingInterval = useRef(null);

    const { data: responseData, isLoading, isError, error, refetch } = useAdminResourceList(resourceName, currentPage);
    const benchmarks = responseData?.results || [];

    const { deleteItem, isPending: isDeleting } = useAdminResourceActions(resourceName);
    const { mutate: uploadFile, isPending: isUploading } = useAdminFileUpload(resourceName);

    // Function to stop the polling
    const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
    };

    // Effect to start/stop polling based on the isUploading state
    useEffect(() => {
        if (isUploading) {
            // If we are already polling, don't start another one
            if (!pollingInterval.current) {
                pollingInterval.current = setInterval(() => {
                    console.log('Polling for new data...');
                    refetch();
                }, 5000); // Poll every 5 seconds
            }
        } else {
            // If no longer uploading, stop polling
            stopPolling();
        }

        // Cleanup function to stop polling when the component unmounts
        return () => stopPolling();
    }, [isUploading, refetch]);


    const handleFileChange = (e) => {
        if (e.target.files.length > 0) setFileToUpload(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!fileToUpload) {
            showError('Please select a file to upload.');
            return;
        }
        uploadFile(fileToUpload, {
            onSuccess: (data) => {
                showSuccess(data.message || 'File accepted for processing.');
                setFileToUpload(null);
            },
            onError: (err) => {
                showError(`Upload failed: ${err.response?.data?.error || err.message}`);
                stopPolling(); // Stop polling if the initial upload fails
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            deleteItem(id, {
                onSuccess: () => showSuccess('Entry deleted.'),
                onError: (err) => showError(`Deletion failed: ${err.message}`)
            });
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    if (isLoading && !responseData) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (isError) {
        return <div className="p-6 alert alert-error">Error: {error.message}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{title}</h1>

            <div className="p-4 bg-base-200 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Upload Benchmark File</h2>
                <p className="text-sm opacity-70 mb-4">{fileTypeHint}</p>
                <div className="flex items-center gap-4">
                    <input
                        key={fileToUpload ? 'file-selected' : 'no-file'}
                        type="file"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full max-w-xs"
                        accept=".csv,.xls,.xlsx,.ods"
                    />
                    <button onClick={handleUpload} className="btn btn-primary" disabled={isUploading || !fileToUpload}>
                        {isUploading ? <span className="loading loading-spinner"></span> : 'Upload & Process'}
                    </button>
                </div>
                {isUploading && (
                    <div className="mt-4 text-sm text-info flex items-center gap-2">
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing file in the background. Data will update automatically.
                    </div>
                )}
            </div>

            <div className={`overflow-x-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="table w-full">
                    {/* ... thead ... */}
                    <tbody>
                        {benchmarks.map((item) => (
                            <tr key={item.id} className="hover">
                                <td className="font-medium">{item.name}</td>
                                <td>{item.benchmark_score.toLocaleString()}</td>
                                <td className="text-right">
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-error btn-outline" disabled={isDeleting}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && benchmarks.length === 0 && (
                    <div className="text-center p-8 text-neutral-content">No data found.</div>
                )}
            </div>

            <PaginationControls responseData={responseData} onPageChange={handlePageChange} />
        </div>
    );
};

export default BenchmarkManager;