"use client";

import type { Exercise } from "@/lib/schemas";
import type { User } from "@/lib/schemas";
import { useState } from "react";
import ExerciseSelector from "./exercise-selector";
import { Card } from "./ui/card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import UserProfile from "./user-profile";
import UserSelector from "./user-selector";
import WeeklyChart from "./weekly-chart";

export function Dashboard({
  users,
  exercises,
}: { users: User[]; exercises: Exercise[] }) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([
    exercises[0],
  ]);

  const handleUserToggle = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      }
      return [...prev, user];
    });
    setActiveUser(user);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <UserSelector
            users={users}
            selectedUsers={selectedUsers}
            onToggleUser={handleUserToggle}
            activeUser={activeUser}
            setActiveUser={setActiveUser}
          />
        </div>
        <ExerciseSelector
          exercises={exercises}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
        />
      </div>
      {activeUser && (
        <div className="mb-6">
          <UserProfile user={activeUser} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress Comparison</CardTitle>
            <CardDescription>
              Compare workout activity for selected users and exercises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyChart
              userIds={selectedUsers.map((u) => u.id ?? 0)}
              exercises={selectedExercises.map((e) => e.name)}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
