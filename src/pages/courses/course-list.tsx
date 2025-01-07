import { useState, useEffect } from "react";
import { fetchCourses } from "@/api/courses";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@/types";
import DataTable from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user?.uid) {
      loadCourses();
    }
  }, [user]);

  if (loading) <Spinner className="text-[--primary]">Loading...</Spinner>;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Courses</h1>
          <p className="text-sm">All Existing Courses in the system</p>
        </div>
        <Button onClick={() => navigate("/courses/add")}>Add Course</Button>
      </div>
      <Card>
        <DataTable columns={columns} data={courses} />
      </Card>
    </>
  );
}
