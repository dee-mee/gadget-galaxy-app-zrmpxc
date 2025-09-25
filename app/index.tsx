
import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setProducts, setCategories, setFeaturedProducts } from '../store/slices/productSlice';
import { mockProducts, mockCategories } from '../data/mockData';
import { commonStyles } from '../styles/commonStyles';

export default function Index() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const dispatch = useDispatch();

  const initializeApp = useCallback(() => {
    // Initialize app data
    dispatch(setProducts(mockProducts));
    dispatch(setCategories(mockCategories));
    dispatch(setFeaturedProducts(mockProducts.filter(p => p.isFeatured)));
    
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
