import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';

// This intitialises the 'Days' object, thats a Typscript type. Types defines the parameter of a datastructures
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

  // This destructures the name, and addWorkout properties of UserContext
  // useUserContext is a React hook that allows us to use UserContext, its values and its methods
  // Whats a hook? 
  //    A special function that makes remembering data easier.
  const { name, addWorkout } = useUserContext();
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

  const handleContinue = () => {
    const selectedDays = Object.keys(days).filter((day) => days[day as keyof Days]);
    if (selectedDays.length > 0) {
      selectedDays.forEach((day) => addWorkout(day as keyof Days));
      router.push({
        pathname: './WorkoutDetailsScreen',
        params: { selectedDays },
      });
    } else {
      alert('Please select at least one day.');
    }
  };

  const handleBackPress = () => {
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
        <TouchableOpacity style={styles.button} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Object.values(days).some((val) => val) ? 'white' : 'gray' },
          ]}
          onPress={handleContinue}
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
    justifyContent: "space-between",  
    paddingHorizontal: 10,           
    marginTop: 290,
    marginBottom: 100,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    width: "30%",                    
    alignItems: "center",            
  },
  nextButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  }

});
