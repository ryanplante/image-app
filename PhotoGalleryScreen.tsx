import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import ImageItem from './ImageItem';

interface ImageData {
  id: number;
  url: string;
}

const PhotoGalleryScreen = ({ navigation }: { navigation: any }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleImageSelect = (imageUrl: string) => {
    navigation.navigate('PhotoDetail', { imageUrl });
  };

  const handleImageClose = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item }: { item: ImageData }) => (
    <ImageItem url={item.url} onSelect={handleImageSelect} />
  );

  const imageData: ImageData[] = [];
  for (let i = 1; i < 70; i++) {
    imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
  }

  const filteredImages = imageData.filter((image) => image.id.toString().includes(searchTerm));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by ID..."
        keyboardType="numeric"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      {selectedImage ? (
        <TouchableOpacity style={styles.modalImageContainer} onPress={handleImageClose}>
          {/* ... (selected image and close icon) */}
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

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
  
  export default PhotoGalleryScreen;



