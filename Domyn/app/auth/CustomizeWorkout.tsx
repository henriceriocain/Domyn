import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';

export default function CustomizeWorkout() {
  const { day } = useLocalSearchParams();
  const { workouts, addWorkout, getWorkout } = useUserContext();

  const existingWorkout = getWorkout(day as string);

  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    if (!existingWorkout) {
      addWorkout(day as string);
    }
  }, [day]);

  const addExercise = () => {
    const workout = getWorkout(day as string);
    if (workout) {
      // Use the correct addExercise method from the Workout class
      workout.addExercise(
        exerciseName,
        parseInt(weight),
        parseInt(reps),
        parseInt(sets)
      );

      // Force a re-render by updating the workouts object
      const updatedWorkouts = { ...workouts };
      updatedWorkouts[day as string] = workout;
    }

    // Reset input fields
    setExerciseName('');
    setWeight('');
    setSets('');
    setReps('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{day}'s Workout</Text>
      <FlatList
        data={existingWorkout?.exercise || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>
              {item.nameOfExercise}: {item.weight} lbs, {item.sets} sets, {item.reps} reps
            </Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        placeholderTextColor="gray"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        placeholderTextColor="gray"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        placeholderTextColor="gray"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor="gray"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <Button title="Add Exercise" onPress={addExercise} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black',
    padding: 20 
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    paddingTop: 60,
    paddingBottom: 60,
  },
  input: { 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  exerciseItem: { 
    backgroundColor: '#333', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  exerciseText: { 
    color: 'white' 
  },
});