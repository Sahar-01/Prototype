import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
      const response = await axios.get('http://192.168.24.30:3000/claims');
      setClaims(response.data);
    } catch (error) {
      console.error('❌ Error fetching claims:', error);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      await axios.put(`http://192.168.24.30:3000/claims/${claimId}/status`, {
        status: newStatus,
      });
      setModalVisible(false);
      fetchAllClaims(); // Refresh claims after update
    } catch (error) {
      console.error('❌ Error updating status:', error);
      Alert.alert('Update failed', 'Please try again later.');
    }
  };

  const handleClaimPress = (claim) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  const renderClaim = ({ item }) => (
    <TouchableOpacity onPress={() => handleClaimPress(item)}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.category}</Text>
          <Text style={styles.itemAmount}>£{item.amount}</Text>
        </View>
        <Text style={styles.itemInfo}>Date: {item.date}</Text>
        <Text style={styles.itemInfo}>Staff: {item.staffId}</Text>
        <Text style={styles.itemInfo}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manager Claim Approvals</Text>
      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClaim}
        contentContainerStyle={{ paddingBottom: 20, padding: 20 }}
      />

      {/* Bottom Modal */}
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
            style={[styles.modalButton, { backgroundColor: '#E53935' }]}
            onPress={() => updateClaimStatus(selectedClaim.id, 'REJECTED')}
          >
            <Text style={styles.modalButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#FFA000' }]}
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D2A32',
    textAlign: 'center',
    marginVertical: 20,
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
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  itemAmount: { fontSize: 18, fontWeight: '600', color: '#E53935' },
  itemInfo: { marginTop: 4, fontSize: 14, color: '#6b7280' },
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
    backgroundColor: '#C6FF00',
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
