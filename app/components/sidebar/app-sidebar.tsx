import React from "react";
import {
  CheckCircle,
  Clock,
  Home,
  Library,
  Settings,
  TrendingUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { NavUser } from "./nav-user";
import { createServerFn } from "@tanstack/react-start";
import {
  getCountAllGames,
  getCountCompletedGames,
  getCountPlayingGames,
} from "@/lib/server/game";
import { useSuspenseQuery } from "@tanstack/react-query";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Library",
    url: "/Library",
    icon: Library,
  },
  // {
  //   title: "Backlog Roulette",
  //   url: "/roulette",
  //   icon: Shuffle,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  // {
  //   title: "Admin",
  //   url: "/administration",
  //   icon: Computer,
  // },
];

const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  const countAllGames = await getCountAllGames();
  const currentlyPlaying = await getCountPlayingGames();
  const countCompletedGames = await getCountCompletedGames();
  return { countAllGames, currentlyPlaying, countCompletedGames };
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouterState();
  const { pathname } = router.location;

  const { data } = useSuspenseQuery({
    queryKey: ["sidebarData"],
    queryFn: () => getDashboardData(),
  });
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Library className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Videogame Organizer</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 text-blue-500`} />
                    <span className="text-sm">Playing</span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.currentlyPlaying}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 text-green-500`} />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.countCompletedGames}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 text-purple-500`} />
                    <span className="text-sm">Total Games</span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.countAllGames}
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
