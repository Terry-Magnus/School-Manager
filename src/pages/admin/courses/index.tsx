import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePagination from "@/hooks/usePagination";

export default function ManageCourses() {
  const navigate = useNavigate();

  const {
    list,
    showNext,
    showPrevious,
    loading,
    currentPage,
    error,
    totalPages,
  } = usePagination<Course>({
    collectionName: "courses",
    itemsPerPage: 10,
    orderByField: "createdAt",
  });

  if (error) {
    return <div className="text-red-700 bg-red-400 p-4">{error}</div>;
  }
  const btnDisabled = totalPages <= currentPage;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-4">Manage Courses</h1>

        <Button onClick={() => navigate("./add-new")}>Add New</Button>
      </div>

      <Card>
        {loading ? (
          <Spinner className="text-[--primary]">Loading Courses...</Spinner>
        ) : (
          <>
            <DataTable data={list} columns={columns} />
            {list.length > 0 && (
              <div className="flex mx-auto gap-4 w-20 justify-between items-center mt-4">
                <Button
                  onClick={() => showPrevious()}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft />
                </Button>
                <span className="p-4 outline-1">{currentPage}</span>

                <Button onClick={() => showNext()} disabled={btnDisabled}>
                  <ArrowRight />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
