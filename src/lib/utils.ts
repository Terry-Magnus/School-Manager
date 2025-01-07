import { SidebarData } from "@/components/layout/types";
import { Result } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkIsActive(href: string, item: SidebarData) {
  return (
    href === item.url || // /endpint?search=param
    href.split("?")[0] === item.url // endpoint
  );
}

export const numbersOnlyRegex = /^(?:\d+(?:\.\d*)?|\.\d+)?$/;

//Function helps generate academic years in format "2024/2025"
export const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  // Generate current year and next year pairs
  for (let i = 0; i < 2; i++) {
    const startYear = currentYear + i;
    years.push(`${startYear}/${startYear + 1}`);
  }

  return years;
};

// Helper function to calculate grade
export const calculateGrade = (score: number): string => {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  if (score >= 40) return "E";
  return "F";
};

export const calculateGradePoint = (score: number): number => {
  if (score >= 70) return 5.0;
  if (score >= 60) return 4.0;
  if (score >= 50) return 3.0;
  if (score >= 45) return 2.0;
  if (score >= 40) return 1.0;
  return 0.0;
};

export const calculateGPA = (results: Result[]): string | number => {
  let totalQualityPoints = 0;
  let totalCreditUnits = 0;

  results.forEach((result: Result) => {
    const gradePoint = calculateGradePoint(result.score);
    totalQualityPoints += gradePoint * result.course.creditUnits;
    totalCreditUnits += result.course.creditUnits;
  });

  return totalCreditUnits > 0
    ? (totalQualityPoints / totalCreditUnits).toFixed(1)
    : 0;
};

//   export const calculateCGPA = (results: Result[]): number => {
//     let cumulativeQualityPoints = 0;
//     let cumulativeCreditUnits = 0;

//     results.forEach((result) => {
//       result.course.forEach((result: Result) => {
//         const gradePoint = calculateGradePoint(result.score);
//         cumulativeQualityPoints += gradePoint * result.course.creditUnits;
//         cumulativeCreditUnits += result.course.creditUnits;
//       });
//     });

//     return cumulativeCreditUnits > 0
//       ? cumulativeQualityPoints / cumulativeCreditUnits
//       : 0;
//   };
