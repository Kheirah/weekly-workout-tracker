import { Dashboard } from "@/components/dashboard";
import ExerciseForm from "@/components/exercise-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Exercise, ExerciseCategory, User } from "@/lib/schemas";
import { neon } from "@neondatabase/serverless";

export default async function Home() {
  const sql = neon(`${process.env.WORKOUT_TRACKER_DATABASE_URL}`);
  const users = (await sql`SELECT * FROM wt_users`) as User[];
  const user = users.find((user) => user.id === 5);

  const exercises = (await sql`SELECT * FROM wt_exercises`) as Exercise[];
  const categories =
    (await sql`SELECT * FROM wt_exercise_categories`) as ExerciseCategory[];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Weekly Workout Tracker</h1>
      <Dashboard users={users} exercises={exercises} />
      <Card>
        <CardHeader>
          <CardTitle>Log Exercise</CardTitle>
          <CardDescription>Record your workout manually</CardDescription>
        </CardHeader>
        <CardContent>
          <ExerciseForm
            userId={user?.id}
            exercises={exercises}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
