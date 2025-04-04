import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';

const FinanceScreen = () => {
  const [financeData, setFinanceData] = useState([]);

  // simulated data acquisition (replaceable as interface call in real project)
  useEffect(() => {
    const data = [
      { id: '1', type: 'income', amount: 5000, description: 'Salary', date: '2025-03-30' },
      { id: '2', type: 'expense', amount: 120, description: 'Groceries', date: '2025-03-31' },
      { id: '3', type: 'expense', amount: 50, description: 'Transport', date: '2025-04-01' },
      { id: '4', type: 'income', amount: 200, description: 'Freelance', date: '2025-04-02' },
    ];
    setFinanceData(data);
  }, []);

  // calculate total income and total expenses
  const totalIncome = financeData
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = financeData
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={[styles.itemAmount, item.type === 'expense' ? styles.expense : styles.income]}>
          {item.type === 'expense' ? '-' : '+'}${item.amount}
        </Text>
      </View>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* page title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Overview</Text>
      </View>

      {/* overview of income/expenditure */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>${totalIncome}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={styles.summaryValue}>${totalExpense}</Text>
        </View>
      </View>

      {/* transaction list */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Recent Transactions</Text>
        <FlatList
          data={financeData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* add trade button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    backgroundColor: '#C6FF00',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D2A32',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C9D3DB',
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginTop: 5,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  expense: {
    color: '#E53935',
  },
  income: {
    color: '#43A047',
  },
  itemDate: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#C6FF00',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    margin: 24,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FinanceScreen;
