// app / auth / WorkoutRoutineScreen.tsx

import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '../../hooks/useUserContext';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import { RoutineWorkout } from '../../models/RoutineWorkout';

function getFullDayName(day: string): string {
  return day;
}

export default function WorkoutRoutineScreen() {
  const router = useRouter();
  const { selectedDays, getWorkout } = useUserContext();
  const { execute, loading } = useAsyncOperation();

  // Debug logs to understand the state
  console.log('=== Debug Info ===');
  console.log('Selected Days:', selectedDays);

  // Check each day's status in detail
  const allComplete = selectedDays.every(day => {
    const workout = getWorkout(day) as RoutineWorkout | undefined;
    
    // Evaluate each condition separately for clearer debugging
    const conditions = {
      exists: !!workout,
      isScheduled: workout?.isScheduled === true,
      hasCustomName: !!workout?.customName,
      customNameNotEmpty: workout?.customName?.trim() !== '',
      hasExercises: Array.isArray(workout?.exercises),
      exercisesNotEmpty: (workout?.exercises?.length || 0) > 0
    };

    // Log the conditions for this day
    console.log(`${day} conditions:`, conditions);

    // Check final result for this day
    const isDayComplete = conditions.exists && 
                         conditions.isScheduled && 
                         conditions.hasCustomName && 
                         conditions.customNameNotEmpty && 
                         conditions.hasExercises && 
                         conditions.exercisesNotEmpty;

    console.log(`${day} is complete:`, isDayComplete);
    
    return isDayComplete;
  });

  // Log the final result
  console.log('All Complete:', allComplete);
  console.log('=== End Debug Info ===');

  useFocusEffect(React.useCallback(() => {}, []));

  const handleNext = async () => {
    if (!allComplete) {
      alert("Please complete all workout fields before proceeding.");
      return;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("User not authenticated.");
      return;
    }
    try {
      await execute(async () => {
        // Save all workout routines
        for (const day of selectedDays) {
          const workout = getWorkout(day) as RoutineWorkout;
          if (workout && workout.isScheduled) {  // Check isScheduled flag
            const dayDocRef = doc(db, "users", currentUser.uid, "workoutRoutine", day);
            await setDoc(
              dayDocRef,
              {
                day,
                isScheduled: true,
                customName: workout.customName,
                exercises: workout.exercises,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
  
        // Mark registration as complete
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userDocRef,
          {
            isRegistered: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });
      
      router.push("/auth/AllSetUpScreen");
    } catch (error) {
      console.error("Error saving workout routines:", error);
      alert("Error saving workout routines. Please try again.");
    }
  };

  const renderDaySection = (day: string, index: number) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const workout = getWorkout(day);
    const customName = workout?.customName || '';
    const exercises = workout?.exercises || [];

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
      Animated.spring(scaleValue, { toValue: 0.97, friction: 20, tension: 200, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, { toValue: 1, friction: 20, tension: 200, useNativeDriver: true }).start();
    };

    const handlePress = () => {
      Animated.sequence([
        Animated.spring(scaleValue, { toValue: 0.97, friction: 20, tension: 200, useNativeDriver: true }),
        Animated.spring(scaleValue, { toValue: 1, friction: 20, tension: 200, useNativeDriver: true })
      ]).start(() => {
        router.push({ pathname: './CustomizeWorkout', params: { day } });
      });
    };

    return (
      <Animated.View key={index} style={[styles.daySection, { transform: [{ scale: scaleValue }] }]}>
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Plan Your Workouts</Text>
        <Text style={styles.subheader}>Customize each day's routine to match your goals.</Text>
        
        {selectedDays.map((day, index) => renderDaySection(day, index))}
        
        <View style={styles.nextButtonContainer}>
          {allComplete && (
            <TouchableOpacity
              style={[styles.nextButton, styles.nextButtonActive]}
              onPress={handleNext}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.nextButtonTextActive}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: 20 
  },
  dayLabelContainer: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: -1
  },
  dayLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  customNameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700'
  },
  statusBar: {
    backgroundColor: '#262626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end'
  },
  statusText: {
    fontSize: 16,
    color: '#666'
  },
  completeText: {
    color: '#4CD964',
    fontSize: 20,
    fontWeight: '700'
  },
  nextButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 30,
  },
  nextButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  nextButtonActive: {
    backgroundColor: 'white',
  },
  nextButtonTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3140',
    textAlign: 'center',
  },
});
