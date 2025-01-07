import { getNumberOfResultsForStudent } from "@/api/results";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { BookText, Files } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState(0);

  const loadResults = async () => {
    try {
      const data = await getNumberOfResultsForStudent(user!.uid);
      setResults(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome {user?.name || "Student"}
      </h1>

      <div className="grid grid-cols-1 mt-3 gap-4 sm:grid-cols-2 ">
        <Card>
          <div className="p-4 flex items-center gap-4 justify-center">
            <BookText className="w-8 h-8" />
            <div className="text-center">
              <p className="text-xl font-bold">{user?.courses?.length || 0}</p>
              <p className="text-[12px]">Courses Registered</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-4 justify-center">
            <Files className="w-8 h-8" />
            <div className="text-center">
              <p className="text-xl font-bold">
                {user?.role === "student" ? results : 0}
              </p>
              <p className="text-[12px]">Results Compiled</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
