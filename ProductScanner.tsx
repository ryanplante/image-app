import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFetch } from './useFetch'; // Adjust the path accordingly

const ProductScanner = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const id = extractProductId(data);
    if (id === -1)
    {
        console.error("Invalid product URL!");
    }
    else
    {
        navigation.navigate('ProductDetails', { productId: id });
    }
  };

  const extractProductId = (url: string) => {
    if (!url.endsWith('.json')) {
      return -1; // Return -1 for invalid URLs
    }
    
    const productIdStart = url.lastIndexOf('/') + 1;
    const productIdEnd = url.lastIndexOf('.json');
    
    if (productIdStart >= productIdEnd) {
      return -1; // Return -1 for invalid URLs
    }
    
    // Extract the product ID from the URL by removing the '.json' extension
    const productId = url.substring(productIdStart, productIdEnd);
    if (!isNaN(productId)) {
      return parseInt(productId); // Convert the extracted string to an integer
    }
    
    return -1; // Return -1 for invalid URLs
  };  

  if (hasPermission === null) {
    return <Text>Requesting permission to access the camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Ionicons name="scan" size={24} color="white" />
          <Text style={styles.scanAgainButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  scanAgainButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default ProductScanner;
