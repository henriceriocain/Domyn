// app / auth / CustomizeWorkout.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UserContextProps } from '../../contexts/UserContext';
import type Workout from '../../models/Workout';
import { BouncyBoxTextInput } from '../../components/BouncyBoxTextInput';
import { BouncyBox } from '../../components/BouncyBox';

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

const ExerciseItem = ({ exercise, onPress }: { exercise: Exercise; onPress: () => void; }) => {
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

export default function CustomizeWorkout() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const dayParam = params.day;
  const dayString = Array.isArray(dayParam) ? dayParam[0] : dayParam;
  const router = useRouter();
  const { addWorkout, getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(dayString);
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
    router.push({ pathname: './EditExerciseScreen', params: { day: dayString, index } });
  };

  const handleAddExercise = () => {
    router.push({ pathname: './AddExerciseScreen', params: { day: dayString } });
  };

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
          <Text style={styles.header}>Customize Workout</Text>
          <Text style={styles.subheader}>Design your perfect {getFullDayName(dayString)} routine.</Text>

          <View style={styles.content}>
            <View style={styles.nameSection}>
              <Text style={styles.sectionTitle}>Name of Workout</Text>
              <BouncyBoxTextInput
                value={dayName}
                onChangeText={handleDayNameChange}
                placeholder="Enter workout name"
                width="100%"
              />
            </View>
            
            <View style={styles.exercisesSection}>
              <Text style={styles.sectionTitle}>Exercises</Text>
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

        <TouchableWithoutFeedback onPress={handleAddExercise}>
          <View style={styles.fab}>
            <View style={styles.fabInner}>
              <Text style={styles.fabIcon}>+</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

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
  content: {
    marginTop: 20,
  },
  nameSection: {
    backgroundColor: '#404040',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  exercisesSection: {
    backgroundColor: '#323232',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  fabInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#2E3140',
    fontSize: 32,
    fontWeight: '400',
    marginTop: -2, // Optical alignment
  },
});