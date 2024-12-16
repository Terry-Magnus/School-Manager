import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        {/* <CardDescription>
          Enter your email below to create your account
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Confirm Password</Label>
          <Input id="confirm_password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Password Reset Code</Label>
          <Input id="code" type="text" placeholder="123456" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Link to="/login">Submit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
