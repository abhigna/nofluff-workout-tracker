export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
  lastCompleted?: Date; // optional – used for displaying last completed date
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  setNumber: number;
  targetWeight: number;
  actualWeight?: number;
  reps?: number;
  completed: boolean;
}

export interface WorkoutHistory {
  routineId: string;
  date: Date;
  exercises: Exercise[];
} 