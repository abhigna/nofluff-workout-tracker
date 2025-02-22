import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadRoutines, updateRoutine } from "../utils/workoutStorage";
import { WorkoutRoutine } from "../types";
import styles from "./TrackingSheet.module.css";
import { format } from "date-fns";

// Define types for our per-set override values
type SetOverride = {
  done: boolean;      // whether this set is marked done (i.e. use default values)
  target: string;     // string version of the target weight
  reps: string;       // string version of reps
};

type Overrides = {
  [exerciseId: string]: {
    [setNumber: number]: SetOverride;
  };
};

const TrackingSheet: React.FC = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  // This state holds the per-set override values
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    const routines = loadRoutines();
    const found = routines.find((r) => r.id === routineId);
    if (found) {
      setRoutine(found);
      // Initialize each set's override state:
      //   - done false means the set is not yet marked as done.
      const newOverrides: Overrides = {};
      found.exercises.forEach((exercise) => {
        newOverrides[exercise.id] = {};
        exercise.sets.forEach((set) => {
          newOverrides[exercise.id][set.setNumber] = {
            done: false,
            target: String(set.targetWeight), // default: previous target weight
            reps: "10",                         // default: 10 reps
          };
        });
      });
      setOverrides(newOverrides);
    }
  }, [routineId]);

  // Called when a user manually edits the "Target" or "Reps" fields.
  // We set done to false so that the set is no longer considered "done".
  const handleOverrideChange = (
    exerciseId: string,
    setNumber: number,
    field: "target" | "reps",
    value: string
  ) => {
    setOverrides((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setNumber]: {
          ...prev[exerciseId][setNumber],
          [field]: value,
          done: false,
        },
      },
    }));
  };

  // When the user toggles the checkbox we update the "done" flag.
  // If the user marks the set as done, we revert the values to defaults.
  const handleCheckboxChange = (
    exerciseId: string,
    setNumber: number,
    checked: boolean
  ) => {
    setOverrides((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setNumber]: {
          ...prev[exerciseId][setNumber],
          done: checked,
        },
      },
    }));
  };

  // Add a new set for a given exercise
  const handleAddSet = (exerciseId: string) => {
    if (!routine) return;
    let newSetNumber = 1;
    let defaultTarget = 0;
    const updatedExercises = routine.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        if (exercise.sets.length > 0) {
          const lastSet = exercise.sets[exercise.sets.length - 1];
          newSetNumber = lastSet.setNumber + 1;
          defaultTarget = lastSet.targetWeight;
        }
        const newSet = {
          setNumber: newSetNumber,
          targetWeight: defaultTarget,
          reps: 10,
          completed: false,
        };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      }
      return exercise;
    });
    setRoutine({ ...routine, exercises: updatedExercises });
    // Update overrides for the new set
    setOverrides((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [newSetNumber]: {
          done: false,
          target: String(defaultTarget),
          reps: "10",
        },
      },
    }));
  };

  const handleSave = () => {
    if (routine) {
      // For each exercise and its sets, update the target weight and reps
      // based on the current state. We always use the override values.
      const newExercises = routine.exercises.map((exercise) => {
        const newSets = exercise.sets.map((set) => {
          const override = overrides[exercise.id][set.setNumber];
          const newTarget = Number(override.target);
          const newReps = Number(override.reps);
          return { ...set, targetWeight: newTarget, reps: newReps };
        });
        return { ...exercise, sets: newSets };
      });
      // Save the updated routine along with the current timestamp in lastCompleted.
      const updatedRoutine: WorkoutRoutine = {
        ...routine,
        exercises: newExercises,
        lastCompleted: new Date(),
      };
      updateRoutine(updatedRoutine);
      alert("Workout saved!");
      navigate("/");
    }
  };

  if (!routine) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{routine.name}</h1>
      <p>Date: {format(new Date(), "yyyy-MM-dd")}</p>
      {routine.exercises.map((exercise) => (
        <div key={exercise.id} className={styles.exerciseSection}>
          <h2>{exercise.name}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Set</th>
                <th>Previous</th>
                <th>Target</th>
                <th>Reps</th>
                <th>Mark Done</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set) => {
                const override = overrides[exercise.id][set.setNumber];
                return (
                  <tr key={set.setNumber}>
                    <td>{set.setNumber}</td>
                    {/* "Previous" just reiterates the stored target weight */}
                    <td>{set.targetWeight}</td>
                    <td>
                      <input
                        type="number"
                        value={override.target}
                        onChange={(e) =>
                          handleOverrideChange(
                            exercise.id,
                            set.setNumber,
                            "target",
                            e.target.value
                          )
                        }
                        style={{
                          color: override.done
                            ? "blue"
                            : override.target === String(set.targetWeight)
                            ? "gray"
                            : "black",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={override.reps}
                        onChange={(e) =>
                          handleOverrideChange(
                            exercise.id,
                            set.setNumber,
                            "reps",
                            e.target.value
                          )
                        }
                        style={{
                          color: override.done
                            ? "blue"
                            : override.reps === "10"
                            ? "gray"
                            : "black",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={override.done}
                        onChange={(e) =>
                          handleCheckboxChange(
                            exercise.id,
                            set.setNumber,
                            e.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => handleAddSet(exercise.id)}
              className={styles.saveButton}
            >
              + Add Set
            </button>
          </div>
        </div>
      ))}
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          Back
        </button>
      </div>
    </div>
  );
};

export default TrackingSheet; 