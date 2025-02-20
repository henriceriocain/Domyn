// app / auth / WorkoutDaysScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Updated type with full weekday names.
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
  const { name, setSelectedDays, addWorkout } = useUserContext();

  // Initialize full weekday names (all false).
  const [days, setDays] = useState<Days>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const handleDayPress = (day: keyof Days) => {
    setDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };

  // Save selected days to UserContext and persist to Firestore.
  const handleNext = async () => {
    const selectedDays = Object.keys(days).filter((day) => days[day as keyof Days]);
    if (selectedDays.length > 0) {
      setSelectedDays(selectedDays); // Save to UserContext
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
      try {
        for (const day of selectedDays) {
          const dayDocRef = doc(db, "users", currentUser.uid, "workoutRoutine", day);
          await setDoc(
            dayDocRef,
            {
              day,
              workoutName: null, // Default value; will be updated later.
              exercises: [],     // Initially empty.
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        selectedDays.forEach((day) => addWorkout(day as keyof Days));
        router.push('./WorkoutRoutineScreen');
      } catch (error) {
        console.error("Error updating workoutRoutine:", error);
        Alert.alert("Error", "Error saving your workout days. Please try again.");
      }
    } else {
      Alert.alert("Selection Required", "Please select at least one day.");
    }
  };

  const handleBack = () => {
    router.push('./PersonalDetailsScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome, <Text style={styles.name}>{name}</Text>!
      </Text>
      <Text style={styles.subheader}>When Do You Usually Workout?</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Object.values(days).some((val) => val) ? 'white' : 'gray' },
          ]}
          onPress={handleNext}
          disabled={!Object.values(days).some((val) => val)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    paddingTop: 60,
    paddingBottom: 60,
  },
  name: {
    fontWeight: '800',
    color: 'white',
  },
  subheader: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    marginTop: 40,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    width: "30%",
    alignItems: "center",
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
