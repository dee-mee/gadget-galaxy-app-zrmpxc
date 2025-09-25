
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../app/integrations/supabase/client';
import { Alert } from 'react-native';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch(loginFailure(error.message));
        Alert.alert('Login Failed', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          console.log('Profile error:', profileError);
        }

        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phone: profile?.phone || '',
          avatar: profile?.avatar_url || '',
          role: profile?.role || 'user',
          addresses: [],
          createdAt: data.user.created_at || new Date().toISOString(),
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(loginSuccess(userData));
        return { success: true, user: userData };
      }

      return { success: false, error: 'Login failed' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      Alert.alert('Login Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    dispatch(loginStart());
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        dispatch(loginFailure(error.message));
        Alert.alert('Registration Failed', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        Alert.alert(
          'Registration Successful', 
          'Please check your email to verify your account before logging in.',
          [{ text: 'OK' }]
        );
        dispatch(loginFailure(''));
        return { success: true, needsVerification: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      Alert.alert('Registration Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user');
      dispatch(logout());
    } catch (err) {
      console.log('Error signing out:', err);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phone: profile?.phone || '',
          avatar: profile?.avatar_url || '',
          role: profile?.role || 'user',
          addresses: [],
          createdAt: session.user.created_at || new Date().toISOString(),
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(loginSuccess(userData));
      } else {
        // Check AsyncStorage as fallback
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          dispatch(loginSuccess(JSON.parse(userData)));
        }
      }
    } catch (err) {
      console.log('Error checking auth status:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/reset-password',
      });

      if (error) {
        Alert.alert('Reset Failed', error.message);
        return { success: false, error: error.message };
      }

      Alert.alert(
        'Reset Email Sent', 
        'Please check your email for password reset instructions.',
        [{ text: 'OK' }]
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reset failed';
      Alert.alert('Reset Failed', errorMessage);
      return { success: false, error: errorMessage };
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
    resetPassword,
  };
};
