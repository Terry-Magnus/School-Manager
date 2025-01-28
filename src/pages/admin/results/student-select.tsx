import searchUser from "@/api/auth/get-user";
import { Button } from "@/components/ui/button";
import { IAlertProps } from "@/components/ui/custom-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomUser, TInputChangeEvent } from "@/types";
import { USERROLESENUM } from "@/types/enums";
import { Dispatch, SetStateAction, useState } from "react";

interface StudentSelectProps {
  selectedStudent: CustomUser | null;
  setSelectedStudent: Dispatch<SetStateAction<CustomUser | null>>;
  setAlert: Dispatch<SetStateAction<IAlertProps | null>>;
}

const StudentSelect = ({
  selectedStudent,
  setSelectedStudent,
  setAlert,
}: StudentSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSelectedStudent(null);

    try {
      const student = await searchUser({
        param: "regNumber",
        searchTerm,
        role: USERROLESENUM.STUDENT,
      });
      setSelectedStudent(student);
      setSearchTerm("");
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Error",
        description: err.message || "An error occurred while searching",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-4">
      <div>
        <Label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search and Select a Student
        </Label>
        <Input
          type="text"
          id="search"
          value={searchTerm}
          disabled={!!selectedStudent}
          onChange={(e: TInputChangeEvent) => setSearchTerm(e.target.value)}
          className="mt-1 block w-full rounded-md pr-[100px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={`${
            selectedStudent ? selectedStudent.name : "Enter registration number"
          }`}
        />
        <Button
          type="button"
          onClick={
            !selectedStudent ? handleSearch : () => setSelectedStudent(null)
          }
          disabled={loading}
          className={`${
            selectedStudent ? "bg-red-600" : ""
          } absolute text-[10px] h-[25px] top-[32px] right-2`}
        >
          {loading ? "Searching..." : selectedStudent ? "Cancel" : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default StudentSelect;
