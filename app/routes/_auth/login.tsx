// app/routes/index.tsx
import { LoginForm } from "@/components/login/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: Home,
});

function Home() {
  return <LoginForm />;
}
