import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import ImageItem from './ImageItem';

interface ImageData {
  id: number;
  url: string;
}

const imageData: ImageData[] = [];
for (let i = 1; i < 70; i++) {
  imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
}

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleImageClose = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item }: { item: ImageData }) => (
    <ImageItem url={item.url} onSelect={handleImageSelect} />
  );

  const filteredImages = imageData.filter((image) => image.id.toString().includes(searchTerm));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by ID..."
        // I know this isn't required but I feel like restricting
        // the user to only put in numbers would be acceptable when they're searching by number
        keyboardType="numeric" 
        value={searchTerm}
        onChangeText={handleSearch}

      />
      {selectedImage ? (
        <TouchableOpacity style={styles.modalImageContainer} onPress={handleImageClose}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          <Ionicons name="close-circle-outline" size={36} color="white" style={styles.closeIcon} />
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    alignItems: 'center',
  },
  searchInput: {
    width: '75%',
    height: 40,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  modalImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
