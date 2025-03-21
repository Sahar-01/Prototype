import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native';

export default function LogInScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Login handler
  const handleLogin = () => {
    // Validate form fields
    if (!form.email || !form.password) {
      alert('Please enter both email and password');
      return;
    }

    // Handle login logic
    // If login is successful, navigate to the Dashboard
    navigation.replace('Main'); // This takes the user to the Dashboard
  };

  useEffect(() => {
    const backAction = () => {
      // Prevent back action on login screen
      return true; // Returning true prevents default back action behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Image alt="App Logo" resizeMode="contain" style={styles.headerImg} source={require('../assets/logo.png')} />
                <Text style={styles.title}>
                  Sign in to <Text style={styles.appName}>MyApp</Text>
                </Text>
                <Text style={styles.subtitle}>Get access to your portfolio and more</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email address</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={(email) => setForm({ ...form, email })}
                    placeholder="john@example.com"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.email}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    autoCorrect={false}
                    onChangeText={(password) => setForm({ ...form, password })}
                    placeholder="********"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    secureTextEntry={true}
                    value={form.password}
                  />
                </View>

                {/* Sign-in Button */}
                <View style={styles.formAction}>
                  <TouchableOpacity onPress={handleLogin}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Sign in</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity onPress={() => { /* Handle forgot password */ }}>
                  <Text style={styles.formLink}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 155,
    height: 155,
    marginBottom: 5,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
  },
  appName: {
    color: '#C6FF00',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  formAction: {
    marginTop: 10,
    marginBottom: 16,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    backgroundColor: '#C6FF00',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});
