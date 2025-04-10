import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('GBP');
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert('Permission Denied', 'Camera roll permissions are required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const themedContainerStyle = darkTheme ? styles.containerDark : styles.container;
  const themedModalStyle = darkTheme ? styles.modalContentDark : styles.modalContent;
  const themedTextColor = darkTheme ? '#EEE' : '#333';

  return (
    <ScrollView contentContainerStyle={themedContainerStyle}>
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: themedTextColor }]}>Preferred Currency</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={preferredCurrency}
            onValueChange={(value) => setPreferredCurrency(value)}
            style={styles.picker}
          >
            <Picker.Item label="GBP (£)" value="GBP" />
            <Picker.Item label="USD ($)" value="USD" />
            <Picker.Item label="EUR (€)" value="EUR" />
            <Picker.Item label="JPY (¥)" value="JPY" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonGrey} onPress={toggleModal}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonGrey} onPress={goToChatScreen}>
        <Text style={styles.buttonText}>Need Assistance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDarkGrey} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.extraOptions}>
        <View style={styles.optionRow}>
          <Text style={[styles.optionLabel, { color: themedTextColor }]}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? '#C6FF00' : '#999'}
            trackColor={{ false: '#ccc', true: '#a2ff00' }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={[styles.optionLabel, { color: themedTextColor }]}>Dark Mode</Text>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            thumbColor={darkTheme ? '#C6FF00' : '#999'}
            trackColor={{ false: '#ccc', true: '#a2ff00' }}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.optionLabel, { color: themedTextColor }]}>About</Text>
          <Text style={[styles.optionDescription, { color: themedTextColor }]}>MyExpense helps you manage and track expense claims with ease. Version 1.0.</Text>
        </View>
      </View>

      <View style={styles.footerNote}>
        <Text style={{ color: themedTextColor, fontSize: 13 }}>© 2025 MyExpense</Text>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={themedModalStyle}>
            <Text style={[styles.modalTitle, { color: themedTextColor }]}>Change Password</Text>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor={darkTheme ? '#aaa' : '#666'}
              secureTextEntry
              onChangeText={handlePasswordChange}
              style={[styles.input, { color: themedTextColor, backgroundColor: darkTheme ? '#333' : '#fff', borderColor: darkTheme ? '#666' : '#bbb' }]}
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: passwordValidations.length ? 'green' : 'red' }}>
                • At least 10 characters
              </Text>
              <Text style={{ color: passwordValidations.capital ? 'green' : 'red' }}>
                • At least 1 capital letter
              </Text>
              <Text style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
                • At least 1 special character
              </Text>
            </View>
            <TouchableOpacity onPress={changePassword} style={styles.buttonGrey}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={[styles.modalCancel, { color: themedTextColor }]}>Cancel</Text>
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
    alignItems: 'center',
  },
  containerDark: {
    padding: 20,
    backgroundColor: '#2c2c2c',
    flexGrow: 1,
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  imageWrapper: {
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: '#555',
    fontSize: 13,
  },
  section: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonGrey: {
    backgroundColor: '#666',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonDarkGrey: {
    backgroundColor: '#444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  extraOptions: {
    marginTop: 30,
    width: '100%',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerNote: {
    marginTop: 40,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalContentDark: {
    width: '85%',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1D2A32',
  },
  modalCancel: {
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});