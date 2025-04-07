import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrency } from './CurrencyContext';
import { convertCurrency } from './CurrencyUtils';

const DashboardScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [claims, setClaims] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { currency } = useCurrency();

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    } else {
      setHasPermission(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClaims();
    }, [])
  );

  const fetchClaims = async () => {
    try {
      const response = await axios.get('http://192.168.1.180:8081/claims');
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const selectImage = async () => {
    if (!hasPermission) {
      console.log('Permission denied!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const image = result.assets[0];
      setImageUri(image.uri);
      uploadImage(image);
    } else {
      console.log('User cancelled image selection');
    }
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    });

    try {
      const response = await axios.post('http://192.168.1.180:8081/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('OCR Response:', response.data);
      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.fab} onPress={() => setShowOptions(!showOptions)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={selectImage}>
            <Text style={styles.optionText}>OCR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('CreateClaim')}
          >
            <Text style={styles.optionText}>Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      {extractedText ? <Text>{`Extracted Text: ${extractedText}`}</Text> : null}

      <View style={styles.claimsListContainer}>
        <FlatList
          data={claims}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.claimItem}>
              <View style={styles.claimHeader}>
                <Text style={styles.claimCategory}>{item.category}</Text>
                <Text style={styles.claimStatus}>{item.status}</Text>
              </View>
              <Text style={styles.claimInfo}>
                 {convertCurrency(item.amount, currency)} {currency} • {item.date}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#222',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  optionButton: {
    backgroundColor: '#68636b',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  claimsListContainer: {
    width: '100%',
    maxHeight: '50%',
    marginBottom: 10,
  },
  claimItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    marginBottom: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  claimCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  claimStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  claimInfo: {
    fontSize: 14,
    color: '#555',
  },
});

export default DashboardScreen;