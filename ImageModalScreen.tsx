import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  PhotoDetail: { imageUrl: string };
  ImageModal: { imageUrl: string };
};

type ImageModalRouteProp = RouteProp<RootStackParamList, 'ImageModal'>;

type ImageModalScreenProps = StackScreenProps<RootStackParamList, 'ImageModal'>;

const ImageModalScreen = ({ route, navigation }: ImageModalScreenProps) => {
  const imageUrl = route.params.imageUrl;

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close-circle-outline" size={36} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.modalContent}>
        <Image source={{ uri: imageUrl }} style={styles.modalImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'ios' ? 40 : 50, // Adjust padding for iOS
    borderBottomWidth: Platform.OS === 'ios' ? 0 : 1, // Hide border for Android
    borderBottomColor: '#000', // Black border for Android
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 20 : 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ImageModalScreen;
