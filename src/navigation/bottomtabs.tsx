import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/homescreen';
import MyCards from '../screens/mycards';
import Insight from '../screens/insight';
import ContactScreen from '../screens/contactscreen';
import IMAGES from '../constants';
import ThemeScreen from '../screens/newcardscreen/index';
import AboutStepScreen from '../screens/aboutscreen';

const Tab = createBottomTabNavigator();

const icons = {
  homescreen: IMAGES.Home,
  mycards: IMAGES.Mycards,
  insight: IMAGES.Insights,
  contactscreen: IMAGES.Contact,
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const icon = icons[route.name as keyof typeof icons];
          return (
            <Image
              source={icon}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#0C53E9',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="homescreen"
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="mycards"
        component={MyCards}
        options={{ title: 'My Cards' }}
      />
      <Tab.Screen
        name="insight"
        component={Insight}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen
        name="contactscreen"
        component={ContactScreen}
        options={{ title: 'Contact' }}
      />
    
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
});
