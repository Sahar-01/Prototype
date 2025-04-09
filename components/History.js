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
      const response = await axios.get(`http://192.168.32.30:3000/claims?username=${username}`);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'REJECTED': return { backgroundColor: '#FFEBEE', color: '#C62828' };
      case 'NEEDS_INFO': return { backgroundColor: '#FFF8E1', color: '#FB8C00' };
      case 'PENDING': return { backgroundColor: '#FFF3E0', color: '#EF6C00' };
      default: return { backgroundColor: '#ECEFF1', color: '#37474F' };
    }
  };

  const renderClaim = ({ item }) => {
    const statusStyles = getStatusStyle(item.status);
    return (
      <View style={styles.claimItem}>
        <View style={styles.claimHeader}>
          <Text style={styles.claimCategory}>{item.category}</Text>
          <View style={[styles.statusTag, { backgroundColor: statusStyles.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyles.color }]}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.claimInfo}>
          £{item.amount} • {item.date}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 12 }}>
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
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCE3E8',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  claimCategory: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  claimInfo: { fontSize: 14, color: '#6B7280' },
  statusTag: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default HistoryScreen;
