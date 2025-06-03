import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

const DEMODATA = [
  {
    id: "1",
    title: "Elden Ring",
    platform: "PC",
    status: "playing",
    progress: 65,
    lastPlayed: "2 hours ago",
    coverUrl: "/placeholder.svg?height=80&width=60",
  },
  {
    id: "2",
    title: "Cyberpunk 2077",
    platform: "PC",
    status: "playing",
    progress: 45,
    lastPlayed: "1 day ago",
    coverUrl: "/placeholder.svg?height=80&width=60",
  },
  {
    id: "3",
    title: "God of War",
    platform: "PlayStation 5",
    status: "completed",
    progress: 100,
    lastPlayed: "3 days ago",
    coverUrl: "/placeholder.svg?height=80&width=60",
  },
];

const DashboardRecentActivity = () => {
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
          {DEMODATA.map((game) => (
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
                    game.status === "completed" ? "default" : "secondary"
                  }
                >
                  {game.status === "completed" ? "Completed" : "Playing"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {game.lastPlayed}
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
