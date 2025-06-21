// hooks/useProducts.js
import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../utils/api/products';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addProduct = async (data) => {
    const res = await createProduct(data);
    fetchProducts(); // or use optimistic update
    return res.data;
  };

  const editProduct = async (id, data) => {
    await updateProduct(id, data);
    fetchProducts();
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id)); // Optimistic
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    refetch: fetchProducts,
  };
}
