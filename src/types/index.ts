import { User } from "firebase/auth";
import { USERROLESENUM } from "./enums";
import { Timestamp } from "firebase/firestore";

export interface UserSignup {
  name: string;
  email: string;
  regNumber?: string;
  password: string;
  confirm_password: string;
  role: USERROLESENUM;
  code?: string;
}

export interface CustomUser extends User {
  regNumber?: string;
  name?: string;
  role?: USERROLESENUM;
  courses?: Course[];
  [key: string]: unknown;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  semester: string;
  level: number;
  students?: string[]; // Array of student IDs
  examOfficerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  //   student: {
  //     regNumber: string;
  //     name: string;
  //     email: string;
  //   };
  //   course: {
  //     id: string;
  //     title: string;
  //     code: string;
  //     creditUnits: number;
  //   };
  student: Pick<CustomUser, "regNumber" | "name" | "email">;
  course: Pick<Course, "id" | "title" | "code" | "creditUnits">;
  semester: string;
  academicYear: string;
  score: number;
  grade: string;
  examOfficerId: unknown;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TInputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
export type TSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type TFormEvent = React.FormEvent<HTMLFormElement>;
