import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchGame } from "@/types/game";
import { getUrl } from "@/lib/server/igdb/cover";

interface GameListItemProps {
  game: SearchGame;
  onClick: () => void;
}

export default function GameListItem({ game, onClick }: GameListItemProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:bg-muted/50 p-0"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-16 h-20 relative flex-shrink-0">
            <img
              src={getUrl((game.cover?.url as string) || "", "cover_big")}
              alt={game.name}
              className="object-cover rounded"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {game.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {game.first_release_date
                    ? format(new Date(game.first_release_date), "MMM d, yyyy")
                    : "Release date unknown"}
                </p>

                {game.genres && game.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {game.genres.slice(0, 3).map((genre) => (
                      <Badge
                        key={genre.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                    {game.genres.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{game.genres.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {game.platforms.slice(0, 4).map((platform) => (
                      <Badge
                        key={platform.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {platform.name}
                      </Badge>
                    ))}
                    {game.platforms.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{game.platforms.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
