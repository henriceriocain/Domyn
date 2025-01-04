import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '../../hooks/useUserContext';

export default function WorkoutRoutineScreen() {
  const router = useRouter();
  const { selectedDays } = useUserContext();
  const scaleValues = useRef<{ [key: string]: Animated.Value }>({});

  useFocusEffect(
    React.useCallback(() => {
      Object.values(scaleValues.current).forEach(scaleValue => {
        scaleValue.setValue(1);
      });
    }, [])
  );

  const handleBack = () => {
    router.push('./WorkoutDaysScreen');
  };

  const handleNext = () => {
    alert('Workout routines saved!');
  };

  const renderDaySection = (day: string, index: number) => {
    const scaleValue = new Animated.Value(1); // Create new value each render instead of persisting
  
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        friction: 20,
        tension: 200,
        useNativeDriver: true,
      }).start();
    };
  
    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 20,
        tension: 200,
        useNativeDriver: true,
      }).start();
    };
  
    const handlePress = () => {
      // Complete bounce animation first
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 0.97,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 20,
          tension: 200,
          useNativeDriver: true,
        })
      ]).start();
  
      // Navigate while bounce is happening
      setTimeout(() => {
        router.push({
          pathname: './CustomizeWorkout',
          params: { day },
        });
      }, 100); // Small delay to let the bounce animation be visible
    };
  
    return (
      <Animated.View
        key={index}
        style={[
          styles.daySection,
          {
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={styles.touchable}
        >
          <View style={styles.daySectionContent}>
            <Text style={styles.dayTitle}>{day}</Text>
            <Text style={styles.tapToCustomize}>Tap to customize →</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.header}>What are your workout routines on these days?</Text>
        {selectedDays.map((day, index) => renderDaySection(day, index))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    paddingTop: 60,
    paddingBottom: 60,
  },
  daySection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  touchable: {
    width: '100%',
  },
  daySectionContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tapToCustomize: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});