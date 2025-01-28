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
import {
  Course,
  CustomUser,
  Result,
  TFormEvent,
  TInputChangeEvent,
} from "@/types";
import { useMemo, useState } from "react";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { uploadResult } from "@/api/results";
import { generateAcademicYears, numbersOnlyRegex } from "@/lib/utils";
import CourseSelect from "./course-select";
import StudentSelect from "./student-select";

// Omit fields that will be handled automatically
type IAddResult = Omit<
  Result,
  "id" | "course" | "student" | "grade" | "createdAt" | "updatedAt" | "semester"
>;

const initialValues: IAddResult = {
  score: 0,
  academicYear: "", // Default level
};

export default function UploadResult() {
  const [data, setData] = useState<IAddResult>(initialValues);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<CustomUser | null>(
    null
  );
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      setData(initialValues);
      setSelectedCourse(null);
      setSelectedStudent(null);
    }
  };

  const handleChange = (e: TInputChangeEvent) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isStudentRegistered = useMemo(() => {
    if (!selectedCourse || !selectedStudent) return false;
    return selectedCourse.students.includes(selectedStudent.uid);
  }, [selectedCourse, selectedStudent]);

  const submitDisabled =
    !data.academicYear || !selectedCourse || !selectedStudent || !data.score;

  const handleSubmit = async (e: TFormEvent) => {
    e.preventDefault();
    if (!isStudentRegistered) {
      setAlert({
        type: "error",
        title: "Validation Error",
        description:
          "Selected student is not registered for the selected course.",
      });
      return;
    }

    setLoading(true);

    try {
      await uploadResult({
        ...data,
        semester: selectedCourse!.semester,
        student: {
          name: selectedStudent!.name,
          email: selectedStudent!.email,
          regNumber: selectedStudent!.regNumber,
        },
        course: {
          code: selectedCourse!.code.toUpperCase(),
          title: selectedCourse!.title,
          id: selectedCourse!.id,
          creditUnits: selectedCourse!.creditUnits,
        },
      });
      setSuccess(true);
      setAlert({
        type: "success",
        title: "Success",
        description: "Result uploaded successfully",
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

  return (
    <div className="max-w-sm rounded-md mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Upload Result</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="code">Score</Label>
          <Input
            id="score"
            name="score"
            type="text"
            value={data.score}
            onChange={(e: TInputChangeEvent) =>
              e.target.value.match(numbersOnlyRegex) && handleChange(e)
            }
            required
            min={0}
            max={100}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="level">Academic Year</Label>
          <Select
            value={data.academicYear}
            onValueChange={(value) =>
              setData((prev) => ({ ...prev, academicYear: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {generateAcademicYears().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <StudentSelect // dedicated searchbar for getting student based on regNumber
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setAlert={setAlert}
          />
        </div>

        <div className="grid gap-2">
          <Label>Course</Label>

          <CourseSelect //get courses based on selected student
            selectedStudent={selectedStudent}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            setAlert={setAlert}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitDisabled}>
          {loading ? "Loading..." : "Upload"}
        </Button>
      </form>

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={handleAlertClose}
          duration={2000}
          // Close the alert
        />
      )}
    </div>
  );
}
