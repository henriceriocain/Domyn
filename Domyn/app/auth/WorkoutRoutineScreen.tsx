import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';

export default function WorkoutRoutineScreen() {
  const router = useRouter();
  const { selectedDays } = useUserContext(); // Access selectedDays from UserContext

  const handleBack = () => {
    router.push('./WorkoutDaysScreen'); // Navigate back to the previous screen
  };

  const handleNext = () => {
    alert('Workout routines saved!'); // Placeholder for next functionality
    // Navigate to the next screen if required, e.g., router.push('./NextScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What are your workout routines on these days?</Text>

      {/* Dynamically render sections for each selected day */}
      {selectedDays.map((day, index) => (
        <View key={index} style={styles.daySection}>
          <Text style={styles.dayTitle}>{day}</Text>
          <TextInput
            placeholder="Enter workout details"
            placeholderTextColor="gray"
            style={styles.input}
          />
        </View>
      ))}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  daySection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#000',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
