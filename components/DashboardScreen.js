import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform, StyleSheet, Modal, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const DashboardScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [claims, setClaims] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // New for Manual Entry Modal
  const [manualEntry, setManualEntry] = useState({
    amount: '',
    description: '',
    category: '',
  });

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
    fetchClaims(); // Fetch claims when component loads
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

    if (!result.cancelled) {
      setImageUri(result.uri);
      uploadImage(result);
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
      const response = await axios.get('http://10.0.2.2:3000/expense_claims');
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  // Submit manual entry to backend
  const handleManualSubmit = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/expense_claims', {
        amount: manualEntry.amount,
        description: manualEntry.description,
        category: manualEntry.category,
      });

      if (response.status === 200) {
        console.log('Claim added successfully!');
        fetchClaims(); // Fetch claims again to refresh the list
        setModalVisible(false); // Close modal
        setManualEntry({ amount: '', description: '', category: '' }); // Reset form
      } else {
        console.log('Error adding claim');
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Main "+" Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Show smaller options when "+" button is clicked */}
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
            onPress={() => setModalVisible(true)} // Open modal on Manual
          >
            <Text style={styles.optionText}>Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show Selected Image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {/* Show Extracted Text */}
      {extractedText ? <Text>{`Extracted Text: ${extractedText}`}</Text> : null}

      {/* Display Claims */}
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

      {/* Manual Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manual Entry</Text>

            <TextInput
              placeholder="Amount"
              value={manualEntry.amount}
              onChangeText={(text) => setManualEntry({ ...manualEntry, amount: text })}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Description"
              value={manualEntry.description}
              onChangeText={(text) => setManualEntry({ ...manualEntry, description: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Category"
              value={manualEntry.category}
              onChangeText={(text) => setManualEntry({ ...manualEntry, category: text })}
              style={styles.input}
            />

            <Button
              title="Submit"
              onPress={handleManualSubmit} // Submit data to backend
            />

            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default DashboardScreen;