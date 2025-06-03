import { ReactNode } from "@tanstack/react-router";
import React from "react";

interface PageWrapProps {
  title: string | ReactNode;
  subtitle?: string;
  children: ReactNode;
}

const PageWrap = ({ title, subtitle, children }: PageWrapProps) => {
  return <div>PageWrap</div>;
};

export default PageWrap;
