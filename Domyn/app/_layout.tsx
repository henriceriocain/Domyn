import React from 'react';
import { UserProvider } from '../contexts/UserContext'; // Adjust the path if necessary
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native'; // Added import

const Layout = () => {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
