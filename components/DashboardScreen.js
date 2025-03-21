import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function DashboardScreen() {
  const handleAction = (action) => {
    console.log(`Action: ${action}`);
    // Add logic to navigate or handle different actions
  };

  return (
    <View style={styles.container}>
      {/* Dashboard content goes here */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar}>
        {/* First Section */}
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => handleAction('search')}>
          <Image source={require('../assets/analytics.png')} style={[styles.icon, { width: 35, height: 35 }]} />
        </TouchableOpacity>

        {/* Second Section */}
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => handleAction('notifications')}>
          <Image source={require('../assets/notification.png')} style={[styles.icon, { width: 30, height: 30 }]} />
        </TouchableOpacity>

        {/* Third Section (Home, centered) */}
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => handleAction('home')}>
          <Image source={require('../assets/home.png')} style={[styles.icon, { width: 50, height: 50 }]} />
        </TouchableOpacity>


        {/* Fourth Section */}
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => handleAction('profile')}>
          <Image source={require('../assets/history.png')} style={[styles.icon, { width: 35, height: 35 }]} />
        </TouchableOpacity>

        {/* Fifth Section */}
        <TouchableOpacity style={styles.bottomBarItem} onPress={() => handleAction('profile')}>
          <Image source={require('../assets/profile.png')} style={[styles.icon, { width: 35, height: 35 }]} />
        </TouchableOpacity>
      </View>
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