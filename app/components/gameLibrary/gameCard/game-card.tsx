import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchGame } from "@/lib/server/fetch";
import { getUrl } from "@/lib/server/igdb/cover";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { LibraryUserGame } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Eye } from "lucide-react";
import { z } from "zod";

const searchGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.number().parse(d))
  .middleware([igdbAuthMiddleware])
  .handler(async ({ data: id, context }) => {
    const { igdbAccessToken } = context;

    const response = await fetchGame({
      endpoint: "game",
      fields:
        "name,first_release_date,cover.url,summary,genres.name,platforms.name",
      token: igdbAccessToken as string,
      id,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

const GameCard = ({ game }: { game: LibraryUserGame }) => {
  const {
    isLoading,
    isError,
    data: igdbGame,
    error,
  } = useQuery({
    queryKey: ["searchGame", game.game.igdbId],
    queryFn: () => searchGame({ data: game.gameId }),
  });

  return (
    <>
      {!isLoading && !isError && (
        <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
          {igdbGame[0].name}
        </div>
      )}
    </>
  );
};

export default GameCard;
