import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/server/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
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
      {/* <AppSidebar /> */}
      <div className="min-h-screen w-full bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <main>
            <SidebarTrigger />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
