import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';

const CitySearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (query === '') {
      setCities([]); // Clear the list when the query is empty
      return;
    }

    // Define the search term (query)
    const searchTerm = query.toLowerCase();

    // Query data from your JSON server with the search term
    axios
      .get(`http://192.168.1.197:3000/cities?name_like=${searchTerm}`)
      .then((response) => {
        const cityData = response.data;
        setCities(cityData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [query]);

  const handleSelectCity = (city) => {
    navigation.navigate('Weather', {
      useDeviceLocation: false, // Optionally set useDeviceLocation to false
      location: {
        latitude: city.coord.lat,
        longitude: city.coord.lon,
      },
    });
  };
  
  

  const renderCityItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectCity(item)}>
      <Text style={styles.cityItem}>
        {item.name}, {item.state}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>City Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a city name..."
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cityItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
  },
});

export default CitySearchScreen;
