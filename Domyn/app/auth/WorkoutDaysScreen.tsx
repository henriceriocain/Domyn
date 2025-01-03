// app/auth/WorkoutDetailsScreen.tsx

// Import statements
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUserContext } from '../../hooks/useUserContext'; 

// File function
export default function WorkoutDetailsScreen() {

  // router const to route to other pages
  const router = useRouter();
  // useUserContext used to get name
  const { name } = useUserContext();

  


  // Handlers for navigation buttons
  const handleNextPress = () => {
    router.push("./WorkoutRoutineScreen");
  };
  const handleBackPress = () => {
    router.push("./PersonalDetailsScreen");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome, <Text style={styles.name}>{name}</Text>!
      </Text>    
      <Text style={styles.subheader}>When Do You Usually Workout?</Text>
    </View>
    <View>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Mon</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Tues</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Wed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Thu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Fri</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Sat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dayContainer} onPress={handleDayPress}>
        <Text style={styles.dayContainerText}>Sun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 700,
    color: "white",
    paddingTop: 60,
    paddingBottom: 60,
  },
  name: {
    fontWeight: 800,
    color: "white",
  },
  subheader: {
    fontSize: 26,
    fontWeight: 600,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",            // Arrange buttons horizontally
    justifyContent: "space-between",  // Space between buttons
    paddingHorizontal: 30,           // Horizontal padding for the container
    marginBottom: 100,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    width: "30%",                     // Adjust width to fit side by side
    alignItems: "center",            // Center text horizontally
  },
  nextButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  }
});
