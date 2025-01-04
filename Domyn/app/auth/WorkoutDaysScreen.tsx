import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';

// This initializes the 'Days' object, that's a TypeScript type. Types define the structure of a data object.
type Days = {
  Mon: boolean;
  Tues: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
};

export default function WorkoutDaysScreen() {
  const router = useRouter();

  // This destructures the name, setSelectedDays, and addWorkout properties of UserContext
  // useUserContext is a React hook that allows us to use UserContext, its values, and its methods
  const { name, setSelectedDays, addWorkout } = useUserContext();

  // This sets all Days to be by default false. Consts are constant variables where values cannot be changed.
  const [days, setDays] = useState<Days>({
    Mon: false,
    Tues: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  // Defines a const function, input is a day of a Days object
  const handleDayPress = (day: keyof Days) => {
    setDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };

  // Save selected days to UserContext and navigate to the next screen
  const handleNext = () => {
    const selectedDays = Object.keys(days).filter((day) => days[day as keyof Days]);
    if (selectedDays.length > 0) {
      setSelectedDays(selectedDays); // Save to UserContext
      selectedDays.forEach((day) => addWorkout(day as keyof Days)); // Optionally add workouts
      router.push('./WorkoutRoutineScreen'); // Navigate to the next screen
    } else {
      alert('Please select at least one day.');
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
    width: '22%',
    marginVertical: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#404040',
    borderRadius: 10,
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
    marginTop: 290,
    marginBottom: 100,
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
