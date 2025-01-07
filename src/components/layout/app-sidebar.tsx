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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const href = location.pathname;
  const { user } = useAuth();

  function logOut() {
    signOut(auth);
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4 items-center">
        {user && user?.role === "admin"
          ? sidebarData.admin.map((props) => (
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
            ))
          : sidebarData.user.map((props) => (
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

        <SidebarMenuButton
          asChild
          className="mt-auto"
          onClick={logOut}
          tooltip="Logout"
        >
          {/* <Link to="/login"> */}
          <div role="button" className="flex items-center cursor-pointer">
            <LogOut className="text-red-600" />
            <span className="text-red-600">Logout</span>
            {/* </Link> */}
          </div>
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
