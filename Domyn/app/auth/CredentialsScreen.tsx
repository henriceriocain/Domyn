// app / auth / CredentialsScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { BouncyBoxTextInput } from '../../components/BouncyBoxTextInput';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

export default function CredentialsScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const { execute, loading } = useAsyncOperation();

  // Basic password requirements:
  // At least 8 characters, one uppercase letter, and one digit.
  const isValid = useMemo(() => {
    const allFilled =
      email.trim() !== '' &&
      password.trim() !== '' &&
      retypePassword.trim() !== '';
    const passwordsMatch = password === retypePassword;
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    return allFilled && passwordsMatch && isEmailValid && isPasswordValid;
  }, [email, password, retypePassword]);

  const handleNext = async () => {
    if (!isValid) return;

    try {
      const userCredential = await execute(() => 
        createUserWithEmailAndPassword(auth, email, password)
      );
      
      // Check if we have a user after registration
      if (userCredential && userCredential.user) {
        router.push('/auth/PersonalDetailsScreen');
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      let errorMessage = "There was a problem creating your account. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "That email address is already in use.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The email address is invalid.";
            break;
          case 'auth/weak-password':
            errorMessage = "The password is too weak.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Secure Your Account</Text>
          <Text style={styles.subheader}>
            Please enter your email and create a secure password.
          </Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <BouncyBoxTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="default"
              width="100%"
            />
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.fieldLabel}>Password</Text>
              <Text style={styles.requirementsLabel}>
                (Min 8 chars, 1 uppercase, 1 number)
              </Text>
            </View>
            <BouncyBoxTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={true}
              width="100%"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Retype Password</Text>
            <BouncyBoxTextInput
              value={retypePassword}
              onChangeText={setRetypePassword}
              placeholder="Retype your password"
              secureTextEntry={true}
              width="100%"
            />
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
  container: { flex: 1, backgroundColor: 'black' },
  contentContainer: { padding: 20, paddingTop: 60 },
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
  fieldContainer: { width: '100%', marginBottom: 20 },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: { fontSize: 16, color: 'white', marginBottom: 5 },
  requirementsLabel: { fontSize: 12, color: '#aaa' },
  nextButtonContainer: { width: '100%', alignItems: 'flex-end', marginTop: 30 },
  nextButton: { borderRadius: 25, paddingVertical: 12, paddingHorizontal: 30, width: 100 },
  nextButtonActive: { backgroundColor: 'white' },
  nextButtonDisabled: { backgroundColor: '#444' },
  nextButtonText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  nextButtonTextActive: { color: '#2E3140' },
  nextButtonTextDisabled: { color: '#888' },
});
