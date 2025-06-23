// Example usage in a Product Detail Page
import { useCreateOrder } from '../utils/hooks/useOrders';

export function ProductDetailPage({ product }) {
    const { mutate: placeOrder, isPending } = useCreateOrder();

    const handleOrderClick = () => {
        placeOrder({ product: product.id, quantity: 1 });
    };

    return (
        <div>
            <h1>{product.name}</h1>
            <p>Vendor: {product.vendor_name}</p>
            <p>Contact: {product.vendor_contact}</p> {/* Pass this from backend */}
            <p>Location: {product.vendor_location}</p> {/* Pass this from backend */}
            <button onClick={handleOrderClick} disabled={isPending}>
                {isPending ? 'Placing Order...' : 'Inform Vendor I Want This'}
            </button>
        </div>
    );
}