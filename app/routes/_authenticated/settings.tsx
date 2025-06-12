import React from "react";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

async function RouteComponent() {
  return (
    <>
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <ThemeModeToggle />
      </div>
    </>
  );
}
