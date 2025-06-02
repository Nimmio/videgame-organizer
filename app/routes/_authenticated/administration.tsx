import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administration")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/administration"!</div>;
}
