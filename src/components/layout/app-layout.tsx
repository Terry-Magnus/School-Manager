import { Main } from "@/components/layout/main";
import { Profile } from "@/components/layout/profile";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="bg-zinc-200">
      <SidebarProvider defaultOpen={true}>
        <aside className="hidden sm:block">
          <AppSidebar />
        </aside>
        <div
          id="content"
          className={cn(
            "max-w-full w-full ml-auto",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] ease-linear duration-200",
            "h-full flex flex-col"
          )}
        >
          <div className="bg-white py-4 px-2 flex">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              <Profile />
            </div>
          </div>
          {/* ===== Main ===== */}
          <Main>
            <Outlet />
          </Main>
        </div>
      </SidebarProvider>
    </div>
  );
}
