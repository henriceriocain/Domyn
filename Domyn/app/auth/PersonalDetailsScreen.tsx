// Import statement
import React, { useContext } from 'react';
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
} from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from '../../contexts/UserContext'; // Adjust the path as needed

// File function
export default function PersonalDetailsScreen() {

  // router const to route buttons to other files
  const router = useRouter();
  //  userContect const to store and utilise user data
  const userContext = useContext(UserContext); 

  // Case where the context is not available
  if (!userContext) {
    return null;
  }

  // Initilizing userContext
  const { name, setName, age, setAge, gender, setGender, weight, setWeight } = userContext;

  // Variable to check all fields are filled
  const allFieldsFilled = name && age && gender && weight;

  // Handler for the Next button
  const handleNextPress = () => {
    router.push("./WorkoutDetailsScreen");
  };

  return (
    // Prevents keyboard from blocking elements
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={5} 
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Let's Get To Know Each Other...</Text>

          <View style={styles.form}>
            {/* Name */}
            <Text style={styles.subheadings}>First Name</Text>
            <TextInput
              style={styles.userInput}
              placeholder="What's your first name?"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName} // Update context state
            />

            {/* Age */}
            <Text style={styles.subheadings}>Age</Text>
            <TextInput
              style={styles.userInput2}
              placeholder="How old are you?"
              placeholderTextColor="gray"
              value={age}
              onChangeText={setAge} // Update context state
              keyboardType="numeric"
            />

            {/* Gender */}
            <Text style={styles.subheadings}>Gender</Text>
            <TextInput
              style={styles.userInput3}
              placeholder="What's your gender?"
              placeholderTextColor="gray"
              value={gender}
              onChangeText={setGender} // Update context state
            />

            {/* Weight */}
            <Text style={styles.subheadings}>Weight</Text>
            <TextInput
              style={styles.userInput4}
              placeholder="What's your weight (lbs)?"
              placeholderTextColor="gray"
              value={weight}
              onChangeText={setWeight} // Update context state
              keyboardType="numeric"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: allFieldsFilled ? "white" : "gray" }, // Button color based on input completion
            ]}
            disabled={!allFieldsFilled} // Disable button if fields are empty
            onPress={handleNextPress}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: allFieldsFilled ? "white" : "gray" }, // Button color based on input completion
            ]}
            disabled={!allFieldsFilled} // Disable button if fields are empty
            onPress={handleNextPress}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Imported StyleSheet const and called it styles
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
    marginTop: 15, // Added margin for spacing
    marginBottom: 5, // Added margin for spacing
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
    marginBottom: 150,
    paddingVertical: 10,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    alignSelf: "flex-end",
    width: "30%",
    marginRight: 30,
    marginBottom: 100,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
