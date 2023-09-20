import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';


const CitySearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);

  // Initialize an animated value for opacity
  const opacity = useSharedValue(0);

  // Create an animated style based on the opacity value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (query === '') {
      setCities([]); // Clear the list when the query is empty
      return;
    }

    // Define the search term (query)
    const searchTerm = query.toLowerCase();

    // Query data from the JSON server with the search term
    axios
      .get(`http://71.161.232.253:3009/cities?name_like=${searchTerm}`) // I am hosting a custom json-server to supply the city data
      .then((response) => {
        const cityData = response.data;
        setCities(cityData);

        // Trigger the fade-in animation for each city item with a delay
        cityData.forEach((_, index) => {
          opacity.value = withTiming(1, { duration: 500, delay: index * 100 });
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [query]);

  const handleSelectCity = (city) => {
    navigation.navigate('Weather', {
      useDeviceLocation: false,
      location: {
        latitude: city.coord.lat,
        longitude: city.coord.lon,
      },
    });
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectCity(item)}>
      <Animated.Text style={[styles.cityItem, animatedStyle]}>
        {item.name}, {item.state}, {item.country}
      </Animated.Text>
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
