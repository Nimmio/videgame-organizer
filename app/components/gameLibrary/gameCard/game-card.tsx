import React from "react";
import { Button } from "@/components/ui/button";
import { getUrl } from "@/lib/server/igdb/cover";
import { Eye } from "lucide-react";
import GameCardPlatformDropdown from "./game-card-platform-dropdown";
import { Status, UserGame } from "@/generated/prisma";
import GameCardDeleteButton from "./game-card-delete-button";
import GameCardStatusBadge from "./game-card-status-badge";
import { Badge } from "@/components/ui/badge";
import { GameWithStatus } from "@/types/game";

interface GameCardProps {
  userGame: GameWithStatus;
  onDelete: (userGameId: UserGame["id"]) => void;
}

const GameCard = ({ userGame, onDelete }: GameCardProps) => {
  console.log(userGame);
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
      {/* Cover Image - Full Card */}
      <div className="aspect-[3/4] relative">
        {userGame.coverUrl && (
          <img
            src={userGame.coverUrl}
            alt={`${userGame.title} cover`}
            className="w-full h-full object-cover"
          />
        )}
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>

        {/* Status Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <div className="mb-4">
            <Badge>{userGame.status.statusTitle}</Badge>
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>

          <GameCardDeleteButton
            gameName={userGame.title}
            onDelete={() => {
              onDelete(userGame.id);
            }}
          />
        </div>
        <></>
        {/* Game Title - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="font-bold text-white text-lg leading-tight mb-1 drop-shadow-lg">
            {userGame.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
