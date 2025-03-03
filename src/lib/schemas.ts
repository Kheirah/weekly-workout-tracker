import { z } from "zod";

export const exerciseCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  created_at: z.date().optional(),
});

export const exerciseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category_id: z.number().optional(),
  created_at: z.date().optional(),
});

export const sessionSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  session_date: z.date().default(() => new Date()),
  duration_minutes: z.number().optional(),
  notes: z.string().optional(),
  created_at: z.date().optional(),
});

export const workoutLogSchema = z.object({
  id: z.number().optional(),
  session_id: z.number(),
  exercise_id: z.number(),
  set_number: z.number().min(1),
  reps: z.number().min(0),
  additional_weight: z.number().min(0).default(0),
  rest_seconds: z.number().optional(),
  notes: z.string().optional(),
  performed_at: z.date().optional(),
});

export type ExerciseCategory = z.infer<typeof exerciseCategorySchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type WorkoutLog = z.infer<typeof workoutLogSchema>;

export const addExerciseFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category_id: z.number().optional(),
});

export const logWorkoutFormSchema = z.object({
  user_id: z.number(),
  exercise_id: z.number(),
  reps: z.number().min(0),
  additional_weight: z.number().min(0).default(0),
  notes: z.string().optional(),
});
