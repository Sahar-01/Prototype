import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const DashboardScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [claims, setClaims] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // For toggling the visibility of smaller buttons

  // Request permission for gallery access (for Android)
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    } else {
      setHasPermission(true); // iOS doesn't need explicit permission
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // Select image from gallery using Expo's ImagePicker
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

  // Upload image to backend for OCR processing
  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: 'image/jpeg', // or use the image type returned by the picker
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

  // Fetch claims from backend
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

      {/* Main "+" Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowOptions(!showOptions)} // Toggle the visibility of smaller buttons
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Show smaller options when "+" button is clicked */}
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={selectImage} // This will open the Image Picker for OCR
          >
            <Text style={styles.optionText}>OCR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => console.log("Manual")} // You can add your manual entry function here
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
    backgroundColor: '#222', // Red color
    width: 70, // Increased size
    height: 70, // Increased size
    borderRadius: 35, // Circle shape
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
    bottom: 120, // Position options slightly above the main FAB
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  optionButton: {
    backgroundColor: '#68636b', // Green color for options
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Space between options
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

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

const MainPage = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [analyticsData] = useState([2230, 1400, 1830, 3540, 2140, 2690]); // Sample analytics data
  const [totalBalance] = useState(1250); // Current balance
  const [totalExpense] = useState(14300); // Total expense
  const [totalSalary] = useState(12500); // Total salary
  const [monthlyExpense] = useState(22789); // Monthly expense

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Total Balance Section */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            ${balanceVisible ? totalBalance : '*****'}
          </Text>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
            <Text style={styles.hideButton}>{balanceVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewTitle}>Total Expense</Text>
            <Text style={styles.overviewValue}>${totalExpense}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewTitle}>Total Salary</Text>
            <Text style={styles.overviewValue}>${totalSalary}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewTitle}>Monthly Expense</Text>
            <Text style={styles.overviewValue}>${monthlyExpense}</Text>
          </View>
        </View>

        {/* Analytics Section */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>Analytics</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  data: analyticsData,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Line color
                  strokeWidth: 2,
                },
              ],
            }}
            width={350}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f7f7f7',
              backgroundGradientTo: '#f7f7f7',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
          />
        </View>

        {/* Latest Entries Section */}
        <View style={styles.entriesContainer}>
          <Text style={styles.entriesTitle}>Latest Entries</Text>
          <View style={styles.entryItem}>
            <Icon name="shopping-cart" size={20} color="#000" />
            <Text style={styles.entryText}>Shopping - $100 + VAT 2%</Text>
            <Text style={styles.entryDate}>30 Sep, 2022</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="info-circle" size={20} color="#000" />
          <Text style={styles.navButtonText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="question-circle" size={20} color="#000" />
          <Text style={styles.navButtonText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="cogs" size={20} color="#000" />
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="sign-out" size={20} color="#000" />
          <Text style={styles.navButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  hideButton: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    alignItems: 'center',
    width: '30%',
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  analyticsContainer: {
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entriesContainer: {
    marginTop: 20,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  entryText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
    color: '#888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MainPage;
