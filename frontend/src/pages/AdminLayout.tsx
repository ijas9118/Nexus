import AdminAppSidebar from "@/features/admin/components/app-sider";
import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/molecules/breadcrumb";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/organisms/sidebar";
import useLogout from "@/hooks/useLogout";
import { RootState } from "@/store/store";
import { Bell } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumb.breadcrumbs,
  );
  const logoutUser = useLogout();

  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center pl-4 pr-8 justify-between w-full">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) =>
                    index === breadcrumbs.length - 1 ? (
                      <BreadcrumbItem key={crumb.title || index}>
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <React.Fragment key={crumb.title || index}>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink className="cursor-pointer">
                            {crumb.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </React.Fragment>
                    ),
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Bell />
              <Button variant="outline" onClick={() => logoutUser()}>
                Logout
              </Button>
            </div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
