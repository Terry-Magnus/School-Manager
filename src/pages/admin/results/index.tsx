import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Result } from "@/types";
import usePagination from "@/hooks/usePagination";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ManageResults() {
  const navigate = useNavigate();

  const {
    list,
    totalPages,
    showNext,
    showPrevious,
    loading,
    currentPage,
    error,
  } = usePagination<Result>({
    collectionName: "results",
    itemsPerPage: 10,
    orderByField: "student.regNumber",
  });

  if (error) {
    return <div className="text-red-700 bg-red-400 p-4">{error}</div>;
  }

  const btnDisabled = totalPages <= currentPage;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
          <p className="text-sm">View all existing entries in the system</p>
        </div>
        <Button onClick={() => navigate("./upload")}>Upload Results</Button>
      </div>
      <Card>
        {loading ? (
          <Spinner className="text-[--primary]">Loading...</Spinner>
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
