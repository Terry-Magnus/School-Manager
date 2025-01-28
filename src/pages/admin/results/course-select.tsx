import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePagination from "@/hooks/usePagination";
import { capitalizeText } from "@/lib/utils";
import { Course } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface CourseSelectProps {
  selectedCourse: Course | null;
  setSelectedCourse: Dispatch<SetStateAction<Course | null>>;
}

const CourseSelect = ({
  selectedCourse,
  setSelectedCourse,
}: CourseSelectProps) => {
  const { list: courses } = usePagination<Course>({
    collectionName: "courses",
    itemsPerPage: 25,
    orderByField: "createdAt",
  });

  const handleSelectChange = (id: string) => {
    if (courses.length === 0) return;
    const item = courses
      ? courses.find((course: Course) => id === course.id)!
      : null;
    setSelectedCourse(item || null);
  };

  return (
    <>
      <Select
        value={selectedCourse?.id}
        onValueChange={(value) => handleSelectChange(value)}
      >
        <SelectTrigger className="w-25">
          <SelectValue>
            {selectedCourse
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
    </>
  );
};

export default CourseSelect;
