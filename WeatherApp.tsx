import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as Location from 'expo-location';
import useWeatherAPI from './useWeatherAPI';
import CurrentWeatherScreen from './CurrentWeatherScreen';
import ForecastScreen from './ForecastScreen';

const Drawer = createDrawerNavigator();
const API_KEY = 'd7e88c2243f84a3eb41183055231408';

const WeatherApp = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  const { data: currentWeatherData, loading: currentWeatherLoading } = useWeatherAPI(
    location ? `/current.json?q=${location.latitude},${location.longitude}` : '/current.json?q=Warwick,RI', // Default to Warwick if the location fails
    API_KEY
  );

  const { data: forecastData, loading: forecastLoading } = useWeatherAPI(
    location ? `/forecast.json?q=${location.latitude},${location.longitude}&days=7` : '/forecast.json?q=Warwick,RI&days=7',
    API_KEY
  );

  if (currentWeatherLoading || forecastLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Drawer.Navigator initialRouteName="CurrentWeather" screenOptions={{
          drawerPosition: 'left'
        }}>
        <Drawer.Screen name="Current Weather">
          {() => <CurrentWeatherScreen data={currentWeatherData} />}
        </Drawer.Screen>
        <Drawer.Screen name="Forecast">
          {() => <ForecastScreen data={forecastData} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WeatherApp;