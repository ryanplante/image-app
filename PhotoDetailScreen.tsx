import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  PhotoDetail: { imageUrl: string };
  ImageModal: { imageUrl: string };
};

type PhotoDetailRouteProp = RouteProp<RootStackParamList, 'PhotoDetail'>;

const PhotoDetailScreen = () => {
  const route = useRoute<PhotoDetailRouteProp>();
  const imageUrl = route.params.imageUrl;
  const navigation = useNavigation();

  useEffect(() => {
    // Set the header title to the URL of the photo
    navigation.setOptions({ title: imageUrl });
  }, []); // Empty dependency array ensures this effect runs only once

  const handleImageModalPress = () => {
    console.log('Navigating to ImageModal:', imageUrl);
    navigation.navigate('ImageModal', { imageUrl } as RootStackParamList['ImageModal']); // Navigator doesn't navigate unless this is in there, not sure why
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.touchableArea}
        onPress={handleImageModalPress}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text>{imageUrl}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableArea: {
    width: '50%',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default PhotoDetailScreen;
