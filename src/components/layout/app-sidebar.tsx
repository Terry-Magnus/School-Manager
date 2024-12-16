import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  //   SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "./logo";
import { sidebarData } from "./data/sidebar-data";
import { checkIsActive } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
// import { NavLink } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const href = location.pathname;

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4 items-center">
        {sidebarData.map((props) => (
          <SidebarMenuButton
            asChild
            key={props.title}
            tooltip={props.title}
            isActive={checkIsActive(href, props)}
          >
            <Link to={props.url} key={props.title}>
              {props.icon && <props.icon className="text-[#6825bd]" />}
              <span>{props.title}</span>{" "}
            </Link>
          </SidebarMenuButton>
        ))}

        <SidebarMenuButton className="mt-auto" tooltip="Logout">
          <LogOut className="text-red-600" />
          <span className="text-red-600">Logout</span>
        </SidebarMenuButton>
      </SidebarContent>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
//   <NavLink
//     to={props.url}
//     className={({ isActive }) => (isActive ? "bg-gray-300" : "")}
//   >
//     <props.icon /> {props.title}
//   </NavLink>
