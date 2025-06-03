import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/roulette")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/roulette"!</div>;
}
