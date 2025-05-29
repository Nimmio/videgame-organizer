import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getUrl } from "@/lib/server/igdb/cover";
import { SearchGame } from "@/types/game";
import { ArrowLeft, Plus } from "lucide-react";

interface GameProps {
  game: SearchGame;
  onBack?: () => void;
  onAddGame?: () => void;
}

export default function GameDetails({
  game,
  onBack = () => {},
  onAddGame = () => {},
}: GameProps) {
  return (
    <div className="w-full bg-background">
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Game Cover Image */}
        <div className="md:col-span-1">
          <div className="h-130 w-full overflow-hidden rounded-md border border-border">
            <img
              src={getUrl((game.cover?.url as string) || "", "cover_big")}
              alt={`${game.name} cover`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Game Details */}
        <div className="md:col-span-2 flex flex-col">
          <div className="pb-4">
            <>
              <h1 className="text-2xl font-bold">{game.name}</h1>
              <p className="text-sm text-muted-foreground">
                Released: {game.first_release_date}
              </p>
            </>
          </div>

          <div className="flex-1 grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium leading-none">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium leading-none">Platforms</h3>

              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <Badge key={platform.id} variant="outline">
                    {platform.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 flex-1">
              <h3 className="text-sm font-medium leading-none">Summary</h3>
              <p className="text-sm text-muted-foreground">{game.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Game Button */}
      <div className="px-6 pb-6">
        <Button className="w-full" size="lg" onClick={onAddGame}>
          <Plus className="mr-2 h-4 w-4" /> Add Game
        </Button>
      </div>
    </div>
  );
}
