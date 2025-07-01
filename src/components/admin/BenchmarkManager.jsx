import React, { useState, useEffect, useRef } from 'react';
import { useAdminResourceList } from '../../utils/hooks/useAdminResourceList';
import { useAdminResourceActions } from '../../utils/hooks/useAdminResourceActions';
import { useToast } from '../../context/ToastContext';
import PaginationControls from '../common/PaginationControls';
import BenchmarkUploadModal from './BenchmarkUploadModal'; // Import the new modal

export default function BenchmarkManager({
    resourceName,
    title,
    fileTypeHint,
    nameField = 'name',
    scoreField = 'score'
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const pollingIntervalRef = useRef(null);

    const { data: responseData, isLoading, isError, error, refetch } = useAdminResourceList(resourceName, currentPage);
    const { deleteItem, isDeleting } = useAdminResourceActions(resourceName);

    const benchmarks = responseData?.results || [];
    const totalCount = responseData?.count || 0;
    const itemsPerPage = responseData?.results?.length || 10;
    const modalId = `${resourceName}-upload-modal`;

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setIsProcessing(false);
        }
    };

    // This function will be passed to the modal
    const handleUploadSuccess = () => {
        setIsProcessing(true); // Indicate that a background task has started
        if (!pollingIntervalRef.current) {
            pollingIntervalRef.current = setInterval(() => {
                console.log(`Polling for ${resourceName} data...`);
                refetch();
            }, 5000); // Poll every 5 seconds
        }
        // Stop polling after a while to prevent infinite loops
        setTimeout(stopPolling, 60000); // Stop after 1 minute
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => stopPolling();
    }, []);


    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            deleteItem(id, {
                onSuccess: () => showToast({ message: 'Entry deleted.', type: 'success' }),
                onError: (err) => showToast({ message: `Deletion failed: ${err.message}`, type: 'error' })
            });
        }
    };

    if (isLoading && !responseData) {
        return <div className="p-6 flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (isError) {
        return <div className="p-6 alert alert-error">Error: {error.message}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{title}</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => document.getElementById(modalId).showModal()}
                >
                    Upload New File
                </button>
            </div>

            {isProcessing && (
                <div className="alert alert-info shadow-lg">
                    <div>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>A file is being processed in the background. The list will update automatically.</span>
                    </div>
                </div>
            )}

            <div className={`overflow-x-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="text-right">Benchmark Score</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {benchmarks.map((item) => (
                            <tr key={item?.id} className="hover">
                                <td className="font-medium">{item?.[nameField] || 'Unnamed'}</td>
                                <td className="text-right">{item?.[scoreField]?.toLocaleString() ?? 'N/A'}</td>
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
                    <div className="text-center p-8">No data found.</div>
                )}
            </div>

            {totalCount > 0 &&
                <PaginationControls
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onPageChange={setCurrentPage}
                    pageSize={itemsPerPage}
                />
            }

            {/* The modal is included here, but only becomes visible when called */}
            <BenchmarkUploadModal
                modalId={modalId}
                resourceName={resourceName}
                title={`Upload ${title}`}
                fileTypeHint={fileTypeHint}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
};