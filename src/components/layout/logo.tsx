import { School2 } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function Logo() {
  const { state } = useSidebar();
  return (
    <div className="flex gap-4 bg-[#6825bd] items-center justify-center text-white border-none rounded-lg p-2">
      <School2 color="#fff" />
      <h2 className={`${state === "collapsed" ? "hidden" : "text-md"} `}>
        Polygot Academy
      </h2>
    </div>
  );
}
