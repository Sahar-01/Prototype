import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation, route }) => {
  const { username, user } = route.params;

  const [claims, setClaims] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setClaims([]);
      fetchClaims();
    }, [username])
  );

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`http://192.168.32.30:3000/claims?username=${username}`);
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
      uploadImage(image.uri);
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
      const response = await axios.post('http://192.168.32.30:3000/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extracted = response.data.text;
      createClaimFromOCR(extracted);
    } catch (error) {
      console.error('OCR failed:', error);
      Alert.alert('Error', 'OCR failed. Please try again.');
    }
  };

  const createClaimFromOCR = async (text) => {
    const now = new Date();
    const claim = {
      username,
      category: 'OCR',
      amount: 4.5,
      date: now.toISOString().split('T')[0],
      description: text,
      status: 'Pending',
    };

    try {
      await axios.post('http://192.168.32.30:3000/claims', claim);
      fetchClaims();
    } catch (error) {
      console.error('Error creating OCR claim:', error);
    }
  };

  const getColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6A89CC', '#F8A5C2', '#60A3BC'];
    return colors[index % colors.length];
  };

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'REJECTED':
        return { backgroundColor: '#FFEBEE', color: '#C62828' };
      case 'PENDING':
      default:
        return { backgroundColor: '#FFF3E0', color: '#EF6C00' };
    }
  };

  const getCategoryChartData = () => {
    const categoryTotals = {};
    claims.forEach((claim) => {
      const amount = parseFloat(claim.amount);
      if (categoryTotals[claim.category]) {
        categoryTotals[claim.category] += amount;
      } else {
        categoryTotals[claim.category] = amount;
      }
    });

    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      population: amount,
      color: getColor(index),
      legendFontColor: '#37474F',
      legendFontSize: 13,
    }));
  };

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
            onPress={() => navigation.navigate('CreateClaim', { username, user })}
          >
            <Text style={styles.optionText}>Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.fixedTopSection}>
        <View style={styles.spacer} />
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Number of Claims</Text>
            <Text style={styles.summaryValue}>{claims.length}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Value</Text>
            <Text style={styles.summaryValue}>
              £{claims.reduce((sum, c) => sum + parseFloat(c.amount), 0).toFixed(2)}
            </Text>
          </View>
        </View>

        {claims.length > 0 && (
          <View style={styles.chartContainer}>
            <PieChart
              data={getCategoryChartData()}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => `rgba(0, 0, 0, 1)`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="5"
              absolute
              style={{ alignSelf: 'flex-start' }}
            />
          </View>
        )}
      </View>

      <FlatList
        contentContainerStyle={{ paddingTop: 350, paddingBottom: 100 }}
        data={claims.slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View style={styles.claimItem}>
              <View style={styles.claimHeader}>
                <Text style={styles.claimCategory}>{item.category}</Text>
                <View style={[styles.statusTag, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.claimInfo}>
                £{item.amount} • {item.date?.split('T')[0] || item.date}
              </Text>
              {item.description && (
                <Text style={styles.claimDescription}>{item.description}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    backgroundColor: '#222',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fabText: { color: '#fff', fontSize: 34, fontWeight: 'bold' },
  optionsContainer: {
    position: 'absolute',
    bottom: 95,
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  optionButton: {
    backgroundColor: '#68636b',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  fixedTopSection: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  spacer: { height: 10 },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    elevation: 0,
  },
  claimItem: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  claimCategory: { fontSize: 16, fontWeight: '600', color: '#333' },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  claimInfo: { fontSize: 14, color: '#555' },
  claimDescription: { fontSize: 12, color: '#777', marginTop: 4 },
});

export default DashboardScreen;