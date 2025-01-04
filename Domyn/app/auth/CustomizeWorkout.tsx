import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { BouncyBox } from '../../components/BouncyBox';
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
  const [isEditingName, setIsEditingName] = useState(false);
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

  const handleWorkoutNamePress = () => {
    setIsEditingName(true);
  };

  const handleWorkoutNameBlur = () => {
    setIsEditingName(false);
  };

  const checkAndAddExercise = () => {
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

  const handleExerciseChange = (field: keyof Omit<CurrentExercise, 'isEditing'>, value: string) => {
    setCurrentExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.header}>{day}'s Workout</Text>

          <View style={styles.section}>
            <Text style={styles.subheader}>Name of Workout</Text>
            <BouncyBox 
              containerStyle={styles.workoutNameContainer}
              onPress={handleWorkoutNamePress}
            >
              {isEditingName ? (
                <TextInput
                  style={[styles.input, styles.workoutNameInput]}
                  placeholder="Enter workout name"
                  placeholderTextColor="#666"
                  value={dayName}
                  onChangeText={handleDayNameChange}
                  onBlur={handleWorkoutNameBlur}
                  autoFocus
                />
              ) : (
                <Text style={[styles.input, styles.workoutNameInput]}>
                  {dayName || "Enter workout name"}
                </Text>
              )}
            </BouncyBox>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.subheader}>Exercises</Text>
            
            <View style={styles.exercisesList}>
              {exercises.map((item, index) => (
                <BouncyBox 
                  key={index} 
                  containerStyle={styles.exerciseItem}
                >
                  <Text style={styles.exerciseItemName}>
                    {item.nameOfExercise}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {item.weight} lbs × {item.reps} reps
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {item.sets} sets
                  </Text>
                </BouncyBox>
              ))}
            </View>
            
            <View style={styles.exerciseInputWrapper}>
              <BouncyBox containerStyle={styles.exerciseInputContainer}>
                <TextInput
                  style={[styles.input, styles.exerciseNameInput]}
                  placeholder="Exercise Name"
                  placeholderTextColor="#666"
                  value={currentExercise.nameOfExercise}
                  onChangeText={(value) => handleExerciseChange('nameOfExercise', value)}
                  onBlur={checkAndAddExercise}
                  returnKeyType="next"
                />
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    placeholder="Weight"
                    placeholderTextColor="#666"
                    value={currentExercise.weight}
                    onChangeText={(value) => handleExerciseChange('weight', value)}
                    onBlur={checkAndAddExercise}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    placeholder="Reps"
                    placeholderTextColor="#666"
                    value={currentExercise.reps}
                    onChangeText={(value) => handleExerciseChange('reps', value)}
                    onBlur={checkAndAddExercise}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    placeholder="Sets"
                    placeholderTextColor="#666"
                    value={currentExercise.sets}
                    onChangeText={(value) => handleExerciseChange('sets', value)}
                    onBlur={checkAndAddExercise}
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>
              </BouncyBox>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 60,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  workoutNameContainer: {
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    height: 50,
  },
  input: { 
    color: 'white',
    padding: 10,
  },
  exerciseNameInput: {
    fontSize: 16,
    height: 45,
  },
  workoutNameInput: {
    fontSize: 16,
    height: 50,
  },
  exercisesList: {
    marginBottom: 15,
  },
  exerciseInputWrapper: {
    marginBottom: 300,
  },
  exerciseInputContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
    height: 150,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    height: 50,
  },
  numberInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#262626',
    borderRadius: 10,
    height: 45,
  },
  exerciseItem: { 
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    height: 90,
  },
  exerciseItemName: { 
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
});