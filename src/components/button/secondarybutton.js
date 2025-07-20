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

export interface SecondaryButtonProps {
  /** Text to show inside the button */
  title: string;
  /** Tap handler */
  onPress: (event: GestureResponderEvent) => void;

  /** States */
  disabled?: boolean;
  loading?: boolean;

  /** Optional icon(s) */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  /** Style overrides */
  style?: ViewStyle;
  textStyle?: TextStyle;

  /** Custom colors (optional) */
  bgColor?: string;          // default: '#000'
  textColor?: string;        // default: '#fff'
  outline?: boolean;         // if true → transparent bg, 1‑px border

  radius?: number;           // default: 8
  padding?: number;          // default: 14
  width?: number | string;
  height?: number | string;

  disabledBgColor?: string;  // default: '#CED4DA'
  disabledTextColor?: string;// default: '#6C757D'
}

const DEFAULT_BG         = '#000';
const DEFAULT_TEXT_COLOR = '#fff';
const DEFAULT_DISABLED_BG   = '#CED4DA';
const DEFAULT_DISABLED_TEXT = '#6C757D';
const DEFAULT_RADIUS   = 8;
const DEFAULT_PADDING  = 14;

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,

  /** customisation */
  bgColor,
  textColor,
  outline = false,
  radius = DEFAULT_RADIUS,
  padding = DEFAULT_PADDING,
  width,
  height,

  disabledBgColor,
  disabledTextColor,
}) => {
  /* ───────────── Loader animation ───────────── */
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

  /* ───────────── Dynamic colours ───────────── */
  const currentBg   = outline ? 'transparent'
                              : (disabled || loading)
                                ? (disabledBgColor ?? DEFAULT_DISABLED_BG)
                                : (bgColor ?? DEFAULT_BG);

  const currentText = (disabled || loading)
                      ? (disabledTextColor ?? DEFAULT_DISABLED_TEXT)
                      : (textColor ?? DEFAULT_TEXT_COLOR);

  /* ───────────── Combined style ───────────── */
  const dynamicStyle: ViewStyle = {
    backgroundColor: currentBg,
    borderWidth    : outline ? 1 : 0,
    borderColor    : outline ? (bgColor ?? DEFAULT_BG) : 'transparent',
    borderRadius   : radius,
    padding,
    width,
    height,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, dynamicStyle, style]}
    >
      {/* Loader */}
      <Animated.View style={[styles.loaderContainer, spinnerStyle]}>
        <ActivityIndicator color={currentText} size="small" />
      </Animated.View>

      {/* Icons & Text */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={[styles.title, { color: currentText }, textStyle]}>
          {title}
        </Text>
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

/* ───────────── Styles ───────────── */
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems   : 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems   : 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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
