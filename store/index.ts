
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import orderSlice from './slices/orderSlice';
import wishlistSlice from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productSlice,
    orders: orderSlice,
    wishlist: wishlistSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
