import { firestore } from "@/lib/firebaseConfig";
import { calculateGrade } from "@/lib/utils";
import { Result } from "@/types";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  addDoc,
  where,
  orderBy,
  startAfter,
  limit,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export const fetchAllResults = async (lastVisibleDoc?: any, pageSize = 10) => {
  try {
    const resultsRef = collection(firestore, "results");
    const resultsQuery = lastVisibleDoc
      ? query(
          resultsRef,
          orderBy("student.regNumber"),
          startAfter(lastVisibleDoc),
          limit(pageSize)
        )
      : query(resultsRef, orderBy("student.regNumber"), limit(pageSize));

    const querySnapshot = await getDocs(resultsQuery);
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { results, lastDoc };
  } catch (error) {
    console.error("Error fetching all results", error);
    throw error;
  }
};

export const fetchStudentResults = async (regNumber: string) => {
  try {
    const resultsRef = collection(firestore, "results");

    // Create a query to filter results by studentId
    const resultsQuery = query(
      resultsRef,
      where("student.regNumber", "==", regNumber)
    );

    const querySnapshot = await getDocs(resultsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Result[];
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export const updateResult = async (
  resultId: string,
  updatedData: DocumentData
) => {
  try {
    const resultDocRef = doc(firestore, "results", resultId);
    await updateDoc(resultDocRef, updatedData);
  } catch (error) {
    console.error("Error updating result", error);
    throw error;
  }
};

export const deleteResult = async (resultId: string) => {
  try {
    const resultDocRef = doc(firestore, "results", resultId);
    await deleteDoc(resultDocRef);
  } catch (error) {
    console.error("Error deleting result", error);
    throw error;
  }
};

export const uploadResult = async (
  resultData: Omit<Result, "updatedAt" | "grade" | "id" | "createdAt">
) => {
  try {
    const resultsRef = collection(firestore, "results");

    // Calculate grade based on score
    const grade = calculateGrade(resultData.score);

    const resultDoc = {
      ...resultData,
      grade,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(resultsRef, resultDoc);
    return { id: docRef.id, ...resultDoc };
  } catch (error) {
    console.error("Error uploading result:", error);
    throw error;
  }
};

export const getNumberOfResultsForStudent = async (
  studentId: string
): Promise<number> => {
  try {
    // Reference to the results collection
    const resultsRef = collection(firestore, "results");

    // Create a query to filter results by studentId
    const resultsQuery = query(resultsRef, where("studentId", "==", studentId));

    // Fetch the query results
    const querySnapshot = await getDocs(resultsQuery);

    // Return the number of documents found (i.e., the number of results)
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching results for student:", error);
    throw error;
  }
};
