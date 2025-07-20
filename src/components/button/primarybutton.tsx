import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  View,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import type { ReactNode } from 'react';

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabledBgColor?: string;
  bgColor?: string;
  width?: number | string;
  height?: number | string;
  radius?: number;
  padding?: number;
}

const DEFAULT_BG = '#FF6B00';
const DEFAULT_DISABLED_BG = '#CED4DA';
const DEFAULT_RADIUS = 8;
const DEFAULT_PADDING = 14;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  bgColor = DEFAULT_BG,
  disabledBgColor,
  width,
  height,
  radius = DEFAULT_RADIUS,
  padding,
}) => {
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinnerAnim, {
      toValue: loading ? 1 : 0,
      duration: 300,
      easing: loading ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [loading]);

  const contentOpacity = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const spinnerStyle = {
    opacity: spinnerAnim,
    transform: [
      {
        scale: spinnerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  const dynamicStyle: ViewStyle = {
    backgroundColor: (disabled || loading) ? (disabledBgColor ?? bgColor) : bgColor,
    borderRadius: radius,
    width,
    height,
    padding: padding ?? DEFAULT_PADDING,
    opacity: disabled || loading ? 0.6 : 1, // 💡 Dim when disabled
  };

  const finalTextStyle = [
    styles.buttonText,
    textStyle,
    disabled && { color: '#888' },
  ];

  return (
    <TouchableOpacity
      style={[styles.button, style, dynamicStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      <Animated.View style={[styles.loaderContainer, spinnerStyle]}>
        <ActivityIndicator color="#fff" size="small" />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={finalTextStyle}>{title}</Text>
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginHorizontal: 4,
  },
  loaderContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
