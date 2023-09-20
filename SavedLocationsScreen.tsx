import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';

const SavedLocationsScreen = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState([]);

  const fetchSavedLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('savedLocations');
      if (storedLocations) {
        const parsedLocations = JSON.parse(storedLocations);
        setSavedLocations(parsedLocations);
      }
    } catch (error) {
      console.error('Error fetching saved locations:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedLocations();
    }, [])
  );

  const handleSelectCity = (city) => {
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
      <Text style={styles.title}>Saved Locations</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',      
    textAlignVertical: 'center' 
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SavedLocationsScreen;
