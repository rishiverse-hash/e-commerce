import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        salePrice?: number;
        onSale: boolean;
        stock: number;
        images: Array<{
            url: string;
            alt?: string;
            isMain?: boolean;
        }>;
        ratings: {
            average: number;
            count: number;
        };
    };
    onAddToCart?: (product: any) => void;
    onWishlist?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onWishlist }) => {
    const images = product.images || [];
    const mainImage = images.find(img => img.isMain) || images[0];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const currentPrice = product.onSale && product.salePrice ? product.salePrice : product.price;

    return (
        <div className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
            <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                {/* Image */}
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                    <img
                        src={mainImage?.url || '/api/placeholder/400/500'}
                        alt={mainImage?.alt || product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Product+Image';
                        }}
                    />
                    {product.onSale && (
                        <div className="absolute top-0 left-0 bg-secondary-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                            Sale
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="bg-gray-900 text-white px-4 py-2 font-bold uppercase tracking-widest text-sm">Out of Stock</span>
                        </div>
                    )}

                    {/* Quick Actions overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-white/95 py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-4 border-t border-gray-100">
                        <button
                            onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
                            className="p-2 text-gray-500 hover:text-secondary-500 transition-colors"
                            title="Add to Wishlist"
                        >
                            <FiHeart size={20} />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); onAddToCart?.(product); }}
                            className="p-2 text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
                            disabled={product.stock === 0}
                            title="Add to Cart"
                        >
                            <FiShoppingCart size={20} />
                        </button>
                    </div>
                </div>
            </Link>

            <div className="p-4 text-center">
                <h3 className="text-gray-800 font-medium text-sm line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>

                <div className="flex justify-center items-center space-x-2">
                    {product.onSale && product.salePrice && product.price > product.salePrice && (
                        <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                        {formatPrice(currentPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
