
import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Admin Dashboard',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="products" 
        options={{ 
          title: 'Manage Products',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="categories" 
        options={{ 
          title: 'Manage Categories',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          title: 'Manage Orders',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="users" 
        options={{ 
          title: 'Manage Users',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          title: 'Edit Product',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="product/new" 
        options={{ 
          title: 'Add Product',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="category/[id]" 
        options={{ 
          title: 'Edit Category',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="category/new" 
        options={{ 
          title: 'Add Category',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
