import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productApi from '../../../utils/api/products'; // We'll need to add get/update functions

// First, let's update api/products.js to support fetching/updating single products
// Add these two functions to src/utils/api/products.js:
/*
export const getAdminProductDetails = (id) => {
    return api.get(`/admin/products/${id}/`).then(res => res.data);
};

export const updateAdminProduct = ({ id, payload }) => {
    return api.put(`/admin/products/${id}/`, payload).then(res => res.data);
};
*/

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    const queryKey = ['adminProducts', productId];

    const { data: product, isLoading, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => productApi.getAdminProductDetails(productId),
        enabled: !!productId,
    });

    const { mutate: updateProduct, isPending: isUpdating } = useMutation({
        mutationFn: productApi.updateAdminProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] }); // Invalidate list
            setIsEditing(false);
            alert('Product updated!');
        },
        onError: (err) => alert(`Update failed: ${err.message}`),
    });

    useEffect(() => {
        if (product) {
            setFormData({ ...product });
        }
    }, [product]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProduct({ id: productId, payload: formData });
    };

    if (isLoading) return <div className="p-6"><span className="loading loading-spinner"></span></div>;
    if (error) return <div className="p-6 alert alert-error">{error.message}</div>;
    if (!product || !formData) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Details</h1>
                <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline">
                    {isEditing ? 'Cancel' : 'Edit Product'}
                </button>
            </div>

            <form onSubmit={handleSave} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Product Name</span></label>
                            {isEditing ? (
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input input-bordered" />
                            ) : (
                                <p className="text-lg">{product.name}</p>
                            )}
                        </div>
                        {/* Repeat for other fields: price, quantity, description etc. */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Price</span></label>
                            {isEditing ? (
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input input-bordered" />
                            ) : (
                                <p className="text-lg">${product.price}</p>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Quantity</span></label>
                            {isEditing ? (
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input input-bordered" />
                            ) : (
                                <p className="text-lg">{product.quantity}</p>
                            )}
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text">Vendor</span></label>
                            <p className="text-lg font-semibold">{product.vendor_name}</p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="card-actions justify-end mt-6">
                            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductDetailPage;