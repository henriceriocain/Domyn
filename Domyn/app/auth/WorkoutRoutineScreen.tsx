// app / auth / WorkoutRoutineScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '../../hooks/useUserContext';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

function getFullDayName(day: string): string {
  // Now assuming day is stored as full name ("Monday", etc.)
  return day;
}

export default function WorkoutRoutineScreen() {
  const router = useRouter();
  const { selectedDays } = useUserContext();
  
  // Local state for fetched workout routines.
  const [workoutData, setWorkoutData] = useState<{ [day: string]: any }>({});

  // Fetch workoutRoutine documents from Firestore.
  useEffect(() => {
    const fetchWorkouts = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      try {
        const workoutsRef = collection(db, 'users', currentUser.uid, 'workoutRoutine');
        const q = query(workoutsRef);
        const querySnapshot = await getDocs(q);
        const data: { [day: string]: any } = {};
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setWorkoutData(data);
      } catch (error) {
        console.error("Error fetching workout routines:", error);
      }
    };
    fetchWorkouts();
  }, []);

  // Helper function to get workout for a given day.
  const getWorkout = (day: string) => workoutData[day];

  // Check if each selected day is "complete" (has a non‑empty workoutName and at least one exercise)
  const allComplete = selectedDays.every(day => {
    const workout = getWorkout(day);
    return (
      workout &&
      workout.workoutName &&
      workout.workoutName.trim() !== '' &&
      workout.exercises &&
      workout.exercises.length > 0
    );
  });

  useFocusEffect(
    React.useCallback(() => {
      // Optionally refresh animations or data if needed.
    }, [])
  );

  const handleNext = () => {
    alert('Workout routines saved!');
  };

  const renderDaySection = (day: string, index: number) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const workout = getWorkout(day);
    // Use workoutName and exercises fields from Firestore.
    const customName = workout?.workoutName || '';
    const exercises = workout?.exercises || [];

    // Determine status text based on the completeness of the workout routine.
    let statusText = '';
    if (!customName.trim() && exercises.length === 0) {
      statusText = 'Tap to customize';
    } else if (!customName.trim()) {
      statusText = 'Day needs name';
    } else if (exercises.length === 0) {
      statusText = 'Add exercise';
    } else {
      statusText = 'Complete';
    }

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        friction: 20,
        tension: 200,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 20,
        tension: 200,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = () => {
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 0.97,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.push({
          pathname: './CustomizeWorkout',
          params: { day },
        });
      });
    };

    return (
      <Animated.View
        key={index}
        style={[styles.daySection, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
        >
          <View style={styles.daySectionContent}>
            <View style={styles.dayLabelContainer}>
              <Text style={styles.dayLabel}>{getFullDayName(day)}</Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.customNameText}>{`"${customName}"`}</Text>
              <View style={styles.statusBar}>
                {statusText === 'Complete' ? (
                  <Text style={[styles.statusText, styles.completeText]}>✓</Text>
                ) : (
                  <Text style={styles.statusText}>{statusText}</Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.header}>
          What are your workout routines on these days?
        </Text>
        {selectedDays.map((day, index) => renderDaySection(day, index))}
        <View style={styles.buttonContainer}>
          {allComplete && (
            <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.7}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    paddingTop: 60,
    paddingBottom: 60,
  },
  daySection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  daySectionContent: {
    padding: 20,
  },
  dayLabelContainer: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: -1,
  },
  dayLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customNameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  statusBar: {
    backgroundColor: '#262626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  completeText: {
    color: '#4CD964',
    fontSize: 20,
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
