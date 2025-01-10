import { Outlet } from "react-router-dom";
import banner from "/main.webp";
import logo from "/logo_alt.png";
import { Card } from "../ui/card";

export default function AuthLayout() {
  return (
    <div className="grid h-screen items-center justify-center md:grid-cols-2">
      <div className="relative hidden w-full h-full flex-col bg-[#6825bd] text-white md:flex">
        <img
          src={banner}
          className="object-cover w-full h-screen"
          alt="banner"
        />
      </div>
      <div className="mx-auto py-4 w-full h-full flex flex-col items-center justify-center">
        <Card>
          <div className="px-6 pt-4 flex justify-center">
            <img src={logo} className="w-28" alt="logo" />
          </div>
          <Outlet />
        </Card>
      </div>
    </div>
  );
}
