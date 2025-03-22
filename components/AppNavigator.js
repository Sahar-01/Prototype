import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, BackHandler } from 'react-native';

import LoginScreen from './LogInScreen'; // Your Login Screen
import DashboardScreen from './DashboardScreen'; // Your Main Dashboard Screen
import SearchScreen from '../components/SearchScreen'; // Your Search Screen
import NotificationsScreen from '../components/NotificationsScreen'; // Your Notifications Screen
import ProfileScreen from '../components/ProfileScreen'; // Your Profile Screen
import AnalyticsScreen from '../components/AnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#C6FF00', // Your background color
          height: 80, // Set the height for the bottom tab bar
          paddingBottom: 10, // Padding at the bottom to avoid icon cutoff
          paddingTop : 20,
          justifyContent: 'center', // Ensure icons are vertically centered
          alignItems: 'center', // Align items to center horizontally
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/analytics.png')} style={{ width: 35, height: 35 }} />
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/history.png')} style={{ width: 35, height: 35 }} />
          ),
          tabBarLabel: () => null,
        }}
      />



      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/home.png')} style={{ width: 50, height: 50 }} />
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/notification.png')} style={{ width: 30, height: 30 }} />
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/profile.png')} style={{ width: 35, height: 35 }} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;