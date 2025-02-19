// app / auth / CustomizeWorkout.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

//
// WorkoutNameInput Component
//
const WorkoutNameInput = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handlePress = () => setEditing(true);
  const handleBlur = () => {
    // Remove trailing spaces and enforce max 12 characters
    const finalInput = inputValue.trimEnd().slice(0, 12);
    setEditing(false);
    onChangeText(finalInput);
  };

  return (
    <BouncyBox
      containerStyle={styles.workoutNameContainer}
      onPress={!editing ? handlePress : undefined}
    >
      <View style={styles.workoutNameWrapper}>
        {editing ? (
          <TextInput
            style={styles.workoutNameInput}
            value={inputValue}
            onChangeText={setInputValue}
            onBlur={handleBlur}
            onSubmitEditing={handleBlur}
            placeholder="Enter workout name"
            placeholderTextColor="#666"
            autoFocus
            returnKeyType="done"
            selectionColor="white"
            multiline={false}
            textAlignVertical="center"
            maxLength={12}
          />
        ) : (
          <Text
            style={[
              styles.workoutNameText,
              !value && styles.placeholderText,
            ]}
          >
            {value || "Enter workout name"}
          </Text>
        )}
      </View>
    </BouncyBox>
  );
};

//
// ExerciseItem Component – displays a bouncy, read‑only exercise summary
//
const ExerciseItem = ({
  exercise,
  onPress,
}: {
  exercise: Exercise;
  onPress: () => void;
}) => {
  return (
    <BouncyBox containerStyle={styles.exerciseItem} onPress={onPress}>
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseItemName}>
          {exercise.nameOfExercise || "Unnamed Exercise"}
        </Text>
        <Text style={styles.exerciseDetails}>
          {exercise.weight} lbs × {exercise.reps} reps
        </Text>
        <Text style={styles.exerciseSets}>{exercise.sets} sets</Text>
      </View>
    </BouncyBox>
  );
};

//
// Main CustomizeWorkout Component
//
export default function CustomizeWorkout() {
  const { day } = useLocalSearchParams();
  const router = useRouter();
  const { addWorkout, getWorkout, updateWorkout } =
    useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(day as string);

  // Default workout name now starts as empty
  const [dayName, setDayName] = useState(existingWorkout?.dayName || "");
  const [exercises, setExercises] = useState<Exercise[]>(
    existingWorkout?.exercise || []
  );

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

  // When an exercise is tapped, navigate to the edit page with its index and day
  const handleExercisePress = (index: number) => {
    router.push({
      pathname: './editExerciseScreen',
      params: { day, index },
    });
  };

  // When the floating "Add Exercise" button is tapped, navigate to the add exercise page
  const handleAddExercise = () => {
    router.push({
      pathname: './addExerciseScreen',
      params: { day },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.header}>{day}'s Workout</Text>
            <View style={styles.section}>
              <Text style={styles.subheader}>Name of Workout</Text>
              <WorkoutNameInput
                value={dayName}
                onChangeText={handleDayNameChange}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subheader}>Exercises</Text>
              <View style={styles.exercisesList}>
                {exercises.map((exercise, index) => (
                  <ExerciseItem
                    key={index}
                    exercise={exercise}
                    onPress={() => handleExercisePress(index)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
        <BouncyBox containerStyle={styles.fab} onPress={handleAddExercise}>
          <View style={styles.fabIconContainer}>
            <Text style={styles.fabText}>+</Text>
          </View>
        </BouncyBox>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  // Fixed height container so it stays static during editing
  workoutNameContainer: {
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
  },
  workoutNameWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  workoutNameInput: {
    color: 'white',
    fontSize: 16,
    padding: 0,
    height: '100%',
    textAlignVertical: 'center',
  },
  workoutNameText: {
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  exercisesList: {
    marginBottom: 20,
  },
  exerciseItem: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseItemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  exerciseDetails: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  exerciseSets: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 32,
    color: 'black',
    fontWeight: '400',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
