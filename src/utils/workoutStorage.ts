import { WorkoutRoutine } from "../types";
import { MOCK_ROUTINES } from "../data";

const STORAGE_KEY = "workoutRoutines";

// Helper to parse date fields (for now, only lastCompleted)
function parseRoutineDates(routine: any): WorkoutRoutine {
  if (routine.lastCompleted) {
    routine.lastCompleted = new Date(routine.lastCompleted);
  }
  return routine;
}

export function loadRoutines(): WorkoutRoutine[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const routines = JSON.parse(stored);
      return routines.map(parseRoutineDates);
    } catch (error) {
      console.error("Error parsing stored routines:", error);
      return MOCK_ROUTINES;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ROUTINES));
    return MOCK_ROUTINES;
  }
}

export function saveRoutines(routines: WorkoutRoutine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

export function updateRoutine(updatedRoutine: WorkoutRoutine) {
  const routines = loadRoutines();
  const newRoutines = routines.map(routine =>
    routine.id === updatedRoutine.id ? updatedRoutine : routine
  );
  saveRoutines(newRoutines);
} 