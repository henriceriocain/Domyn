import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { UserContext, UserContextProps } from '@/contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const WorkoutsScreen: React.FC = () => {
  const userContext = useContext(UserContext) as UserContextProps;
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string };
  }>({});

  if (!userContext) {
    return <Text>Loading...</Text>;
  }

  const { workouts, selectedDays } = userContext;

  // Mark dates for calendar
  useEffect(() => {
    const marks: Record<
      string,
      { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }
    > = {};

    selectedDays.forEach((day) => {
      const workout = workouts[day];
      if (workout) {
        marks[day] = { marked: true, dotColor: 'green' }; // Completed days
      } else {
        marks[day] = { marked: true, dotColor: 'yellow' }; // Skipped days
      }
    });

    const today = new Date().toISOString().split('T')[0];
    marks[today] = { ...marks[today], selected: true, selectedColor: 'blue' };

    setMarkedDates(marks);
  }, [workouts, selectedDays]);

  const onDayPress = (day: { dateString: string }) => {
    const date = day.dateString;
    // navigation.navigate('CalendarDetails', { date });
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'red',
          dotColor: 'green',
        }}
      />

      {/* Weekly Overview */}
      <View style={styles.weeklyOverview}>
        <Text style={styles.header}>Weekly Overview</Text>
        {selectedDays.map((day: string) => {
          const status = workouts[day]
            ? 'Completed'
            : selectedDays.includes(day)
            ? 'Scheduled'
            : 'Rest Day';
          return (
            <Text key={day} style={styles.dayText}>
              {day}: {status}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  weeklyOverview: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  dayText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WorkoutsScreen;