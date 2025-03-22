import { ModeToggle } from "@/components/theme/mode-toggle";
import { AppSidebar } from "@/components/organisms/app-sidebar";
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
import { Outlet, useNavigate } from "react-router-dom";
import Premium from "@/components/icons/Premium";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/molecules/tooltip";

export default function Layout() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumb.breadcrumbs,
  );
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b-[1px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                          <BreadcrumbLink
                            onClick={() => navigate(crumb.url)}
                            className="cursor-pointer"
                          >
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
              {user?.isPremium && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Premium />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Premium member</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
}
