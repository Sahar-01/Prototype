import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function DashboardScreen() {
  const navigation = useNavigation(); // Get navigation object

  // Handle the action based on the icon pressed
  const handleAction = (action) => {
    console.log(`Action: ${action}`);
    switch (action) {
      case 'search':
        navigation.navigate('Search'); // Navigate to the Search screen
        break;
      case 'notifications':
        navigation.navigate('Notifications'); // Navigate to Notifications screen
        break;
      case 'profile':
        navigation.navigate('Profile'); // Navigate to Profile screen
        break;
      case 'home':
        navigation.navigate('Dashboard'); // Navigate to Dashboard (Home)
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color to white
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#C6FF00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#C6FF00',
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain', // Ensures icons are not stretched
  },
});
