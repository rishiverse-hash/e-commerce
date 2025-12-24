import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  category: string;
  brand?: string;
  rating: number;
  stock: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setCurrentProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;