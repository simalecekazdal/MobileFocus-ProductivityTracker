import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Yeni import
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen'; 
import ReportScreen from './src/screens/ReportScreen';
import WelcomeScreen from './src/screens/WelcomeScreen'; // Yeni ekran

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Eski App yapısını bir "Alt Bileşen" (MainApp) haline getirdik
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF0F5',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Ana Sayfa') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Raporlar') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#FFB6C1',
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Raporlar" component={ReportScreen} />
    </Tab.Navigator>
  );
}

// Ana App artık Stack Navigator kullanıyor
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* İlk açılan ekran WelcomeScreen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        {/* Giriş yapıldıktan sonra gidilecek yer MainApp */}
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}