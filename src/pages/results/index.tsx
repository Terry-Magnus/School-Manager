import { fetchStudentResults } from "@/api/results";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { calculateGPA } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function Results() {
  const [results, setResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentResults(user!.regNumber);
      setResults(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Results</h1>

      <div className="grid grid-cols-1 mt-3 ">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Current Stats</CardTitle>
            <CardDescription>A summary of your current results</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {results.length > 0
              ? `You're currently on a ${calculateGPA(results)} GPA`
              : `Your results haven't been compiled at this time`}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 mt-3 ">
        <Card>
          {loading ? (
            <Spinner className="text-[--primary]">Loading Results...</Spinner>
          ) : (
            <DataTable columns={columns} data={results} />
          )}
        </Card>
      </div>
    </>
  );
}
