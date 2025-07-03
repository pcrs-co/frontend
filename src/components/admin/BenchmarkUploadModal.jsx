import React, { useState, useEffect, useRef } from 'react';
import { useAdminFileUpload } from '../../utils/hooks/useAdminFileUpload';
import { useToast } from '../../context/ToastContext';

export default function BenchmarkUploadModal({ modalId, resourceName, title, fileTypeHint, onUploadSuccess }) {
    const [fileToUpload, setFileToUpload] = useState(null);
    const { showToast } = useToast();
    const { mutate: uploadFile, isPending: isUploading } = useAdminFileUpload(resourceName);
    const fileInputRef = useRef(null); // Ref to reset the file input

    const handleClose = () => {
        setFileToUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
        document.getElementById(modalId).close();
    };

    const handleFileChange = (e) => {
        setFileToUpload(e.target.files?.[0] || null);
    };

    const handleUpload = () => {
        if (!fileToUpload) {
            showToast({ message: 'Please select a file to upload.', type: 'error' });
            return;
        }

        uploadFile(fileToUpload, {
            onSuccess: (data) => {
                showToast({ message: data.message || 'File accepted for processing. Data will update shortly.', type: 'info' });
                // Call the callback to trigger a refetch on the parent page
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
                handleClose();
            },
            onError: (err) => {
                const errorMessage = err.response?.data?.error || err.message;
                showToast({ message: `Upload failed: ${errorMessage}`, type: 'error' });
            }
        });
    };

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-2 text-sm text-base-content/70">
                    {fileTypeHint}
                </p>

                <div className="py-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                        accept=".csv,.xls,.xlsx"
                        disabled={isUploading}
                    />
                </div>

                <div className="modal-action">
                    <button type="button" className="btn" onClick={handleClose} disabled={isUploading}>Cancel</button>
                    <button onClick={handleUpload} className="btn btn-primary" disabled={isUploading || !fileToUpload}>
                        {isUploading ? <span className="loading loading-spinner"></span> : 'Upload & Process'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
}