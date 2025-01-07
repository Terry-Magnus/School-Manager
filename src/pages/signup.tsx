// import studentSignup from "@/api/auth/studentSignup";
import userSignup from "@/api/auth/user-signup";
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
import { numbersOnlyRegex } from "@/lib/utils";
import { TInputChangeEvent, UserSignup } from "@/types";
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

  const handleSignup = async () => {
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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            placeholder="Ex: John Doe"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="regNumber">Registration Number</Label>
          <Input
            name="regNumber"
            id="regNumber"
            type="text"
            placeholder="20231946323"
            inputMode="numeric"
            value={formData.regNumber}
            onChange={(e: TInputChangeEvent) =>
              e.target.value.match(numbersOnlyRegex) && handleInputChange(e)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            className={`${error && "border-red-600"}`}
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            name="confirm_password"
            id="confirm_password"
            type="password"
            className={`${error && "border-red-600"}`}
            value={formData.confirm_password}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup} className="w-full">
          {loading ? "Loading" : "Create account"}
        </Button>

        {alert && (
          <CustomAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={handleAlertClose} // Close the alert
          />
        )}
      </CardFooter>
      <p className="px-8 text-center text-sm text-muted-foreground mb-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </Card>
  );
}
