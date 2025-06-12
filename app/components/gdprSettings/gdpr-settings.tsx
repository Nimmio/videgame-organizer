import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Cookie, Download, Link, Shield } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const GdprSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy & Data Protection
        </CardTitle>
        <CardDescription>
          Manage your privacy settings and data rights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Data Processing Consent</Label>
            <p className="text-sm text-muted-foreground">
              Allow processing of personal data for service improvement
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Communications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features and games
            </p>
          </div>
          <Switch />
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Center
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/privacy/export">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/privacy/consent">
              <Cookie className="w-4 h-4 mr-2" />
              Cookie Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GdprSettings;
