// app/routes/index.tsx
import React from "react";
import GameLibrary from "@/components/gameLibrary/game-library";
import { Button } from "@/components/ui/button";
import { userGameQueryOptions } from "@/lib/userGames";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { StatusQueryOptions } from "@/lib/server/status";
import PageHeader from "@/components/page-wrap";
import AddGameDialog from "@/components/addGameDialog/add-game-dialog";
import { Card } from "@/components/ui/card";

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
  const [addGameDialogOpen, setAddGameDialogOpen] = useState<boolean>(false);

  const handleAddButtonClick = () => setAddGameDialogOpen(true);
  const handleDialogClose = () => setAddGameDialogOpen(false);
  return (
    <>
      <PageHeader
        title={"Game Library"}
        subtitle="Manage and organize your video game collection"
      />
      <AddGameDialog open={addGameDialogOpen} onClose={handleDialogClose} />
      <Card className="p-8">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-6">
            <Button className="gap-2" onClick={handleAddButtonClick}>
              <PlusCircle className="h-4 w-4" />
              Add Game
            </Button>
          </div>
          <GameLibrary />
        </div>
      </Card>
    </>
  );
}
