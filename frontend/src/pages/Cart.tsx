import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, itemCount } = useSelector((state: RootState) => state.cart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-20">
          <FiShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="card p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <img
                    src={item.image || '/api/placeholder/100/100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {formatPrice(item.price)} each
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <FiMinus size={16} />
                      </button>
                      
                      <span className="font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors ml-4"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    {item.quantity >= item.stock && (
                      <p className="text-red-600 text-sm mt-1">
                        Maximum available: {item.stock}
                      </p>
                    )}
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items ({itemCount}):</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="btn-primary w-full text-center block mb-3"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/products"
              className="btn-outline w-full text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;