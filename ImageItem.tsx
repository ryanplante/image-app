import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ImageItemProps {
  url: string;
  onSelect: (imageUrl: string) => void;
}

const ImageItem = ({ url, onSelect }: ImageItemProps) => {
  return (
    <TouchableOpacity onPress={() => onSelect(url)}>
      <Image source={{ uri: url }} style={styles.imageItem} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageItem: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default ImageItem;
