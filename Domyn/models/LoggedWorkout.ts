// models / LoggedWorkout.ts

import { BaseWorkout } from './BaseWorkout';

export class LoggedWorkout extends BaseWorkout {
    readonly date: Date;                    // Specific date when workout was performed
    originalRoutineDay: string | undefined; // Reference to routine day if this was from routine
    completionTime: number;                 // How long it actually took in minutes
    intensity: number;                      // User-rated intensity 1-10
    status: 'completed' | 'skipped';        // Whether the workout was completed or skipped

    constructor(date: Date, originalRoutineDay?: string) {
        super();
        this.date = date;
        this.originalRoutineDay = originalRoutineDay;
        this.completionTime = 0;
        this.intensity = 5;
        this.status = 'completed';
    }

    // Set the completion time for the workout
    setCompletionTime(minutes: number): void {
        if (minutes < 0) {
            throw new Error('Completion time cannot be negative');
        }
        this.completionTime = minutes;
        this.updateLastModified();
    }

    // Set the intensity level (1-10)
    setIntensity(level: number): void {
        if (level < 1 || level > 10) {
            throw new Error('Intensity must be between 1 and 10');
        }
        this.intensity = level;
        this.updateLastModified();
    }

    // Set workout status
    setStatus(status: 'completed' | 'skipped'): void {
        this.status = status;
        this.updateLastModified();
    }

    // Link this logged workout to a routine day
    setOriginalRoutineDay(day: string): void {
        this.originalRoutineDay = day;
        this.updateLastModified();
    }

    // Implementation of abstract toJSON method
    toJSON() {
        return {
            date: this.date,
            originalRoutineDay: this.originalRoutineDay,
            customName: this.customName,
            exercises: this.exercises,
            created: this.created,
            lastModified: this.lastModified,
            completionTime: this.completionTime,
            intensity: this.intensity,
            status: this.status,
            targetMuscleGroups: this.targetMuscleGroups,
            difficulty: this.difficulty,
            notes: this.notes
        };
    }

    // Static method to create LoggedWorkout from Firebase data
    static fromFirebase(data: any): LoggedWorkout {
        const workout = new LoggedWorkout(
            data.date ? new Date(data.date) : new Date(),
            data.originalRoutineDay
        );
        
        workout.customName = data.customName || "";
        workout.exercises = data.exercises || [];
        workout.created = data.created ? new Date(data.created) : new Date();
        workout.lastModified = data.lastModified ? new Date(data.lastModified) : new Date();
        workout.completionTime = data.completionTime || 0;
        workout.intensity = data.intensity || 5;
        workout.status = data.status || 'completed';
        workout.targetMuscleGroups = data.targetMuscleGroups;
        workout.difficulty = data.difficulty;
        workout.notes = data.notes;

        return workout;
    }
}