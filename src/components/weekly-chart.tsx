"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ExerciseData {
  name: string;
  [key: string]: string | number; // Allow dynamic exercise properties
}

interface UserDataType {
  [userId: number]: ExerciseData[];
}

// Mock data - in a real app, this would come from your backend
const userData: UserDataType = {
  1: [
    { name: "Mon", Pushups: 20, Pullups: 30, Dips: 25 },
    { name: "Tue", Pushups: 25, Pullups: 35, Dips: 30 },
    { name: "Wed", Pushups: 30, Pullups: 40, Dips: 35 },
    { name: "Thu", Pushups: 22, Pullups: 32, Dips: 28 },
    { name: "Fri", Pushups: 28, Pullups: 38, Dips: 33 },
    { name: "Sat", Pushups: 35, Pullups: 45, Dips: 40 },
    { name: "Sun", Pushups: 32, Pullups: 42, Dips: 37 },
  ],
  2: [
    { name: "Mon", Pushups: 15, Pullups: 25, Dips: 20 },
    { name: "Tue", Pushups: 18, Pullups: 28, Dips: 23 },
    { name: "Wed", Pushups: 22, Pullups: 32, Dips: 27 },
    { name: "Thu", Pushups: 20, Pullups: 30, Dips: 25 },
    { name: "Fri", Pushups: 25, Pullups: 35, Dips: 30 },
    { name: "Sat", Pushups: 28, Pullups: 38, Dips: 33 },
    { name: "Sun", Pushups: 30, Pullups: 40, Dips: 35 },
  ],
  3: [
    { name: "Mon", Pushups: 25, Pullups: 35, Dips: 30 },
    { name: "Tue", Pushups: 28, Pullups: 38, Dips: 33 },
    { name: "Wed", Pushups: 32, Pullups: 42, Dips: 37 },
    { name: "Thu", Pushups: 30, Pullups: 40, Dips: 35 },
    { name: "Fri", Pushups: 35, Pullups: 45, Dips: 40 },
    { name: "Sat", Pushups: 38, Pullups: 48, Dips: 43 },
    { name: "Sun", Pushups: 40, Pullups: 50, Dips: 45 },
  ],
  4: [
    { name: "Mon", Pushups: 18, Pullups: 28, Dips: 23 },
    { name: "Tue", Pushups: 20, Pullups: 30, Dips: 25 },
    { name: "Wed", Pushups: 25, Pullups: 35, Dips: 30 },
    { name: "Thu", Pushups: 22, Pullups: 32, Dips: 27 },
    { name: "Fri", Pushups: 28, Pullups: 38, Dips: 33 },
    { name: "Sat", Pushups: 30, Pullups: 40, Dips: 35 },
    { name: "Sun", Pushups: 32, Pullups: 42, Dips: 37 },
  ],
};

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#a4de6c",
  "#d0ed57",
];

interface WeeklyChartProps {
  userIds: number[];
  exercises: string[];
}

export default function WeeklyChart({ userIds, exercises }: WeeklyChartProps) {
  if (!userIds?.length || !exercises?.length) {
    return (
      <Card className="w-full h-[400px] p-4 flex items-center justify-center">
        <p className="text-gray-500">
          Please select at least one user and one exercise to display the chart.
        </p>
      </Card>
    );
  }

  // Combine data for all selected users
  const combinedData = (userData[userIds[0]] || []).map(
    (dayData, index: number) => {
      const combinedDay: { name: string; [key: string]: string | number } = {
        name: dayData.name,
      };
      for (const userId of userIds) {
        if (userData[userId]) {
          for (const exercise of exercises) {
            combinedDay[`${exercise}-User${userId}`] =
              userData[userId][index]?.[exercise] || 0;
          }
        }
      }
      return combinedDay;
    },
  );

  if (combinedData.length === 0) {
    return (
      <Card className="w-full h-[400px] p-4 flex items-center justify-center">
        <p className="text-gray-500">
          No data available for the selected users and exercises.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[400px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {userIds.flatMap((userId, userIndex) =>
            exercises.map((exercise, exerciseIndex) => (
              <Bar
                key={`${userId}-${exercise}`}
                dataKey={`${exercise}-User${userId}`}
                fill={
                  colors[
                    (userIndex * exercises.length + exerciseIndex) %
                      colors.length
                  ]
                }
                name={`User ${userId} ${exercise}`}
              />
            )),
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
