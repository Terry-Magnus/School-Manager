import {
  Book,
  FileText,
  LayoutDashboard,
  MessageCircleWarning,
  Settings2,
} from "lucide-react";
import { SidebarData } from "../types";

export const sidebarData: SidebarData[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Results",
    url: "/results",
    icon: FileText,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: Book,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2,
  },
  {
    title: "Help & Support",
    url: "/support",
    icon: MessageCircleWarning,
  },
];
