import { ReactNode } from "@tanstack/react-router";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between space-y-2 mb-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
