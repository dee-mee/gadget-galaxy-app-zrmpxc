
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '../store';
import { setupErrorLogging } from '../utils/errorLogger';
import { useAuth } from '../hooks/useAuth';
import { useDataSync } from '../hooks/useDataSync';
import React, { useEffect } from 'react';

function AppInitializer() {
  const { checkAuthStatus } = useAuth();
  useDataSync(); // Initialize data sync

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    setupErrorLogging();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppInitializer />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'default',
            }}
          />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
