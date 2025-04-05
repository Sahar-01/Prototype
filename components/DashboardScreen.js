import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const DashboardScreen = ({ navigation }) => {
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

  useEffect(() => {
    requestPermission();
  }, []);

  const selectImage = async () => {
    if (!hasPermission) {
      console.log("Permission denied!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setImageUri(image.uri);
      uploadImage(image);
    } else {
      console.log("User cancelled image selection");
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
      const response = await axios.post('http://10.0.2.2:3000/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("OCR Response:", response.data);
      setExtractedText(response.data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/claims');
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={selectImage}
          >
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

      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.claimItem}>
            <Text>Amount: ${item.amount}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  claimItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
});

export default DashboardScreen;
