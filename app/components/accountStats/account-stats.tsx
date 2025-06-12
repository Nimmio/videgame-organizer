import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const AccountStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
        <CardDescription>Overview of your GameVault usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Total Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">
              Currently Playing
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Days Active</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStats;
