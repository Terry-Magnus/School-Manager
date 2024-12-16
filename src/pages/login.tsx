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
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your details below to view your details
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <p className=" text-right text-[10px] text-muted-foreground mb-2">
          <Link to="/forgot-password" className="hover:text-primary">
            Forgot Password
          </Link>
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Link to="/dashboard">Login</Link>
        </Button>{" "}
      </CardFooter>

      <p className="px-8 text-center text-sm text-muted-foreground mb-4">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
