// models / BaseWorkout.ts

// Exercise interface used by all workout types
export interface Exercise {
  id: string;          // Unique identifier for the exercise
  name: string;        // Name of the exercise
  weight: number;      // Weight in pounds/kg
  reps: number;        // Number of repetitions
  sets: number;        // Number of sets
  restTime: number;    // Rest time between sets in minutes
  notes?: string;      // Optional notes for the exercise
  lastUpdated: Date;   // When the exercise was last modified
}

// Abstract base class with shared workout functionality
export abstract class BaseWorkout {
  exercises: Exercise[] = [];
  customName: string = "";
  created: Date = new Date();
  lastModified: Date = new Date();
  targetMuscleGroups?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;

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
      let duration = 0;
      for (const exercise of this.exercises) {
          // Assume average of 1 minute per set plus rest time
          duration += exercise.sets * (60 + exercise.restTime);
      }
      return Math.ceil(duration / 60); // Return in minutes
  }

  // Helper Methods
  protected generateExerciseId(): string {
      return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected updateLastModified(): void {
      this.lastModified = new Date();
  }

  // Abstract method that derived classes must implement
  abstract toJSON(): object;
}