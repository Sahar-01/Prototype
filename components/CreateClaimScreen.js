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
  View,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function CreateClaimScreen({ navigation, route }) {
  const { username } = route.params;

  const [claim, setClaim] = useState({
    category: '',
    customCategory: '',
    amount: '',
    currency: 'GBP',
    date: '',
    description: '',
    staffId: username,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const currencyRates = {
    GBP: 1,
    USD: 0.79,
    EUR: 0.86,
    JPY: 0.0053,
    CAD: 0.58,
    AUD: 0.52,
    CHF: 0.88,
    CNY: 0.11,
    SGD: 0.59,
    NZD: 0.47,
    SEK: 0.074,
    NOK: 0.071,
    INR: 0.0095,
    TRY: 0.026,
    AED: 0.22,
  };

  const handleSubmit = async () => {
    const finalCategory = claim.category === 'Other' ? claim.customCategory : claim.category;

    if (!finalCategory || !claim.amount || !claim.date) {
      Alert.alert('Missing info', 'Please fill in all required fields.');
      return;
    }

    const numericAmount = parseFloat(claim.amount);
    const rate = currencyRates[claim.currency] || 1;
    const convertedAmount = (numericAmount * rate).toFixed(2);

    const payload = {
      ...claim,
      category: finalCategory,
      amount: convertedAmount,
      currency: 'GBP',
      status: 'PENDING',
    };

    delete payload.customCategory;

    console.log("Submitting claim payload (in GBP):", payload);

    try {
      const response = await axios.post('http://192.168.24.30:3000/expenses/submit', payload);
      if (response.status === 200) {
        Alert.alert('Success!', 'Expense claim submitted.');
        navigation.goBack();
      } else {
        Alert.alert('Error', `Unexpected server response: ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Submission failed: " + (error.message || "Unknown error"));
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setClaim({ ...claim, date: formatted });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.headerLabel}>New Claim</Text>

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={claim.category}
              onValueChange={(value) => setClaim({ ...claim, category: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" enabled={false} />
              <Picker.Item label="Travel" value="Travel" />
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Hotel" value="Hotel" />
              <Picker.Item label="Fuel" value="Fuel" />
              <Picker.Item label="Products" value="Products" />
              <Picker.Item label="Miscellaneous" value="Misc" />
              <Picker.Item label="Other (type below)" value="Other" />
            </Picker>
          </View>

          {claim.category === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Custom category"
              value={claim.customCategory}
              onChangeText={(text) => setClaim({ ...claim, customCategory: text })}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Amount (e.g., 100.00)"
            keyboardType="numeric"
            value={claim.amount}
            onChangeText={(text) => setClaim({ ...claim, amount: text })}
          />

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={claim.currency}
              onValueChange={(value) => setClaim({ ...claim, currency: value })}
              style={styles.picker}
            >
              <Picker.Item label="GBP (£)" value="GBP" />
              <Picker.Item label="USD ($)" value="USD" />
              <Picker.Item label="EUR (€)" value="EUR" />
              <Picker.Item label="JPY (¥)" value="JPY" />
              <Picker.Item label="CAD (C$)" value="CAD" />
              <Picker.Item label="AUD (A$)" value="AUD" />
              <Picker.Item label="CHF (Fr)" value="CHF" />
              <Picker.Item label="CNY (¥)" value="CNY" />
              <Picker.Item label="SGD (S$)" value="SGD" />
              <Picker.Item label="NZD (NZ$)" value="NZD" />
              <Picker.Item label="SEK (kr)" value="SEK" />
              <Picker.Item label="NOK (kr)" value="NOK" />
              <Picker.Item label="INR (₹)" value="INR" />
              <Picker.Item label="TRY (₺)" value="TRY" />
              <Picker.Item label="AED (د.إ)" value="AED" />
            </Picker>
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={[styles.input, { justifyContent: 'center' }]}>
              <Text style={{ color: claim.date ? '#000' : '#888' }}>
                {claim.date || 'Select Date'}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={claim.date ? new Date(claim.date) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={onChangeDate}
            />
          )}

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Description (optional)"
            multiline
            value={claim.description}
            onChangeText={(text) => setClaim({ ...claim, description: text })}
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
  },
  headerLabel: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'left',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 10,
    marginBottom: 18,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#C6FF00',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 17,
  },
});