import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
  FiPackage
} from 'react-icons/fi';
import { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const cartItemsCount = itemCount;
  const wishlistItemsCount = wishlistItems.length;

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm font-sans">
      {/* Top Bar - Black */}
      <div className="bg-gray-900 text-white text-xs py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex space-x-6">
            <span className="font-medium tracking-wide">FREE SHIPPING ON ALL ORDERS</span>
          </div>
          <div className="flex items-center space-x-6 ml-auto">
            <span className="cursor-pointer hover:text-primary-400 transition-colors">Download App</span>
            <span className="cursor-pointer hover:text-primary-400 transition-colors">Support</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-display font-bold tracking-tighter text-gray-900">
                Lime<span className="text-primary-500">Road</span>
              </span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8 ml-8">
              <Link to="/products?gender=women" className="text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 py-1 transition-all">Women</Link>
              <Link to="/products?gender=men" className="text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 py-1 transition-all">Men</Link>
              <Link to="/products?gender=kids" className="text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 py-1 transition-all">Kids</Link>
              <Link to="/products" className="text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 py-1 transition-all">Home</Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-sm ml-auto mr-6">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-gray-100 border-none rounded-none text-sm focus:ring-0 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <FiSearch size={18} />
                </button>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-5">

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative group" ref={userMenuRef}>
                  <button className="flex flex-col items-center justify-center text-gray-700 hover:text-primary-600 transition-colors">
                    <FiUser size={20} />
                    <span className="text-[10px] uppercase font-bold mt-1">Profile</span>
                  </button>

                  {/* Dropdown - styled nicely */}
                  <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-56 z-50">
                    <div className="bg-white shadow-xl border border-gray-100 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">{user?.firstName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">My Orders</Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Account Settings</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-medium">Admin Dashboard</Link>
                      )}
                      <div className="border-t border-gray-100 mt-1"></div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">Log Out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center justify-center text-gray-700 hover:text-primary-600 transition-colors">
                  <FiUser size={20} />
                  <span className="text-[10px] uppercase font-bold mt-1">Profile</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="flex flex-col items-center justify-center text-gray-700 hover:text-primary-600 transition-colors relative">
                <FiHeart size={20} />
                <span className="text-[10px] uppercase font-bold mt-1">Wishlist</span>
                {wishlistItemsCount > 0 && (
                  <span className="absolute top-0 right-2 w-2 h-2 bg-secondary-500 rounded-full"></span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center justify-center text-gray-700 hover:text-primary-600 transition-colors relative">
                <FiShoppingCart size={20} />
                <span className="text-[10px] uppercase font-bold mt-1">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-primary-500 text-white text-[10px] font-bold px-1 rounded-sm min-w-[16px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-40 shadow-xl">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 bg-gray-100 border-none rounded-none text-sm"
              />
            </form>
            <div className="flex flex-col space-y-2 font-bold text-gray-800 uppercase tracking-wide">
              <Link to="/products?gender=women" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Women</Link>
              <Link to="/products?gender=men" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Men</Link>
              <Link to="/products?gender=kids" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Kids</Link>
              <Link to="/products" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;