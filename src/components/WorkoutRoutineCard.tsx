import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./WorkoutRoutineCard.module.css";

interface WorkoutRoutineCardProps {
  id: string;
  name: string;
  lastCompleted?: string;
  exerciseCount: number;
  onDelete?: (id: string) => void;
}

const WorkoutRoutineCard: React.FC<WorkoutRoutineCardProps> = ({
  id,
  name,
  lastCompleted,
  exerciseCount,
  onDelete,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <div className={styles.card}>
      <Link to={`/track/${id}`} className={styles.cardContent}>
        <div className={styles.content}>
          <h2 className={styles.title}>{name}</h2>
          <p>{exerciseCount} Exercises</p>
          {lastCompleted && <p>Last Completed: {lastCompleted}</p>}
        </div>
      </Link>
      {onDelete && (
        <div
          className={styles.dropdownContainer}
          ref={dropdownRef}
          onClick={(e) => {
            // Stop click events from bubbling up to the Link so the user doesn't navigate away
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <button
            className={styles.dropdownButton}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }}
          >
            &#x2022;&#x2022;&#x2022;
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(id);
                  setDropdownOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutRoutineCard; 