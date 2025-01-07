import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid h-screen items-center justify-center md:grid-cols-2">
      <div className="relative hidden w-full h-full flex-col bg-[#6825bd] p-5 text-white md:flex">
        <p className=" text-3xl font-large">CampusTrack</p>
      </div>
      <div className="mx-auto py-4 w-full h-full flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
