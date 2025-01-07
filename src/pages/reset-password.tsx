import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TFormEvent, TInputChangeEvent, UserSignup } from "@/types";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

const initialValues = {
  password: "",
  confirm_password: "",
};

type ResetPasswordProps = Pick<UserSignup, "password" | "confirm_password">;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResetPasswordProps>(initialValues);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [alert, setAlert] = useState<IAlertProps | null>(null);

  const auth = getAuth();
  // Get the oobCode (reset token) from URL parameters
  const oobCode = searchParams.get("oobCode");
  const userType = searchParams.get("userType");

  useEffect(() => {
    // Verify the reset code when component mounts
    const verifyCode = async () => {
      if (!oobCode) {
        setAlert({
          type: "error",
          title: "Invalid Reset Link",
          description: "The password reset link is invalid or has expired.",
        });
        setError(true);
        setIsVerifying(false);
        return;
      }

      try {
        // This verifies the code and returns the user's email
        await verifyPasswordResetCode(auth, oobCode);
        setIsVerifying(false);
      } catch (error: any) {
        setAlert({
          type: "error",
          title: "Invalid Reset Link",
          description: "This password reset link has expired or is invalid.",
        });
        setError(true);
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [auth, oobCode]);

  const handleSubmit = async (e: TFormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError(true);
      setAlert({
        type: "error",
        title: "Password Reset Failed",
        description: "Passwords must match",
      });
      return;
    }

    if (!oobCode) {
      setAlert({
        type: "error",
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the password reset with Firebase
      await confirmPasswordReset(auth, oobCode, formData.password);

      setSuccess(true);
      setError(false);
      setAlert({
        type: "success",
        title: "Success",
        description:
          "Password reset successful. Please log in with your new password.",
      });
    } catch (err: any) {
      setSuccess(false);
      setError(true);
      let errorMessage = "An error occurred while resetting your password.";

      switch (err.code) {
        case "auth/expired-action-code":
          errorMessage = "This password reset link has expired.";
          break;
        case "auth/invalid-action-code":
          errorMessage = "This password reset link is invalid.";
          break;
        case "auth/weak-password":
          errorMessage = "Please choose a stronger password.";
          break;
        default:
          console.error("Firebase error:", err);
      }

      setAlert({
        type: "error",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: TInputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      navigate(userType === "admin" ? "/admin/login" : "/login");
    }
  };

  if (isVerifying) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Verifying reset link...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">New Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 mb-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${error && "border-red-600"}`}
            />
          </div>
          <div className="grid gap-2 mb-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className={`${error && "border-red-600"}`}
            />
          </div>
          <Button disabled={isLoading} className="w-full mt-4" type="submit">
            {isLoading ? "Loading..." : "Set New Password"}
          </Button>
        </form>
      </CardContent>

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          duration={2500}
          onClose={handleAlertClose}
        />
      )}
    </Card>
  );
}
