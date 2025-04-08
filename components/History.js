import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const HistoryScreen = ({ route }) => {
  const { username } = route.params;
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [sortType, setSortType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchClaims();
    }, [username])
  );

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`http://192.168.24.30:3000/claims?username=${username}`);
      setClaims(response.data);
      setFilteredClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleSort = (type) => {
    let sorted = [...filteredClaims];

    switch (type) {
      case 'dateRecent':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'dateOldest':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amountHigh':
        sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        break;
      case 'amountLow':
        sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        break;
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    setSortType(type);
    setFilteredClaims(sorted);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const lower = query.toLowerCase();
    const filtered = claims.filter(
      (claim) =>
        claim.category.toLowerCase().includes(lower) ||
        (claim.description && claim.description.toLowerCase().includes(lower))
    );

    setFilteredClaims(filtered);
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

      <TextInput
        style={styles.searchBar}
        placeholder="Search by category or description"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <View style={styles.sortSection}>
        <Picker
          selectedValue={sortType}
          onValueChange={(value) => handleSort(value)}
          style={styles.picker}
        >
          <Picker.Item label="Sort by..." value="" enabled={false} />
          <Picker.Item label="Date (Recent → Oldest)" value="dateRecent" />
          <Picker.Item label="Date (Oldest → Recent)" value="dateOldest" />
          <Picker.Item label="Amount (High → Low)" value="amountHigh" />
          <Picker.Item label="Amount (Low → High)" value="amountLow" />
          <Picker.Item label="Status (A-Z)" value="status" />
          <Picker.Item label="Category (A-Z)" value="category" />
        </Picker>
      </View>

      <FlatList
        data={filteredClaims}
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
  searchBar: {
    height: 45,
    borderColor: '#C9D3DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  sortSection: {
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  claimItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  claimCategory: { fontSize: 16, fontWeight: '600', color: '#333' },
  claimStatus: { fontSize: 14, fontWeight: '500', color: '#666' },
  claimInfo: { fontSize: 14, color: '#555' },
});

export default HistoryScreen;