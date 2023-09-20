import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import useWeatherAPI from './useWeatherAPI';
import CurrentWeatherScreen from './CurrentWeatherScreen';
import ForecastScreen from './ForecastScreen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

interface WeatherAppProps {
  route: {
    params: {
      useDeviceLocation: boolean;
      location?: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

function WeatherApp({ route }: WeatherAppProps) {
  const { useDeviceLocation, location: routeLocation } = route.params;
  console.log(useDeviceLocation);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentKey, setCurrentKey] = useState<number>(0);
  const [hasDeviceLocation, setHasDeviceLocation] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    refreshData();
  }, []);

  const refreshLocation = async () => {
    if (useDeviceLocation && !hasDeviceLocation) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
          setHasDeviceLocation(true);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
  };

  useEffect(() => {
    if (useDeviceLocation && !hasDeviceLocation) {
      refreshLocation();
    }
  }, [useDeviceLocation, hasDeviceLocation]);

  // Use useFocusEffect to update the location when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      if (routeLocation) {
        setLocation(routeLocation);
        refreshData(); // Refresh data when route location changes
      }
    }, [routeLocation])
  );

  const refreshData = useCallback(() => {
    setCurrentKey((prevKey) => prevKey + 1);
    setRefreshing(false); // Reset refreshing state when data is refreshed
  }, []);

  const { data: currentWeatherData, loading: currentWeatherLoading } = useWeatherAPI(
    location ? `/current.json?q=${location.latitude},${location.longitude}` : '/current.json?q=Warwick,RI',
    [currentKey]
  );

  const { data: forecastData, loading: forecastLoading } = useWeatherAPI(
    location ? `/forecast.json?q=${location.latitude},${location.longitude}&days=7` : '/forecast.json?q=Warwick,RI&days=7',
    [currentKey]
  );
  

  if (currentWeatherLoading || forecastLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Current Weather') {
              iconName = focused ? 'partly-sunny' : 'partly-sunny-outline'; // Clock icon
            } else if (route.name === '7 Day Forecast') {
              iconName = focused ? 'calendar' : 'calendar-outline'; // Calendar icon
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarActiveTintColor="blue" // Change the color for the active tab
        tabBarInactiveTintColor="gray" // Change the color for the inactive tab
        tabBarStyle={{
          display: 'flex',
        }}
      >
        <Tab.Screen name="Current Weather">
          {() => <CurrentWeatherScreen data={currentWeatherData} onRefresh={onRefresh} />}
        </Tab.Screen>
        <Tab.Screen name="7 Day Forecast">
          {() => <ForecastScreen data={forecastData} onRefresh={onRefresh} />}
        </Tab.Screen>
      </Tab.Navigator>
    </ScrollView>
  );
}

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
