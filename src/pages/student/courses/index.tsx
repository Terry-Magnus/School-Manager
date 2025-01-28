import { useState, useEffect } from "react";
import { fetchStudentCourses } from "@/api/courses";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@/types";
import DataTable from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";

export default function StudentCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    if (user?.role !== "student") return;
    try {
      const studentId = user!.uid;
      const fetchedCourses = await fetchStudentCourses(studentId);
      setCourses(fetchedCourses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm">Your previously registered courses</p>
        </div>

        <Button onClick={() => navigate("/courses/register")}>
          Register Courses
        </Button>
      </div>
      <Card>
        {loading ? (
          <Spinner className="text-[--primary]">Loading...</Spinner>
        ) : (
          <DataTable columns={columns} data={courses} />
        )}
      </Card>
    </>
  );
}
