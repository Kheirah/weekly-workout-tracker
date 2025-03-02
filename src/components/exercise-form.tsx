"use client";

import type React from "react";

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
import { useState } from "react";
import { toast } from "sonner";

type Exercise = {
  id: number;
  name: string;
};

type ExerciseFormProps = {
  userId: number;
  exercises: Exercise[];
};

export default function ExerciseForm({ userId, exercises }: ExerciseFormProps) {
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Exercise logged:", { userId, exercise, reps });
    toast.success(`${reps} ${exercise} for user ${userId}`);
    setExercise("");
    setReps("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>
      <Button type="submit">Log Exercise for User {userId}</Button>
    </form>
  );
}
