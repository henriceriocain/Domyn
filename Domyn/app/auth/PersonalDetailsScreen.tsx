// app / auth / PersonalDetailsScreen.tsx
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from '../../contexts/UserContext'; // If you're still using it for local state
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  // Fallback local state in case context isn't used; you might later synchronize these with Firestore.
  const [name, setName] = useState(userContext?.name || '');
  const [age, setAge] = useState(userContext?.age || '');
  const [gender, setGender] = useState(userContext?.gender || '');
  const [weight, setWeight] = useState(userContext?.weight || '');

  // Check if all fields are filled
  const allFieldsFilled = name.trim() && age.trim() && gender.trim() && weight.trim();

  const handleNextPress = async () => {
    if (!allFieldsFilled) return;

    // Get the currently signed-in user's UID
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    try {
      // Create or update the user's Firestore document.
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

      // Optionally update your UserContext if needed
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

  const handleBackPress = () => {
    router.push("./WelcomeScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={5}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Let's Get To Know Each Other...</Text>
          <View style={styles.form}>
            {/* First Name */}
            <Text style={styles.subheadings}>First Name</Text>
            <TextInput
              style={styles.userInput}
              placeholder="What's your first name?"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            {/* Age */}
            <Text style={styles.subheadings}>Age</Text>
            <TextInput
              style={styles.userInput2}
              placeholder="How old are you?"
              placeholderTextColor="gray"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            {/* Gender */}
            <Text style={styles.subheadings}>Gender</Text>
            <TextInput
              style={styles.userInput3}
              placeholder="What's your gender?"
              placeholderTextColor="gray"
              value={gender}
              onChangeText={setGender}
            />
            {/* Weight */}
            <Text style={styles.subheadings}>Weight</Text>
            <TextInput
              style={styles.userInput4}
              placeholder="What's your weight (lbs)?"
              placeholderTextColor="gray"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: allFieldsFilled ? "white" : "gray" },
              ]}
              disabled={!allFieldsFilled}
              onPress={handleNextPress}
            >
              <Text style={styles.nextButtonText}>Next</Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 40,
    color: "white",
    fontWeight: "700",
    padding: 30,
    paddingTop: 70,
  },
  form: {
    padding: 20,
    paddingLeft: 40,
  },
  subheadings: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: -10,
  },
  userInput: {
    borderBottomWidth: 1,
    borderColor: "white",
    width: "65%",
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    paddingVertical: 10,
  },
  userInput2: {
    borderBottomWidth: 1,
    borderColor: "white",
    width: "40%",
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    paddingVertical: 10,
  },
  userInput3: {
    borderBottomWidth: 1,
    borderColor: "white",
    width: "50%",
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    paddingVertical: 10,
  },
  userInput4: {
    borderBottomWidth: 1,
    borderColor: "white",
    width: "60%",
    fontSize: 16,
    color: "white",
    marginBottom: 130,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    justifyContent: "flex-end",
    marginBottom: 100,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    width: "30%",
    alignItems: "center",
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
