import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFetch } from './useFetch';

interface ProductData {
  image: string;
  title: string;
}

interface FavoriteItemProps {
  productId: number;
  onPress: (productId: number) => void;
}

const FavoriteItem = ({ productId, onPress }) => {
  const url = `https://rn-products-1d8a6-default-rtdb.firebaseio.com/products/${productId}.json`;
  const { data: productData, loading } = useFetch<ProductData>(url);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <TouchableOpacity style={styles.favoriteItem} onPress={() => onPress(productId)}>
      <Image source={{ uri: productData.image }} style={styles.favoriteImage} />
      <Text style={styles.favoriteTitle}>{productData.title}</Text>
    </TouchableOpacity>
  );
};

interface Styles {
  container: ViewStyle;
  favoriteItem: ViewStyle;
  favoriteImage: ViewStyle;
  favoriteTitle: TextStyle;
}

const FavoritesListScreen = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getFavorites();
    }
  }, [isFocused]);

  const getFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoriteProductsData: number[] = JSON.parse(favorites);
        setFavoriteProducts(favoriteProductsData);
      } else {
        console.log('No favorites found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error getting favorites: ', error);
    }
  };

  const handleFavoriteItemPress = (productId: number) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const renderFavoriteItem = ({ item: productId }: { item: number }) => (
    <FavoriteItem productId={productId} onPress={handleFavoriteItemPress} />
  );

  return (
    <View style={styles.container}>
      {favoriteProducts.length === 0 ? (
        <Text>No favorite items found</Text>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    marginRight: 10,
  },
  favoriteTitle: {
    fontSize: 16,
  },
});

export default FavoritesListScreen;
