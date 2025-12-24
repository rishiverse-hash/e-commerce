import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productAPI } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { FiGrid, FiList, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { AppDispatch } from '../store/store';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  salePrice?: number;
  onSale: boolean;
  images: Array<{
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
  category: {
    name: string;
    slug: string;
  };
  brand?: string;
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  featured: boolean;
  tags: string[];
}

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Get query parameters
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const gender = searchParams.get('gender');
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products with params:', { page, category, search, featured, sortBy, gender });
      const params: any = {
        page,
        limit: 12,
        sortBy,
        sortOrder: 'desc'
      };

      if (category) params.category = category;
      if (search) params.search = search;
      if (featured) params.featured = featured;
      if (gender) params.gender = gender;

      const response = await productAPI.getProducts(params);
      console.log('Products API response:', response.data);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentPrice = (product: Product) => {
    if (product.onSale && product.salePrice) {
      return product.salePrice;
    }
    return product.price;
  };

  const getDiscountPercentage = (product: Product) => {
    if (product.onSale && product.salePrice && product.price > product.salePrice) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100);
    }
    if (product.comparePrice && product.price < product.comparePrice) {
      return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
    }
    return 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleAddToCart = (product: Product) => {
    try {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const currentPrice = getCurrentPrice(product);
    const discount = getDiscountPercentage(product);
    const images = product.images || [];
    const mainImage = images.find(img => img.isMain) || images[0];

    return (
      <div className="card-hover p-4 group">
        <div className="relative mb-4">
          <img
            src={mainImage?.url || '/api/placeholder/300/300'}
            alt={mainImage?.alt || product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <FiHeart size={20} className="text-gray-700" />
              </button>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-primary-600 p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                disabled={product.stock === 0}
              >
                <FiShoppingCart size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {renderStars(product.ratings.average)}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.ratings.count})</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(currentPrice)}
              </span>
              {(product.onSale && product.salePrice && product.price > product.salePrice) && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {(product.comparePrice && product.price < product.comparePrice) && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${product.stock > 0
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` :
              gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Products` :
                search ? `Search Results for "${search}"` :
                  featured ? 'Featured Products' : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings.average">Highest Rated</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            {pagination.hasPrevPage && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (pagination.currentPage - 1).toString());
                  setSearchParams(newParams);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}

            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
              {pagination.currentPage} of {pagination.totalPages}
            </span>

            {pagination.hasNextPage && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (pagination.currentPage + 1).toString());
                  setSearchParams(newParams);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;