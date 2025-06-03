import React from "react";
import {
  CheckCircle,
  Clock,
  Computer,
  Home,
  Library,
  Settings,
  Shuffle,
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
  {
    title: "Backlog Roulette",
    url: "/roulette",
    icon: Shuffle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    url: "/administration",
    icon: Computer,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouterState();
  const { pathname } = router.location;
  const quickStats = [
    {
      title: "Playing",
      count: 3,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      count: 12,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Total Games",
      count: 24,
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

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
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              {quickStats.map((stat) => (
                <div
                  key={stat.title}
                  className="flex items-center justify-between p-2 rounded-md bg-sidebar-accent/50"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm">{stat.title}</span>
                  </div>
                  <span className="text-sm font-medium">{stat.count}</span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
