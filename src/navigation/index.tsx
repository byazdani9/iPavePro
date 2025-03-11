import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { AuthForm } from '../components/Auth/AuthForm';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import JobsScreen from '../screens/Jobs/JobsScreen';
import JobDetailScreen from '../screens/Jobs/JobDetailScreen';
import CustomersScreen from '../screens/Customers/CustomersScreen';
import EstimatesScreen from '../screens/Estimates/EstimatesScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { getSession } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import { RootStackParamList, MainTabParamList } from './types';

// Create typed navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e9ecef',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{
          tabBarLabel: 'Jobs',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomersScreen}
        options={{
          tabBarLabel: 'Customers',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Estimates" 
        component={EstimatesScreen}
        options={{
          tabBarLabel: 'Estimates',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Check for existing session when app loads
    dispatch(getSession());
  }, [dispatch]);
  
  const isSignedIn = !!user;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
            {/* Define Job Detail Screen here */}
            <Stack.Screen 
              name="JobDetail" 
              component={JobDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="CustomerDetail" 
              component={CustomersScreen} // This will be replaced with an actual CustomerDetailScreen
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="EstimateDetail" 
              component={EstimatesScreen} // This will be replaced with an actual EstimateDetailScreen
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthForm} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
