import { addCourse } from "@/api/courses";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, TFormEvent, TInputChangeEvent } from "@/types";
import { useState } from "react";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { useAuth } from "@/hooks/use-auth";

// Omit fields that will be handled automatically
type IAddCourse = Omit<
  Course,
  "createdAt" | "id" | "students" | "examOfficerId" | "updatedAt"
>;
const initialValues = {
  title: "",
  code: "",
  creditUnits: 1, // Initialize numeric fields with 1
  semester: "",
  level: 100, // Default level
};

export default function AddCourses() {
  const [data, setData] = useState<IAddCourse>(initialValues);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e: TInputChangeEvent) => {
    const { name, value, type } = e.target;

    // For numeric fields, convert string to number
    if (type === "number") {
      setData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value), // Convert to number, default to 0 if empty
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: TFormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addCourse({
        ...data,
        examOfficerId: user!.uid,
      });

      setSuccess(true);
      // Show success alert
      setAlert({
        type: "success",
        title: "Success",
        description: "Course added successfully",
      });
    } catch (err: any) {
      setSuccess(false);
      setAlert({
        type: "error",
        title: "Error",
        description: err.message || "An error occurred",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      setData(initialValues);
    }
  };

  return (
    <div className="max-w-sm rounded-md mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Add Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={data.title}
            onChange={handleChange}
            required
            placeholder="Ex: Introduction to Software Architecture"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="code">Course Code</Label>
          <Input
            id="code"
            name="code"
            type="text"
            value={data.code}
            onChange={handleChange}
            required
            placeholder="Ex: GMAT201"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="creditUnits">Credit Units</Label>
          <Input
            id="creditUnits"
            name="creditUnits"
            type="number"
            min="1"
            max="6"
            value={data.creditUnits}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="semester">Semester</Label>
          <Select
            value={data.semester}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, semester: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIRST">First Semester</SelectItem>
              <SelectItem value="SECOND">Second Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={data.level.toString()}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, level: Number(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100 Level</SelectItem>
              <SelectItem value="200">200 Level</SelectItem>
              <SelectItem value="300">300 Level</SelectItem>
              <SelectItem value="400">400 Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding Course..." : "Add Course"}
        </Button>
      </form>

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
