console.log("CreateClaimScreen loaded");

import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';

export default function CreateClaimScreen({ navigation }) {

  
  const [claim, setClaim] = useState({
    category: '',
    amount: '',
    date: '',
    staffId: '',
  });

  const handleSubmit = async () => {
  
    const payload = { ...claim, status: 'PENDING' };
    console.log("Submitting claim payload:", payload);
  
    try {
      const response = await axios.post('http://192.168.0.68:3000/expenses/submit', payload);
      console.log("Response from backend:", response);
  
      if (response.status === 200) {
        alert('Success! Expense claim submitted.');
        navigation.goBack();
      } else {
        alert(`Unexpected server response: ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed: " + (error.message || "Unknown error"));
    }
  };
  
  
  
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Create Expense Claim</Text>

          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Travel)"
            value={claim.category}
            onChangeText={(text) => setClaim({ ...claim, category: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Amount (e.g., 100.00)"
            keyboardType="numeric"
            value={claim.amount}
            onChangeText={(text) => setClaim({ ...claim, amount: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={claim.date}
            onChangeText={(text) => setClaim({ ...claim, date: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Staff ID (optional)"
            value={claim.staffId}
            onChangeText={(text) => setClaim({ ...claim, staffId: text })}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Claim</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#C6FF00',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
});