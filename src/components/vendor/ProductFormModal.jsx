// src/components/vendor/ProductFormModal.jsx
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

// Helper to safely stringify objects
const safeJSONStringify = (obj) => {
    try {
        return JSON.stringify(obj);
    } catch {
        return '{}';
    }
};

const ProductFormModal = ({ product, onSave, isSaving, formId = "product_modal" }) => {
    const { showToast } = useToast();
    const getInitialState = () => ({
        name: '', brand: '', price: '', quantity: '', product_type: 'laptop',
        processor: { data_received: '' }, memory: { data_received: '' }, storage: { data_received: '' },
        graphic: { data_received: '' }, display: { data_received: '' }, ports: { data_received: '' },
        battery: { data_received: '' }, cooling: { data_received: '' }, operating_system: { data_received: '' },
        form_factor: { data_received: '' }, extra: { data_received: '' },
    });

    const [formData, setFormData] = useState(getInitialState());
    const [imageFiles, setImageFiles] = useState([]); // Handle multiple files

    useEffect(() => {
        if (product) {
            const mergedState = { ...getInitialState(), ...JSON.parse(JSON.stringify(product)) };
            setFormData(mergedState);
        } else {
            setFormData(getInitialState());
        }
        setImageFiles([]); // Reset files on product change
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleComponentChange = (e, component) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, [component]: { ...prev[component], data_received: value } }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = { ...formData };

        // Convert nested objects to JSON strings
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'object' && payload[key] !== null) {
                payload[key] = safeJSONStringify(payload[key]);
            }
        });

        const data = new FormData();
        Object.keys(payload).forEach(key => {
            if (key !== 'images') { // Don't append the existing images array
                data.append(key, payload[key]);
            }
        });

        // Append all new image files
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                // The key 'uploaded_images' must match the serializer
                data.append('uploaded_images', file);
            });
        }

        onSave(data);
    };

    return (
        <dialog id={formId} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
                <h3 className="font-bold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="py-4 space-y-4">

                    <div className="form-control">
                        <label className="label"><span className="label-text">Product Images</span></label>
                        <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} accept="image/*" multiple />
                        <div className="text-xs mt-1">You can select multiple images.</div>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            {/* Show existing images */}
                            {product?.images?.map(img => (
                                <img key={img.id} src={img.image} alt={img.alt_text} className="w-20 h-20 object-cover rounded shadow-md" />
                            ))}
                            {/* Show new image previews */}
                            {imageFiles.map((file, index) => (
                                <img key={index} src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded shadow-md" />
                            ))}
                        </div>
                    </div>

                    {/* Rest of the form inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="input input-bordered md:col-span-2" required />
                        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="input input-bordered" required />
                        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="input input-bordered" required step="0.01" />
                        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="input input-bordered" required />
                    </div>
                    <div className="divider">Specifications (Enter full spec string)</div>
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
            <form method="dialog" className="modal-backdrop"><button>close</button></form>
        </dialog>
    );
};

export default ProductFormModal;