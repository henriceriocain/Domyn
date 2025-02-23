// app / componeents / WeekView.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { useUserContext } from '../hooks/useUserContext';
import { RoutineWorkout } from '../models/RoutineWorkout';

interface DayStatus {
  date: string;
  dayLetter: string;
  dayNumber: number;
  dayName: string;  // Full day name
  status: 'completed' | 'skipped' | 'missed' | 'scheduled' | 'none' | 'past';
  isToday: boolean;
  isScheduled: boolean;  // Changed from hasWorkout to match our model
}

export const WeekView = () => {
  const [weekDays, setWeekDays] = useState<DayStatus[]>([]);
  const { workouts } = useUserContext();  // Get workouts from context

  useEffect(() => {
    const fetchWeekStatus = async () => {
      if (!auth.currentUser) return;

      // Get current week dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1); // Start with Monday

      const days: DayStatus[] = [];
      
      // Generate week days
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const isToday = date.getTime() === today.getTime();
        const isPast = date < today;
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const workout = workouts[dayName] as RoutineWorkout | undefined;
        
        // Determine status based on workout data
        let status: DayStatus['status'] = 'none';
        if (workout?.isScheduled) {
          if (isPast && !isToday) {
            status = 'missed';  // Past scheduled workouts are marked as missed
          } else {
            status = 'scheduled';
          }
        }

        days.push({
          date: date.toISOString().split('T')[0],
          dayLetter: date.toLocaleDateString('en-US', { weekday: 'short' })[0],
          dayNumber: date.getDate(),
          dayName,
          status,
          isToday,
          isScheduled: workout?.isScheduled || false
        });
      }

      try {
        // Fetch completed workouts for the week
        const logsRef = collection(db, 'users', auth.currentUser.uid, 'workoutLogs');
        const weekStart = days[0].date;
        const weekEnd = days[6].date;
        
        const logsQuery = query(
          logsRef,
          where('date', '>=', weekStart),
          where('date', '<=', weekEnd)
        );
        
        const logsSnap = await getDocs(logsQuery);
        
        // Update status for completed/skipped workouts
        logsSnap.forEach(doc => {
          const logData = doc.data();
          const dayIndex = days.findIndex(day => day.date === logData.date);
          if (dayIndex !== -1) {
            days[dayIndex].status = logData.status as DayStatus['status'];
          }
        });

        setWeekDays(days);
      } catch (error) {
        console.error('Error fetching week status:', error);
      }
    };

    fetchWeekStatus();
  }, [workouts]);  // Update when workouts change

  const getStatusColor = (day: DayStatus) => {
    if (!day.isScheduled) {
      return 'transparent';
    }

    switch (day.status) {
      case 'completed': return '#2E7D32';  // Green
      case 'skipped': return '#F9A825';    // Yellow
      case 'missed': return '#B71C1C';     // Red
      case 'scheduled': return '#424242';   // Dark Gray
      case 'past': return '#1a1a1a';       // Background
      case 'none': return '#424242';       // Gray
      default: return 'transparent';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayLetter}>{day.dayLetter}</Text>
            <View 
              style={[
                styles.dayCircle,
                { backgroundColor: getStatusColor(day) },
                day.status === 'past' && !day.isToday && styles.scratchedOut
              ]}
            >
              <Text style={styles.dayNumber}>{day.dayNumber}</Text>
              {day.status === 'missed' && (
                <View style={styles.scratchLine} />
              )}
            </View>
            {day.isToday && <View style={styles.todayDot} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 15,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLetter: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  dayNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    marginTop: 4,
  },
  scratchedOut: {
    position: 'relative',
  },
  scratchLine: {
    position: 'absolute',
    top: '50%',
    left: -2,
    right: -2,
    height: 1,
    backgroundColor: '#666',
    transform: [{ rotate: '45deg' }],
  },
});