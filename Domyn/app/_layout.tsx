// app / _layout.tsx

import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

const Layout = () => {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="auth/EditExerciseScreen"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureDirection: 'vertical',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="auth/AddExerciseScreen"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureDirection: 'vertical',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
            animationDuration: 300,
          }}
        />
      </Stack>
    </UserProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
});