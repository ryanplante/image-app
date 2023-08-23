import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFetch } from './useFetch'; // Adjust the path accordingly

const ProductDetails = ({ route, navigation }) => {
  const { productId } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: productData, loading } = useFetch(`https://rn-products-1d8a6-default-rtdb.firebaseio.com/products/${productId}.json`);

  useEffect(() => {
    // Check if the product is already favorited in async storage
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      setIsFavorite(favorites.includes(productId));
    } catch (error) {
      console.error("Error checking favorite status: ", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoriteProducts = JSON.parse(favorites) || [];

      if (isFavorite) {
        favoriteProducts = favoriteProducts.filter(id => id !== productId);
      } else {
        favoriteProducts.push(productId);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(favoriteProducts));
      setIsFavorite(!isFavorite);

      await checkFavoriteStatus();
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!productData) {
    return <Text>No product data available</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={toggleFavorite}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? 'red' : 'black'}
        />
      </TouchableOpacity>
      <Image source={{ uri: productData.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{productData.title}</Text>
      <Text style={styles.productCategory}>Category: {productData.category}</Text>
      <Text style={styles.productDescription}>{productData.description}</Text>
      <View style={styles.productRating}>
        <Text style={styles.ratingLabel}>Rating:</Text>
        <Text style={styles.ratingStars}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name={index < Math.floor(productData.rating.rate) ? 'star' : 'star-outline'}
              size={24}
              color="gold"
            />
          ))}
        </Text>
        <Text style={styles.ratingCount}>({productData.rating.count} reviews)</Text>
      </View>
      <Text style={styles.productPrice}>Price: ${productData.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.purpleButton]}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.purpleButton]}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
    margin: 10
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 40,
    left: 20,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 35,
    right: 20,
    zIndex: 1, 
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
    top: 25,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  productCategory: {
    fontSize: 18,
    marginBottom: 10,
    color: 'gray',
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  ratingLabel: {
    fontSize: 18,
    marginRight: 5,
    color: 'gray',
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingCount: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  purpleButton: {
    backgroundColor: 'purple',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
