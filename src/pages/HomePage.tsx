import React, { useEffect, useState, useRef } from "react";
import { WorkoutRoutine } from "../types";
import { loadRoutines, updateRoutine } from "../utils/workoutStorage";
import WorkoutRoutineCard from "../components/WorkoutRoutineCard";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = loadRoutines();
    setRoutines(data);
  }, []);

  // Helper function to generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Function to import a routine from CSV text
  const importRoutineFromCSV = (csvText: string): WorkoutRoutine => {
    // Split CSV text into rows, trimming any empty lines
    const rows = csvText.split(/\r?\n/).filter((row) => row.trim() !== "");
    if (rows.length < 2) {
      throw new Error("CSV file does not contain enough data.");
    }

    // Process header (assume comma-delimited fields)
    const header = rows[0].split(",").map((h) => h.trim().toLowerCase());
    const routineNameIndex = header.indexOf("routine name");
    const exerciseNameIndex = header.indexOf("exercise name");
    const exerciseIdIndex = header.indexOf("exercise id"); // optional column
    const setNumberIndex = header.indexOf("set number");
    const targetWeightIndex = header.indexOf("target weight");
    const repsIndex = header.indexOf("reps");

    if (
      routineNameIndex === -1 ||
      exerciseNameIndex === -1 ||
      setNumberIndex === -1 ||
      targetWeightIndex === -1 ||
      repsIndex === -1
    ) {
      throw new Error(
        "CSV headers missing required columns. Required columns: Routine Name, Exercise Name, Set Number, Target Weight, Reps."
      );
    }

    let routineName = "";
    const exercisesMap: {
      [key: string]: {
        id: string;
        name: string;
        sets: {
          setNumber: number;
          targetWeight: number;
          reps: number;
          completed: boolean;
        }[];
      };
    } = {};

    // Process each data row (skip the header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",").map((cell) => cell.trim());
      if (row.length < header.length) continue;

      if (!routineName) {
        routineName = row[routineNameIndex];
      }
      const exerciseName = row[exerciseNameIndex];

      // Use the CSV provided exercise id if available; otherwise fall back to exercise name
      let exerciseKey = "";
      if (exerciseIdIndex !== -1 && row[exerciseIdIndex]) {
        exerciseKey = row[exerciseIdIndex];
      } else {
        exerciseKey = exerciseName;
      }

      const setNumber = Number(row[setNumberIndex]);
      const targetWeight = Number(row[targetWeightIndex]);
      const reps = Number(row[repsIndex]);

      if (isNaN(setNumber) || isNaN(targetWeight) || isNaN(reps)) {
        continue; // skip the row if number conversion failed
      }

      if (!exercisesMap[exerciseKey]) {
        exercisesMap[exerciseKey] = {
          id: generateId(), // assign a generated id internally
          name: exerciseName,
          sets: [],
        };
      }

      exercisesMap[exerciseKey].sets.push({
        setNumber,
        targetWeight,
        reps,
        completed: false,
      });
    }

    // Sort the sets for each exercise by set number
    const exercises = Object.values(exercisesMap).map((ex) => ({
      ...ex,
      sets: ex.sets.sort((a, b) => a.setNumber - b.setNumber),
    }));

    // Create the new routine object
    return {
      id: generateId(),
      name: routineName || "Imported Routine",
      exercises: exercises,
      lastCompleted: undefined,
    };
  };

  // Handle CSV file input change event
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        try {
          const importedRoutine = importRoutineFromCSV(text);
          updateRoutine(importedRoutine);
          // Reload routines after updating storage
          const data = loadRoutines();
          setRoutines(data);
          alert("Routine imported successfully!");
        } catch (error: any) {
          alert("Error importing routine: " + error.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Delete routine function
  const handleDeleteRoutine = (routineId: string) => {
    const updatedRoutines = routines.filter(
      (routine) => routine.id !== routineId
    );
    localStorage.setItem("workoutRoutines", JSON.stringify(updatedRoutines));
    setRoutines(updatedRoutines);
  };

  return (
    <div className={styles.container}>
      <h1>Workout Routines</h1>

      {/* Hidden CSV Input */}
      <input
        type="file"
        id="csvUpload"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleCSVUpload}
        ref={fileInputRef}
      />

      <div className={styles.grid}>
        {routines.map((routine) => (
          <WorkoutRoutineCard
            key={routine.id}
            id={routine.id}
            name={routine.name}
            lastCompleted={
              routine.lastCompleted
                ? routine.lastCompleted.toLocaleDateString()
                : undefined
            }
            exerciseCount={routine.exercises.length}
            onDelete={handleDeleteRoutine}
          />
        ))}

        {/* "Import Routine" Card moved to the end */}
        <div
          className={styles.importCard}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.plusIcon}>+</div>
          <p>Import Routine</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 