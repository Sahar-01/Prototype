// components/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Switch, TextInput } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Display user details */}
      <Text style={styles.label}>Full Name: John Doe</Text>
      <Text style={styles.label}>Email: john.doe@example.com</Text>
      <Text style={styles.label}>Role: Employee</Text>

      {/* Currency preference */}
      <Text style={styles.label}>Preferred Currency</Text>
      <TextInput style={styles.input} placeholder="Enter preferred currency" />

      {/* 2FA Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable 2FA</Text>
        <Switch value={true} />
      </View>

      {/* Change Password Button */}
      <Button title="Change Password" onPress={() => {}} />

      {/* Logout Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Log Out" color="red" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
});

