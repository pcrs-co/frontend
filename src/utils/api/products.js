// utils/api/products.js
import api from '../api';

export const getProducts = () => api.get('/vendor/products/');
export const createProduct = (data) => api.post('/vendor/products/', data);
export const updateProduct = (id, data) => api.put(`/vendor/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/vendor/products/${id}/`);
