import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiArrowRight } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ProductCard from '../components/UI/ProductCard';
import toast from 'react-hot-toast';
import { AppDispatch } from '../store/store';

interface Product {
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
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: {
    url: string;
  };
}

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getFeaturedProducts(),
        categoryAPI.getCategories()
      ]);

      console.log('Products API Response:', productsResponse);
      console.log('Categories API Response:', categoriesResponse);

      setFeaturedProducts(productsResponse.data.data.products);
      setCategories(categoriesResponse.data.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = (product: Product) => {
    try {
      const images = product.images || [];
      const mainImage = images.find(img => img.isMain) || images[0];

      dispatch(addToWishlist({
        _id: product._id,
        product: product._id,
        name: product.name,
        price: product.onSale && product.salePrice ? product.salePrice : product.price,
        image: mainImage?.url || ''
      }));
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  // Hardcoded images for better aesthetic control
  // Hardcoded images for better aesthetic control
  const CATEGORY_IMAGES: Record<string, string> = {
    'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    'clothing': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'home': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80',
    'sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'kids': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'default': 'https://images.unsplash.com/photo-1531297461136-82lw9z1w0w9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Magazine Cover / Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="block text-primary-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-slide-up">
            New Collection 2024
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-fade-in shadow-sm">
            Discover Your <br />
            <span className="italic text-primary-400">Unique Style</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Curated looks for the modern trendsetter. Explore our latest arrivals in fashion, accessories, and home decor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
            <Link
              to="/products"
              className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Collection
            </Link>
            <Link
              to="/products?featured=true"
              className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-4 font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges - Minimalist */}
      <section className="py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center p-4">
              <FiTruck className="text-gray-400 mb-2" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <FiShield className="text-gray-400 mb-2" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <FiHeadphones className="text-gray-400 mb-2" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <FiShoppingBag className="text-gray-400 mb-2" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Editorial Style */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-8" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.slug}`}
                  className={`group relative overflow-hidden h-[400px] shadow-lg ${index === 1 ? 'md:-mt-12' : ''}`}
                >
                  <img
                    src={CATEGORY_IMAGES[category.slug] || category.image?.url || CATEGORY_IMAGES['default']}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CATEGORY_IMAGES['default'];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-8 left-0 w-full text-center text-white p-4">
                    <h3 className="text-3xl font-display font-bold mb-2">{category.name}</h3>
                    <span className="text-primary-300 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                      Explore <FiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products - Scrapbook Grid */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <span className="text-primary-600 font-bold uppercase tracking-wider text-sm">Editor's Pick</span>
              <h2 className="text-4xl font-display font-bold text-gray-900 mt-2">Trending Now</h2>
            </div>
            <Link
              to="/products?featured=true"
              className="text-gray-900 hover:text-primary-600 font-bold border-b-2 border-gray-900 hover:border-primary-600 transition-colors pb-1 mt-4 md:mt-0"
            >
              View All Collection
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-8" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900/20 skew-x-12 transform translate-x-1/4"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Join the Revolution</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
            Sign up for our newsletter to get the latest fashion updates, style tips, and exclusive offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-colors"
            />
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 font-bold uppercase tracking-wider transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;