// navigation/drawertab.tsx
import React from 'react';
import { Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';

import IMAGES from '../constants';
import CustomDrawerContent from '../components/CustomDrawer';
import BottomTabNavigator from './bottomtabs';
import Profile from '../screens/profilescreen'
import Support from '../screens/supportscreen';

const Drawer = createDrawerNavigator();

export default function Drawertab() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#040404',
        drawerLabelStyle: { fontSize: 16 },
        drawerStyle: {
          width: '65%',
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'My Cards',
          drawerIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profilescreen"
        component={Profile}
        options={{
          drawerLabel: 'My Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={IMAGES.Support}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
