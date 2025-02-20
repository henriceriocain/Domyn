// components / BouncyBoxTextInput 

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { BouncyBox } from './BouncyBox';

interface BouncyBoxTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  width?: DimensionValue;
  secureTextEntry?: boolean;
}

export const BouncyBoxTextInput: React.FC<BouncyBoxTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  width = '100%',
  secureTextEntry = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    setEditing(true);
    // Small delay to ensure the input gets focus after animation
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleFocus = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onChangeText(inputValue);
  };

  const containerStyle: ViewStyle = {
    ...styles.inputContainer,
    width,
  };

  // When not editing and secureTextEntry is true, mask the text.
  const displayText = secureTextEntry && !editing
    ? '•'.repeat(inputValue.length)
    : (value || placeholder);

  return (
    // Wrap in a view that always returns true for responder and stops propagation.
    <View
      onStartShouldSetResponder={() => true}
      onResponderRelease={(e) => e.stopPropagation()}
    >
      <BouncyBox containerStyle={containerStyle} onPress={!editing ? handlePress : undefined}>
        <View style={styles.inputWrapper}>
          {editing ? (
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor="#666"
              keyboardType={keyboardType}
              returnKeyType="done"
              secureTextEntry={secureTextEntry}
            />
          ) : (
            <Text style={[styles.inputText, !value && styles.inputPlaceholder]}>
              {displayText}
            </Text>
          )}
        </View>
      </BouncyBox>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 10,
    backgroundColor: '#262626',
    padding: 10,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    color: 'white',
    fontSize: 16,
    width: '100%',
  },
  inputText: {
    color: 'white',
    fontSize: 16,
  },
  inputPlaceholder: {
    color: '#666',
  },
});
