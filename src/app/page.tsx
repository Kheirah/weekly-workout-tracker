"use client";

import ExerciseForm from "@/components/exercise-form";
import ExerciseSelector from "@/components/exercise-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserProfile from "@/components/user-profile";
import UserSelector from "@/components/user-selector";
import VoiceInput from "@/components/voice-input";
import WeeklyChart from "@/components/weekly-chart";
import { categories } from "@/lib/categories";
import { exercises } from "@/lib/exercises";
import type { Exercise } from "@/lib/schemas";
import { users } from "@/lib/users";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  avatar: string;
};

export default function Dashboard() {
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Weekly Workout Tracker</h1>
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
              userIds={selectedUsers.map((u) => u.id)}
              exercises={selectedExercises.map((e) => e.name)}
            />
          </CardContent>
        </Card>
        {activeUser && (
          <Card>
            <CardHeader>
              <CardTitle>Log Exercise for {activeUser.name}</CardTitle>
              <CardDescription>
                Record your workout manually or using voice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExerciseForm
                userId={activeUser.id}
                exercises={exercises}
                categories={categories}
              />
              <div className="mt-4">
                <VoiceInput userId={activeUser.id} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
