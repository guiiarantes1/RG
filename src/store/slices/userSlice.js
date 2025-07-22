import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')),
};

console.log('userSlice - Estado inicial:', initialState);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, access, refresh } = action.payload;
      console.log('LoginSuccess - Dados recebidos:', { user, access, refresh });
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      console.log('LoginSuccess - Estado atualizado:', state);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.accessToken = access;
      state.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },
  },
});

export const { loginSuccess, logout, updateUser, updateTokens } = userSlice.actions;
export default userSlice.reducer; 