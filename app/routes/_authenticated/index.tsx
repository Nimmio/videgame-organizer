import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import PageWrap from "@/components/page-wrap";
import DashboardStats from "@/components/dashboardStats/dashboard-stats";
import DashboardRecentActivity from "@/components/dashboardRecentActivity/dashboard-recent-activity";
import DashboardMonthlyProgress from "@/components/dashboardMonthlyProgress/dashboard-monthly-progres";
import DashboardQuickActions from "@/components/dashboardQuickActions/dashboard-quick-actions";
import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getCountAllGames,
  getCountCompletedGames,
  getCountPlayingGames,
} from "@/lib/server/game";
import { userMiddleware } from "@/lib/server/middleware";

const getDashboardData = createServerFn({ method: "GET" })
  .middleware([userMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;

    const countAllGames = await getCountAllGames();

    const countLastMonth = await prisma.userGame.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: subMonths(new Date(), 1),
        },
      },
    });

    const countCompletedGames = await getCountCompletedGames();

    const completionRate =
      countAllGames !== 0
        ? ((countCompletedGames / countAllGames) * 100).toFixed(2)
        : 0;

    const currentlyPlaying = await getCountPlayingGames();

    const recentGames = await prisma.userGame.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 3,
      include: { status: true },
    });

    const monthlyFinishedGames: { month: string; count: number }[] = [];

    for (let index = 0; index < 6; index++) {
      const date = subMonths(new Date(), index);
      const monthString = format(date, "MMMM");
      const startMonth = startOfMonth(date);
      const endMonth = endOfMonth(date);
      const countFinishedGames = await prisma.userGame.count({
        where: {
          userId: user.id,
          status: {
            group: "FINISHED",
          },
          finishDate: {
            gte: startMonth,
            lte: endMonth,
          },
        },
      });
      monthlyFinishedGames.push({
        month: monthString,
        count: countFinishedGames,
      });
    }

    return {
      countAllGames,
      countLastMonth,
      countCompletedGames,
      completionRate,
      currentlyPlaying,
      recentGames,
      monthlyFinishedGames: monthlyFinishedGames.reverse(),
    };
  });

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["dashboardData"],
      queryFn: () => getDashboardData(),
    });
  },
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseQuery({
    queryKey: ["dashboardData"],
    queryFn: () => getDashboardData(),
  });
  return (
    <div>
      <PageWrap
        title={"Dashboard"}
        subtitle="Welcome back! Here's an overview of your gaming activity."
      />
      {data && (
        <>
          <DashboardStats
            completedGames={data.countCompletedGames}
            completionRate={data.completionRate as number}
            currentlyPlaying={data.currentlyPlaying}
            totalGames={data.countAllGames}
            gamesLastMonth={data.countLastMonth}
          />
          <DashboardRecentActivity games={data.recentGames || []} />
          <DashboardMonthlyProgress data={data.monthlyFinishedGames} />
        </>
      )}
      <DashboardQuickActions />
    </div>
  );
}
