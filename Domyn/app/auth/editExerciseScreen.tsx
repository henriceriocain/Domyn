// app / auth / EditExerciseScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { BouncyBoxTextInput } from '../../components/BouncyBoxTextInput';
import type { UserContextProps } from '../../contexts/UserContext';

const EditExerciseScreen = () => {
  const { day, index } = useLocalSearchParams();
  const router = useRouter();
  const { getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const workout = getWorkout(day as string);
  const exerciseIndex = parseInt(index as string);
  const currentExercise = workout?.exercise[exerciseIndex];

  const [nameOfExercise, setNameOfExercise] = useState(currentExercise?.nameOfExercise || '');
  const [weight, setWeight] = useState(currentExercise?.weight.toString() || '');
  const [reps, setReps] = useState(currentExercise?.reps.toString() || '');
  const [sets, setSets] = useState(currentExercise?.sets.toString() || '');

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
      Alert.alert('Validation Error', 'Weight, reps, and sets must be greater than zero.');
      return;
    }
    if (workout) {
      workout.exercise[exerciseIndex] = {
        nameOfExercise,
        weight: weightNum,
        reps: repsNum,
        sets: setsNum,
      };
      updateWorkout(day as string, workout);
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            if (workout) {
              workout.exercise.splice(exerciseIndex, 1);
              updateWorkout(day as string, workout);
              router.back();
            }
          } 
        }
      ]
    );
  };

  const isValid = nameOfExercise.trim() && weight.trim() && reps.trim() && sets.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Edit Exercise</Text>
          <Text style={styles.subheader}>Update your exercise details.</Text>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Exercise Name</Text>
              <BouncyBoxTextInput
                value={nameOfExercise}
                onChangeText={setNameOfExercise}
                placeholder="Enter exercise name"
                keyboardType="default"
                width="100%"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <BouncyBoxTextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                keyboardType="numeric"
                width="40%"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Reps</Text>
              <BouncyBoxTextInput
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
                keyboardType="numeric"
                width="40%"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sets</Text>
              <BouncyBoxTextInput
                value={sets}
                onChangeText={setSets}
                placeholder="Enter sets"
                keyboardType="numeric"
                width="35%"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.nextButton,
                isValid ? styles.nextButtonActive : styles.nextButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!isValid}
            >
              <Text 
                style={[
                  styles.nextButtonText,
                  isValid ? styles.nextButtonTextActive : styles.nextButtonTextDisabled,
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  subheader: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'left',
    width: '100%',
  },
  formContainer: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  nextButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: 100,
  },
  nextButtonActive: {
    backgroundColor: 'white',
  },
  nextButtonDisabled: {
    backgroundColor: '#444',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButtonTextActive: {
    color: '#2E3140',
  },
  nextButtonTextDisabled: {
    color: '#888',
  },
  deleteButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#b00020',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});