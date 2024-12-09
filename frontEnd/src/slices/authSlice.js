// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
        console.log(action)
      state.user = action.payload.user;
      state.token = action.payload.access_token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token from local storage
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
