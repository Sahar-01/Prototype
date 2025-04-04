import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native';

export default function LogInScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = () => {
    if (!form.email || !form.password) {
      alert('Please enter both email and password');
      return;
    }
  
    if (!/^[0-9]{6}$/.test(form.email)) {
      alert('Username must be exactly 6 digits');
      return;
    }
  
    const isManager = form.email.startsWith('0');
    const isFinance = form.email.startsWith('2');
    if (isManager)  {
      navigation.replace('Main', { isManager, isFinance });
      console.log('Is Manager:', isManager);
    }
    if (isFinance)  {
      console.log('Is Finance:', isFinance);
    }
  
    navigation.replace('Main', { isManager, isFinance });
  };
  
  
  useEffect(() => {
    const backAction = () => {
      return true;
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
              <View style={styles.header}>
                <Image alt="App Logo" resizeMode="contain" style={styles.headerImg} source={require('../assets/logo.png')} />
                <Text style={styles.title}>
                  Sign in to <Text style={styles.appName}>MyExpense</Text>
                </Text>
                <Text style={styles.subtitle}>Get access to your claims and more</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    onChangeText={(email) => setForm({ ...form, email })}
                    placeholder="123456"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.email}
                  />
                </View>

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

                <View style={styles.formAction}>
                  <TouchableOpacity onPress={handleLogin}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Sign in</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.formLink}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign up</Text></Text>
              </TouchableOpacity>
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
  signUpText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#222',
  },
  signUpLink: {
    color: '#C6FF00',
    fontWeight: 'bold',
  }
});