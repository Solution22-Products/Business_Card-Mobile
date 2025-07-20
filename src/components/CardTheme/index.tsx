import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IMAGES from '../../constants';
import ClassicStackCard from '../../components/Themes/classicStackCard';

interface CardThemeProps {
  name: string;
  designation?: string;
  company?: string;
  avatar: string;
  cover?: string;
  theme: string;
  mobile?: string;
  website?: string;
  address?: string;
  email?: string;
  style?: any;
}

const ShadowCardWrapper: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => (
  <View style={[ style]}>{children}</View>
);



const CardThemePreview: React.FC<CardThemeProps> = props => {
  return <ClassicStackCard {...props} />;
};

export default CardThemePreview;

