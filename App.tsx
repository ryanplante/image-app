import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PhotoGalleryScreen from './PhotoGalleryScreen';
import PhotoDetailScreen from './PhotoDetailScreen';
import ImageModalScreen from './ImageModalScreen';
import WeatherApp from './WeatherApp';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'right',
          headerShown: false // Hide the header for all screens in the drawer navigator
        }}
      >
        <Drawer.Screen
          name="Main"
          component={MainStackNavigator}
          options={{
            drawerLabel: 'Gallery App',
            drawerIcon: () => null // Hide the drawer icon
          }}
        />
        <Drawer.Screen name="Weather app" component={WeatherApp} />
        {/* Add more week screens as needed */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const MainStack = createStackNavigator();

const MainStackNavigator = () => (
  <MainStack.Navigator initialRouteName="PhotoGallery">
    <MainStack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
    <MainStack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
    <MainStack.Screen name="ImageModal" options={{ headerShown: false }} component={ImageModalScreen} />
    <MainStack.Screen name="Weather app" component={WeatherApp} />
  </MainStack.Navigator>
);


export default App;
