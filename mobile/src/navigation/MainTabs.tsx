import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import BooksScreen from '../screens/BooksScreen';
import AuthorsScreen from '../screens/AuthorsScreen';
import UsersScreen from '../screens/UsersScreen';
import BorrowedBooksScreen from '../screens/BorrowedBooksScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0ea5e9',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Books"
        component={BooksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Authors"
        component={AuthorsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Borrowed"
        component={BorrowedBooksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="library" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


