import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ToggleProps {
  /** Track state */
  isOn: boolean;
  /** Fired when user taps the switch */
  onToggle?: () => void;
  /** Active-track colour */
  onColor?: string;
  /** Inactive-track colour */
  offColor?: string;
  /** Optional text label */
  label?: string;
  /** Extra styles for the outer track */
  style?: StyleProp<ViewStyle>;
  /** Extra styles for the label */
  labelStyle?: StyleProp<TextStyle>;
}

const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle = () => {},
  onColor = '#4cd137',
  offColor = '#ecf0f1',
  label = '',
  style = {},
  labelStyle = {},
}) => {
  // Animated value drives wheel movement
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  // Animate whenever `isOn` changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  // Interpolate wheel’s horizontal position
  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20], // 20px slide distance
  });

  return (
    <View style={styles.container}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <View
          style={[
            styles.toggleContainer,
            style,
            { backgroundColor: isOn ? onColor : offColor },
          ]}
        >
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                marginLeft: moveToggle,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(Toggle);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    width: 50,
    height: 30,
    marginLeft: 3,
    borderRadius: 15,
    justifyContent: 'center',
  },
  label: {
    marginRight: 2,
  },
  toggleWheelStyle: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});
