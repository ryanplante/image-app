import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesListScreen from './FavoritesListScreen';
import PhotoGalleryScreen from './PhotoGalleryScreen';
import PhotoDetailScreen from './PhotoDetailScreen';
import ImageModalScreen from './ImageModalScreen';
import WeatherApp from './WeatherApp';
//import ProductScreen from './ProductScreen';
import ProductDetails from './ProductDetails';
import ProductScanner from './ProductScanner';
import { Ionicons } from '@expo/vector-icons'; // Import the Ionicons component

const Stack = createStackNavigator();
const ScannerStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
    <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
    <Stack.Screen name="ImageModal" options={{ headerShown: false }} component={ImageModalScreen} />
    <Stack.Screen name="Weather app" component={WeatherApp} />
  </Stack.Navigator>
);


const ScannerStackNavigator = () => (
  <ScannerStack.Navigator>
    <ScannerStack.Screen
      name="ScannerTab"
      options={{ headerShown: false }}
      component={ScannerTabScreen}
    />
    <ScannerStack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
  </ScannerStack.Navigator>
);

const ScannerTabScreen = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Scanner"
      component={ProductScanner}
      options={{
        headerShown: false,
        unmountOnBlur: true,
        title: 'Scanner',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="qr-code" size={size} color={color} />
        ), // QR Code icon
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('Scanner', {
            screen: 'Scanner',
          });
        },
      })}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesListScreen}
      options={{
        unmountOnBlur: true,
        title: 'Favorites',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart" size={size} color={color} />
        ), // Heart icon
      }}
    />
  </Tab.Navigator>
);



const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerPosition: 'right',
      headerShown: false,
    }}
  >
    <Drawer.Screen
      name="Main"
      component={MainStackNavigator}
      options={{
        drawerLabel: 'Gallery App',
        drawerIcon: () => null,
      }}
    />
    <Drawer.Screen name="Weather app" component={WeatherApp} />
    <Drawer.Screen name="Product Scanner" component={ScannerStackNavigator} />
    {/* Week screens will exist here */}
  </Drawer.Navigator>
);

const Navigation = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
