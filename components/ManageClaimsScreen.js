import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';

const ManageClaimsScreen = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const fetchAllClaims = async () => {
    try {
      const response = await axios.get('http://192.168.32.30:3000/claims');
      setClaims(response.data);
    } catch (error) {
      console.error('❌ Error fetching claims:', error);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      await axios.put(`http://192.168.32.30:3000/claims/${claimId}/status`, {
        status: newStatus,
      });
      setModalVisible(false);
      fetchAllClaims();
    } catch (error) {
      console.error('❌ Error updating status:', error);
      Alert.alert('Update failed', 'Please try again later.');
    }
  };

  const handleClaimPress = (claim) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  const getAmountColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#34A853';
      case 'PENDING': return '#FBBC05';
      case 'REJECTED': return '#EA4335';
      case 'NEEDS_INFO': return '#F29900';
      default: return '#555';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return { backgroundColor: '#E6F4EA', color: '#34A853' };
      case 'REJECTED': return { backgroundColor: '#FDECEA', color: '#EA4335' };
      case 'NEEDS_INFO': return { backgroundColor: '#FFF7E6', color: '#F29900' };
      case 'PENDING': return { backgroundColor: '#FEF9E7', color: '#FBBC05' };
      default: return { backgroundColor: '#ECEFF1', color: '#37474F' };
    }
  };

  const renderClaim = ({ item }) => {
    const statusStyles = getStatusStyle(item.status);
    const formattedDate = item.date.split('T')[0];
    return (
      <TouchableOpacity onPress={() => handleClaimPress(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.category}</Text>
            <Text style={[styles.itemAmount, { color: getAmountColor(item.status) }]}>£{item.amount}</Text>
          </View>
          <Text style={styles.itemInfo}>Date: {formattedDate}</Text>
          <Text style={styles.itemInfo}>Staff: {item.staffId}</Text>
          <View style={[styles.statusTag, { backgroundColor: statusStyles.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyles.color }]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pendingClaims = claims.filter(c => c.status === 'PENDING');
  const reviewedClaims = claims.filter(c => c.status !== 'PENDING');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {pendingClaims.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Claims to Review</Text>
            <FlatList
              data={pendingClaims}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderClaim}
              scrollEnabled={false}
            />
          </>
        )}

        {reviewedClaims.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reviewed Claims</Text>
            <FlatList
              data={reviewedClaims}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderClaim}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Claim Status</Text>
          <Text style={styles.modalClaim}>Claim ID: {selectedClaim?.id}</Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => updateClaimStatus(selectedClaim.id, 'APPROVED')}
          >
            <Text style={styles.modalButtonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#EA4335' }]}
            onPress={() => updateClaimStatus(selectedClaim.id, 'REJECTED')}
          >
            <Text style={styles.modalButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#F29900' }]}
            onPress={() => updateClaimStatus(selectedClaim.id, 'NEEDS_INFO')}
          >
            <Text style={styles.modalButtonText}>Request More Info</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 10,
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    backgroundColor: '#34A853',
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

export default ManageClaimsScreen;
