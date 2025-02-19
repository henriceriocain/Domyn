// CredentialsScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BouncyBox } from '../../components/BouncyBox';

export default function CredentialsScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    const allFilled = email.trim() !== '' && 
                     password.trim() !== '' && 
                     retypePassword.trim() !== '';
    const passwordsMatch = password === retypePassword;
    const isEmailValid = /\S+@\S+\.\S+/.test(email); // Basic email validation
    
    return allFilled && passwordsMatch && isEmailValid;
  }, [email, password, retypePassword]);

  const handleNext = async () => {
    if (!isValid) return;
    
    setLoading(true);
    try {
      // Replace with your backend API endpoint.
      const response = await fetch('https://your-backend-url.com/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Failed to save credentials');
      }
      router.push('/auth/PersonalDetailsScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was a problem saving your credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Bouncy email input component
  const BouncyEmailInput = ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handlePress = () => setEditing(true);
    const handleBlur = () => {
      setEditing(false);
      onChangeText(inputValue);
    };

    return (
      <BouncyBox containerStyle={styles.emailContainer} onPress={!editing ? handlePress : undefined}>
        <View style={styles.emailWrapper}>
          {editing ? (
            <TextInput
              style={styles.emailInput}
              value={inputValue}
              onChangeText={setInputValue}
              onBlur={handleBlur}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          ) : (
            <Text style={[styles.emailText, !value && styles.emailPlaceholder]}>
              {value || "Enter your email"}
            </Text>
          )}
        </View>
      </BouncyBox>
    );
  };

  // Bouncy password input component
  const BouncyPasswordInput = ({
    value,
    onChangeText,
    placeholder,
  }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
  }) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handlePress = () => setEditing(true);
    const handleBlur = () => {
      setEditing(false);
      onChangeText(inputValue);
    };

    return (
      <BouncyBox containerStyle={styles.passwordContainer} onPress={!editing ? handlePress : undefined}>
        <View style={styles.passwordWrapper}>
          {editing ? (
            <TextInput
              style={styles.passwordInput}
              value={inputValue}
              onChangeText={setInputValue}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor="#666"
              autoFocus
              secureTextEntry
              returnKeyType="done"
            />
          ) : (
            <Text style={[styles.passwordText, !value && styles.passwordPlaceholder]}>
              {value ? '•'.repeat(value.length) : placeholder}
            </Text>
          )}
        </View>
      </BouncyBox>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>Secure Your Account</Text>
          <Text style={styles.subheader}>
            Please enter your email and create a secure password.
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <BouncyEmailInput value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <BouncyPasswordInput value={password} onChangeText={setPassword} placeholder="Enter your password" />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Retype Password</Text>
            <BouncyPasswordInput value={retypePassword} onChangeText={setRetypePassword} placeholder="Retype your password" />
          </View>

          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                isValid ? styles.nextButtonActive : styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={!isValid || loading}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  isValid ? styles.nextButtonTextActive : styles.nextButtonTextDisabled,
                ]}
              >
                {loading ? '...' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  subheader: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'left',
    width: '100%',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  emailContainer: {
    borderRadius: 10,
    backgroundColor: '#262626',
    padding: 10,
  },
  emailWrapper: {
    width: '100%',
  },
  emailInput: {
    color: 'white',
    fontSize: 16,
    width: '100%',
  },
  emailText: {
    color: 'white',
    fontSize: 16,
  },
  emailPlaceholder: {
    color: '#666',
  },
  passwordContainer: {
    borderRadius: 10,
    backgroundColor: '#262626',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  passwordWrapper: {
    width: '100%',
  },
  passwordInput: {
    color: 'white',
    fontSize: 16,
    width: '100%',
  },
  passwordText: {
    color: 'white',
    fontSize: 16,
  },
  passwordPlaceholder: {
    color: '#666',
  },
  nextButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 30,
  },
  nextButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: 100,
  },
  nextButtonActive: {
    backgroundColor: 'white',
  },
  nextButtonDisabled: {
    backgroundColor: '#444',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButtonTextActive: {
    color: '#2E3140',
  },
  nextButtonTextDisabled: {
    color: '#888',
  },
});