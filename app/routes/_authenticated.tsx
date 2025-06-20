import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Card } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="ml-8 mr-8 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
