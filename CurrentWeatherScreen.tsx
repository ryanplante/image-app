import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';

const CurrentWeatherScreen = ({ data }) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!data || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  // Extract relevant data from the API response
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
    is_day, // Used for theming
  } = current;

  // Determine the appropriate gradient colors based on is_day
  const gradientColors = is_day
    ? ['#B4E1FF', '#1E2A4A'] // White to sky blue gradient for day
    : ['#1E2A4A', '#0B101D']; // Dark gradient for night

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <Text style={styles.location}>{location.name}, {location.region}</Text>
      <Image source={{ uri: `https:${icon}` }} style={styles.weatherIcon} />
      <Text style={styles.temperature}>{temp_f}°F</Text>
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
});

export default CurrentWeatherScreen;