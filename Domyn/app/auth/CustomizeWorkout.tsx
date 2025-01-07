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
  Alert
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
      onPress={!isEditing ? handlePress : undefined}
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
            multiline
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
      friction: 6,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, [isEditing]);

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 150], // Reverted height for correct padding
  });

  const handleLocalChange = (field: keyof typeof localExercise, value: string) => {
    setLocalExercise(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'nameOfExercise') {
      handleExerciseFieldChange(index, field, value);
    } else {
      handleExerciseFieldChange(index, field as keyof Exercise, value);
    }
  };

  const validateFields = () => {
    return (
      localExercise.nameOfExercise.trim() !== '' &&
      localExercise.weight.trim() !== '' &&
      localExercise.reps.trim() !== '' &&
      localExercise.sets.trim() !== ''
    );
  };

  const handleDone = () => {
    if (validateFields()) {
      saveExercise(index);
    } else {
      Alert.alert('Validation Error', 'Please fill out all fields correctly.');
    }
  };

  return (
    <Animated.View style={[styles.exerciseItem, { height: animatedHeight }]}>
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
              onSubmitEditing={handleDone} // Ensures handleDone is called on "done"
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
                onSubmitEditing={handleDone} // Ensures handleDone is called on "done"
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={localExercise.reps}
                onChangeText={(text) => handleLocalChange('reps', text)}
                keyboardType="numeric"
                placeholder="Reps"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={handleDone} // Ensures handleDone is called on "done"
              />
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={localExercise.sets}
                onChangeText={(text) => handleLocalChange('sets', text)}
                keyboardType="numeric"
                placeholder="Sets"
                placeholderTextColor="#666"
                returnKeyType="done"
                onSubmitEditing={handleDone} // Ensures handleDone is called on "done"
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
    isEditing: false // Ensure new exercises are not in edit mode initially
  });
  
  const [editingExercises, setEditingExercises] = useState<{ [key: number]: boolean }>({});
  
  useEffect(() => {
    if (!existingWorkout) {
      addWorkout(day as string);
    }
  }, [day]);
  
  const handleOutsideTap = () => {
    // Dismiss keyboard immediately
    Keyboard.dismiss();

    // Get all currently editing exercises
    const editingIndices = Object.entries(editingExercises)
      .filter(([_, isEditing]) => isEditing)
      .map(([index]) => parseInt(index));

    // For each editing exercise, validate and save if valid
    editingIndices.forEach(index => {
      const exercise = exercises[index];
      if (
        exercise.nameOfExercise.trim() !== '' &&
        exercise.weight > 0 &&
        exercise.reps > 0 &&
        exercise.sets > 0
      ) {
        // Update workout and reset editing state in one go
        const workout = getWorkout(day as string);
        if (workout) {
          workout.exercise[index] = exercise;
          updateWorkout(day as string, workout);
          setEditingExercises(prev => ({
            ...prev,
            [index]: false
          }));
        }
      } else {
        // If validation fails, optionally alert the user
        Alert.alert('Validation Error', `Please complete all fields for exercise "${exercise.nameOfExercise || 'Unnamed Exercise'}".`);
      }
    });
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
          isEditing: false
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

  const toggleEditingExercise = (index: number) => {
    setEditingExercises(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  const saveExercise = (index: number) => {
    const workout = getWorkout(day as string);
    if (workout) {
      workout.exercise[index] = exercises[index];
      updateWorkout(day as string, workout);
    }
    
    // Update only the specific exercise's editing state to false
    setEditingExercises(prev => ({
      ...prev,
      [index]: false
    }));

    // Dismiss the keyboard after updating the state
    Keyboard.dismiss();
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
                    isEditing={!!editingExercises[index]}
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
    paddingTop: 60,
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
    minHeight: 50,
    paddingVertical: 10,
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
    minHeight: 40,
    textAlignVertical: 'top',
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
    height: 40, // Reverted height to original
    flex: 1,
    marginBottom: 10,
    color: 'white',
  },
  exercisesList: {
    marginBottom: 15,
  },
  exerciseInputWrapper: {
    marginBottom: 20,
  },
  exerciseInputContainer: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
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
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
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
