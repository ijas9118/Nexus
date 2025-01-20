import { AppSidebar } from "@/components/normal/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="mt-8 ml-4" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
