import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadRoutines, updateRoutine } from "../utils/workoutStorage";
import { WorkoutRoutine } from "../types";
import styles from "./TrackingSheet.module.css";
import { format } from "date-fns";

const TrackingSheet: React.FC = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);

  useEffect(() => {
    const routines = loadRoutines();
    const found = routines.find((r) => r.id === routineId);
    if (found) {
      setRoutine(found);
    }
  }, [routineId]);

  const handleInputChange = (
    exerciseId: string,
    setNumber: number,
    field: "actualWeight" | "reps",
    value: string
  ) => {
    if (!routine) return;
    const updatedExercises = routine.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        const updatedSets = exercise.sets.map((set) => {
          if (set.setNumber === setNumber) {
            return {
              ...set,
              [field]: value ? Number(value) : undefined,
            };
          }
          return set;
        });
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setRoutine({ ...routine, exercises: updatedExercises });
  };

  const handleSave = () => {
    if (routine) {
      const updatedRoutine: WorkoutRoutine = {
        ...routine,
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
                <th>Target Weight</th>
                <th>Actual Weight</th>
                <th>Reps</th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set) => (
                <tr key={set.setNumber}>
                  <td>{set.setNumber}</td>
                  <td>{set.targetWeight}</td>
                  <td>
                    <input
                      type="number"
                      value={set.actualWeight !== undefined ? set.actualWeight : ""}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.id,
                          set.setNumber,
                          "actualWeight",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.reps !== undefined ? set.reps : ""}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.id,
                          set.setNumber,
                          "reps",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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