import { Result } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

type ResultTableProps = Omit<Result, "studentId" | "examOfficerId">;

export const columns: ColumnDef<ResultTableProps>[] = [
  {
    accessorKey: "course",
    header: "Course",
    accessorFn: (origin) => {
      return `${origin.course.title} - ${origin.course.code}`;
    },
  },
  {
    accessorKey: "course.creditUnits",
    header: "Credit Units",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "academicYear",
    header: "Session",
  },
  {
    accessorKey: "student",
    header: "Student",
    accessorFn: (origin) => {
      return `${origin.student.name} - ${origin.student.regNumber}`;
    },
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
];
