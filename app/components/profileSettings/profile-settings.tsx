import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ProfileSettingsProps {
  username: string;
  email: string;
  bio?: string;
  onChangeUsername: (newUsername: string) => void;
  onChangeEmail: (newEmail: string) => void;
}

const ProfileSettings = ({
  username,
  email,
  onChangeUsername,
  onChangeEmail,
}: ProfileSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Manage your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => onChangeUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
            />
          </div>
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            disabled={true}
          />
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
