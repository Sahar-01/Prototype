import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LogInScreen'; // Update this path to your actual Login Screen
import DashboardScreen from './DashboardScreen'; // Create this file for your main dashboard

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header on login screen
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }} // Hide header on dashboard screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
