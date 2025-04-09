import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const DashboardScreen = ({ navigation, route }) => {
  const { username } = route.params;

  const [claims, setClaims] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setClaims([]);
      fetchClaims();
    }, [username])
  );

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`http://172.20.10.14:3000/claims?username=${username}`);
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow access to photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImage(image.uri); // No need to show image
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    });
  
    try {
      const response = await axios.post('http://172.20.10.14:3000/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const extracted = response.data.text;
      setExtractedText(extracted);
      createClaimFromOCR(extracted);
    } catch (error) {
      console.error('OCR failed:', error);
      Alert.alert('Error', 'OCR failed. Please try again.');
    }
  };
  

  const createClaimFromOCR = async (text) => {
    const now = new Date();
    const dummyAmount = 4.50;
    const claim = {
      username,
      category: 'OCR',
      amount: dummyAmount,
      date: now.toISOString().split('T')[0],
      description: text,
      status: 'Pending',
    };

    try {
      await axios.post('http://172.20.10.14:3000/claims', claim);
      fetchClaims(); // Refresh claims list to include this one
    } catch (error) {
      console.error('Error creating OCR claim:', error);
    }
  };

  const handleLogout = () => {
    setClaims([]);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const numberOfClaims = claims.length;
  const totalValue = claims.reduce((sum, claim) => sum + parseFloat(claim.amount), 0).toFixed(2);

  const getColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6A89CC', '#F8A5C2', '#60A3BC'];
    return colors[index % colors.length];
  };

  const getCategoryChartData = () => {
    const categoryTotals = {};
    claims.forEach((claim) => {
      if (categoryTotals[claim.category]) {
        categoryTotals[claim.category] += parseFloat(claim.amount);
      } else {
        categoryTotals[claim.category] = parseFloat(claim.amount);
      }
    });

    const pieData = [];
    const legendItems = [];

    Object.entries(categoryTotals).forEach(([category, value], index) => {
      const color = getColor(index);

      pieData.push({
        key: category,
        value,
        svg: {
          fill: color,
          onPress: () => Alert.alert('Category', category),
        },
        arc: { outerRadius: '100%', padAngle: 0.02 },
      });

      legendItems.push({ category, color });
    });

    return { pieData, legendItems };
  };

  const { pieData, legendItems } = getCategoryChartData();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={() => setShowOptions(!showOptions)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={selectImageFromGallery}>
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
              {item.description && (
                <Text style={styles.claimDescription}>{item.description}</Text>
              )}
              {item.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: '#FF6B6B', marginTop: 10 }]}
                  onPress={async () => {
                    try {
                      await axios.delete(`http://172.20.10.14:3000/claims/${item.id}`);
                      fetchClaims(); // Refresh claims list
                    } catch (error) {
                      console.error('Error withdrawing claim:', error);
                      Alert.alert('Error', 'Failed to withdraw claim. Please try again.');
                    }
                  }}
                >
                  <Text style={styles.optionText}>Withdraw</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>

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

      {claims.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Claims by Category</Text>
          <PieChart style={{ height: 200, width: 200 }} data={pieData} />
          <View style={styles.legendContainer}>
            {legendItems.map((item) => (
              <View key={item.category} style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.category}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    zIndex: 10,
  },
  fabText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  optionsContainer: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 10,
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
  claimDescription: { fontSize: 12, color: '#777', marginTop: 4 },
  summaryContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#eef2f7',
    padding: 10,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#444',
  },
});

export default DashboardScreen;
