import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSignUp = async () => {
    const { username, email, password } = form;

    if (!username || !email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.72:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: 'STAFF',
        }),
      });

      if (response.ok) {
        alert('Account created successfully!');
        navigation.goBack(); // 👈 Keep this as requested
      } else {
        const message = await response.text();
        Alert.alert('Registration failed', message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

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
            onChangeText={(password) => setForm({ ...form, password })}
            value={form.password}
          />
        </View>

        <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
          <Text style={styles.btnText}>Sign Up</Text>
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
    alignItems: 'center',
  },
  container: {
    width: '80%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputControl: {
    height: 45,
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  btn: {
    backgroundColor: '#C6FF00',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  formLink: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});