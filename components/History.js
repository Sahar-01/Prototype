import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useCurrency } from './CurrencyContext';
import { convertCurrency } from './CurrencyUtils';

export default function History({ route }) {
  const [claims, setClaims] = useState([]);
  const username = route.params?.username;
  const { currency } = useCurrency();


  useEffect(() => {
    if (username) {
      fetchClaims(username);
    }
  }, [username]);

  const fetchClaims = async (username) => {
    try {
      const response = await axios.get(`http://192.168.1.180:8081/claims/user/${username}`);
      setClaims(response.data);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
    }
  };

  const renderClaim = ({ item }) => (
    <View style={styles.claimItem}>
      <View style={styles.claimHeader}>
        <Text style={styles.claimCategory}>{item.category}</Text>
        <Text style={styles.claimStatus}>{item.status}</Text>
      </View>
      <Text style={styles.claimInfo}>
        {convertCurrency(item.amount, currency)} {currency} • {item.date}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Claims</Text>
      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClaim}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  claimItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    marginBottom: 10,
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
