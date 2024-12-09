// store.js
import { configureStore } from '@reduxjs/toolkit';
import tweetsReducer from './slices/tweetsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    tweets: tweetsReducer,
    auth: authReducer,
  },
});
