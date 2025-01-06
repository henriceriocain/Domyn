import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function FAQScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.push("/settings/SettingsScreen")}>
          <Text style={styles.backText}>&lt; Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Frequently Asked Questions</Text>

        {/* FAQ Screen */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. General</Text>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: What is this app used for?</Text>
            <Text style={styles.answer}>A: This app helps you track your workouts, monitor progress, and stay motivated.</Text>
          </View>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: Can I use this app to track any type of workout?</Text>
            <Text style={styles.answer}>A: Yes! This app can be used to track any type of workout, whether it is weightlifting, yoga, cardio, or any type of activity.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>2. Workout Schedule</Text>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: How do I set up my workout dates?</Text>
            <Text style={styles.answer}>A: When you enter our domain, you'll choose the days you want to work out. Then, you'll be prompted to enter your exercises and any optional weight/reps you want to track.</Text>
          </View>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: Can I change my workout schedule after setting it?</Text>
            <Text style={styles.answer}>A: Yes! Navigate to <Text style={styles.highlight}>Settings &gt; Edit Schedule</Text> to edit the days and types of exercises you want.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>3. Streaks/Progress</Text>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: How do streaks work?</Text>
            <Text style={styles.answer}>A: Streaks track the number of consecutive workout days you complete. Missing a scheduled day will restart your streak to 0.</Text>
          </View>
          <View style={styles.questionBlock}>
            <Text style={styles.question}>Q: Do rest days restart my streak?</Text>
            <Text style={styles.answer}>A: No. Streaks will continue as long as no planned workout days are skipped. Rest days will not count towards streak days.</Text>
          </View>
        </View>

        {/* Footer */}
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
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 25,
  },
  questionBlock: {
    marginBottom: 15,
  },
  question: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  answer: {
    fontSize: 17,
    color: "white",
    lineHeight: 22,
  },
  highlight: {
    fontWeight: "bold",
    color: "#4CAF50", // Highlight color
  },
  footer: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 30,
  },
});