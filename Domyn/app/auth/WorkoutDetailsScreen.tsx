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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome, <Text style={styles.name}>{name}</Text>!
      </Text>    
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
  },
  name: {
    fontWeight: 800,
    color: "white",
  }
});
