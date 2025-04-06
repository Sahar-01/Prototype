import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Modal } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    capital: false,
    specialChar: false,
  });

  const handleLogout = () => {
    console.log('Logging out...');
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
      alert('Password changed successfully!');
      toggleModal();
    } else {
      alert('Ensure all password requirements are met.');
    }
  };

  const goToChatScreen = () => {
    navigation.navigate('ChatScreen');
  };
}

export default function ProfileScreen({ navigation }) {

  const handleLogout = () => {
    // Perform any cleanup actions like removing user data (e.g., AsyncStorage)
    console.log('Logging out...');
    
    // Navigate back to Login and reset the navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* User Info */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>John Doe</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>john.doe@example.com</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Employee</Text>
      </View>

      {/* Editable Fields */}
      <View style={styles.section}>
        <Text style={styles.label}>Preferred Currency</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter preferred currency"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.label}>Enable 2FA</Text>
        <Switch value={true} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={toggleModal}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Assistance Button */}
      <TouchableOpacity style={styles.assistanceButton} onPress={goToChatScreen}>
        <Text style={styles.buttonText}>Assistance</Text>
      </TouchableOpacity>

      {/* Modal for Password Change */}
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
              <Text style={{ color: passwordValidations.length ? 'green' : 'red' }}>At least 10 characters</Text>
              <Text style={{ color: passwordValidations.capital ? 'green' : 'red' }}>At least 1 capital letter</Text>
              <Text style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>At least 1 special character</Text>
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
  sectionRow: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    padding: 12,
    backgroundColor: '#fff',
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