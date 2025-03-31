import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';

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
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});