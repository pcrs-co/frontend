// src/components/vendor/ProductUploadModal.jsx
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function ProductUploadModal({ onUpload, isUploading }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const { showToast } = useToast();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!selectedFile) {
            showToast({ message: 'Please select a file first.', type: 'error' });
            return;
        }

        onUpload({ file: selectedFile }, {
            onSuccess: () => {
                showToast({ message: 'File uploaded successfully! Products are being processed.', type: 'success' });
                document.getElementById('upload_modal').close();
                setSelectedFile(null); // Reset file input
            },
            onError: (err) => {
                showToast({ message: `Upload failed: ${err.message}`, type: 'error' });
            }
        });
    };

    return (
        <dialog id="upload_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Upload Product Spreadsheet</h3>
                <p className="py-2 text-sm text-base-content/70">
                    Upload an Excel (.xlsx) or CSV (.csv) file with columns like: `name`, `brand`, `price`, `quantity`, `description`.
                </p>
                <div className="py-4">
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                    />
                    {selectedFile && <p className="text-xs mt-2">Selected: {selectedFile.name}</p>}
                </div>
                <div className="modal-action">
                    <button
                        className="btn btn-primary"
                        onClick={handleUploadClick}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? <span className="loading loading-spinner"></span> : 'Upload'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}