import React, { useEffect, useState } from "react";
import { WorkoutRoutine } from "../types";
import { loadRoutines } from "../utils/workoutStorage";
import WorkoutRoutineCard from "../components/WorkoutRoutineCard";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);

  useEffect(() => {
    const data = loadRoutines();
    setRoutines(data);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Workout Routines</h1>
      <div className={styles.grid}>
        {routines.map((routine) => (
          <WorkoutRoutineCard
            key={routine.id}
            id={routine.id}
            name={routine.name}
            lastCompleted={routine.lastCompleted}
            exerciseCount={routine.exercises.length}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage; 