// app / auth / CustomizeWorkout.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Animated, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserContext } from '../../hooks/useUserContext';
import { BouncyBox } from '../../components/BouncyBox';
import type { UserContextProps } from '../../contexts/UserContext';
import type Workout from '../../models/Workout';

interface Exercise {
  nameOfExercise: string;
  weight: number;
  reps: number;
  sets: number;
}

interface CurrentExercise {
  nameOfExercise: string;
  weight: string;
  reps: string;
  sets: string;
  isEditing: boolean;
}

const LAYOUT_ANIMATION_DURATION = 150;

const WorkoutNameInput = ({ value, onChangeText, disableEditing }: { 
  value: string; 
  onChangeText: (text: string) => void;
  disableEditing: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handlePress = () => {
    if (disableEditing) return;
    setIsEditing(true);
  };
  const handleBlur = () => {
    setIsEditing(false);
    onChangeText(inputValue);
  };

  return (
    <BouncyBox 
      containerStyle={styles.workoutNameContainer}
      onPress={!isEditing && !disableEditing ? handlePress : undefined}
      disable={disableEditing}
    >
      <View style={styles.workoutNameWrapper}>
        {isEditing ? (
          <TextInput
            style={styles.workoutNameInput}
            value={inputValue}
            onChangeText={setInputValue}
            onBlur={handleBlur}
            onSubmitEditing={handleBlur}
            placeholder="Enter workout name"
            placeholderTextColor="#666"
            autoFocus
            returnKeyType="done"
            selectionColor="white"
            multiline
          />
        ) : (
          <Text style={[styles.workoutNameText, !value && styles.placeholderText]}>
            {value || "Enter workout name"}
          </Text>
        )}
      </View>
    </BouncyBox>
  );
};

const EditableExerciseItem = ({
  exercise,
  index,
  isEditing,
  toggleEditing,
  handleExerciseFieldChange,
  saveExercise
}: {
  exercise: Exercise;
  index: number;
  isEditing: boolean;
  toggleEditing: (index: number) => void;
  handleExerciseFieldChange: (index: number, field: keyof Exercise, value: string) => void;
  saveExercise: (index: number) => void;
}) => {
  const animation = useRef(new Animated.Value(isEditing ? 1 : 0)).current;
  const [localExercise, setLocalExercise] = useState({
    nameOfExercise: exercise.nameOfExercise,
    weight: exercise.weight.toString(),
    reps: exercise.reps.toString(),
    sets: exercise.sets.toString(),
  });

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isEditing ? 1 : 0,
      friction: 8,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [isEditing]);

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [110, 160],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const handleLocalChange = (field: keyof typeof localExercise, value: string) => {
    setLocalExercise(prev => ({ ...prev, [field]: value }));
    handleExerciseFieldChange(index, field as keyof Exercise, value);
  };

  const validateFields = () =>
    localExercise.nameOfExercise.trim() &&
    localExercise.weight.trim() &&
    localExercise.reps.trim() &&
    localExercise.sets.trim();

  const handleDone = () => {
    if (validateFields()) {
      saveExercise(index);
    } else {
      Alert.alert('Validation Error', 'Please fill out all fields correctly.');
    }
  };

  return (
    <Animated.View style={[styles.exerciseItem, { height: animatedHeight, opacity: animatedOpacity }]}>
      <BouncyBox 
        containerStyle={styles.exerciseContent}
        onPress={!isEditing ? () => toggleEditing(index) : undefined}
      >
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.input, styles.exerciseNameInput]}
              value={localExercise.nameOfExercise}
              onChangeText={(text) => handleLocalChange('nameOfExercise', text)}
              placeholder="Exercise Name"
              placeholderTextColor="#666"
              returnKeyType="done"
              autoFocus
              onSubmitEditing={handleDone}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={localExercise.weight}
                onChangeText={(text) => handleLocalChange('weight', text)}
                keyboardType="numeric"
                placeholder="Weight"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={handleDone}
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={localExercise.reps}
                onChangeText={(text) => handleLocalChange('reps', text)}
                keyboardType="numeric"
                placeholder="Reps"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={handleDone}
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={localExercise.sets}
                onChangeText={(text) => handleLocalChange('sets', text)}
                keyboardType="numeric"
                placeholder="Sets"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={handleDone}
              />
            </View>
          </View>
        ) : (
          <View style={styles.displayContainer}>
            <Text style={styles.exerciseItemName}>{exercise.nameOfExercise}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.weight} lbs × {exercise.reps} reps
            </Text>
            <Text style={styles.exerciseDetails}>{exercise.sets} sets</Text>
          </View>
        )}
      </BouncyBox>
    </Animated.View>
  );
};

export default function CustomizeWorkout() {
  const { day } = useLocalSearchParams();
  const { addWorkout, getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(day as string);
  
  const [dayName, setDayName] = useState(existingWorkout?.dayName || (day as string));
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercise || []);
  const [currentExercise, setCurrentExercise] = useState<CurrentExercise>({
    nameOfExercise: '',
    weight: '',
    sets: '',
    reps: '',
    isEditing: false
  });
  // Only one card may be open at a time.
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!existingWorkout) addWorkout(day as string);
  }, [day]);

  // Use keyboardWillHide (on iOS) or keyboardDidHide (Android) with a custom, short duration animation.
  useEffect(() => {
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const listener = Keyboard.addListener(keyboardHideEvent, () => {
      LayoutAnimation.configureNext({
        duration: LAYOUT_ANIMATION_DURATION,
        update: { type: LayoutAnimation.Types.easeInEaseOut }
      });
      setEditingExerciseIndex(null);
    });
    return () => listener.remove();
  }, []);

  const handleOutsideTap = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext({
      duration: LAYOUT_ANIMATION_DURATION,
      update: { type: LayoutAnimation.Types.easeInEaseOut }
    });
    if (editingExerciseIndex !== null) {
      const exercise = exercises[editingExerciseIndex];
      if (
        exercise.nameOfExercise.trim() &&
        exercise.weight > 0 &&
        exercise.reps > 0 &&
        exercise.sets > 0
      ) {
        const workout = getWorkout(day as string);
        if (workout) {
          workout.exercise[editingExerciseIndex] = exercise;
          updateWorkout(day as string, workout);
          setEditingExerciseIndex(null);
        }
      } else {
        Alert.alert('Validation Error', `Please complete all fields for exercise "${exercise.nameOfExercise || 'Unnamed Exercise'}".`);
      }
    }
  };

  const handleDayNameChange = (name: string) => {
    setDayName(name);
    const workout = getWorkout(day as string);
    if (workout) {
      workout.dayName = name;
      updateWorkout(day as string, workout);
    }
  };

  const checkAndAddExercise = () => {
    if (
      currentExercise.nameOfExercise.trim() &&
      currentExercise.weight.trim() &&
      currentExercise.sets.trim() &&
      currentExercise.reps.trim()
    ) {
      const workout = getWorkout(day as string);
      if (workout) {
        workout.addExercise(
          currentExercise.nameOfExercise,
          parseInt(currentExercise.weight),
          parseInt(currentExercise.reps),
          parseInt(currentExercise.sets)
        );
        setExercises([...workout.exercise]);
        setCurrentExercise({ nameOfExercise: '', weight: '', sets: '', reps: '', isEditing: false });
        updateWorkout(day as string, workout);
      }
    }
  };

  const handleExerciseChange = (field: keyof Omit<CurrentExercise, 'isEditing'>, value: string) =>
    setCurrentExercise(prev => ({ ...prev, [field]: value }));

  // When tapping on a card:
  // • If no card is open, open the tapped card.
  // • If the tapped card is already open, collapse it.
  // • If a different card is open, first collapse it (using our custom animation) then open the new card.
  const toggleEditingExercise = (index: number) => {
    if (editingExerciseIndex === index) {
      LayoutAnimation.configureNext({
        duration: LAYOUT_ANIMATION_DURATION,
        update: { type: LayoutAnimation.Types.easeInEaseOut }
      });
      setEditingExerciseIndex(null);
    } else if (editingExerciseIndex !== null && editingExerciseIndex !== index) {
      // Collapse currently open card.
      LayoutAnimation.configureNext({
        duration: LAYOUT_ANIMATION_DURATION,
        update: { type: LayoutAnimation.Types.easeInEaseOut }
      });
      setEditingExerciseIndex(null);
      // After the collapse animation, open the tapped card.
      setTimeout(() => {
        LayoutAnimation.configureNext({
          duration: LAYOUT_ANIMATION_DURATION,
          update: { type: LayoutAnimation.Types.easeInEaseOut }
        });
        setEditingExerciseIndex(index);
      }, LAYOUT_ANIMATION_DURATION);
    } else {
      LayoutAnimation.configureNext({
        duration: LAYOUT_ANIMATION_DURATION,
        update: { type: LayoutAnimation.Types.easeInEaseOut }
      });
      setEditingExerciseIndex(index);
    }
  };

  const handleExerciseFieldChange = (index: number, field: keyof Exercise, value: string) => {
    setExercises(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: (field === 'weight' || field === 'reps' || field === 'sets')
          ? (parseInt(value) || 0)
          : value,
      };
      return updated;
    });
  };

  const saveExercise = (index: number) => {
    const workout = getWorkout(day as string);
    if (workout) {
      workout.exercise[index] = exercises[index];
      updateWorkout(day as string, workout);
    }
    LayoutAnimation.configureNext({
      duration: LAYOUT_ANIMATION_DURATION,
      update: { type: LayoutAnimation.Types.easeInEaseOut }
    });
    setEditingExerciseIndex(null);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.header}>{day}'s Workout</Text>
            <View style={styles.section}>
              <Text style={styles.subheader}>Name of Workout</Text>
              {/* Disable workout name editing if any exercise card is open */}
              <WorkoutNameInput 
                value={dayName} 
                onChangeText={handleDayNameChange} 
                disableEditing={editingExerciseIndex !== null} 
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subheader}>Exercises</Text>
              <View style={styles.exercisesList}>
                {exercises.map((item, index) => (
                  <EditableExerciseItem 
                    key={index} 
                    exercise={item} 
                    index={index}
                    isEditing={editingExerciseIndex === index}
                    toggleEditing={toggleEditingExercise}
                    handleExerciseFieldChange={handleExerciseFieldChange}
                    saveExercise={saveExercise}
                  />
                ))}
              </View>
              <View style={styles.exerciseInputWrapper}>
                <BouncyBox containerStyle={styles.exerciseInputContainer}>
                  <TextInput
                    style={[styles.input, styles.exerciseNameInput]}
                    placeholder="Exercise Name"
                    placeholderTextColor="#666"
                    value={currentExercise.nameOfExercise}
                    onChangeText={(value) => handleExerciseChange('nameOfExercise', value)}
                    onBlur={checkAndAddExercise}
                    returnKeyType="next"
                  />
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.numberInput]}
                      placeholder="Weight"
                      placeholderTextColor="#666"
                      value={currentExercise.weight}
                      onChangeText={(value) => handleExerciseChange('weight', value)}
                      onBlur={checkAndAddExercise}
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                    <TextInput
                      style={[styles.input, styles.numberInput]}
                      placeholder="Reps"
                      placeholderTextColor="#666"
                      value={currentExercise.reps}
                      onChangeText={(value) => handleExerciseChange('reps', value)}
                      onBlur={checkAndAddExercise}
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                    <TextInput
                      style={[styles.input, styles.numberInput]}
                      placeholder="Sets"
                      placeholderTextColor="#666"
                      value={currentExercise.sets}
                      onChangeText={(value) => handleExerciseChange('sets', value)}
                      onBlur={checkAndAddExercise}
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                  </View>
                </BouncyBox>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  content: { padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: '700', color: 'white', marginBottom: 30 },
  section: { marginBottom: 30 },
  subheader: { fontSize: 20, fontWeight: '600', color: 'white', marginBottom: 15 },
  workoutNameContainer: { borderRadius: 10, backgroundColor: '#1a1a1a', minHeight: 60, paddingVertical: 15, marginBottom: 20 },
  workoutNameWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 15 },
  workoutNameInput: { color: 'white', fontSize: 16, padding: 0, minHeight: 45, textAlignVertical: 'top' },
  workoutNameText: { color: 'white', fontSize: 16, padding: 0, textAlignVertical: 'center' },
  placeholderText: { color: '#666' },
  input: { color: 'white', padding: 10, borderRadius: 5, backgroundColor: '#262626', fontSize: 16 },
  exerciseNameInput: { fontSize: 16, height: 45, flex: 1, marginBottom: 10, color: 'white' },
  exercisesList: { marginBottom: 20 },
  exerciseInputWrapper: { marginBottom: 30 },
  exerciseInputContainer: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  numberInput: { flex: 1, fontSize: 16, backgroundColor: '#262626', borderRadius: 10, height: 50, paddingHorizontal: 10, color: 'white' },
  exerciseItem: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10, marginBottom: 15, overflow: 'hidden' },
  exerciseContent: { flex: 1 },
  exerciseItemName: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 5 },
  exerciseDetails: { color: '#999', fontSize: 14, marginBottom: 3 },
  editContainer: { flex: 1 },
  displayContainer: { paddingVertical: 5 },
});
