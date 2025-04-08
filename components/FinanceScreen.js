import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
} from 'react-native';
import axios from 'axios';

const FinanceScreen = () => {
  const [financeData, setFinanceData] = useState([]);

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const fetchAllClaims = async () => {
    try {
      const response = await axios.get('http://192.168.32.30:3000/claims');
      setFinanceData(response.data);
    } catch (error) {
      console.error('❌ Error fetching all claims:', error);
    }
  };

  const totalExpense = financeData
    .filter(item => item.status === 'APPROVED')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemDescription}>{item.category}</Text>
        <Text style={styles.itemAmount}>£{item.amount}</Text>
      </View>
      <Text style={styles.itemDate}>{item.date}</Text>
      <Text style={styles.itemDate}>Staff: {item.staffId}</Text>
      <Text style={styles.itemDate}>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Overview</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Approved Expense</Text>
          <Text style={styles.summaryValue}>£{totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Submitted Claims</Text>
        <FlatList
          data={financeData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 24,
    backgroundColor: '#C6FF00',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1D2A32' },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C9D3DB',
  },
  summaryBox: { alignItems: 'center' },
  summaryLabel: { fontSize: 18, fontWeight: '600', color: '#222' },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginTop: 5,
  },
  listContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemDescription: { fontSize: 18, fontWeight: '600', color: '#222' },
  itemAmount: { fontSize: 18, fontWeight: '600', color: '#E53935' },
  itemDate: { marginTop: 4, fontSize: 14, color: '#6b7280' },
});

export default FinanceScreen;
