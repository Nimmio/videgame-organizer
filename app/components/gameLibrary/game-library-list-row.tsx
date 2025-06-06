import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { GameWithStatus, LibraryUserGame } from "@/types/game";
import { getUrl } from "@/lib/server/igdb/cover";
import GameCardStatusBadge from "./gameCard/game-card-status-badge";
import GameCardPlatformDropdown from "./gameCard/game-card-platform-dropdown";
import { Platform, Status, UserGame } from "@/generated/prisma";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import GameCardDeleteButton from "./gameCard/game-card-delete-button";

interface GameLibraryListRowProps {
  userGame: GameWithStatus;
  onDelete: (userGameId: UserGame["id"]) => void;
  onStatusChange: (userGameId: UserGame["id"], newStatus: Status) => void;
}

const GameLibraryListRow = ({
  userGame,
  onDelete,
}: GameLibraryListRowProps) => {
  return (
    <TableRow key={userGame.id}>
      <TableCell>
        <img
          src={userGame.coverUrl || ""}
          alt={userGame.title}
          className="h-16 w-12 object-cover rounded-sm"
        />
      </TableCell>
      <TableCell className="font-medium">{userGame.title}</TableCell>
      <TableCell className="font-medium">
        {userGame.status.statusTitle}
      </TableCell>
      <TableCell className="font-medium">{userGame.platform}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>

          <GameCardDeleteButton
            gameName={userGame.title}
            onDelete={() => {
              onDelete(userGame.id);
            }}
            style="list"
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameLibraryListRow;
