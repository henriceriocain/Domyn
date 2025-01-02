import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function PersonalDetailsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's Get To Know Each Other...</Text>

      {/* Name */}
      <Text style={styles.subheadings}>Name</Text>
      <TextInput
        style={styles.userInput}
        placeholder="What's your name?"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      {/* Age */}
      <Text style={styles.subheadings}>Age</Text>
      <TextInput
        style={styles.userInput}
        placeholder="How old are you?"
        value={age}
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric" // Set keyboard for numbers
      />

      {/* Gender */}
      <Text style={styles.subheadings}>Gender</Text>
      <TextInput
        style={styles.userInput}
        placeholder="What's your gender?"
        value={gender}
        onChangeText={(text) => setGender(text)}
      />

      {/* Weight */}
      <Text style={styles.subheadings}>Weight</Text>
      <TextInput
        style={styles.userInput}
        placeholder="What's your weight (kg)?"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        keyboardType="numeric" // Set keyboard for numbers
      />

      {/* Submit Button */}
      <Button
        title="Submit"
        onPress={() =>
          alert(`Name: ${name}, Age: ${age}, Gender: ${gender}, Weight: ${weight}`)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "black",
  },
  header: {
    fontSize: 32,
    color: "white",
    fontWeight: 400,
  },
  subheadings: {
    fontSize: 15,
    color: "white",
  },
  userInput: {
    
  }

});