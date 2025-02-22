// models / RoutineWorkout.ts

import { BaseWorkout } from './BaseWorkout';

export class RoutineWorkout extends BaseWorkout {
    readonly day: string;         // The day this workout belongs to (e.g., "Monday")
    isScheduled: boolean;         // Whether this day has a planned workout

    constructor(day: string, isScheduled: boolean = false) {
        super();
        this.day = day;
        this.isScheduled = isScheduled;
    }

    // Method to toggle scheduled status and handle related data
    setScheduled(scheduled: boolean): void {
        this.isScheduled = scheduled;
        
        // If unscheduling, clear all workout data
        if (!scheduled) {
            this.customName = "";
            this.exercises = [];
            this.targetMuscleGroups = undefined;
            this.difficulty = undefined;
            this.notes = undefined;
        }
        
        this.updateLastModified();
    }

    // Implementation of abstract toJSON method
    toJSON() {
        return {
            day: this.day,
            isScheduled: this.isScheduled,
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

    // Static method to create RoutineWorkout from Firebase data
    static fromFirebase(data: any): RoutineWorkout {
        const workout = new RoutineWorkout(data.day, data.isScheduled);
        
        workout.customName = data.customName || "";
        workout.exercises = data.exercises || [];
        workout.created = data.created ? new Date(data.created) : new Date();
        workout.lastModified = data.lastModified ? new Date(data.lastModified) : new Date();
        workout.targetMuscleGroups = data.targetMuscleGroups;
        workout.difficulty = data.difficulty;
        workout.notes = data.notes;

        return workout;
    }

    setIsScheduled(scheduled: boolean): void {
      this.isScheduled = scheduled;
      this.updateLastModified();
    }
}
