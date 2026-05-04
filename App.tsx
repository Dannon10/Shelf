// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductProvider } from './src/context/ProductContext';
import { requestNotificationPermissions } from './src/utils/notification';
import { RootStackParamList } from './src/types';
import ShelfScreen from './src/screens/ShelfScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0F0F0F' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Shelf" component={ShelfScreen} />
          <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}