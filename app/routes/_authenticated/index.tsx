import React from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import PageWrap from "@/components/page-wrap";
import DashboardStats from "@/components/dashboardStats/dashboard-stats";
import DashboardRecentActivity from "@/components/dashboardRecentActivity/dashboard-recent-activity";
import DashboardMonthlyProgress from "@/components/dashboardMonthlyProgress/dashboard-monthly-progres";
import DashboardQuickActions from "@/components/dashboardQuickActions/dashboard-quick-actions";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getCountAllGames,
  getCountCompletedGames,
  getCountPlayingGames,
} from "@/lib/server/game";

const getDashboardData = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { userId } = data;

    const countAllGames = await getCountAllGames({ data: { userId } });

    const countLastMonth = await prisma.userGame.count({
      where: {
        userId,
        createdAt: {
          gte: subMonths(new Date(), 1),
        },
      },
    });

    const countCompletedGames = await getCountCompletedGames({
      data: { userId },
    });

    const completionRate = (countCompletedGames / countAllGames) * 100;

    const currentlyPlaying = await getCountPlayingGames({ data: { userId } });

    const recentGames = await prisma.userGame.findMany({
      where: {
        userId,
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
          userId,
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
      queryKey: ["dashboardData", context.user.id],
      queryFn: () => getDashboardData({ data: { userId: context.user.id } }),
    });
  },
  component: Dashboard,
});

function Dashboard() {
  const { user } = useRouteContext({ from: "/_authenticated" });

  const { data } = useSuspenseQuery({
    queryKey: ["dashboardData", user.id],
    queryFn: () => getDashboardData({ data: { userId: user.id } }),
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
            completionRate={data.completionRate}
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
