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
import Workout from '../models/Workout';

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
  workouts: { [day: string]: Workout };
  addWorkout: (day: string) => void;
  getWorkout: (day: string) => Workout | undefined;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

  // Personal details state, this defines the initial state of these variables
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  // Workouts state
  const [workouts, setWorkouts] = useState<{ [day: string]: Workout }>({});

  // Load user data from AsyncStorage, this grabs the data within Asynctorage when the app is opened
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedAge = await AsyncStorage.getItem('@user_age');
        const storedGender = await AsyncStorage.getItem('@user_gender');
        const storedWeight = await AsyncStorage.getItem('@user_weight');
        const storedWorkouts = await AsyncStorage.getItem('@workouts');

        if (storedName) setName(storedName);
        if (storedAge) setAge(storedAge);
        if (storedGender) setGender(storedGender);
        if (storedWeight) setWeight(storedWeight);
        if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadUserData();
  }, []);

  // Save data to AsyncStorage
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('@user_name', name);
        await AsyncStorage.setItem('@user_age', age);
        await AsyncStorage.setItem('@user_gender', gender);
        await AsyncStorage.setItem('@user_weight', weight);
        await AsyncStorage.setItem('@workouts', JSON.stringify(workouts));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveUserData();
  }, [name, age, gender, weight, workouts]);

  // Reset user data
  const resetUser = async () => {
    try {
      setName('');
      setAge('');
      setGender('');
      setWeight('');
      setWorkouts({});
      await AsyncStorage.multiRemove(['@user_name', '@user_age', '@user_gender', '@user_weight', '@workouts']);
    } catch (error) {
      console.error('Error resetting user data:', error);
    }
  };

  // Add a workout
  const addWorkout = (day: string) => {
    setWorkouts((prev) => ({
      ...prev,
      [day]: new Workout(day),
    }));
  };

  // Get a workout
  const getWorkout = (day: string): Workout | undefined => workouts[day];

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
      addWorkout,
      getWorkout,
    }),
    [name, age, gender, weight, workouts]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
  
};
