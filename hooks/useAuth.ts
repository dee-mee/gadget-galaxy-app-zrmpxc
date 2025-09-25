
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUser } from '../data/mockData';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'demo@example.com' && password === 'password') {
        const userData = { ...mockUser, email };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(loginSuccess(userData));
        return { success: true };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    dispatch(loginStart());
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        ...mockUser,
        email,
        firstName,
        lastName,
        id: Date.now().toString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      dispatch(logout());
    } catch (err) {
      console.log('Error signing out:', err);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        dispatch(loginSuccess(JSON.parse(userData)));
      }
    } catch (err) {
      console.log('Error checking auth status:', err);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    signOut,
    checkAuthStatus,
  };
};
