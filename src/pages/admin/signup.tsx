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
import { TFormEvent, TInputChangeEvent, UserSignup } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERROLESENUM } from "@/types/enums";

const initialValue = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: USERROLESENUM.ADMIN,
};

export default function AdminSignup() {
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
          description: "Admin account created successfully",
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
      navigate("/admin/login");
    }
    setError(false);
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
        <CardDescription>Fill in the details below</CardDescription>
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
          <Label htmlFor="password" className="grid gap-2">
            <span aria-label="password">
              Password
              <i className="inline text-red-500" aria-hidden="true">
                *
              </i>
            </span>
            <Input
              name="password"
              id="password"
              className={`${error && "border-red-600"}`}
              type="password"
              required
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
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Loading" : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground mb-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in
          </Link>
        </p>{" "}
        {alert && (
          <CustomAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={handleAlertClose} // Close the alert
          />
        )}
      </CardFooter>
    </>
  );
}
