import { WorkoutRoutine } from "./types";

export const MOCK_ROUTINES: WorkoutRoutine[] = [
  {
    id: '1',
    name: 'Full Body Routine',
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        sets: Array.from({ length: 4 }, (_, i) => ({
          setNumber: i + 1,
          targetWeight: 135,
          completed: false,
        })),
      },
      {
        id: '2',
        name: 'Squats',
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNumber: i + 1,
          targetWeight: 185,
          completed: false,
        })),
      },
    ],
  },
  {
    id: '2',
    name: 'Upper Body Routine',
    exercises: [
      {
        id: '1',
        name: 'Pull Ups',
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNumber: i + 1,
          targetWeight: 0, // body weight
          completed: false,
        })),
      },
      {
        id: '2',
        name: 'Push Ups',
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNumber: i + 1,
          targetWeight: 0,
          completed: false,
        })),
      },
    ],
  },
]; 