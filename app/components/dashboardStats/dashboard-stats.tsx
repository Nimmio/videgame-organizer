import React from "react";
import StatCard from "./stat-card";
import { CheckCircle, Clock, Library } from "lucide-react";

interface DashboardStatsProps {
  totalGames: number;
  completionRate: number;
  completedGames: number;
  currentlyPlaying: number;
}

const DashboardStats = ({
  completedGames,
  completionRate,
  currentlyPlaying,
  totalGames,
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
      <StatCard
        icon={<Library className="h-4 w-4 text-muted-foreground" />}
        title="Total Games"
        subtitle="+2 from last month"
        value={totalGames}
      />
      <StatCard
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        title="Completed"
        subtitle={`${completionRate}% completion rate`}
        value={completedGames}
      />
      <StatCard
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        title="Currently Playing"
        subtitle="Active games"
        value={currentlyPlaying}
      />
    </div>
  );
};

export default DashboardStats;
