import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../context/ToastContext';
import * as productApi from '../../../utils/api/products';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);

    const queryKey = ['adminProductDetails', productId];

    const { data: product, isLoading, error } = useQuery({
        queryKey,
        queryFn: () => productApi.getAdminProductDetails(productId),
        enabled: !!productId,
    });

    const { mutate: updateProduct, isPending: isUpdating } = useMutation({
        mutationFn: productApi.updateAdminProduct,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data); // Optimistically update cache
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            setIsEditing(false);
            showToast({ message: 'Product updated!', type: 'success' });
        },
        onError: (err) => showToast({ message: `Update failed: ${err.message}`, type: 'error' }),
    });

    useEffect(() => {
        if (product) {
            setFormData({ ...product });
            setImageFiles([]);
        }
    }, [product]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));

    const handleSave = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            // Exclude read-only nested objects
            if (key !== 'images' && key !== 'vendor_details' && typeof formData[key] !== 'object') {
                data.append(key, formData[key]);
            }
        });
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => data.append('uploaded_images', file));
        }
        updateProduct({ id: productId, payload: data });
    };

    if (isLoading) return <div className="p-6 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="p-6 alert alert-error">{error.message}</div>;
    if (!product || !formData) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Details</h1>
                <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline">
                    {isEditing ? 'Cancel Edit' : 'Edit Product'}
                </button>
            </div>
            <form onSubmit={handleSave} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <p className="font-semibold">Vendor: <span className="font-normal">{product.vendor_details?.company_name || 'N/A'}</span></p>
                    <div className="divider"></div>
                    {/* Image display and upload */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">{isEditing ? "Upload New/Replacement Images" : "Product Images"}</span></label>
                        {isEditing && <input type="file" className="file-input file-input-bordered" onChange={handleImageChange} multiple />}
                        <div className="flex flex-wrap gap-4 mt-2">
                            {product.images?.map(img => <img key={img.id} src={img.image} alt={img.alt_text} className="w-32 h-32 object-cover rounded-lg shadow" />)}
                            {product.images?.length === 0 && <p className="text-sm">No images uploaded.</p>}
                        </div>
                    </div>
                    {/* Editable Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Product Name</span></label>
                            {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input input-bordered" /> : <p className="text-lg">{product.name}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Brand</span></label>
                            {isEditing ? <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="input input-bordered" /> : <p className="text-lg">{product.brand}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Price</span></label>
                            {isEditing ? <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input input-bordered" step="0.01" /> : <p className="text-lg">${product.price}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Quantity</span></label>
                            {isEditing ? <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input input-bordered" /> : <p className="text-lg">{product.quantity}</p>}
                        </div>
                    </div>
                    {isEditing && (
                        <div className="card-actions justify-end mt-6">
                            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                                {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductDetailPage;