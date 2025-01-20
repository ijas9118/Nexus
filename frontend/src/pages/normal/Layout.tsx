import { AppSidebar } from "@/components/normal/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="mt-8 ml-4" />
        {children}
      </main>
    </SidebarProvider>
  );
}
