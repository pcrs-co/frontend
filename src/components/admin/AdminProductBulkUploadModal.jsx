import React, { useState } from 'react';
import { useAdminProductActions } from '../../utils/hooks/useAdminProducts';
import { useVendorsList } from '../../utils/hooks/useVendors';
import { useToast } from '../../context/ToastContext';

export default function AdminProductBulkUploadModal({ modalId = "admin_bulk_upload_modal" }) {
    const [spreadsheetFile, setSpreadsheetFile] = useState(null);
    const [imageZipFile, setImageZipFile] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState('');

    const { showToast } = useToast();
    const { data: vendorsData, isLoading: isLoadingVendors } = useVendorsList();
    const { uploadBulk, isUploading } = useAdminProductActions();

    const vendors = vendorsData?.results || vendorsData || [];

    const handleClose = () => {
        setSelectedVendor('');
        setSpreadsheetFile(null);
        setImageZipFile(null);
        const spreadsheetInput = document.getElementById('admin_spreadsheet_input');
        const zipInput = document.getElementById('admin_zip_input');
        if (spreadsheetInput) spreadsheetInput.value = '';
        if (zipInput) zipInput.value = '';

        document.getElementById(modalId).close();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedVendor) {
            showToast({ message: 'Please select a vendor.', type: 'error' });
            return;
        }
        if (!spreadsheetFile) {
            showToast({ message: 'Please select a spreadsheet file.', type: 'error' });
            return;
        }
        uploadBulk({ vendorId: selectedVendor, spreadsheetFile, imageZipFile }, {
            onSuccess: handleClose
        });
    };

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-2xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg">Admin Bulk Product Upload</h3>

                <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">1. Select Vendor*</span></label>
                        <select
                            className="select select-bordered"
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            required
                            disabled={isUploading || isLoadingVendors}
                        >
                            <option disabled value="">{isLoadingVendors ? "Loading..." : "Select a Vendor"}</option>
                            {vendors.map(v => <option key={v.id} value={v.id}>{v.company_name}</option>)}
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">2. Select Spreadsheet File*</span></label>
                        <input
                            id="admin_spreadsheet_input"
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept=".csv, .xlsx, .xls"
                            onChange={(e) => setSpreadsheetFile(e.target.files[0] || null)}
                            required
                            disabled={isUploading}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold">3. Select Image Zip File (Optional)</span></label>
                        <input
                            id="admin_zip_input"
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept=".zip"
                            onChange={(e) => setImageZipFile(e.target.files[0] || null)}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="modal-action mt-6">
                        <button type="button" className="btn" onClick={handleClose} disabled={isUploading}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isUploading || !selectedVendor || !spreadsheetFile}>
                            {isUploading && <span className="loading loading-spinner"></span>}
                            {isUploading ? "Uploading..." : "Upload For Vendor"}
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