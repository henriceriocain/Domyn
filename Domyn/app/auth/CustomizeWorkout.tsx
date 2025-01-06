import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Animated, 
  Easing, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform 
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

const WorkoutNameInput = ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handlePress = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChangeText(inputValue);
  };

  const handleChange = (text: string) => {
    setInputValue(text);
  };

  return (
    <BouncyBox 
      containerStyle={styles.workoutNameContainer}
      onPress={!isEditing ? handlePress : undefined} // Only handle press when not editing
    >
      <View style={styles.workoutNameWrapper}>
        {isEditing ? (
          <TextInput
            style={styles.workoutNameInput}
            onChangeText={handleChange}
            onBlur={handleBlur}
            onSubmitEditing={handleBlur}
            value={inputValue}
            placeholder="Enter workout name"
            placeholderTextColor="#666"
            autoFocus
            returnKeyType="done"
            selectionColor="white"
            multiline // Allow multiline input
          />
        ) : (
          <Text style={[
            styles.workoutNameText,
            !value && styles.placeholderText
          ]}>
            {value || "Enter workout name"}
          </Text>
        )}
      </View>
    </BouncyBox>
  );
};

// New Component: EditableExerciseItem
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
  // Animation value
  const animation = useRef(new Animated.Value(isEditing ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isEditing ? 1 : 0,
      friction: 6, // Reduced friction for smoother animation
      tension: 100, // Adjusted tension to reduce bounciness
      useNativeDriver: false,
    }).start();
  }, [isEditing]);

  // Interpolate height based on animation value
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 150], // Adjust these values as needed
  });

  return (
    <Animated.View style={[styles.exerciseItem, { height: animatedHeight }]}>
      <BouncyBox 
        containerStyle={styles.exerciseContent}
        onPress={!isEditing ? () => toggleEditing(index) : undefined} // Disable onPress when editing
      >
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.input, styles.exerciseNameInput]}
              value={exercise.nameOfExercise}
              onChangeText={(text) => handleExerciseFieldChange(index, 'nameOfExercise', text)}
              onBlur={() => saveExercise(index)}
              autoFocus
              placeholder="Exercise Name"
              placeholderTextColor="#666"
              returnKeyType="next"
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={exercise.weight.toString()}
                onChangeText={(text) => handleExerciseFieldChange(index, 'weight', text)}
                keyboardType="numeric"
                onBlur={() => saveExercise(index)}
                placeholder="Weight"
                placeholderTextColor="#666"
                returnKeyType="next"
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={exercise.reps.toString()}
                onChangeText={(text) => handleExerciseFieldChange(index, 'reps', text)}
                keyboardType="numeric"
                onBlur={() => saveExercise(index)}
                placeholder="Reps"
                placeholderTextColor="#666"
                returnKeyType="next"
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={exercise.sets.toString()}
                onChangeText={(text) => handleExerciseFieldChange(index, 'sets', text)}
                keyboardType="numeric"
                onBlur={() => saveExercise(index)}
                placeholder="Sets"
                placeholderTextColor="#666"
                returnKeyType="done"
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.exerciseItemName}>
              {exercise.nameOfExercise}
            </Text>
            <Text style={styles.exerciseDetails}>
              {exercise.weight} lbs × {exercise.reps} reps
            </Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets} sets
            </Text>
          </View>
        )}
      </BouncyBox>
    </Animated.View>
  );
};

export default function CustomizeWorkout() {
  const { day } = useLocalSearchParams();
  const { workouts, addWorkout, getWorkout, updateWorkout } = useUserContext() as UserContextProps;
  const existingWorkout = getWorkout(day as string);
  
  const [dayName, setDayName] = useState(existingWorkout?.dayName || day as string);
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercise || []);
  const [currentExercise, setCurrentExercise] = useState<CurrentExercise>({
    nameOfExercise: '',
    weight: '',
    sets: '',
    reps: '',
    isEditing: true
  });
  
  // State to track which exercises are being edited
  const [editingExercises, setEditingExercises] = useState<{ [key: number]: boolean }>({});
  
  useEffect(() => {
    if (!existingWorkout) {
      addWorkout(day as string);
    }
  }, [day]);

  // Handle tap outside to close all edit modes
  const handleOutsideTap = () => {
    setEditingExercises({});
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
      currentExercise.nameOfExercise.trim() !== '' &&
      currentExercise.weight.trim() !== '' &&
      currentExercise.sets.trim() !== '' &&
      currentExercise.reps.trim() !== ''
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
        
        setCurrentExercise({
          nameOfExercise: '',
          weight: '',
          sets: '',
          reps: '',
          isEditing: true
        });
        
        updateWorkout(day as string, workout);
      }
    }
  };

  const handleExerciseChange = (field: keyof Omit<CurrentExercise, 'isEditing'>, value: string) => {
    setCurrentExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle edit mode for a specific exercise
  const toggleEditingExercise = (index: number) => {
    setEditingExercises(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle changes to exercise fields when editing
  const handleExerciseFieldChange = (index: number, field: keyof Exercise, value: string) => {
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      if (field === 'weight' || field === 'reps' || field === 'sets') {
        updatedExercises[index][field] = parseInt(value) || 0;
      } else {
        updatedExercises[index][field] = value;
      }
      return updatedExercises;
    });
  };

  // Save edited exercise and update the workout
  const saveExercise = (index: number) => {
    const workout = getWorkout(day as string);
    if (workout) {
      workout.exercise[index] = exercises[index];
      updateWorkout(day as string, workout);
    }
    toggleEditingExercise(index);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.header}>{day}'s Workout</Text>

            <View style={styles.section}>
              <Text style={styles.subheader}>Name of Workout</Text>
              <WorkoutNameInput 
                value={dayName}
                onChangeText={handleDayNameChange}
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
                    isEditing={editingExercises[index]}
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    padding: 20,
    paddingTop: 60, // Adjusted padding to accommodate KeyboardAvoidingView
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  workoutNameContainer: {
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    minHeight: 50, // Changed from fixed height to minHeight
    paddingVertical: 10, // Added padding for better spacing
  },
  workoutNameWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  workoutNameInput: {
    color: 'white',
    fontSize: 16,
    padding: 0,
    minHeight: 40, // Allow the input to expand
    textAlignVertical: 'top', // Ensure text starts at the top
  },
  workoutNameText: {
    color: 'white',
    fontSize: 16,
    padding: 0,
    textAlignVertical: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  input: { 
    color: 'white',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#262626',
    fontSize: 16,
  },
  exerciseNameInput: {
    fontSize: 16,
    height: 45,
    flex: 1,
    marginBottom: 10,
    color: 'white',
  },
  exercisesList: {
    marginBottom: 15,
  },
  exerciseInputWrapper: {
    marginBottom: 20, // Reduced margin to prevent excessive space
  },
  exerciseInputContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
    // Removed fixed height to allow expansion
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  numberInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#262626',
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 10,
    color: 'white',
  },
  exerciseItem: { 
    backgroundColor: '#1a1a1a', // Match create exercise box background
    padding: 10, // Match padding
    borderRadius: 10, // Match border radius
    marginBottom: 10,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseItemName: { 
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  editContainer: {
    flex: 1,
  },
});
