import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = ({ route }) => {
  const { username } = route.params;
  const [claims, setClaims] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
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

  const renderClaim = ({ item }) => (
    <View style={styles.claimItem}>
      <View style={styles.claimHeader}>
        <Text style={styles.claimCategory}>{item.category}</Text>
        <Text style={styles.claimStatus}>{item.status}</Text>
      </View>
      <Text style={styles.claimInfo}>
        ${item.amount} • {item.date}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Claim History</Text>
      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClaim}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  claimItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  claimHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  claimCategory: { fontSize: 16, fontWeight: '600', color: '#333' },
  claimStatus: { fontSize: 14, fontWeight: '500', color: '#666' },
  claimInfo: { fontSize: 14, color: '#555' },
});

export default HistoryScreen;
