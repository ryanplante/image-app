import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';

const ForecastScreen = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
  const forecastDayWidth = screenWidth * 0.5;
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const scaleValue = new Animated.Value(1);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scaleValue } } }],
    { useNativeDriver: false }
  );

  if (!data || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading forecast data...</Text>
      </View>
    );
  }

  const forecastDays = data.forecast.forecastday;

  return (
    <LinearGradient colors={['#B4E1FF', '#1E2A4A']} style={styles.container}>
      <Animated.ScrollView
        horizontal
        contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
      >
        {forecastDays.map((day, index) => {
          const date = new Date(day.date);
          date.setDate(date.getDate() + 1);
          const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).split(',')[0];

          const scale = scaleValue.interpolate({
            inputRange: [(index - 1) * forecastDayWidth, index * forecastDayWidth, (index + 1) * forecastDayWidth],
            outputRange: [0.8, 1, 0.8], // Adjust these values as needed
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={day.date_epoch}
              style={[
                styles.forecastDay,
                { width: forecastDayWidth, transform: [{ scale }] },
              ]}
            >
              <Text style={styles.date}>{dayOfWeek}</Text>
              <Image source={{ uri: `https:${day.day.condition.icon}` }} style={styles.weatherIcon} />
              <Text style={styles.condition}>{day.day.condition.text}</Text>
              <Text style={styles.temp}>High: {day.day.maxtemp_f}°F</Text>
              <Text style={styles.temp}>Low: {day.day.mintemp_f}°F</Text>
              <Text style={styles.infoText}>Precipitation: {day.day.totalprecip_in} in</Text>
              <Text style={styles.infoText}>Humidity: {day.day.avghumidity}%</Text>
              <Text style={styles.infoText}>UV Index: {day.day.uv}</Text>
              <Text style={styles.infoText}>Max Wind Speed: {day.day.maxwind_mph} mph</Text>
              <Text style={styles.infoText}>Avg Visibility: {day.day.avgvis_miles} miles</Text>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  forecastDay: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
  temp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'white',
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'white',
    marginBottom: 2,
  },
});

export default ForecastScreen;
