import userLogin from "@/api/auth/user-login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { TFormEvent, TInputChangeEvent } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const { setUser } = useAuth();

  const handleLogin = async (e: TFormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await userLogin(email, password);
      setUser(userCredential.user);
      setSuccess(true);
      setError(false);
      // Show success alert
      setAlert({
        type: "success",
        title: "Login Successful",
        description:
          "You have successfully logged in. Redirecting to your dashboard...",
      });
    } catch (err: any) {
      // Show error alert
      setSuccess(false);
      setError(true);
      setAlert({
        type: "error",
        title: "Login Failed",
        description: err.message || "An error occurred while logging in.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      navigate("/courses/all");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          Login into your Admin account
        </CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className={`${error && "border-red-600"}`}
              value={email}
              required
              onChange={(e: TInputChangeEvent) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              id="password"
              type="password"
              className={`${error && "border-red-600"}`}
              value={password}
              required
              onChange={(e: TInputChangeEvent) => setPassword(e.target.value)}
            />
          </div>{" "}
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Loading" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        <p className=" text-right text-[12px] text-muted-foreground mb-2">
          <Link to="/forgot-password" className="hover:text-primary">
            Forgot Password
          </Link>
        </p>
        {alert && (
          <CustomAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            duration={2500}
            onClose={handleAlertClose} // Close the alert
          />
        )}
      </CardFooter>
    </Card>
  );
}
