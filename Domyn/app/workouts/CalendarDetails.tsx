import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserContext, UserContextProps } from '@/contexts/UserContext';

interface CalendarDetailsProps {
  route: {
    params: {
      date: string;
    };
  };
}

const CalendarDetails: React.FC<CalendarDetailsProps> = ({ route }) => {
  const { date } = route.params;
  const userContext = useContext(UserContext) as UserContextProps;

  if (!userContext) {
    return <Text>Loading...</Text>;
  }

  const { workouts, getSkippedDayReason } = userContext;
  const workout = workouts[date];
  const skippedReason = getSkippedDayReason(date);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.dateText}>Date: {date}</Text>
      {workout ? (
        <View>
          <Text style={styles.header}>Workout Details:</Text>
          {workout.exercise.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>
              {exercise.nameOfExercise} - {exercise.reps} reps x {exercise.sets} sets @ {exercise.weight} lbs
            </Text>
          ))}
        </View>
      ) : skippedReason ? (
        <View>
          <Text style={styles.skippedText}>Day Skipped</Text>
          <Text style={styles.reasonText}>Reason: {skippedReason}</Text>
        </View>
      ) : (
        <Text style={styles.restText}>Rest Day</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  dateText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 5,
  },
  skippedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 16,
    color: '#555',
  },
  restText: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default CalendarDetails;