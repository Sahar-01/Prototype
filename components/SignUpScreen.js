import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [passwordValidations, setPasswordValidations] = useState({ length: false, capital: false, specialChar: false });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handlePasswordChange = (password) => {
    setForm((prev) => ({ ...prev, password }));
    setPasswordValidations({
      length: password.length >= 10,
      capital: /[A-Z]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleSignUp = async () => {
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }

    const allValid = Object.values(passwordValidations).every(Boolean);
    if (!allValid) {
      Alert.alert('Password does not meet requirements');
      return;
    }

    try {
      const response = await fetch('http://192.168.32.30:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await response.text();
      console.log('📦 Raw response:', text);

      try {
        const data = JSON.parse(text);
        if (response.ok) {
          Alert.alert('Success', 'Account created successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Registration failed', data.message || 'Unknown error');
        }
      } catch (parseErr) {
        console.error('❌ JSON parse error:', parseErr);
        Alert.alert('Error', 'Unexpected response from the server');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Network request failed');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            placeholder="Enter username"
            style={styles.inputControl}
            onChangeText={(username) => setForm({ ...form, username })}
            value={form.username}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Enter email"
            keyboardType="email-address"
            style={styles.inputControl}
            onChangeText={(email) => setForm({ ...form, email })}
            value={form.email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder="Enter password"
            secureTextEntry
            style={styles.inputControl}
            onChangeText={handlePasswordChange}
            value={form.password}
          />
          <Text style={{ color: passwordValidations.length ? 'green' : 'red' }}>• At least 10 characters</Text>
          <Text style={{ color: passwordValidations.capital ? 'green' : 'red' }}>• At least 1 capital letter</Text>
          <Text style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>• At least 1 special character</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm password"
            secureTextEntry
            style={styles.inputControl}
            onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
            value={form.confirmPassword}
          />
        </View>

        <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.formLink}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D2A32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  inputControl: {
    height: 48,
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#C6FF00',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1D2A32',
  },
  formLink: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});
