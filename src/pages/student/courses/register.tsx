import { useState, useEffect } from "react";
import { registerStudentForCourse, fetchCourses } from "@/api/courses";
import { useAuth } from "@/hooks/use-auth";
import { Course, Faculty, Level } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleX } from "lucide-react";
import { capitalizeText } from "@/lib/utils";

type Semester = "harmattan" | "rain";

export default function RegisterCourses() {
  const [data, setData] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<IAlertProps | null>(null);
  const [semester, setSemester] = useState<Semester>("harmattan");
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);

      setAlert({
        type: "success",
        title: "Success",
        description: "Courses registered successfully",
      });
    } catch (error: any) {
      setSuccess(false);

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
      const courses = await fetchCourses(
        user?.faculty as Faculty,
        user?.level as Level,
        semester
      );
      setData(courses);
    } catch (err: any) {
      console.error(err);
      setAlert({
        type: "error",
        title: "Login Failed",
        description: err.message || "An error occurred while logging in.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.faculty) {
      loadCourses();
    }
  }, [semester]);

  if (!user?.faculty) {
    return (
      <div className="bg-red-300 rounded-sm text-red-700 p-4 w-full">
        <p>
          <CircleX className="inline-block" /> Please complete your profile
          settings before course registration.
        </p>
      </div>
    );
  }

  const handleAlertClose = () => {
    setAlert(null);
    if (success) {
      setSelectedCourses([]);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight mb-3">Courses</h1>
      <div className="flex items-center gap-4 mb-4">
        <p> Select Semester:</p>
        <Select
          value={semester}
          onValueChange={(value: Semester) => setSemester(value)}
        >
          <SelectTrigger className="w-25">
            <SelectValue>
              {semester ? `${capitalizeText(semester)}` : "Select Semester"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["harmattan", "rain"].map((value) => (
              <SelectItem key={value} value={value}>
                {capitalizeText(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        {loading ? (
          <Spinner className="text-[--primary]">Loading...</Spinner>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </Card>

      <div className="flex justify-end px-2">
        <Button
          onClick={() => setDialogOpen(true)}
          className="my-4 px-4 py-2"
          disabled={selectedCourses.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4 text-white" />
          ) : (
            "Register Selected Courses"
          )}
        </Button>
      </div>

      {isDialogOpen && (
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
                  <li
                    className="list-disc flex items-center justify-between"
                    key={id}
                  >
                    <span>
                      {course?.code} - {course?.title}
                    </span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>
                        setSelectedCourses((prev) =>
                          prev.filter((courseId) => courseId !== id)
                        )
                      }
                    >
                      Remove
                    </button>
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
      )}

      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          duration={2500}
          onClose={handleAlertClose} // Close the alert
        />
      )}
    </>
  );
}
