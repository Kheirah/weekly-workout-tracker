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
import { Textarea } from "@/components/ui/textarea";
import { addExercise } from "@/db/action";
import type { Exercise, ExerciseCategory } from "@/lib/schemas";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ExerciseFormProps {
  userId: number;
  exercises: Exercise[];
  categories: ExerciseCategory[];
}

export default function ExerciseForm({
  userId,
  exercises,
  categories,
}: ExerciseFormProps) {
  const [exercise, setExercise] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [reps, setReps] = useState("");
  const [additionalWeight, setAdditionalWeight] = useState("0");

  const handleSubmit = async (formData: FormData) => {
    formData.append("name", exercise);
    formData.append("description", description);
    if (categoryId) {
      formData.append("category_id", categoryId);
    }
    formData.append("reps", reps);
    formData.append("additional_weight", additionalWeight);
    formData.append("user_id", userId.toString());

    try {
      await addExercise(formData);
      toast.success(`Logged ${reps} ${exercise} for user ${userId}`);
      setExercise("");
      setDescription("");
      setCategoryId("");
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
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategoryId} value={categoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id?.toString() ?? ""}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Exercise description"
        />
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
          step="0.5"
        />
      </div>

      <Button type="submit">Log Exercise for User {userId}</Button>
    </form>
  );
}
