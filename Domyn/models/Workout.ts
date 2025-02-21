// models/Workout.ts

// Interface for Exercise structure
interface Exercise {
  id: string;          // Unique identifier for the exercise
  name: string;        // Name of the exercise
  weight: number;      // Weight in pounds/kg
  reps: number;        // Number of repetitions
  sets: number;        // Number of sets
  restTime: number;    // Rest time between sets in minutes
  notes?: string;      // Optional notes for the exercise
  lastUpdated: Date;   // When the exercise was last modified
}

class Workout {
  // Core properties
  readonly day: string;        // The day this workout belongs to (e.g., "Monday")
  customName: string;          // User's custom name for the workout
  exercises: Exercise[];       // Array of exercises
  created: Date;              // When the workout was created
  lastModified: Date;         // When the workout was last modified
  
  // Optional properties
  targetMuscleGroups?: string[];  // Primary muscle groups targeted
  totalDuration?: number;         // Estimated duration in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;                 // General notes for the workout

  constructor(day: string) {
    this.day = day;
    this.customName = "";
    this.exercises = [];
    this.created = new Date();
    this.lastModified = new Date();
  }

  // Exercise Management
  addExercise(exercise: Omit<Exercise, 'id' | 'lastUpdated'>): void {
    const newExercise: Exercise = {
      ...exercise,
      id: this.generateExerciseId(),
      lastUpdated: new Date()
    };
    this.exercises.push(newExercise);
    this.updateLastModified();
  }

  updateExercise(id: string, updates: Partial<Exercise>): void {
    const index = this.exercises.findIndex(e => e.id === id);
    if (index !== -1) {
      this.exercises[index] = {
        ...this.exercises[index],
        ...updates,
        lastUpdated: new Date()
      };
      this.updateLastModified();
    }
  }

  removeExercise(id: string): void {
    this.exercises = this.exercises.filter(e => e.id !== id);
    this.updateLastModified();
  }

  // Utility Methods
  setCustomName(name: string): void {
    this.customName = name;
    this.updateLastModified();
  }

  getTotalExercises(): number {
    return this.exercises.length;
  }

  getEstimatedDuration(): number {
    // Calculate based on exercises, sets, and rest times
    let duration = 0;
    for (const exercise of this.exercises) {
      // Assume average of 1 minute per set plus rest time
      duration += exercise.sets * (60 + exercise.restTime);
    }
    return Math.ceil(duration / 60); // Return in minutes
  }

  // Helper Methods
  private generateExerciseId(): string {
    return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateLastModified(): void {
    this.lastModified = new Date();
  }

  // Data Methods
  toJSON() {
    return {
      day: this.day,
      customName: this.customName,
      exercises: this.exercises,
      created: this.created,
      lastModified: this.lastModified,
      targetMuscleGroups: this.targetMuscleGroups,
      totalDuration: this.getEstimatedDuration(),
      difficulty: this.difficulty,
      notes: this.notes
    };
  }
}

export default Workout;

