import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import useWeatherAPI from './useWeatherAPI';
import CurrentWeatherScreen from './CurrentWeatherScreen';
import ForecastScreen from './ForecastScreen';

const Tab = createBottomTabNavigator();

const API_KEY = 'd7e88c2243f84a3eb41183055231408';

const WeatherApp = ({ route }) => {
  const { useDeviceLocation, location: routeLocation } = route.params;
  const [location, setLocation] = useState(routeLocation || null);
  const [currentKey, setCurrentKey] = useState(0);

  useEffect(() => {
    if (useDeviceLocation) {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
          }
        } catch (error) {
          console.error('Error getting location:', error);
        }
      })();
    }
  }, [useDeviceLocation]);

  // Use useEffect to update the location when route.params changes
  useEffect(() => {
    if (routeLocation) {
      setLocation(routeLocation);
    }
  }, [routeLocation]);

  const refreshData = useCallback(() => {
    setCurrentKey((prevKey) => prevKey + 1);
  }, []);

  const { data: currentWeatherData, loading: currentWeatherLoading } = useWeatherAPI(
    location ? `/current.json?q=${location.latitude},${location.longitude}` : '/current.json?q=Warwick,RI',
    API_KEY,
    [currentKey]
  );

  const { data: forecastData, loading: forecastLoading } = useWeatherAPI(
    location ? `/forecast.json?q=${location.latitude},${location.longitude}&days=7` : '/forecast.json?q=Warwick,RI&days=7',
    API_KEY,
    [currentKey]
  );

  if (currentWeatherLoading || forecastLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Current Weather">
        {() => <CurrentWeatherScreen data={currentWeatherData} onRefresh={refreshData} />}
      </Tab.Screen>
      <Tab.Screen name="7 Day Forecast">
        {() => <ForecastScreen data={forecastData} onRefresh={refreshData} />}
      </Tab.Screen>
    </Tab.Navigator>
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
