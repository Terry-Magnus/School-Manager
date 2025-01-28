import { getNumberOfResultsUploaded } from "@/api/results";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { BookText, Files } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState(0);
  const [courses, setCourses] = useState(0);

  const loadData = async () => {
    try {
      const [resultCount, courseCount] = await Promise.all([
        getNumberOfResultsUploaded("results"),
        getNumberOfResultsUploaded("courses"),
      ]);
      setResults(resultCount);
      setCourses(courseCount);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome {user?.name || "Admin"}
      </h1>

      <div className="grid grid-cols-1 mt-3 gap-4 sm:grid-cols-2     ">
        <Card>
          <div className="p-4 flex items-center gap-4 justify-center">
            <BookText className="w-8 h-8" />
            <div className="text-center">
              <p className="text-xl font-bold">{courses || 0}</p>
              <p className="text-[12px]">Courses Created</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-4 justify-center">
            <Files className="w-8 h-8" />
            <div className="text-center">
              <p className="text-xl font-bold">
                {user?.role === "admin" ? results : 0}
              </p>
              <p className="text-[12px]">Results Compiled</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
