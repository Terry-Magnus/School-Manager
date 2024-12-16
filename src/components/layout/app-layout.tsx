import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
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
            "h-svh flex flex-col"
          )}
        >
          {" "}
          <Header>
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              {/* <ThemeSwitch /> */}
              <ProfileDropdown name="James" email="jamessirius@gmail.com" />
            </div>
          </Header>
          {/* ===== Main ===== */}
          <Main>{children}</Main>
        </div>
      </SidebarProvider>
    </div>
  );
}
