import { useState, useEffect } from "react";
import { fetchCourses, registerStudentForCourse } from "@/api/courses";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@/types";
import DataTable from "@/components/ui/data-table";
import { useCourseColumns } from "./columns";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomAlert, { IAlertProps } from "@/components/ui/custom-alert";

export default function RegisterCourses() {
  const [data, setData] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const { user } = useAuth();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Handle checkbox selection
  const handleSelect = (id: string, checked: boolean) => {
    setSelectedCourses((prev) =>
      checked ? [...prev, id] : prev.filter((courseId) => courseId !== id)
    );
  };

  // Use column definitions
  const columns = useCourseColumns({ selectedCourses, handleSelect });

  const handleSubmit = async () => {
    setSubmitting(true);
    setDialogOpen(false);

    try {
      const studentId = user!.uid;
      await Promise.all(
        selectedCourses.map((courseId) =>
          registerStudentForCourse(courseId, studentId)
        )
      );
      setAlert({
        type: "success",
        title: "Success",
        description: "Courses registered successfully",
      });
    } catch (error: any) {
      setAlert({
        type: "error",
        title: "Error",
        description: error.message || "An error occurred",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const fetchedCourses = await fetchCourses();
      setData(fetchedCourses);
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
      <h1 className="text-2xl font-bold tracking-tight mb-3">Courses</h1>
      <Card>
        <DataTable columns={columns} data={data} />

        <div className="flex justify-end px-2">
          <Button
            onClick={() => setDialogOpen(true)}
            className="my-4 px-4 py-2 "
            disabled={selectedCourses.length === 0}
          >
            Register Selected Courses
          </Button>
        </div>

        <Dialog
          defaultOpen={isDialogOpen}
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm your courses</DialogTitle>
              <DialogDescription>
                Are you sure you want to register for the following courses?
              </DialogDescription>
            </DialogHeader>
            <ul className="ml-5">
              {selectedCourses.map((id) => {
                const course = data.find((c) => c.id === id);
                return (
                  <li className="list-disc" key={id}>
                    {course?.code} - {course?.title}
                  </li>
                );
              })}
            </ul>
            <DialogFooter>
              <Button
                variant="secondary"
                className="bg-green-700 text-white hover:bg-green-500"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <Spinner className="bg-white h-4 w-4" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          duration={2500}
          onClose={() => setAlert(null)} // Close the alert
        />
      )}
    </>
  );
}
