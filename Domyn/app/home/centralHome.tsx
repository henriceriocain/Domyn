// app / home/ centralHome.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  personalData?: {
    name: string;
    age: string;
    gender: string;
    weight: string;
    email: string;
  };
  workoutRoutine?: {
    [key: string]: {
      day: string;
      dayName: string;
      exercises: Array<{
        nameOfExercise: string;
        weight: number;
        reps: number;
        sets: number;
      }>;
    };
  };
}

export default function CentralHome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert('Error', 'No user is currently logged in');
          setLoading(false);
          return;
        }

        // Fetch user's personal data
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        } else {
          Alert.alert('Error', 'No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>User Profile Test</Text>
        
        {userData?.personalData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.infoText}>Name: {userData.personalData.name}</Text>
            <Text style={styles.infoText}>Age: {userData.personalData.age}</Text>
            <Text style={styles.infoText}>Gender: {userData.personalData.gender}</Text>
            <Text style={styles.infoText}>Weight: {userData.personalData.weight} lbs</Text>
            <Text style={styles.infoText}>Email: {userData.personalData.email}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firebase Auth Info</Text>
          <Text style={styles.infoText}>User ID: {auth.currentUser?.uid}</Text>
          <Text style={styles.infoText}>Email: {auth.currentUser?.email}</Text>
        </View>

        {userData?.workoutRoutine && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Schedule</Text>
            {Object.entries(userData.workoutRoutine).map(([day, routine]) => (
              <View key={day} style={styles.workoutDay}>
                <Text style={styles.dayTitle}>{day}</Text>
                <Text style={styles.workoutName}>{routine.dayName || 'Unnamed Workout'}</Text>
                {routine.exercises?.map((exercise, index) => (
                  <View key={index} style={styles.exercise}>
                    <Text style={styles.exerciseName}>{exercise.nameOfExercise}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.weight}lbs × {exercise.reps} reps × {exercise.sets} sets
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 8,
  },
  workoutDay: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  workoutName: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 10,
  },
  exercise: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#999999',
  },
});