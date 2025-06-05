import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

interface DashboardMonthlyProgressProps {
  data: { month: string; count: number }[];
}

const DashboardMonthlyProgress = ({ data }: DashboardMonthlyProgressProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Monthly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-4">
          {data.map((stat) => (
            <div key={stat.month} className="text-center space-y-2">
              <p className="text-sm font-medium">{stat.month}</p>
              <div className="space-y-1">
                <div className="h-20 bg-muted rounded flex flex-col justify-end p-1">
                  <div
                    className="bg-green-500 rounded-sm"
                    style={{ height: `${(stat.count / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.count} completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMonthlyProgress;
