import React, { useState, useCallback } from 'react';
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

const DashboardScreen = ({ navigation, route }) => {
  const { username } = route.params;

  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [claims, setClaims] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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
      requestPermission();
      setClaims([]);
      fetchClaims();
    }, [username])
  );

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`http://192.168.109.30:3000/claims?username=${username}`);
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const selectImage = async () => {
    if (!hasPermission) return;

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
      const response = await axios.post('http://192.168.109.30:3000/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleLogout = () => {
    setClaims([]);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Summary logic
  const numberOfClaims = claims.length;
  const totalValue = claims.reduce((sum, claim) => sum + parseFloat(claim.amount), 0).toFixed(2);

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
            onPress={() => navigation.navigate('CreateClaim', { username })}
          >
            <Text style={styles.optionText}>Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      {extractedText ? <Text>{`Extracted Text: ${extractedText}`}</Text> : null}

      <View style={styles.claimsListContainer}>
        <FlatList
          data={claims.slice(0, 5)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.claimItem}>
              <View style={styles.claimHeader}>
                <Text style={styles.claimCategory}>{item.category}</Text>
                <Text style={styles.claimStatus}>{item.status}</Text>
              </View>
              <Text style={styles.claimInfo}>
                £{item.amount} • {item.date}
              </Text>
            </View>
          )}
        />
      </View>

      {/* 📦 Summary Boxes */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Number of Claims</Text>
          <Text style={styles.summaryValue}>{numberOfClaims}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>£{totalValue}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
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
  },
  fabText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
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
  optionText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  imagePreview: { width: 200, height: 200, marginTop: 10 },
  claimsListContainer: { width: '100%', maxHeight: '50%', marginBottom: 10 },
  claimItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    marginBottom: 10,
    marginTop: 15,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  claimCategory: { fontSize: 16, fontWeight: '600', color: '#333' },
  claimStatus: { fontSize: 14, fontWeight: '500', color: '#666' },
  claimInfo: { fontSize: 14, color: '#555' },

  // 🎯 Summary styles
  summaryContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#eef2f7',
    padding: 16,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen;
