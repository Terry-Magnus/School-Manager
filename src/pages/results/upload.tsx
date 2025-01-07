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
import { useEffect, useState } from "react";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";
import { useAuth } from "@/hooks/use-auth";
import { uploadResult } from "@/api/results";
import { generateAcademicYears, numbersOnlyRegex } from "@/lib/utils";
import { fetchCourses } from "@/api/courses";
import { firestore } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Omit fields that will be handled automatically
type IAddResult = Omit<
  Result,
  | "id"
  | "examOfficerId"
  | "course"
  | "student"
  | "grade"
  | "createdAt"
  | "updatedAt"
>;

const initialValues = {
  semester: "",
  score: 0,
  academicYear: "", // Default level
};

export default function UploadResult() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[] | []>([]);
  const [students, setStudents] = useState<CustomUser[] | []>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<CustomUser | null>(
    null
  );
  const [data, setData] = useState<IAddResult>(initialValues);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSelectChange = (type: "course" | "student", value: string) => {
    if (type === "course") {
      const course = courses.find((course) => course.id === value) || null;
      setSelectedCourse(course);

      // Reset selected student if the new course has no students
      if (course?.students?.length === 0 || !course) {
        setSelectedStudent(null);
      }
    } else if (type === "student") {
      const student = students.find((student) => student.uid === value) || null;
      setSelectedStudent(student);
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      setData(initialValues);
      setSelectedCourse(null);
      setSelectedStudent(null);
    }
  };

  const handleSubmit = async (e: TFormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await uploadResult({
        ...data,
        examOfficerId: user?.uid,
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

  const loadStudents = async () => {
    try {
      const course = courses.find((c: Course) => c.id === selectedCourse?.id);

      if (course?.students && course?.students?.length > 0) {
        const studentsData = await Promise.all(
          course.students.map(async (id: string) => {
            const userDoc = await getDoc(doc(firestore, "users", id));
            return { uid: id, ...userDoc.data() };
          })
        );
        setStudents(studentsData as CustomUser[]);
      } else {
        setStudents([]); // Set to an empty array if no students
      }
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  const loadCourses = async () => {
    const fetchedCourses = await fetchCourses();
    setCourses(fetchedCourses);
  };

  const isDisabled = loading || students.length === 0;

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadStudents();
    }
  }, [selectedCourse]);

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
          <Label>Course</Label>
          <Select
            value={selectedCourse?.id || "no-course"}
            onValueChange={(value) => handleSelectChange("course", value)}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedCourse
                  ? `${selectedCourse.title} - ${selectedCourse.code}`
                  : "Select course"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {courses.filter((course) => course.semester === data.semester)
                .length > 0 ? (
                courses
                  .filter((course) => course.semester === data.semester)
                  .map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} - {course.code}
                    </SelectItem>
                  ))
              ) : (
                <SelectItem value="no-course" disabled>
                  No Courses Available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Student</Label>
          <Select
            value={selectedStudent?.uid || "no-student"}
            onValueChange={(value) => handleSelectChange("student", value)}
            disabled={!selectedCourse || students.length === 0}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedStudent ? (
                  <>
                    {selectedStudent.name} - {selectedStudent.regNumber}
                  </>
                ) : (
                  "Select student"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {students.length > 0 ? (
                students.map((student) => (
                  <SelectItem key={student.uid} value={student.uid}>
                    {student.name} - {student.regNumber}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-student" disabled>
                  No Student offering such course
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isDisabled}>
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
