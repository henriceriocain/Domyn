// app / auth / CustomizeWorkout.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { BouncyBox } from '../../components/BouncyBox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UserContextProps } from '../../contexts/UserContext';
import type Workout from '../../models/Workout';

interface Exercise {
  nameOfExercise: string;
  weight: number;
  reps: number;
  sets: number;
}

function getFullDayName(abbrev: string): string {
  const mapping: { [key: string]: string } = {
    mon: 'Monday',
    tues: 'Tuesday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thurs: 'Thursday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };
  return mapping[abbrev.toLowerCase()] || abbrev;
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
          <Text style={[styles.workoutNameText, !value && styles.placeholderText]}>
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
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const dayParam = params.day;
  const dayString = Array.isArray(dayParam) ? dayParam[0] : dayParam;

  const router = useRouter();
  const { addWorkout, getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(dayString);

  // Default workout name starts empty
  const [dayName, setDayName] = useState(existingWorkout?.dayName || "");
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercise || []);

  useEffect(() => {
    if (!existingWorkout) {
      addWorkout(dayString);
    }
  }, [dayString]);

  const handleDayNameChange = (name: string) => {
    setDayName(name);
    const workout = getWorkout(dayString);
    if (workout) {
      workout.dayName = name;
      updateWorkout(dayString, workout);
    }
  };

  const handleExercisePress = (index: number) => {
    router.push({
      pathname: './editExerciseScreen',
      params: { day: dayString, index },
    });
  };

  const handleAddExercise = () => {
    router.push({
      pathname: './addExerciseScreen',
      params: { day: dayString },
    });
  };

  const HEADER_HEIGHT = 70 + insets.top;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: HEADER_HEIGHT }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.nameSection}>
              <Text style={styles.subheader}>Name of Workout</Text>
              <WorkoutNameInput value={dayName} onChangeText={handleDayNameChange} />
            </View>
            <View style={styles.exercisesSection}>
              <Text style={styles.subheader}>Exercises</Text>
              <View style={styles.exercisesList}>
                {exercises.length === 0 ? (
                  <Text style={styles.emptyText}>wow so empty...</Text>
                ) : (
                  exercises.map((exercise, index) => (
                    <ExerciseItem
                      key={index}
                      exercise={exercise}
                      onPress={() => handleExercisePress(index)}
                    />
                  ))
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Sticky header with a fixed transparent dark background */}
        <View style={[styles.stickyHeader, { height: HEADER_HEIGHT, paddingTop: insets.top }]}>
          <Text style={styles.stickyHeaderText}>
            {getFullDayName(dayString)}'s Workout
          </Text>
        </View>
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
  scrollContent: {
    paddingBottom: 80, // room for FAB
  },
  content: {
    padding: 20,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'flex-start', // left align header text
    paddingHorizontal: 20,
  },
  stickyHeaderText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'left',
  },
  nameSection: {
    backgroundColor: '#262626',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  exercisesSection: {
    backgroundColor: '#323232',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  workoutNameContainer: {
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    height: 60,
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
  emptyText: {
    color: 'gray',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
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
