// contexts / UserContext.tsx

// What does this file do?
//    This file stores global data within our app.

// How does this file store user data?
//    With a tool called 'React Context'. This gives our data a place to store data, and allows components to use it.

// React Context
    // Whats UserContext?
    //    This is the container that stores all the data of the user. this includes their name, DoB, and workout plan.

    // Whats UserProvider?
    //    This is the wrapper around the app that makes UserContext usable for any component within our app. This decides what component has what data.

// Global State Management

    // States:
    //    The current contents of a class of data.

// AsyncStorage
//    A small database within phones to store data

import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoutineWorkout } from '../models/RoutineWorkout';  // Updated import

export interface UserContextProps {
  name: string;
  setName: (name: string) => void;
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  resetUser: () => void;
  workouts: { [day: string]: RoutineWorkout };
  setWorkouts: React.Dispatch<React.SetStateAction<{ [day: string]: RoutineWorkout }>>;  // Add this line
  addWorkout: (day: string, isScheduled: boolean) => void;
  getWorkout: (day: string) => RoutineWorkout | undefined;  // Updated return type
  updateWorkout: (day: string, workout: RoutineWorkout) => void;  // Updated type
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  skippedDays: { [day: string]: string };
  addSkippedDay: (day: string, reason: string) => void;
  getSkippedDayReason: (day: string) => string | undefined;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [workouts, setWorkouts] = useState<{ [day: string]: RoutineWorkout }>({});  // Updated type
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [skippedDays, setSkippedDays] = useState<{ [day: string]: string }>({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedAge = await AsyncStorage.getItem('@user_age');
        const storedGender = await AsyncStorage.getItem('@user_gender');
        const storedWeight = await AsyncStorage.getItem('@user_weight');
        const storedWorkouts = await AsyncStorage.getItem('@workouts');
        const storedSelectedDays = await AsyncStorage.getItem('@selected_days');
        const storedSkippedDays = await AsyncStorage.getItem('@skipped_days');

        if (storedName) setName(storedName);
        if (storedAge) setAge(storedAge);
        if (storedGender) setGender(storedGender);
        if (storedWeight) setWeight(storedWeight);
        if (storedWorkouts) {
          const parsedWorkouts = JSON.parse(storedWorkouts);
          const reconstructedWorkouts: { [day: string]: RoutineWorkout } = {};
          
          Object.entries(parsedWorkouts).forEach(([day, workoutData]: [string, any]) => {
            const workout = new RoutineWorkout(day, workoutData.isScheduled);
            workout.customName = workoutData.customName || "";
            workout.exercises = workoutData.exercises || [];
            workout.created = new Date(workoutData.created || Date.now());
            workout.lastModified = new Date(workoutData.lastModified || Date.now());
            workout.targetMuscleGroups = workoutData.targetMuscleGroups;
            workout.difficulty = workoutData.difficulty;
            workout.notes = workoutData.notes;
            
            reconstructedWorkouts[day] = workout;
          });
          
          setWorkouts(reconstructedWorkouts);
        }
        if (storedSelectedDays) setSelectedDays(JSON.parse(storedSelectedDays));
        if (storedSkippedDays) setSkippedDays(JSON.parse(storedSkippedDays));
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('@user_name', name);
        await AsyncStorage.setItem('@user_age', age);
        await AsyncStorage.setItem('@user_gender', gender);
        await AsyncStorage.setItem('@user_weight', weight);
        await AsyncStorage.setItem('@workouts', JSON.stringify(workouts));
        await AsyncStorage.setItem('@selected_days', JSON.stringify(selectedDays));
        await AsyncStorage.setItem('@skipped_days', JSON.stringify(skippedDays));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };
    saveUserData();
  }, [name, age, gender, weight, workouts, selectedDays, skippedDays]);

  const resetUser = async () => {
    try {
      setName('');
      setAge('');
      setGender('');
      setWeight('');
      setWorkouts({});
      setSelectedDays([]);
      setSkippedDays({});
      await AsyncStorage.multiRemove([
        '@user_name',
        '@user_age',
        '@user_gender',
        '@user_weight',
        '@workouts',
        '@selected_days',
        '@skipped_days',
      ]);
    } catch (error) {
      console.error('Error resetting user data:', error);
    }
  };

  const addWorkout = (day: string, isScheduled: boolean = true) => {
    setWorkouts((prev) => {
      if (prev[day]) {
        // If workout exists, update its isScheduled flag
        const updatedWorkout = prev[day];
        updatedWorkout.isScheduled = isScheduled;
        return { ...prev, [day]: updatedWorkout };
      }
      // Create new workout with explicit isScheduled flag
      const newWorkout = new RoutineWorkout(day, isScheduled);
      return { ...prev, [day]: newWorkout };
    });
  };

  const getWorkout = (day: string): RoutineWorkout | undefined => workouts[day];

  const updateWorkout = (day: string, workout: RoutineWorkout) => {
    setWorkouts(prev => ({
      ...prev,
      [day]: workout
    }));
  };

  const addSkippedDay = (day: string, reason: string) => {
    setSkippedDays((prev) => ({ ...prev, [day]: reason }));
  };

  const getSkippedDayReason = (day: string): string | undefined => skippedDays[day];

  const value = useMemo(
    () => ({
      name,
      setName,
      age,
      setAge,
      gender,
      setGender,
      weight,
      setWeight,
      resetUser,
      workouts,
      setWorkouts,
      addWorkout,
      getWorkout,
      updateWorkout,
      selectedDays,
      setSelectedDays,
      skippedDays,
      addSkippedDay,
      getSkippedDayReason,
    }),
    [name, age, gender, weight, workouts, selectedDays, skippedDays]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};