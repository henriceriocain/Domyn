// app / auth / LoginScreen.tsx

import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { BouncyBoxTextInput } from '../../components/BouncyBoxTextInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { execute, loading } = useAsyncOperation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    try {
      // First execute login
      const userCredential = await execute(() => signInWithEmailAndPassword(auth, email, password));
      
      // Then check registration status
      const userDoc = await execute(() => getDoc(doc(db, "users", userCredential.user.uid)));
      const isRegistered = userDoc.exists() && userDoc.data()?.isRegistered === true;

      if (isRegistered) {
        router.replace('/home/centralHome');
      } else {
        router.replace('/auth/PersonalDetailsScreen');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to login. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      }
      Alert.alert('Login Error', errorMessage);
    }
  };

  const isValid = email.trim() && password.trim() && !loading;

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
          <Text style={styles.header}>Welcome Back</Text>
          <Text style={styles.subheader}>Login to continue your fitness journey.</Text>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <BouncyBoxTextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="default"
                width="100%"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <BouncyBoxTextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={true}
                width="100%"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.loginButton,
                isValid ? styles.loginButtonActive : styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!isValid}
            >
              <Text
                style={[
                  styles.loginButtonText,
                  isValid ? styles.loginButtonTextActive : styles.loginButtonTextDisabled,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text 
                style={styles.signupLink}
                onPress={() => router.push('/auth/CredentialsScreen')}
              >
                Sign Up {'>'}
              </Text>
            </Text>
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
  formContainer: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 30,
  },
  loginButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  loginButtonActive: {
    backgroundColor: 'white',
  },
  loginButtonDisabled: {
    backgroundColor: '#444',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButtonTextActive: {
    color: '#2E3140',
  },
  loginButtonTextDisabled: {
    color: '#888',
  },
  signupContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
  },
  signupLink: {
    color: '#4CD964',
  },
});
