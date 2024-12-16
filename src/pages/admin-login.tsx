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

export default function AdminLogin() {
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
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
      <p className="px-8 text-right text-sm text-muted-foreground mb-4">
        <Link
          to="/forgot-password"
          className="underline underline-offset-4 hover:text-primary"
        >
          Forgot Password
        </Link>
      </p>
    </Card>
  );
}
