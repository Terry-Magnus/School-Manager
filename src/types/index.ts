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
}

export interface CustomUser extends User {
  regNumber?: string;
  name?: string;
  role?: USERROLESENUM;
  courses?: Course[];
  faculty?: string;
  address?: string;
  level?: string;
  [key: string]: unknown;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  semester: string;
  level: number;
  faculty: string;
  students: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Result {
  id: string;
  student: Pick<CustomUser, "regNumber" | "name" | "email" | "level">;
  course: Pick<Course, "id" | "title" | "code" | "creditUnits">;
  semester: string;
  academicYear: string;
  score: number;
  grade: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Faculty =
  | "agriculture"
  | "arts"
  | "biological_sciences"
  | "business_administration"
  | "education"
  | "engineering"
  | "environmental_studies"
  | "health_sciences"
  | "law"
  | "medicine"
  | "pharmaceutical_sciences"
  | "physical_sciences"
  | "social_sciences"
  | "veterinary_medicine"
  | "vocational_technical_education";

export type Level = "100" | "200" | "300" | "400" | "500";

export type TInputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
export type TSelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type TFormEvent = React.FormEvent<HTMLFormElement>;
