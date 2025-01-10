import userLogin from "@/api/auth/user-login";
import { Button } from "@/components/ui/button";
import {
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
import { numbersOnlyRegex } from "@/lib/utils";
import { TFormEvent, TInputChangeEvent } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const { setUser } = useAuth();

  const handleLogin = async (e: TFormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await userLogin(regNumber, password);
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
      navigate("/dashboard");
    }
  };

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your details below to view your details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <Label className="grid gap-2" htmlFor="regNumber">
            <span aria-label="password">
              Registration Number
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="regNumber"
              id="regNumber"
              type="text"
              required
              placeholder="Ex: 20231946323"
              inputMode="numeric"
              value={regNumber}
              className={`${error && "border-red-600"}`}
              onChange={(e: TInputChangeEvent) =>
                e.target.value.match(numbersOnlyRegex) &&
                setRegNumber(e.target.value)
              }
            />
          </Label>
          <Label className="grid gap-2" htmlFor="password">
            <span aria-label="password">
              Password
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="password"
              id="password"
              type="password"
              required
              className={`${error && "border-red-600"}`}
              value={password}
              onChange={(e: TInputChangeEvent) => setPassword(e.target.value)}
            />
          </Label>
          <p className=" text-right text-[10px] text-muted-foreground mb-2">
            <Link to="/forgot-password" className="hover:text-primary">
              Forgot Password
            </Link>
          </p>
          <Button type="submit" className="w-full">
            {loading ? "Loading" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        <p className="px-8 text-center text-sm text-muted-foreground mb-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
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
    </>
  );
}
