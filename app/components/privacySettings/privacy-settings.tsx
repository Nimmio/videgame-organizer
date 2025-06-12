import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Shield } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const PrivacySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Security
        </CardTitle>
        <CardDescription>
          Control your privacy and data sharing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Public Profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Share Statistics</Label>
            <p className="text-sm text-muted-foreground">
              Allow sharing of anonymized gaming stats
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
