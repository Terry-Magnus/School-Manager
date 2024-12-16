import { SidebarData } from "@/components/layout/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function checkIsActive(href: string, item: SidebarData) {
  return (
    href === item.url || // /endpint?search=param
    href.split("?")[0] === item.url // endpoint
  );
}
