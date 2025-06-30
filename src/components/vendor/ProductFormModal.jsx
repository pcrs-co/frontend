// src/components/vendor/ProductFormModal.jsx
import { useState, useEffect } from 'react';

const ProductFormModal = ({ product, onSave, isSaving, formId = "product_modal" }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        quantity: '',
        // Add all your other product fields here with initial empty values
        processor: { data_received: '' },
        memory: { data_received: '' },
        storage: { data_received: '' },
        graphic: { data_received: '' },
        display: { data_received: '' },
        ports: { data_received: '' },
        battery: { data_received: '' },
        cooling: { data_received: '' },
        operating_system: { data_received: '' },
        form_factor: { data_received: '' },
        extra: { data_received: '' },
    });
    
    useEffect(() => {
        if (product) {
            // Deep copy to avoid mutating the original product object
            setFormData(JSON.parse(JSON.stringify(product)));
        } else {
            // Reset form for new product
             setFormData({
                name: '', brand: '', price: '', quantity: '', product_type: 'laptop',
                processor: { data_received: '' }, memory: { data_received: '' },
                storage: { data_received: '' }, graphic: { data_received: '' },
                display: { data_received: '' }, ports: { data_received: '' },
                battery: { data_received: '' }, cooling: { data_received: '' },
                operating_system: { data_received: '' }, form_factor: { data_received: '' },
                extra: { data_received: '' },
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle nested component changes
    const handleComponentChange = (e, component) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [component]: { ...prev[component], data_received: value }
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <dialog id={formId} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
                
                <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="input input-bordered md:col-span-2" required />
                         <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="input input-bordered" required />
                         <input type="text" name="product_type" placeholder="Product Type" value={formData.product_type} onChange={handleChange} className="input input-bordered" required />
                         <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="input input-bordered" required />
                         <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="input input-bordered" required />
                    </div>
                     <div className="divider">Specifications</div>
                    {/* Component Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Processor Specs" value={formData.processor.data_received} onChange={e => handleComponentChange(e, 'processor')} className="input input-bordered" />
                        <input type="text" placeholder="Memory (RAM) Specs" value={formData.memory.data_received} onChange={e => handleComponentChange(e, 'memory')} className="input input-bordered" />
                        <input type="text" placeholder="Storage Specs" value={formData.storage.data_received} onChange={e => handleComponentChange(e, 'storage')} className="input input-bordered" />
                        <input type="text" placeholder="Graphics Card Specs" value={formData.graphic.data_received} onChange={e => handleComponentChange(e, 'graphic')} className="input input-bordered" />
                        <input type="text" placeholder="Display Specs" value={formData.display.data_received} onChange={e => handleComponentChange(e, 'display')} className="input input-bordered" />
                        <input type="text" placeholder="Ports & Connectivity" value={formData.ports.data_received} onChange={e => handleComponentChange(e, 'ports')} className="input input-bordered" />
                        {/* Add other inputs as needed */}
                    </div>

                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? <span className="loading loading-spinner"></span> : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ProductFormModal;