import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Bell } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const NotificationsSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Configure how you receive updates and reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Game Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminded about unfinished games
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly gaming statistics
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
