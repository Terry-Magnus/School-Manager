import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/api/auth/update-profile";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { Faculty, Level, TFormEvent } from "@/types";
import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeText, faculties, levels } from "@/lib/utils";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState<Faculty | string>("engineering");
  const [level, setLevel] = useState<Level | string>("100");

  // Prefill fields on mount
  useEffect(() => {
    if (user) {
      setEmail(user?.email || "");
      setName(user?.name || "");
      setFaculty(user?.faculty || "engineering");
      setLevel(user?.level || "100");
    }
  }, [user]);

  const handleSelectChange = (type: "faculty" | "level", value: string) => {
    if (type === "faculty") {
      const faculty =
        faculties.find((faculty: Faculty) => faculty === value) || "";
      setFaculty(faculty);
    } else if (type === "level") {
      const level = levels.find((level) => level === value) || "100";
      setLevel(level);
    }
  };

  const handleSubmit = async (e: TFormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile with the new image URL
      await updateUserProfile(auth, {
        name,
        email,
        faculty: user?.faculty || faculty,
        level: user?.level || level,
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

  return (
    <div className="max-w-sm rounded-md mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Profile Settings
      </h1>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder={user?.name || "John Doe"}
          />
        </div>

        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder={user?.email || "johndoe@gmail.com"}
          />
        </div>

        {/* Level and Faculty Fields (for students) */}
        {user?.role === "student" && (
          <>
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select
                value={user?.level || level}
                onValueChange={(value) => handleSelectChange("level", value)}
                disabled={!!user?.level} // Disable if level already exists
              >
                <SelectTrigger>
                  <SelectValue>
                    {level ? `${level} level` : "Select Level"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level: Level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Faculty</Label>
              <Select
                value={user?.faculty || faculty}
                onValueChange={(value) => handleSelectChange("faculty", value)}
                disabled={!!user?.faculty} // Disable if faculty already exists
              >
                <SelectTrigger>
                  <SelectValue>
                    {faculty ? `${capitalizeText(faculty)}` : "Select Faculty"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty: Faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {capitalizeText(faculty)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button disabled={loading}>{loading ? "Loading..." : "Update"}</Button>
      </form>

      {/* Alert */}
      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
