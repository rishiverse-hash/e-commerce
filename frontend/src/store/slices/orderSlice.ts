import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    product: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOrders, setCurrentOrder, setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer;