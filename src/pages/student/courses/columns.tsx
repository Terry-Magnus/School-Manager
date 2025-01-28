import { Course } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

type CourseTableProps = Omit<Course, "students">;

interface CourseColumnsProps {
  selectedCourses: string[];
  handleSelect: (id: string, checked: boolean) => void;
}

export const columns: ColumnDef<CourseTableProps>[] = [
  {
    accessorKey: "code",
    header: "Course Code",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "creditUnits",
    header: "Credit Units",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
];

export const useCourseColumns = ({
  selectedCourses,
  handleSelect,
}: CourseColumnsProps): ColumnDef<Course>[] => {
  return [
    {
      accessorKey: "code",
      header: "Course Code",
    },
    {
      accessorKey: "title",
      header: "Course Title",
    },
    {
      accessorKey: "creditUnits",
      header: "Credit Units",
    },
    {
      accessorKey: "semester",
      header: "Semester",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      id: "select",
      header: "", // Empty header for the checkbox column
      cell: ({ row }) => (
        <input
          type="checkbox"
          onChange={(e) => handleSelect(row.original.id, e.target.checked)}
          checked={selectedCourses.includes(row.original.id)}
        />
      ),
    },
  ];
};
