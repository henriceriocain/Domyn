// app / auth / PersonalDetailsScreen.tsx

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from '../../contexts/UserContext';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { BouncyBoxTextInput } from '../../components/BouncyBoxTextInput';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [name, setName] = useState(userContext?.name || '');
  const [age, setAge] = useState(userContext?.age || '');
  const [gender, setGender] = useState(userContext?.gender || '');
  const [weight, setWeight] = useState(userContext?.weight || '');

  const allFieldsFilled = name.trim() && age.trim() && gender.trim() && weight.trim();

  const handleNextPress = async () => {
    if (!allFieldsFilled) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, {
        personalData: {
          name,
          age,
          gender,
          weight,
          email: currentUser.email,
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });

      if (userContext) {
        userContext.setName(name);
        userContext.setAge(age);
        userContext.setGender(gender);
        userContext.setWeight(weight);
      }

      router.push("./WorkoutDaysScreen");
    } catch (error) {
      console.error("Error updating personal details:", error);
      Alert.alert("Error", "There was a problem saving your details. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={5}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>Let's Get To Know Each Other...</Text>
          <Text style={styles.subheader}>Tell Us About Yourself.</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <BouncyBoxTextInput
              value={name}
              onChangeText={setName}
              placeholder="What's your first name?"
              width="65%"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Age</Text>
            <BouncyBoxTextInput
              value={age}
              onChangeText={setAge}
              placeholder="How old are you?"
              keyboardType="numeric"
              width="50%"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <BouncyBoxTextInput
              value={gender}
              onChangeText={setGender}
              placeholder="What's your gender?"
              width="55%"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Weight</Text>
            <BouncyBoxTextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="What's your weight (lbs)?"
              keyboardType="numeric"
              width="65%"
            />
          </View>

          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                allFieldsFilled ? styles.nextButtonActive : styles.nextButtonDisabled,
              ]}
              disabled={!allFieldsFilled}
              onPress={handleNextPress}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  allFieldsFilled ? styles.nextButtonTextActive : styles.nextButtonTextDisabled,
                ]}
              >
                Next
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
    backgroundColor: "black",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 40,
    color: "white",
    fontWeight: "700",
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
  nextButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 30,
    marginBottom: 30,
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