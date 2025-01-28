import { fetchStudentCourses } from "@/api/courses";
import { IAlertProps } from "@/components/ui/custom-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { capitalizeText } from "@/lib/utils";
import { Course, CustomUser } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CourseSelectProps {
  selectedCourse: Course | null;
  selectedStudent: CustomUser | null;
  setSelectedCourse: Dispatch<SetStateAction<Course | null>>;
  setAlert: Dispatch<SetStateAction<IAlertProps | null>>;
}

const CourseSelect = ({
  selectedStudent,
  selectedCourse,
  setSelectedCourse,
  setAlert,
}: CourseSelectProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    if (!selectedStudent) return;

    setLoading(true);

    try {
      //fetch courses based on student id
      const fetchedCourses = await fetchStudentCourses(selectedStudent.uid);
      setCourses(fetchedCourses);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setAlert({
        type: "error",
        title: "Error",
        description:
          err.message || "Failed to fetch courses. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedStudent]);

  const handleSelectChange = (id: string) => {
    // set the selected course based on the fetched coures
    if (courses.length === 0) return;
    const item = courses.find((course: Course) => id === course.id) || null;
    setSelectedCourse(item);
  };

  return (
    <>
      <Select
        value={selectedCourse?.id || ""}
        onValueChange={(value) => handleSelectChange(value)}
        disabled={!selectedStudent || loading}
      >
        <SelectTrigger className="w-25">
          <SelectValue>
            {loading
              ? "Loading..."
              : selectedCourse
              ? `${capitalizeText(selectedCourse.title)}`
              : "Select Course"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title} - {course.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <Spinner className="w-4 h-4 text-purple-700" />}
    </>
  );
};

export default CourseSelect;
