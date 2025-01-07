import { firestore } from "@/lib/firebaseConfig";
import { Course } from "@/types";
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  getDocs,
  query,
  where,
  writeBatch,
  arrayRemove,
  serverTimestamp,
  getDoc,
  //   updateDoc,
  //   getDoc,
} from "firebase/firestore";

export const addCourse = async (
  courseData: Omit<Course, "id" | "students" | "createdAt" | "updatedAt">
) => {
  try {
    const coursesRef = collection(firestore, "courses");

    // Check if a course with the same code already exists
    const querySnapshot = await getDocs(
      query(coursesRef, where("code", "==", courseData.code))
    );
    if (!querySnapshot.empty) {
      throw new Error(
        `A course with the code "${courseData.code}" already exists.`
      );
    }

    // Create the course document
    const courseDoc = {
      ...courseData,
      students: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(coursesRef, courseDoc);
    return { id: docRef.id, ...courseDoc };
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const registerStudentForCourse = async (
  courseId: string,
  studentId: string
) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    const userRef = doc(firestore, "users", studentId);

    // Get the current course document to check if student is already registered
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      throw new Error("Course not found!");
    }

    const courseData = courseDoc.data();
    if (courseData?.students.includes(studentId)) {
      throw new Error("Student is already registered for this course.");
    }

    // Run as a batch to ensure both updates succeed or fail together
    const batch = writeBatch(firestore);

    // Update course document with the student and updatedAt timestamp
    batch.update(courseRef, {
      students: arrayUnion(studentId),
      updatedAt: serverTimestamp(), // Set the updatedAt timestamp
    });

    // Update user document with the course
    batch.update(userRef, {
      courses: arrayUnion(courseId),
    });

    await batch.commit();
  } catch (error) {
    console.error("Error registering student:", error);
    throw error;
  }
};

export const unregisterStudentFromCourse = async (
  courseId: string,
  studentId: string
) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    const userRef = doc(firestore, "users", studentId);

    const batch = writeBatch(firestore);

    batch.update(courseRef, {
      students: arrayRemove(studentId),
      updatedAt: serverTimestamp(),
    });

    batch.update(userRef, {
      courses: arrayRemove(courseId),
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error unregistering student:", error);
    throw error;
  }
};

export const fetchCourses = async (filters?: {
  examOfficerId?: string;
  semester?: string;
  level?: number;
}) => {
  try {
    const coursesRef = collection(firestore, "courses");
    let q = query(coursesRef);

    if (filters?.examOfficerId) {
      q = query(q, where("examOfficerId", "==", filters.examOfficerId));
    }
    if (filters?.semester) {
      q = query(q, where("semester", "==", filters.semester));
    }
    if (filters?.level) {
      q = query(q, where("level", "==", filters.level));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const fetchStudentCourses = async (studentId: string) => {
  try {
    const coursesRef = collection(firestore, "courses");
    const q = query(coursesRef, where("students", "array-contains", studentId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw error;
  }
};
