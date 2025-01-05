import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditExercisesScreen() {

    const params = useLocalSearchParams(); // Use `useLocalSearchParams` to extract query params
    const day = params.day as string; // Extract `day` as a string


    // State for workout name and exercises
    const [workoutName, setWorkoutName] = useState("");
    const [exercises, setExercises] = useState<{ name: string; weight: string; reps: string }[]>([{ name: "", weight: "", reps: "" }]);

    // Add a new exercise input
    const addExercise = () => {
        setExercises([...exercises, { name: "", weight: "", reps: "" }]);
    };

    // Update an exercise field
    const updateExercise = (
        index: number, field: "name" | "weight" | "reps", value: string
    ) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
    };

    return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>{day}</Text>
    
            <Text style={styles.label}>Name of Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter workout name"
              placeholderTextColor="gray"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
    
            <Text style={styles.label}>Exercises</Text>
            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseRow}>
                <TextInput
                  style={[styles.exerciseInput, { flex: 2 }]}
                  placeholder="Exercise name"
                  placeholderTextColor="gray"
                  value={exercise.name}
                  onChangeText={(value) => updateExercise(index, "name", value)}
                />
                <TextInput
                  style={[styles.exerciseInput, { flex: 1 }]}
                  placeholder="Weight"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={exercise.weight}
                  onChangeText={(value) => updateExercise(index, "weight", value)}
                />
                <TextInput
                  style={[styles.exerciseInput, { flex: 1 }]}
                  placeholder="Reps"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={exercise.reps}
                  onChangeText={(value) => updateExercise(index, "reps", value)}
                />
              </View>
            ))}
    
            <TouchableOpacity style={styles.addButton} onPress={addExercise}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1C1C1E",
    color: "white",
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseInput: {
    backgroundColor: "#1C1C1E",
    color: "white",
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  addButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
});