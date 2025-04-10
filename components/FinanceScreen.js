import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BarChart } from 'react-native-chart-kit';
import Modal from 'react-native-modal';

const FinanceScreen = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchApprovedClaims();
  }, []);

  const fetchApprovedClaims = async () => {
    try {
      const response = await axios.get('http://192.168.32.30:3000/claims');
      const approvedOnly = response.data.filter(claim => claim.status === 'APPROVED');
      setClaims(approvedOnly);
    } catch (error) {
      console.error('❌ Error fetching approved claims:', error);
    }
  };

  const handleClaimPress = (claim) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  const integrateClaim = () => {
    Alert.alert('Integration Started', `Claim ID ${selectedClaim.id} is being integrated.`);
    setModalVisible(false);
  };

  const getMonthlyAmounts = () => {
    const amounts = Array(12).fill(0);
    claims.forEach((claim) => {
      if (claim.date) {
        const monthIndex = moment(claim.date).month();
        amounts[monthIndex] += parseFloat(claim.amount);
      }
    });
    return amounts;
  };

  const getTotalThisMonthAmount = () => {
    const thisMonth = moment().month();
    return claims
      .filter((claim) => moment(claim.date).month() === thisMonth)
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
  };

  const getAmountColor = () => '#2E7D32';

  const renderClaim = ({ item }) => (
    <TouchableOpacity onPress={() => handleClaimPress(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.category}</Text>
          <Text style={[styles.itemAmount, { color: getAmountColor() }]}>£{item.amount}</Text>
        </View>
        <Text style={styles.itemInfo}>Date: {moment(item.date).format('YYYY-MM-DD')}</Text>
        <Text style={styles.itemInfo}>Staff: {item.staffId}</Text>
        <View style={[styles.statusTag, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statusText, { color: '#2E7D32' }]}>APPROVED</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const monthLabels = ['Jan', '', 'Mar', '', 'May', '', 'Jul', '', 'Sep', '', 'Nov', ''];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ marginTop: 20 }}>
          <BarChart
            data={{
              labels: monthLabels,
              datasets: [{ data: getMonthlyAmounts() }],
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel="£"
            fromZero
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: () => '#222',
              barPercentage: 0.7,
              propsForBars: {
                rx: 6,
              },
              propsForBackgroundLines: {
                stroke: '#eee',
              },
            }}
            style={styles.chart}
          />
        </View>

        {/* Summary Boxes */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total this month</Text>
            <Text style={styles.summaryValue}>£{getTotalThisMonthAmount().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total overall</Text>
            <Text style={styles.summaryValue}>£{claims.reduce((sum, c) => sum + parseFloat(c.amount), 0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Approved Claims List */}
        <Text style={styles.sectionTitle}>Approved Claims</Text>
        <FlatList
          data={claims}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderClaim}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Integration Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Integrate Claim</Text>
          <Text style={styles.modalClaim}>Claim ID: {selectedClaim?.id}</Text>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
            onPress={integrateClaim}
          >
            <Text style={styles.modalButtonText}>Integrate</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default FinanceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chart: {
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  summaryBox: {
    backgroundColor: '#F1F5F9',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 10,
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCE3E8',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  itemAmount: { fontSize: 18, fontWeight: '600' },
  itemInfo: { marginTop: 4, fontSize: 14, color: '#6B7280' },
  statusTag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1D2A32',
  },
  modalClaim: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
    color: '#444',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});