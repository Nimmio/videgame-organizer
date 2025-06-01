import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Card } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { user } = context;
    if (!user) {
      throw redirect({
        to: "/login",
      });
    }
    return { user };
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SidebarTrigger />
        <Card className="m-8 p-4">
          <Outlet />
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
