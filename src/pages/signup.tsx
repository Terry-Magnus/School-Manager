// import studentSignup from "@/api/auth/studentSignup";
import userSignup from "@/api/auth/user-signup";
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
import { numbersOnlyRegex } from "@/lib/utils";
import { TFormEvent, TInputChangeEvent, UserSignup } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERROLESENUM } from "@/types/enums";

const initialValue = {
  name: "",
  email: "",
  regNumber: "",
  password: "",
  confirm_password: "",
  role: USERROLESENUM.STUDENT,
};

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [formData, setFormData] = useState<UserSignup>(initialValue);

  const handleSignup = async (e: TFormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError(true);
      setAlert({
        type: "error",
        title: "Signup Failed",
        description: "Passwords must match",
      });
    } else {
      setLoading(true);

      try {
        await userSignup(formData);
        setSuccess(true);
        setError(false);
        // Show success alert
        setAlert({
          type: "success",
          title: "Signup Successful",
          description: "Student Account created successfully",
        });
      } catch (err: any) {
        // Show error alert
        setSuccess(false);
        setError(true);
        setAlert({
          type: "error",
          title: "Signup Failed",
          description: err.message || "An error occurred while signing up.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      navigate("/login");
    }
  };

  const handleInputChange = (e: TInputChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <Label htmlFor="name" className="grid gap-2">
            <span aria-label="password">
              Full Name
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="name"
              id="name"
              type="text"
              placeholder="Ex: John Doe"
              value={formData.name}
              required
              onChange={handleInputChange}
            />
          </Label>
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
              value={formData.regNumber}
              className={`${error && "border-red-600"}`}
              onChange={(e) =>
                e.target.value.match(numbersOnlyRegex) && handleInputChange(e)
              }
            />
          </Label>
          <Label htmlFor="email" className="grid gap-2">
            <span aria-label="password">
              Email
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Ex: m@example.com"
              value={formData.email}
              required
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
            />
          </Label>
          <Label htmlFor="password" className="grid gap-2">
            <span aria-label="password">
              Confirm Password
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="confirm_password"
              id="confirm_password"
              type="password"
              required
              className={`${error && "border-red-600"}`}
              value={formData.confirm_password}
              onChange={handleInputChange}
            />
          </Label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading" : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {alert && (
          <CustomAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={handleAlertClose} // Close the alert
          />
        )}
        <p className="px-8 text-center text-sm text-muted-foreground mb-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
