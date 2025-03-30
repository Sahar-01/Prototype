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
    <ScrollView style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default MainPage;
