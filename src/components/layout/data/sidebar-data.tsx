import {
  Book,
  FileText,
  LayoutDashboard,
  ListCheck,
  MessageCircleWarning,
  Settings2,
} from "lucide-react";
// import { SidebarData } from "../types";

export const sidebarData = {
  user: [
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
      title: "Course Registration",
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
  ],
  admin: [
    {
      title: "Courses",
      url: "/courses/all",
      icon: ListCheck,
    },
    {
      title: "Student Results",
      url: "/results/all",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};
