import type React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Exercise = {
  id: number;
  name: string;
};

type ExerciseSelectorProps = {
  exercises: Exercise[];
  selectedExercises: Exercise[];
  setSelectedExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
};

export default function ExerciseSelector({
  exercises,
  selectedExercises,
  setSelectedExercises,
}: ExerciseSelectorProps) {
  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {exercises.map((exercise) => {
        const isSelected = selectedExercises.some((e) => e.id === exercise.id);
        return (
          <Button
            key={exercise.id}
            variant={isSelected ? "default" : "outline"}
            className="flex items-center space-x-2"
            onClick={() => toggleExercise(exercise)}
          >
            <span>{exercise.name}</span>
            {isSelected && <Check className="w-4 h-4 ml-2" />}
          </Button>
        );
      })}
    </div>
  );
}
