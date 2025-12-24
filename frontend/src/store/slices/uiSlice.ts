import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: number;
  }>;
  modals: {
    isLoginOpen: boolean;
    isRegisterOpen: boolean;
    isCartOpen: boolean;
  };
}

const initialState: UIState = {
  isLoading: false,
  notifications: [],
  modals: {
    isLoginOpen: false,
    isRegisterOpen: false,
    isCartOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
    }>) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
  },
});

export const {
  setLoading,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;