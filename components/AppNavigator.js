import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import LoginScreen from './LogInScreen';
import DashboardScreen from './DashboardScreen';
import SearchScreen from '../components/SearchScreen';
import NotificationsScreen from '../components/NotificationsScreen';
import ProfileScreen from '../components/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#C6FF00' },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/home.png')} style={{ width: 50, height: 50 }} />
          ),
          tabBarLabel: () => null,  // Hide text label
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/analytics.png')} style={{ width: 35, height: 35 }} />
          ),
          tabBarLabel: () => null,  // Hide text label
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/notification.png')} style={{ width: 30, height: 30 }} />
          ),
          tabBarLabel: () => null,  // Hide text label
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('../assets/profile.png')} style={{ width: 35, height: 35 }} />
          ),
          tabBarLabel: () => null,  // Hide text label
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
