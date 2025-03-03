"use server";

import { addExerciseFormSchema, logWorkoutFormSchema } from "@/lib/schemas";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function addExercise(formData: FormData) {
  const sql = neon(`${process.env.WORKOUT_TRACKER_DATABASE_URL}`);

  try {
    // Parse and validate form data
    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category_id: formData.get("category_id")
        ? Number(formData.get("category_id"))
        : undefined,
      user_id: Number(formData.get("user_id")),
      reps: Number(formData.get("reps")),
      additional_weight: Number(formData.get("additional_weight")),
    };

    // Validate exercise data
    const validatedExercise = addExerciseFormSchema.parse({
      name: rawData.name,
      description: rawData.description,
      category_id: rawData.category_id,
    });

    // Get or create exercise to get its ID
    const existingExercise = await sql`
      SELECT id FROM wt_exercises WHERE name = ${validatedExercise.name}
    `;

    let exerciseId: number;

    if (existingExercise.length === 0) {
      const [newExercise] = await sql`
        INSERT INTO wt_exercises (name, description, category_id)
        VALUES (${validatedExercise.name}, ${validatedExercise.description}, ${validatedExercise.category_id})
        RETURNING id
      `;
      exerciseId = newExercise.id;
    } else {
      exerciseId = existingExercise[0].id;
    }

    // Validate workout log data
    const validatedWorkoutLog = logWorkoutFormSchema.parse({
      user_id: rawData.user_id,
      exercise_id: exerciseId,
      reps: rawData.reps,
      additional_weight: rawData.additional_weight,
    });

    // Start a transaction for session and workout log
    await sql.transaction((tx) => {
      const queries = [];

      // First check for existing session from today
      queries.push(tx`
        WITH today_session AS (
          SELECT id 
          FROM wt_sessions 
          WHERE user_id = ${validatedWorkoutLog.user_id}
            AND session_date = CURRENT_DATE
          ORDER BY created_at DESC 
          LIMIT 1
        )
        INSERT INTO wt_sessions (user_id, session_date)
        SELECT ${validatedWorkoutLog.user_id}, CURRENT_DATE
        WHERE NOT EXISTS (SELECT 1 FROM today_session)
        RETURNING id
      `);

      // Get the next set number for this session and exercise
      queries.push(tx`
        WITH session_id AS (
          SELECT id 
          FROM wt_sessions 
          WHERE user_id = ${validatedWorkoutLog.user_id}
            AND session_date = CURRENT_DATE
          ORDER BY created_at DESC 
          LIMIT 1
        )
        SELECT COALESCE(MAX(set_number), 0) + 1 as next_set
        FROM wt_workout_logs
        WHERE session_id = (SELECT id FROM session_id)
        AND exercise_id = ${validatedWorkoutLog.exercise_id}
      `);

      // Log the workout
      queries.push(tx`
        WITH session_id AS (
          SELECT id 
          FROM wt_sessions 
          WHERE user_id = ${validatedWorkoutLog.user_id}
            AND session_date = CURRENT_DATE
          ORDER BY created_at DESC 
          LIMIT 1
        ),
        next_set AS (
          SELECT COALESCE(MAX(set_number), 0) + 1 as num
          FROM wt_workout_logs
          WHERE session_id = (SELECT id FROM session_id)
          AND exercise_id = ${validatedWorkoutLog.exercise_id}
        )
        INSERT INTO wt_workout_logs (
          session_id,
          exercise_id,
          set_number,
          reps,
          additional_weight
        )
        SELECT 
          (SELECT id FROM session_id),
          ${validatedWorkoutLog.exercise_id},
          (SELECT num FROM next_set),
          ${validatedWorkoutLog.reps},
          ${validatedWorkoutLog.additional_weight}
      `);

      return queries;
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error in addExercise:", error);
    throw new Error("Failed to log exercise");
  }
}
