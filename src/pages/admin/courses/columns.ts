import { capitalizeText } from "@/lib/utils";
import { Course } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Course>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => capitalizeText(row.original.semester),
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
    cell: ({ row }) => capitalizeText(row.original.faculty),
  },
  { accessorKey: "level", header: "Level" },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ row }) => `${row.original.students.length}`,
  },
];
