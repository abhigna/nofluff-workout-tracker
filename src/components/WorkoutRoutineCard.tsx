import React from "react";
import { Link } from "react-router-dom";
import styles from "./WorkoutRoutineCard.module.css";
import { format } from "date-fns";

interface WorkoutRoutineCardProps {
  id: string;
  name: string;
  lastCompleted?: Date;
  exerciseCount: number;
}

const WorkoutRoutineCard: React.FC<WorkoutRoutineCardProps> = ({ id, name, lastCompleted, exerciseCount }) => {
  return (
    <Link to={`/track/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <h2>{name}</h2>
        <p>Exercises: {exerciseCount}</p>
        {lastCompleted && (
          <p>Last Completed: {format(lastCompleted, "yyyy-MM-dd")}</p>
        )}
      </div>
    </Link>
  );
};

export default WorkoutRoutineCard; 