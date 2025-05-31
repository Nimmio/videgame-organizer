import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status } from "@/generated/prisma";
import getStatus from "@/lib/server/status";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

interface GameCardStatusBadgeProps {
  currentStatus: Status;
  onStatusChange: (newStatus: Status) => void;
}

const GameCardStatusBadge = ({
  currentStatus,
  onStatusChange,
}: GameCardStatusBadgeProps) => {
  const { data: StatusData } = useSuspenseQuery({
    queryKey: ["status"],
    queryFn: getStatus,
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge className="cursor-pointer">{currentStatus.statusTitle}</Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {StatusData.map((status) => (
            <DropdownMenuItem
              key={status.id}
              onClick={() => onStatusChange(status)}
              className={status.id === currentStatus.id ? "font-bold" : ""}
            >
              {status.statusTitle}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GameCardStatusBadge;
