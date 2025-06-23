import React, { useState, useEffect, useRef } from 'react';
import { useAdminResourceList } from '../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../utils/hooks/useAdminResourceActions';
import { useAdminFileUpload } from '../../utils/hooks/useAdminFileUpload';
import { useToast } from '../../context/ToastContext';
import PaginationControls from '../common/PaginationControls'; // Assuming you have this component

/**
 * A reusable component to manage benchmark data (CPU, GPU, etc.).
 * Handles fetching, displaying, deleting, and uploading benchmark files.
 */
function BenchmarkManager({ resourceName, title, fileTypeHint }) {
    const [fileToUpload, setFileToUpload] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { showSuccess, showError } = useToast();

    // Use a ref to hold the interval ID so it doesn't trigger re-renders
    const pollingIntervalRef = useRef(null);

    // --- Data Fetching and Mutations ---
    const { data: responseData, isLoading, isError, error, refetch } = useAdminResourceList(resourceName, currentPage);
    const { deleteItem, isPending: isDeleting } = useAdminResourceActions(resourceName);
    const { mutate: uploadFile, isPending: isUploading } = useAdminFileUpload(resourceName);

    // Safely extract data for rendering
    const benchmarks = responseData?.results || [];
    const totalCount = responseData?.count || 0;

    // --- Logic for Background Polling ---
    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    useEffect(() => {
        if (isUploading) {
            // Start polling only if it's not already running
            if (!pollingIntervalRef.current) {
                pollingIntervalRef.current = setInterval(() => {
                    console.log(`Polling for ${resourceName} data...`);
                    refetch(); // Refetch the data
                }, 5000); // Poll every 5 seconds
            }
        } else {
            // If no longer uploading, ensure polling is stopped
            stopPolling();
        }

        // Cleanup: stop polling when the component unmounts
        return () => stopPolling();
    }, [isUploading, refetch, resourceName]);


    // --- Event Handlers ---
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToUpload(file);
        }
    };

    const handleUpload = () => {
        if (!fileToUpload) {
            showError('Please select a file to upload.');
            return;
        }

        uploadFile(fileToUpload, {
            onSuccess: (data) => {
                showSuccess(data.message || 'File accepted for processing. Data will update shortly.');
                setFileToUpload(null);
                // The useEffect hook will handle starting the polling
            },
            onError: (err) => {
                const errorMessage = err.response?.data?.error || err.message;
                showError(`Upload failed: ${errorMessage}`);
                stopPolling(); // Stop polling if the initial upload request fails
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            deleteItem(id, {
                onSuccess: () => {
                    showSuccess('Entry deleted successfully.');
                    // The query cache will be invalidated automatically by the hook
                },
                onError: (err) => showError(`Deletion failed: ${err.message}`)
            });
        }
    };

    // --- Render Logic ---

    // 1. Handle the initial loading state
    if (isLoading && !responseData) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // 2. Handle any API errors
    if (isError) {
        return (
            <div className="p-6 m-4 alert alert-error shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error: {error.message}. You may need to log in again.</span>
                </div>
            </div>
        );
    }

    // 3. Render the main component UI
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{title}</h1>

            {/* Upload Section */}
            <div className="p-4 bg-base-200 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Upload New Benchmark File</h2>
                <p className="text-sm opacity-70 mb-4">{fileTypeHint}</p>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        key={fileToUpload ? 'file-selected' : 'no-file'} // Resets the input field
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
                        Processing file in the background. The table will update automatically.
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className={`overflow-x-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Benchmark Score</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {benchmarks.map((item) => (
                            <tr key={item?.id} className="hover">
                                <td className="font-medium">{item?.name || 'Unnamed Entry'}</td>
                                <td>{item?.benchmark_score?.toLocaleString() ?? 'N/A'}</td>
                                <td className="text-right">
                                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-ghost text-error" disabled={isDeleting}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isLoading && benchmarks.length === 0 && (
                    <div className="text-center p-8 text-base-content opacity-60">No benchmark data found.</div>
                )}
            </div>

            {/* Pagination Section */}
            {totalCount > 0 &&
                <PaginationControls
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onPageChange={setCurrentPage}
                    // Assuming a page size of 10, or get it from your API response
                    pageSize={10}
                />
            }
        </div>
    );
};

export default BenchmarkManager;