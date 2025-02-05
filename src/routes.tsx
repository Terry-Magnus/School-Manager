import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import NotFound from "./pages/error";
import Signup from "./pages/signup";
import UploadResults from "./pages/admin/results/upload-result";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/student/dashboard";
import AuthLayout from "./components/layout/auth-layout";
import AppLayout from "./components/layout/app-layout";
import Settings from "./pages/settings";
import StudentCourses from "./pages/student/courses";
import ForgotPassword from "./pages/forgot-password";
import AdminLogin from "./pages/admin/login";
import ResetPassword from "./pages/reset-password";
import AdminSignup from "./pages/admin/signup";
import AddCourses from "./pages/admin/courses/add-course";
import Results from "./pages/student/results";
import RegisterCourses from "./pages/student/courses/register";
import AdminDashboard from "./pages/admin/dashboard";
import ManageCourses from "./pages/admin/courses";
import ManageResults from "./pages/admin/results";
import ErrorBoundary from "./components/ProtectedRoutes/error-boundary";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />,
    errorElement: <NotFound />,
  },
  {
    element: (
      <ProtectedRoutes allowedRoles="student">
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
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
        ],
      },

      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "courses",
        element: <Outlet />,
        children: [
          { index: true, element: <StudentCourses /> },
          //   { path: "all", element: <CourseList /> },
          {
            path: "register",
            element: <RegisterCourses />,
          },
        ],
      },
    ],
  },
  {
    element: (
      <ErrorBoundary>
        <AuthLayout />
      </ErrorBoundary>
    ),
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
  {
    element: (
      <ProtectedRoutes allowedRoles="admin">
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      </ProtectedRoutes>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "admin",
        element: <Outlet />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "courses", element: <ManageCourses /> },
          {
            path: "courses/add-new",
            element: <AddCourses />,
          },
          { path: "results", element: <ManageResults /> },
          {
            path: "results/upload",
            element: <UploadResults />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

export default routes;
