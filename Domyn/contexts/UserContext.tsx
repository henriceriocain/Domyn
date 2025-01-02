// app/contexts/UserContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the user data
export interface UserContextProps {
  name: string;
  setName: (name: string) => void;
  age: string;
  setAge: (age: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  resetUser: () => void; // Optional: For resetting user data
}

// Create the context with default values
export const UserContext = createContext<UserContextProps | undefined>(undefined);

// Define the props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");

  // Load data from AsyncStorage when the provider mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedAge = await AsyncStorage.getItem('@user_age');
        const storedGender = await AsyncStorage.getItem('@user_gender');
        const storedWeight = await AsyncStorage.getItem('@user_weight');

        if (storedName) setName(storedName);
        if (storedAge) setAge(storedAge);
        if (storedGender) setGender(storedGender);
        if (storedWeight) setWeight(storedWeight);
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('@user_name', name);
        await AsyncStorage.setItem('@user_age', age);
        await AsyncStorage.setItem('@user_gender', gender);
        await AsyncStorage.setItem('@user_weight', weight);
      } catch (error) {
        console.log('Error saving user data:', error);
      }
    };

    saveUserData();
  }, [name, age, gender, weight]);

  // Optional: Function to reset user data
  const resetUser = async () => {
    try {
      setName("");
      setAge("");
      setGender("");
      setWeight("");

      await AsyncStorage.removeItem('@user_name');
      await AsyncStorage.removeItem('@user_age');
      await AsyncStorage.removeItem('@user_gender');
      await AsyncStorage.removeItem('@user_weight');
    } catch (error) {
      console.log('Error resetting user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ name, setName, age, setAge, gender, setGender, weight, setWeight, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};
