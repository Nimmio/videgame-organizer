import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import PageWrap from "@/components/page-wrap";
import DashboardStats from "@/components/dashboardStats/dashboard-stats";
import DashboardRecentActivity from "@/components/dashboardRecentActivity/dashboard-recent-activity";
import DashboardMonthlyProgress from "@/components/dashboardMonthlyProgress/dashboard-monthly-progres";
import DashboardQuickActions from "@/components/dashboardQuickActions/dashboard-quick-actions";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

const DEMODATA = {
  totalGames: 10,
  completedGames: 5,
  completionRate: 50,
  currentlyPlaying: 3,
};

function Dashboard() {
  const { completedGames, completionRate, currentlyPlaying, totalGames } =
    DEMODATA;
  return (
    <div>
      <PageWrap
        title={"Dashboard"}
        subtitle="Welcome back! Here's an overview of your gaming activity."
      />
      <DashboardStats
        completedGames={completedGames}
        completionRate={completionRate}
        currentlyPlaying={currentlyPlaying}
        totalGames={totalGames}
      />
      <DashboardRecentActivity />
      <DashboardMonthlyProgress />
      <DashboardQuickActions />
    </div>
  );
}
