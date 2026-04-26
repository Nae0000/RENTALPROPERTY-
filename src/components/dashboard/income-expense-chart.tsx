"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

type DataPoint = {
  month: string;
  income: number;
  expense: number;
};

export function IncomeExpenseChart({ data }: { data: DataPoint[] }) {
  return (
    <Card className="h-[320px]">
      <p className="mb-3 text-sm text-muted-foreground">Income vs Expense</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
