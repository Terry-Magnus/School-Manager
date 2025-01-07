import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/api/auth/update-profile";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { TInputChangeEvent } from "@/types";
import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await updateUserProfile(auth, {
        name,
        email,
      });
      // Show success alert
      await refreshUser();
      setAlert({
        type: "success",
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err: any) {
      // Show error alert
      setAlert({
        type: "error",
        title: "Error",
        description: err.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    setName("");
    setEmail("");
  };

  return (
    <div className="max-w-sm rounded-md mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Profile Settings
      </h1>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e: TInputChangeEvent) => setName(e.target.value)}
            placeholder={user?.name || "John Doe"}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e: TInputChangeEvent) => setEmail(e.target.value)}
            placeholder={user?.email || "johndoe@gmail.com"}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Update"}
        </Button>
      </div>

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={handleAlertClose} // Close the alert
        />
      )}
    </div>
  );
}
