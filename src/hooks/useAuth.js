import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout, updateUser, updateTokens } from '../store/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector((state) => state.user);
  
  console.log('useAuth - Estado atual:', { user, accessToken, refreshToken, isAuthenticated });

  const login = (userData, access, refresh) => {
    dispatch(loginSuccess({ user: userData, access, refresh }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserData = (userData) => {
    dispatch(updateUser(userData));
  };

  const updateUserTokens = (access, refresh) => {
    dispatch(updateTokens({ access, refresh }));
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout: logoutUser,
    updateUser: updateUserData,
    updateTokens: updateUserTokens,
  };
}; 