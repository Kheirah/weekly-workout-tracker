"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addExercise } from "@/db/action";
import type { Exercise, ExerciseCategory } from "@/lib/schemas";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ExerciseFormProps {
  userId: number | undefined;
  exercises: Exercise[];
  categories: ExerciseCategory[];
}

export default function ExerciseForm({
  userId,
  exercises,
  categories,
}: ExerciseFormProps) {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [additionalWeight, setAdditionalWeight] = useState("0");

  const handleSubmit = async (formData: FormData) => {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    formData.append("name", exercise);
    formData.append("reps", reps);
    formData.append("additional_weight", additionalWeight);
    formData.append("user_id", userId.toString());

    try {
      await addExercise(formData);
      toast.success(`Logged ${reps} ${exercise} for user ${userId}`);
      setExercise("");
      setReps("");
      setAdditionalWeight("0");
    } catch (error) {
      toast.error("Failed to log exercise");
      console.error(error);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="exercise">Exercise</Label>
        <Select onValueChange={setExercise} value={exercise}>
          <SelectTrigger>
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((ex) => (
              <SelectItem key={ex.id} value={ex.name}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reps">Reps</Label>
        <Input
          type="number"
          id="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Number of reps"
          min="0"
        />
      </div>

      <div>
        <Label htmlFor="additional_weight">Additional Weight (kg)</Label>
        <Input
          type="number"
          id="additional_weight"
          value={additionalWeight}
          onChange={(e) => setAdditionalWeight(e.target.value)}
          placeholder="Additional weight in kg"
          min="0"
          step="1"
        />
      </div>

      <Button type="submit">Log Exercise</Button>
    </form>
  );
}
