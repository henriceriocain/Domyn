import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import type { UserContextProps } from '../../contexts/UserContext';
import type Workout from '../../models/Workout';

interface Exercise {
  nameOfExercise: string;
  weight: number;
  reps: number;
  sets: number;
}

interface CurrentExercise {
  nameOfExercise: string;
  weight: string;
  reps: string;
  sets: string;
  isEditing: boolean;
}

export default function CustomizeWorkout() {
  const { day } = useLocalSearchParams();
  const { workouts, addWorkout, getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(day as string);
  
  const [dayName, setDayName] = useState(existingWorkout?.dayName || day as string);
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercise || []);
  const [currentExercise, setCurrentExercise] = useState<CurrentExercise>({
    nameOfExercise: '',
    weight: '',
    sets: '',
    reps: '',
    isEditing: true
  });
  
  useEffect(() => {
    if (!existingWorkout) {
      addWorkout(day as string);
    }
  }, [day]);

  const handleDayNameChange = (name: string) => {
    setDayName(name);
    const workout = getWorkout(day as string);
    if (workout) {
      workout.dayName = name;
      updateWorkout(day as string, workout);
    }
  };

  const handleExerciseChange = (field: keyof Omit<CurrentExercise, 'isEditing'>, value: string) => {
    setCurrentExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExerciseComplete = () => {
    if (
      currentExercise.nameOfExercise &&
      currentExercise.weight &&
      currentExercise.sets &&
      currentExercise.reps
    ) {
      const workout = getWorkout(day as string);
      if (workout) {
        workout.addExercise(
          currentExercise.nameOfExercise,
          parseInt(currentExercise.weight),
          parseInt(currentExercise.reps),
          parseInt(currentExercise.sets)
        );
        
        setExercises([...workout.exercise]);
        
        setCurrentExercise({
          nameOfExercise: '',
          weight: '',
          sets: '',
          reps: '',
          isEditing: true
        });
        
        updateWorkout(day as string, workout);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{day}'s Workout</Text>
      
      {/* Workout Name Section */}
      <Text style={styles.subheader}>Name of Workout</Text>
      <TextInput
        style={[styles.input, styles.workoutNameInput]}
        placeholder="Enter workout name"
        placeholderTextColor="gray"
        value={dayName}
        onChangeText={handleDayNameChange}
      />
      
      <Text style={styles.subheader}>Exercises</Text>
      
      {/* Exercise List */}
      {exercises.map((item, index) => (
        <View key={index} style={styles.exerciseItem}>
          <Text style={styles.exerciseText}>
            {item.nameOfExercise}: {item.weight} lbs, {item.sets} sets, {item.reps} reps
          </Text>
        </View>
      ))}
      
      {/* Exercise Input Section */}
      <View style={styles.exerciseInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          placeholderTextColor="gray"
          value={currentExercise.nameOfExercise}
          onChangeText={(value) => handleExerciseChange('nameOfExercise', value)}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.numberInput]}
            placeholder="Weight"
            placeholderTextColor="gray"
            value={currentExercise.weight}
            onChangeText={(value) => handleExerciseChange('weight', value)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.numberInput]}
            placeholder="Sets"
            placeholderTextColor="gray"
            value={currentExercise.sets}
            onChangeText={(value) => handleExerciseChange('sets', value)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.numberInput]}
            placeholder="Reps"
            placeholderTextColor="gray"
            value={currentExercise.reps}
            onChangeText={(value) => handleExerciseChange('reps', value)}
            keyboardType="numeric"
          />
        </View>
        <Button 
          title="Add Exercise" 
          onPress={handleExerciseComplete}
        />
      </View>
    </ScrollView>
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
    paddingBottom: 30,
  },
  subheader: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  input: { 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  workoutNameInput: {
    marginBottom: 20,
  },
  exerciseInputContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  numberInput: {
    flex: 1,
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