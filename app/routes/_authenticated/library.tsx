// app/routes/index.tsx
import React from "react";
import GameLibrary from "@/components/gameLibrary/game-library";
import { userGameQueryOptions } from "@/lib/userGames";
import { createFileRoute } from "@tanstack/react-router";
import { StatusQueryOptions } from "@/lib/server/status";
import PageHeader from "@/components/page-wrap";

export const Route = createFileRoute("/_authenticated/library")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      userGameQueryOptions({ userId: context.user.id })
    );
    await context.queryClient.ensureQueryData(StatusQueryOptions());
  },
  component: Library,
});

function Library() {
  return (
    <>
      <PageHeader
        title={"Game Library"}
        subtitle="Manage and organize your video game collection"
      />
      <GameLibrary />
    </>
  );
}
