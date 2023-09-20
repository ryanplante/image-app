import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface SavedLocationsScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}

function SavedLocationsScreen({ navigation }: SavedLocationsScreenProps) {
  const [savedLocations, setSavedLocations] = useState<City[]>([]);

  const fetchSavedLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('savedLocations');
      if (storedLocations) {
        console.log(storedLocations);
        const parsedLocations = JSON.parse(storedLocations) as City[];
        setSavedLocations(parsedLocations);
      }
    } catch (error) {
      console.error('Error fetching saved locations:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedLocations();
    }, [])
  );

  const handleSelectCity = (city: City) => {
    navigation.navigate('Weather', {
      useDeviceLocation: false,
      location: {
        latitude: city.lat,
        longitude: city.lon,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {savedLocations.length === 0 ? (
        <Text>No saved locations</Text>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectCity(item)}
              style={styles.locationItem}
            >
              <Text>{item.name}, {item.region}, {item.country}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    padding: 20,
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SavedLocationsScreen;
