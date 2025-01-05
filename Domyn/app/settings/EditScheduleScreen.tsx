import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function EditSchedule() {
  const router = useRouter();

  // State to store selected days
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Days of the week
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Toggle day selection
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        // Back button
        <TouchableOpacity onPress={() => router.push("/settings/SettingsScreen")}>
          <Text style={styles.backText}>&lt; Back</Text>
        </TouchableOpacity>

        // Title
        <Text style={styles.title}>Edit Schedule</Text>

        // Edit workout days
        <Text style={styles.subtitle}>Edit Workout Days:</Text>
        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDays.includes(day) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day)}>
              <Text
                style={[
                  styles.dayText,
                  selectedDays.includes(day) && styles.dayTextSelected,
                ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        // Exercise section
        {selectedDays.length > 0 && (
          <>
            <Text style={styles.subtitle}>Exercises</Text>
            <View style={styles.exerciseContainer}>
              {selectedDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={styles.exerciseButton}
                  onPress={() => router.push(`/settings/EditExercisesScreen?day=${day}`)}>
                  <Text style={styles.exerciseText}>{day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}</Text>
                  <Text style={styles.arrow}>&gt;</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        // Footer
        <Text style={styles.footer}>Domyn</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    padding: 20,
  },
  backText: {
    fontSize: 16,
    color: "white",
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginBottom: 30,
  },
  dayButton: {
    backgroundColor: "grey",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginRight: 5,
  },
  dayButtonSelected: {
    backgroundColor: "green",
  },
  dayText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  dayTextSelected: {
    color: "white",
  },
  exerciseContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  exerciseButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
  },
  exerciseText: {
    color: "white",
    fontSize: 16,
  },
  arrow: {
    color: "white",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    marginTop: 20,
  },
});
