// app / auth / WorkoutDaysScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

type Days = {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
};

export default function WorkoutDaysScreen() {
  const router = useRouter();
  const { setSelectedDays, addWorkout, setWorkouts } = useUserContext();  // Add setWorkouts here

  const [days, setDays] = useState<Days>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const { execute, loading } = useAsyncOperation();

  const handleDayPress = (day: keyof Days) => {
    setDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };

  const handleNext = async () => {
    const selectedDays = Object.keys(days).filter((day) => days[day as keyof Days]);
    if (selectedDays.length > 0) {
      setSelectedDays(selectedDays);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
      try {
        await execute(async () => {
          // First clear any existing workouts
          setWorkouts({});  // Add this line to clear existing workouts
  
          // Create documents for ALL days with isScheduled flag
          const allDays = Object.keys(days);
          for (const day of allDays) {
            const isScheduled = selectedDays.includes(day);  // Change this to use selectedDays
            const dayDocRef = doc(db, "users", currentUser.uid, "workoutRoutine", day);
            await setDoc(
              dayDocRef,
              {
                day,
                isScheduled,
                customName: "",
                exercises: [],
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
  
            // Only add selected days to context
            if (isScheduled) {
              addWorkout(day as keyof Days, true);  // Explicitly set isScheduled to true
            }
          }
        });
        router.push('./WorkoutRoutineScreen');
      } catch (error) {
        console.error("Error updating workoutRoutine:", error);
        Alert.alert("Error", "Error saving your workout days. Please try again.");
      }
    } else {
      Alert.alert("Selection Required", "Please select at least one day.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>What's Your Routine?</Text>
        <Text style={styles.subheader}>Select the days you plan to workout.</Text>
        
        <View style={styles.daysContainer}>
          {Object.keys(days).map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayBox, days[day as keyof Days] && styles.daySelected]}
              onPress={() => handleDayPress(day as keyof Days)}
            >
              <Text style={styles.dayBoxText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              Object.values(days).some((val) => val)
                ? styles.nextButtonActive
                : styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!Object.values(days).some((val) => val) || loading}
          >
            <Text 
              style={[
                styles.nextButtonText,
                Object.values(days).some((val) => val)
                  ? styles.nextButtonTextActive
                  : styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
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
  daysContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayBox: {
    width: "auto",
    marginVertical: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#202020',
    borderRadius: 20,
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: 'green',
  },
  dayBoxText: {
    color: 'white',
    fontSize: 18,
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
});
