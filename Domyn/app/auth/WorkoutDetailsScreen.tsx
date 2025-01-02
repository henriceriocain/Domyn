import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import React, { useContext } from 'react';
// importing file that stores user data
import { UserContext } from '../../contexts/UserContext';

export default function PersonalDetailsScreen() {

  // router const to route buttons to new files
  const router = useRouter();
  // userContext const to use user data
  const userContext = useContext(UserContext);
  const { name } = userContext; // Extract the name from context

  // Days of the week
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);

  return (

    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {name}</Text>
    </View>
  );

}

const styles = StyleSheet.create({
 
  container: {
    backgroundColor: "black",

  }
  
});
