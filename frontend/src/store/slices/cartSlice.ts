import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: any;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      product: any;
      quantity?: number;
      variant?: any;
    }>) => {
      const { product, quantity = 1, variant } = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => 
        item.product === product._id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (newQuantity <= product.stock) {
          state.items[existingItemIndex].quantity = newQuantity;
        } else {
          state.error = `Only ${product.stock} items available in stock`;
          return;
        }
      } else {
        // Add new item to cart
        if (quantity <= product.stock) {
          const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
          
          state.items.push({
            _id: `${product._id}_${Date.now()}`,
            product: product._id,
            name: product.name,
            price: product.onSale && product.salePrice ? product.salePrice : product.price,
            quantity,
            image: mainImage?.url || '',
            variant,
            stock: product.stock
          });
        } else {
          state.error = `Only ${product.stock} items available in stock`;
          return;
        }
      }

      // Recalculate totals
      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      state.error = null;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      
      // Recalculate totals
      const { total, itemCount } = calculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === id);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
        } else if (quantity <= item.stock) {
          // Update quantity if within stock limits
          state.items[itemIndex].quantity = quantity;
        } else {
          state.error = `Only ${item.stock} items available in stock`;
          return;
        }

        // Recalculate totals
        const { total, itemCount } = calculateTotals(state.items);
        state.total = total;
        state.itemCount = itemCount;
        state.error = null;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  clearError,
  setLoading 
} = cartSlice.actions;

export default cartSlice.reducer;