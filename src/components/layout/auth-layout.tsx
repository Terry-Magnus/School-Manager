import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="container h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-[#6825bd] p-10 text-white lg:flex">
        <div className="flex items-center text-3xl font-large">
          School Manager
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
