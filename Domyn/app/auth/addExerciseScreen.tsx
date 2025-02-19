// app / auth / addExerciseScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { BouncyBox } from '../../components/BouncyBox';
import type { UserContextProps } from '../../contexts/UserContext';

const AddExerciseScreen = () => {
  const { day } = useLocalSearchParams();
  const router = useRouter();
  const { getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const workout = getWorkout(day as string);

  // Local state for exercise fields
  const [nameOfExercise, setNameOfExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');

  const handleSave = () => {
    if (
      !nameOfExercise.trim() ||
      !weight.trim() ||
      !reps.trim() ||
      !sets.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }
    const weightNum = parseInt(weight) || 0;
    const repsNum = parseInt(reps) || 0;
    const setsNum = parseInt(sets) || 0;
    if (weightNum <= 0 || repsNum <= 0 || setsNum <= 0) {
      Alert.alert(
        'Validation Error',
        'Weight, reps, and sets must be greater than zero.'
      );
      return;
    }
    if (workout) {
      // Add the new exercise to the workout’s exercise array.
      workout.exercise.push({
        nameOfExercise,
        weight: weightNum,
        reps: repsNum,
        sets: setsNum,
      });
      updateWorkout(day as string, workout);
      router.back();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.header}>Add Exercise</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Exercise Name</Text>
              <TextInput
                style={styles.input}
                value={nameOfExercise}
                onChangeText={setNameOfExercise}
                placeholder="Enter exercise name"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Sets</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                placeholder="Enter sets"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>
            <BouncyBox containerStyle={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Exercise</Text>
            </BouncyBox>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AddExerciseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  content: { padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: '700', color: 'white', marginBottom: 30 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 18, color: 'white', marginBottom: 8 },
  input: {
    backgroundColor: '#262626',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
