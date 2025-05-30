// app/routes/index.tsx

import AddGameDialog from "@/components/addGameDialog/add-game-dialog";
import GameLibrary from "@/components/gameLibrary/game-library";
import { Button } from "@/components/ui/button";
import { userGameQueryOptions } from "@/lib/userGames";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      userGameQueryOptions({ userId: context.user.id })
    );
  },
  component: Home,
});

function Home() {
  const [addGameDialogOpen, setAddGameDialogOpen] = useState<boolean>(false);
  const { user } = useRouteContext({ from: "/_authenticated" });

  const userGameQuery = useSuspenseQuery(
    userGameQueryOptions({ userId: user.id })
  );
  console.log(userGameQuery.data);
  const handleAddButtonClick = () => setAddGameDialogOpen(true);
  const handleDialogClose = () => setAddGameDialogOpen(false);
  return (
    <>
      <AddGameDialog open={addGameDialogOpen} onClose={handleDialogClose} />
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Video Game Library</h1>
          <Button className="gap-2" onClick={handleAddButtonClick}>
            <PlusCircle className="h-4 w-4" />
            Add Game
          </Button>
        </div>
        <GameLibrary games={userGameQuery.data} />
      </div>
    </>
  );
}
