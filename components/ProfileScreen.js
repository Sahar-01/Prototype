import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useCurrency } from './CurrencyContext';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen({ route, navigation }) {
  const { user } = route.params;
  console.log('🧾 Profile user data:', user);
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>User not found</Text>
      </View>
    );
  }
  const { currency, setCurrency } = useCurrency();
  const [password, setPassword] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('GBP');
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    capital: false,
    specialChar: false,
  });

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordValidations({
      length: text.length >= 10,
      capital: /[A-Z]/.test(text),
      specialChar: /[^A-Za-z0-9]/.test(text),
    });
  };

  const changePassword = () => {
    if (Object.values(passwordValidations).every(Boolean)) {
      Alert.alert('✅ Success', 'Password changed successfully!');
      toggleModal();
    } else {
      Alert.alert('❌ Error', 'Ensure all password requirements are met.');
    }
  };

  const goToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* User Info */}
            <View style={styles.infoSection}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user.full_name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Employee</Text>
      </View>

      {/* Editable Fields */}
      <View style={styles.input}>
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          mode="dropdown"
          dropdownIconColor="#000"
        >
          <Picker.Item label="USD - US Dollar" value="USD" />
          <Picker.Item label="GBP - British Pound" value="GBP" />
          <Picker.Item label="EUR - Euro" value="EUR" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.assistanceButton} onPress={goToChatScreen}>
        <Text style={styles.buttonText}>Assistance</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              placeholder="Enter new password"
              secureTextEntry
              onChangeText={handlePasswordChange}
              style={styles.input}
            />
            <View>
              <Text style={{ color: passwordValidations.length ? 'green' : 'red' }}>
                At least 10 characters
              </Text>
              <Text style={{ color: passwordValidations.capital ? 'green' : 'red' }}>
                At least 1 capital letter
              </Text>
              <Text style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
                At least 1 special character
              </Text>
            </View>
            <TouchableOpacity onPress={changePassword} style={styles.primaryButton}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  infoSection: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 0,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
      height: 50,
      justifyContent: 'center',
   },    
  primaryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  assistanceButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    width: 150,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalCancel: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
  },
});
