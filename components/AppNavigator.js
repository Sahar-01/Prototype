import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import CreateClaimScreen from './CreateClaimScreen'; // or '../components/CreateClaimScreen'
import { CurrencyProvider } from '../components/CurrencyContext';
import LoginScreen from './LogInScreen'; 
import SignUpScreen from './SignUpScreen'; // Import SignUpScreen
import DashboardScreen from './DashboardScreen'; 
import History from '../components/History'; 
import NotificationsScreen from '../components/NotificationsScreen'; 
import ProfileScreen from '../components/ProfileScreen'; 
import ManageClaimsScreen from '../components/ManageClaimsScreen';
import FinanceScreen from './FinanceScreen';
import ChatScreen from '../components/ChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator({ route }) {
	const isManager = route.params?.isManager ?? false;
	const isFinance = route.params?.isFinance ?? false;
	const user = route.params?.user ?? null;
	const username = user?.username ?? null;
  
	console.log('BottomTabNavigator - Is Manager:', isManager, 'Is Finance:', isFinance);
	
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
		  component={History}
		  initialParams={{ username }}
		  options={{
			tabBarIcon: () => <Image source={require('../assets/history.png')} style={{ width: 35, height: 35 }} />,
			tabBarLabel: () => null,
		  }}
		/>
		<Tab.Screen
		  name="Notifications"
		  component={NotificationsScreen}
		  initialParams={{ username }}
		  options={{
			tabBarIcon: () => <Image source={require('../assets/notification.png')} style={{ width: 30, height: 30 }} />,
			tabBarLabel: () => null,
		  }}
		/>
		<Tab.Screen
		  name="Dashboard"
		  component={DashboardScreen}
		  initialParams={{ username }}
		  options={{
			tabBarIcon: () => <Image source={require('../assets/home.png')} style={{ width: 50, height: 50 }} />,
			tabBarLabel: () => null,
		  }}
		/>
		{isManager && (
		  <Tab.Screen
			name="ManageClaims"
			component={ManageClaimsScreen}
			initialParams={{ username }}
			options={{
			  tabBarIcon: () => <Image source={require('../assets/manage.png')} style={{ width: 35, height: 35 }} />,
			  tabBarLabel: () => null,
			}}
		  />
		)}
		{isFinance && (
		  <Tab.Screen
			name="Finance"
			component={FinanceScreen}
			initialParams={{ username }}
			options={{
			  tabBarIcon: () => <Image source={require('../assets/finance.png')} style={{ width: 35, height: 35 }} />,
			  tabBarLabel: () => null,
			}}
		  />
		)}
				<Tab.Screen
					name="Profile"
					component={ProfileScreen}
					initialParams={{ user }} // ✅ full user object now
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
				<Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
				<Stack.Screen
					name="Main"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
					initialParams={{ isManager: false }} // Default value
				/>
				<Stack.Screen name="ChatScreen" component={ChatScreen} />
				<Stack.Screen name="CreateClaim" component={CreateClaimScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;