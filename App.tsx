import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import PhotoGalleryScreen from './PhotoGalleryScreen';
import PhotoDetailScreen from './PhotoDetailScreen';
import ImageModalScreen from './ImageModalScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhotoGallery">
        <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
        <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
        <Stack.Screen name="ImageModal" options={{headerShown: false}} component={ImageModalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
