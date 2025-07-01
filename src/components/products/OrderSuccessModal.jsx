// src/components/products/OrderSuccessModal.jsx

import React from 'react';
import { CheckCircleIcon, MapPinIcon, PhoneIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';

export default function OrderSuccessModal({ order, onClose }) {
    if (!order || !order.vendor) return null;

    const vendor = order.vendor;
    const vendorUser = vendor.user; // User details should be nested under vendor in the serializer

    return (
        <dialog id="order_success_modal" className="modal modal-open bg-black/30">
            <div className="modal-box">
                <form method="dialog">
                    {/* The button in the form will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                </form>
                <div className="text-center">
                    <CheckCircleIcon className="h-16 w-16 text-success mx-auto" />
                    <h3 className="font-bold text-2xl mt-4">Order Request Sent!</h3>
                    <p className="py-4 text-base-content/80">Your request has been sent to the vendor. Please contact them to arrange payment and pickup/delivery.</p>
                </div>
                <div className="divider">Vendor Details</div>
                <div className="space-y-3 p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <BuildingStorefrontIcon className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{vendor.company_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                        <span>{vendor.location}</span>
                    </div>
                    {vendorUser?.phone_number && (
                        <div className="flex items-center gap-3">
                            <PhoneIcon className="h-5 w-5 text-primary" />
                            <a href={`tel:${vendorUser.phone_number}`} className="link link-hover">{vendorUser.phone_number}</a>
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onClose}>Got it!</button>
                </div>
            </div>
            {/* Click outside to close */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}