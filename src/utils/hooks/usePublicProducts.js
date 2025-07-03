import { useQuery } from '@tanstack/react-query';
import { getPublicProductDetails } from '../api/products';
import { useCreateOrder } from './useOrders'; // We'll need this for the order button

export const useProductDetails = (productId) => {
    return useQuery({
        queryKey: ['productDetails', productId],
        queryFn: () => getPublicProductDetails(productId),
        enabled: !!productId, // The query will not run until a productId is provided
    });
};

// Hook that combines fetching details with the ability to order
export const useProductInteraction = (productId) => {
    const { data: product, isLoading, isError, error } = useProductDetails(productId);
    const { mutate: placeOrder, isPending: isOrdering } = useCreateOrder();

    return {
        product,
        isLoading,
        isError,
        error,
        placeOrder,
        isOrdering,
    };
};