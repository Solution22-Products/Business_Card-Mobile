import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface InputComponentProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  showCheck?: boolean; // ✅ NEW
  style?: any; // or: ViewStyle for stricter typing
}

const InputComponent: React.FC<InputComponentProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  showCheck,
  onChangeText,
  style,
  keyboardType = 'default',
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputWrapper,
        isFocused ? styles.inputFocused : styles.inputBlur,
        style, // ✅ dynamic styles passed from outside
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#888"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        {...rest}
      />
      {secureTextEntry ? (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      ) : showCheck && value.trim().length > 0 ? (
        <Icon name="checkmark-circle" size={20} color="#143D94" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F6FD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: '#0A5FFF',
  },
  inputBlur: {
    borderColor: '#E0E6F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
});

export default InputComponent;
