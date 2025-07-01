import React, { useState, useRef } from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import { useToast } from '../../context/ToastContext';

export default function ProductBulkUploadModal({ modalId = "vendor_bulk_upload_modal" }) {
    // Refs to directly control the file input elements
    const spreadsheetInputRef = useRef(null);
    const zipInputRef = useRef(null);

    // State to hold the actual File objects
    const [spreadsheetFile, setSpreadsheetFile] = useState(null);
    const [imageZipFile, setImageZipFile] = useState(null);
    
    const { uploadFile, isUploading } = useVendorProducts();
    const { showToast } = useToast();

    // This function will be called to cleanly close the modal and reset all state
    const handleClose = () => {
        setSpreadsheetFile(null);
        setImageZipFile(null);
        // Use the refs to reliably clear the file inputs
        if (spreadsheetInputRef.current) spreadsheetInputRef.current.value = "";
        if (zipInputRef.current) zipInputRef.current.value = "";
        
        document.getElementById(modalId).close();
    };

    // This function handles the form submission logic
    const handleSubmit = () => {
        // A crucial check to ensure a spreadsheet file has been selected
        if (!spreadsheetFile) {
            showToast({ message: 'Please select a spreadsheet file to upload.', type: 'error' });
            return;
        }

        // The hook expects an object with these keys, containing the File objects
        uploadFile({ spreadsheetFile, imageZipFile }, {
            onSuccess: () => {
                // If the upload is successful, close the modal
                handleClose();
                // The success toast is already handled by the hook
            },
            // The error toast is also handled by the hook
        });
    };

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-2xl">
                {/* We use a button instead of a form element for more control */}
                <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
                
                <h3 className="font-bold text-lg">Bulk Product Upload</h3>
                
                <div className="card bg-base-200 shadow-inner my-4">
                    <div className="card-body p-4">
                        <h4 className="card-title text-base">Instructions</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Prepare a spreadsheet with an `image` column containing comma-separated filenames.</li>
                            <li>Create a single `.zip` file containing all corresponding images.</li>
                            <li>Upload both files below.</li>
                        </ol>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">1. Select Spreadsheet File*</span></label>
                        <input
                            ref={spreadsheetInputRef}
                            type="file"
                            className="file-input file-input-bordered file-input-primary w-full"
                            accept=".csv, .xlsx, .xls"
                            onChange={(e) => setSpreadsheetFile(e.target.files[0] || null)}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">2. Select Image Zip File (Optional)</span></label>
                        <input
                            ref={zipInputRef}
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept=".zip"
                            onChange={(e) => setImageZipFile(e.target.files[0] || null)}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={handleClose} disabled={isUploading}>Cancel</button>
                        <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={isUploading || !spreadsheetFile}>
                            {isUploading && <span className="loading loading-spinner"></span>}
                            {isUploading ? "Uploading..." : "Upload Products"}
                        </button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
}