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
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { WeekView } from '../../components/WeekView';

interface UserData {
  personalData?: {
    name: string;
    age: string;
    gender: string;
    weight: string;
    email: string;
  };
}

interface WorkoutRoutine {
  [key: string]: {
    dayName: string;
    exercises: any[];
  };
}

const Header = ({ userName }: { userName?: string }) => {
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitial = () => {
    if (userName && userName.trim()) {
      return userName.trim()[0].toUpperCase();
    }
    return auth.currentUser?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Today</Text>
      <View style={styles.headerCenter}>
        <Text style={styles.headerDate}>{getCurrentDate()}</Text>
      </View>
      <View style={styles.profileIcon}>
        <Text style={styles.profileInitial}>{getInitial()}</Text>
      </View>
    </View>
  );
};

const RoutineDebug = ({ routine }: { routine: WorkoutRoutine }) => {
  return (
    <View style={styles.debugSection}>
      <Text style={styles.debugTitle}>Workout Routine Data:</Text>
      {Object.entries(routine).map(([day, data]) => (
        <View key={day} style={styles.debugDay}>
          <Text style={styles.debugDayText}>
            {day}: {data.dayName} ({data.exercises.length} exercises)
          </Text>
        </View>
      ))}
    </View>
  );
};

export default function CentralHome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [workoutRoutine, setWorkoutRoutine] = useState<WorkoutRoutine>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert('Error', 'No user is currently logged in');
          setLoading(false);
          return;
        }

        // Fetch user data
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        }

        // Fetch workout routine
        const routineRef = collection(db, "users", currentUser.uid, "workoutRoutine");
        const routineSnap = await getDocs(routineRef);
        
        const routineData: WorkoutRoutine = {};
        routineSnap.forEach(doc => {
          routineData[doc.id] = doc.data() as any;
        });
        
        setWorkoutRoutine(routineData);

      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <Header userName={userData?.personalData?.name} />
        <WeekView />
        <RoutineDebug routine={workoutRoutine} />
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    height: 40,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  headerDate: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  debugTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  debugDay: {
    marginBottom: 10,
  },
  debugDayText: {
    color: '#cccccc',
    fontSize: 14,
  },
});