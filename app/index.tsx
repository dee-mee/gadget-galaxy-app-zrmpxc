
import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setProducts, setCategories, setFeaturedProducts } from '../store/slices/productSlice';
import { supabase } from './integrations/supabase/client';
import { commonStyles } from '../styles/commonStyles';

export default function Index() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const dispatch = useDispatch();

  const initializeApp = useCallback(async () => {
    // Load data from Supabase instead of mock data
    try {
      // Load categories
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categories) {
        dispatch(setCategories(categories));
      }

      // Load products
      const { data: products } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (products) {
        dispatch(setProducts(products));
        dispatch(setFeaturedProducts(products.filter(p => p.is_featured)));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
    
    // Check authentication status
    checkAuthStatus();
  }, [dispatch, checkAuthStatus]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth/login" />;
}
