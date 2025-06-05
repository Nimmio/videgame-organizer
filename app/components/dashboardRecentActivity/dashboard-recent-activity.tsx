import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { GameWithStatus } from "@/types/game";
import { format } from "date-fns";

interface DashboardRecentActivityProps {
  games: GameWithStatus[];
}

const DashboardRecentActivity = ({ games }: DashboardRecentActivityProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="flex items-center space-x-4">
              <img
                src={game.coverUrl || "/placeholder.svg"}
                alt={game.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{game.title}</p>
                <p className="text-sm text-muted-foreground">{game.platform}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    game.status.statusTitle === "completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {game.status.statusTitle}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(game.updatedAt, "PPP")}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/library">
              View All Games
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentActivity;
