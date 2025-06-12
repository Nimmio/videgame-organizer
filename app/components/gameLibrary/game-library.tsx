import React, { Suspense, useState } from "react";
import { UserGame } from "@/generated/prisma";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { deleteUserGame } from "@/lib/server/game";
import { useRouteContext } from "@tanstack/react-router";
import GameLibraryControls from "./game-library-controls";
import { userGameQueryOptions } from "@/lib/userGames";
import GameLibraryGrid from "./game-library-grid";
import GameLibraryList from "./game-library-list";
import { Separator } from "../ui/separator";
import GameLibraryPaginationControls from "./game-library-pagination-controls";
import { toast } from "sonner";

export type libraryViewMode = "grid" | "list";

const GameLibrary = () => {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<libraryViewMode>("grid");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const userGameQuery = useSuspenseQuery(
    userGameQueryOptions({ userId: user.id })
  );

  const deleteUserGameMutation = useMutation({
    mutationFn: deleteUserGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
      toast("Successfully deleted Game");
    },
  });

  const handleDelete = (gameId: UserGame["id"]) => {
    deleteUserGameMutation.mutate({
      data: {
        userGameId: gameId,
        userId: user.id,
      },
    });
  };
  const [games, count] = userGameQuery.data;
  const totalPages = Math.ceil(count / limit);

  return (
    <>
      <Suspense fallback={"Loading"}>
        <GameLibraryControls
          mode={mode}
          onModeChange={setMode}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={setLimit}
          page={page}
        />
      </Suspense>
      <Separator className="mb-4 mt-4" />
      {mode === "grid" && (
        <GameLibraryGrid games={games} onDelete={handleDelete} />
      )}
      {mode == "list" && (
        <GameLibraryList games={games} onDelete={handleDelete} />
      )}
      <GameLibraryPaginationControls
        page={page}
        onPageChange={setPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default GameLibrary;
