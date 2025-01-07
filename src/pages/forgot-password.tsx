import { FormEvent, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "react-router-dom";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { TInputChangeEvent } from "@/types";

export default function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const auth = getAuth();
  const actionCodeSettings = {
    // This should be your actual reset password page URL
    // url: 'https://campustrack.netlify.app/reset-password',
    url: `${import.meta.env.VITE_BASE_URL}/reset-password?userType=${
      location.pathname.includes("admin") ? "admin" : "student"
    }`,
    // Optional: Forces the page to open in the same window
    handleCodeInApp: true,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSuccess(true);
      setError(false);
      // Show success alert
      setAlert({
        type: "success",
        title: "Success",
        description: "Password reset email sent successfully",
      });
    } catch (error: any) {
      setSuccess(false);
      setError(true);
      setAlert({
        type: "error",
        title: "Error",
        description: error.message || "An error occurred",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      setEmail("");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              onChange={(e: TInputChangeEvent) => setEmail(e.target.value)}
              placeholder="m@example.com"
              className={`${error && "border-red-600"}`}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground mb-4">
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Back to Login
          </Link>
        </p>
      </CardFooter>

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          duration={2500}
          onClose={handleAlertClose} // Close the alert
        />
      )}
    </Card>
  );
}
