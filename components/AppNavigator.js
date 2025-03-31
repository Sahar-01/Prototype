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
import ManageClaimsScreen from '../components/ManageClaimsScreen';
import ChatScreen from '../components/ChatScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
	const { isManager } = route.params || { isManager: false }; // Default to false
  console.log('BottomTabNavigator - Is Manager:', isManager);
  
	return (
		<Tab.Navigator
			initialRouteName="Dashboard"
			screenOptions={{
				tabBarStyle: {
					backgroundColor: '#C6FF00',
					height: 60,
					paddingBottom: 10,
					paddingTop: 10,
					justifyContent: 'center',
					alignItems: 'center',
				},
				headerShown: false,
			}}
		>
			<Tab.Screen
				name="Search"
				component={SearchScreen}
				options={{
					tabBarIcon: () => <Image source={require('../assets/history.png')} style={{ width: 35, height: 35 }} />,
					tabBarLabel: () => null,
				}}
			/>

			<Tab.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					tabBarIcon: () => <Image source={require('../assets/notification.png')} style={{ width: 30, height: 30 }} />,
					tabBarLabel: () => null,
				}}
			/>

			<Tab.Screen
				name="Dashboard"
				component={DashboardScreen}
				options={{
					tabBarIcon: () => <Image source={require('../assets/home.png')} style={{ width: 50, height: 50 }} />,
					tabBarLabel: () => null,
				}}
			/>
			{/* Manager-Only Tab */}
			{isManager && (
				<Tab.Screen
					name="ManageClaims"
					component={ManageClaimsScreen} // You'll need to create this screen
					options={{
						tabBarIcon: () => <Image source={require('../assets/manage.png')} style={{ width: 35, height: 35 }} />,
						tabBarLabel: () => null,
					}}
				/>
			)}
			
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: () => <Image source={require('../assets/profile.png')} style={{ width: 35, height: 35 }} />,
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
				<Stack.Screen
					name="Main"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
					initialParams={{ isManager: false }} // Default value
				/>
				<Stack.Screen name="ChatScreen" component={ChatScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;