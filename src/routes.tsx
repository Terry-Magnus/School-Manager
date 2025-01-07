import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/error";
import Signup from "./pages/signup";
import UploadResults from "./pages/results/upload";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/dashboard";
import AuthLayout from "./components/layout/auth-layout";
import AppLayout from "./components/layout/app-layout";
import Settings from "./pages/settings";
import Courses from "./pages/courses";
import ForgotPassword from "./pages/forgot-password";
import AdminLogin from "./pages/admin-login";
import ResetPassword from "./pages/reset-password";
import AdminSignup from "./pages/admin-signup";
import AddCourses from "./pages/courses/add";
import Results from "./pages/results";
import RegisterCourses from "./pages/courses/register";
import CourseList from "./pages/courses/course-list";
import ResultList from "./pages/results/result-list";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />,
    errorElement: <NotFound />,
  },
  {
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "results",
        element: <Outlet />,
        children: [
          { index: true, element: <Results /> },
          { path: "upload", element: <UploadResults /> },
          { path: "all", element: <ResultList /> },
        ],
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "results/upload",
        element: <UploadResults />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "courses",
        element: <Outlet />,
        children: [
          { index: true, element: <Courses /> },
          { path: "add", element: <AddCourses /> },
          { path: "all", element: <CourseList /> },
          {
            path: "register",
            element: <RegisterCourses />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
        path: "admin/signup",
        element: <AdminSignup />,
      },
      {
        path: "admin/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

export default routes;
