import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CurrentWeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_mph: number;
    pressure_mb: number;
    humidity: number;
    cloud: number;
    feelslike_f: number;
    vis_miles: number;
    uv: number;
    last_updated: string;
    is_day: boolean;
  };
}

interface CurrentWeatherScreenProps {
  data: CurrentWeatherData | null;
}

const CurrentWeatherScreen: React.FC<CurrentWeatherScreenProps> = ({ data }) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const [isFavorite, setIsFavorite] = useState(false); // Track whether the location is a favorite

  useEffect(() => {
    // Check if the location is in AsyncStorage when the component mounts
    const checkFavoriteStatus = async () => {
      try {
        const existingLocations = await AsyncStorage.getItem('savedLocations');
        if (existingLocations) {
          const parsedLocations = JSON.parse(existingLocations);
          const isLocationFavorite = parsedLocations.some(
            (loc: any) =>
              loc.name === data?.location.name &&
              loc.region === data?.location.region &&
              loc.country === data?.location.country
          );
          setIsFavorite(isLocationFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [data?.location]);

  if (!data || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  const { location, current } = data;
  const {
    temp_f,
    condition: { text, icon },
    wind_mph,
    pressure_mb,
    humidity,
    cloud,
    feelslike_f,
    vis_miles,
    uv,
    last_updated,
    is_day,
  } = current;

  const gradientColors = is_day
    ? ['#B4E1FF', '#1E2A4A']
    : ['#1E2A4A', '#0B101D'];

  const addToFavorites = async () => {
    try {
      const newLocation = {
        name: location.name,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
      };

      const existingLocations = await AsyncStorage.getItem('savedLocations');
      let updatedLocations: any[] = [];

      if (existingLocations) {
        const parsedLocations = JSON.parse(existingLocations);
        const isLocationFavorite = parsedLocations.some(
          (loc: any) =>
            loc.name === newLocation.name &&
            loc.region === newLocation.region &&
            loc.country === newLocation.country
        );

        if (isLocationFavorite) {
          // Remove location from favorites
          updatedLocations = parsedLocations.filter(
            (loc: any) =>
              loc.name !== newLocation.name ||
              loc.region !== newLocation.region ||
              loc.country !== newLocation.country
          );
          setIsFavorite(false);
        } else {
          // Add location to favorites
          updatedLocations = [...parsedLocations, newLocation];
          setIsFavorite(true);
        }
      } else {
        // If there are no existing locations, create a new array with the new location
        updatedLocations = [newLocation];
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Error adding/removing location to/from favorites:', error);
    }
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <Text style={styles.location}>{location.name}, {location.region}</Text>
      <Image source={{ uri: `https:${icon}` }} style={styles.weatherIcon} />
      <Text style={styles.temperature}>{Math.round(temp_f)}°F</Text>
      <Text style={styles.condition}>{text}</Text>
      <View style={styles.weatherDetails}>
        <Text style={styles.infoText}>Wind: {wind_mph} mph</Text>
        <Text style={styles.infoText}>Pressure: {pressure_mb} mb</Text>
        <Text style={styles.infoText}>Humidity: {humidity}%</Text>
        <Text style={styles.infoText}>Cloud Cover: {cloud}%</Text>
        <Text style={styles.infoText}>Feels Like: {feelslike_f}°F</Text>
        <Text style={styles.infoText}>Visibility: {vis_miles} mi</Text>
        <Text style={styles.infoText}>UV Index: {uv}</Text>
        <Text style={styles.infoText}>Last Updated: {last_updated}</Text>
      </View>
      <TouchableOpacity onPress={addToFavorites} style={styles.favoriteButton}>
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    marginBottom: 10,
    color: 'white',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  temperature: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: 20,
    color: 'white',
  },
  weatherDetails: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  favoriteButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  favoriteButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CurrentWeatherScreen;
