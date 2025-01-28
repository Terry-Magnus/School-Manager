import {
  Book,
  FileText,
  LayoutDashboard,
  ListCheck,
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
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: ListCheck,
    },
    {
      title: "Student Results",
      url: "/admin/results",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
};
