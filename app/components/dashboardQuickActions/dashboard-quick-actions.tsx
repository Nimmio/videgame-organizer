import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, Library } from "lucide-react";

const DashboardQuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/library">
              <Library className="w-6 h-6" />
              Browse Library
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/settings">
              <Calendar className="w-6 h-6" />
              Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
