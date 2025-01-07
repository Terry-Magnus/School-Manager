import { fetchAllResults } from "@/api/results";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export default function ResultList() {
  const [results, setResults] = useState<any>([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null); // Tracks the last document for pagination
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To disable "Next" when no more data
  const navigate = useNavigate();
  const pageSize = 10;

  // Function to load the first page or subsequent pages
  const loadResults = async (isNext = true) => {
    setLoading(true);
    try {
      const data = await fetchAllResults(
        isNext ? lastVisibleDoc : undefined, // Pass the lastVisibleDoc for next page, or undefined for first page
        pageSize // Page size
      );
      if (data.results.length < 10) setHasMore(false); // Disable "Next" if less data is fetched

      setResults(isNext ? [...results, ...data.results] : data.results); // Append or reset results
      setLastVisibleDoc(data.lastDoc); // Update last visible document
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults(false); // Load the initial page
  }, []);

  console.log(results);
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Results</h1>
          <p className="text-sm">All Existing Results in the system</p>
        </div>
        <Button onClick={() => navigate("/results/upload")}>
          Upload Results
        </Button>
      </div>
      <Card>
        {loading ? (
          <Spinner className="text-[--primary]">Loading...</Spinner>
        ) : (
          <>
            <DataTable columns={columns} data={results} />
            {results.length > 0 && (
              <div className="flex mx-auto gap-4 w-20 justify-between items-center mt-4">
                <Button
                  onClick={() => loadResults(false)}
                  disabled={results.length === 0 || loading} // Disable when no results or loading
                >
                  Previous
                </Button>
                <Button
                  onClick={() => loadResults()}
                  disabled={!hasMore || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
