import React, { useState } from 'react';
import { useVendorProducts } from '../../utils/hooks/useVendorProducts';
import { useToast } from '../../context/ToastContext';

export default function ProductBulkUploadModal({ modalId = "vendor_bulk_upload_modal" }) {
    const [spreadsheetFile, setSpreadsheetFile] = useState(null);
    const [imageZipFile, setImageZipFile] = useState(null);

    // Using the vendor-specific hook
    const { uploadFile, isUploading } = useVendorProducts();
    const { showToast } = useToast();

    // Resets state and closes the modal
    const handleClose = () => {
        setSpreadsheetFile(null);
        setImageZipFile(null);
        // Clear the file input visually by resetting the form if it's part of one, or by id
        const spreadsheetInput = document.getElementById('vendor_spreadsheet_input');
        const zipInput = document.getElementById('vendor_zip_input');
        if (spreadsheetInput) spreadsheetInput.value = '';
        if (zipInput) zipInput.value = '';

        document.getElementById(modalId).close();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!spreadsheetFile) {
            showToast({ message: 'Please select a spreadsheet file.', type: 'error' });
            return;
        }
        uploadFile({ spreadsheetFile, imageZipFile }, {
            onSuccess: () => {
                // The hook's onSuccess already shows a toast
                handleClose();
            },
            // The hook's onError also handles the toast
        });
    };

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-2xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg">Bulk Product Upload</h3>

                <div className="card bg-base-200 shadow-inner my-4">
                    <div className="card-body p-4">
                        <h4 className="card-title text-base">Instructions</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Prepare a spreadsheet with an `image` column containing comma-separated filenames (e.g., `my-image.jpg, other.png`).</li>
                            <li>Create a single `.zip` file containing all the corresponding images.</li>
                            <li>Upload both files below.</li>
                        </ol>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">1. Select Spreadsheet File*</span></label>
                        <input
                            id="vendor_spreadsheet_input"
                            type="file"
                            className="file-input file-input-bordered file-input-primary w-full"
                            accept=".csv, .xlsx, .xls"
                            onChange={(e) => setSpreadsheetFile(e.target.files[0] || null)}
                            required
                            disabled={isUploading}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">2. Select Image Zip File (Optional)</span></label>
                        <input
                            id="vendor_zip_input"
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept=".zip"
                            onChange={(e) => setImageZipFile(e.target.files[0] || null)}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={handleClose} disabled={isUploading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isUploading || !spreadsheetFile}>
                            {isUploading && <span className="loading loading-spinner"></span>}
                            {isUploading ? "Uploading..." : "Upload Products"}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
}