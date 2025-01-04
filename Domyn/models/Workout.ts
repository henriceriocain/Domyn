
// Class to create Workout Day
class Workout {
  dayName: string;
  exercise: { nameOfExercise: string; weight: number; reps: number; sets: number }[];

  constructor(dayName: string) {
    this.dayName = dayName;
    this.exercise = [];
  }

  addExercise(name: string, weight: number, reps: number, sets: number) {
    this.exercise.push({ nameOfExercise: name, weight, reps, sets });
  }
}

export default Workout;

